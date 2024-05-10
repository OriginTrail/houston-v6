/* eslint-disable no-unused-vars */
// noinspection ES6UnusedImports

import {
  StakingABI,
  StakingStorageABI,
  ProfileABI,
  ProfileStorageABI,
  IdentityStorageABI,
  IdentityABI,
  HubABI,
  TokenABI,
  NodeOperatorFeesStorageABI,
} from 'dkg-evm-module';
import { ethers } from 'ethers';
import store from '../store';

import { ADMIN_KEY_PURPOSE } from '@/utils/constants';
import { getAmountWithDecimals } from '@/utils/cryptoUtils';
import { getOracleGnosisGasPrice } from '@/service/priceOracleService';

class ContractService {
  constructor(ethersSigner) {
    this.ethersSigner = ethersSigner;
  }

  async getContractAddress(contractName, isAssetStorage) {
    if (!this[contractName]) {
      if (isAssetStorage) {
        this[contractName] = await this.getContentStorageContract(contractName);
      } else {
        this[contractName] = await this.getContractAddressesFromHubContract(contractName);
      }
    }
    return this[contractName];
  }

  async getContentStorageContract(contractName) {
    const hubContract = new ethers.Contract(
      store.getters.selectedNetwork.hubContract,
      HubABI,
      this.ethersSigner,
    );
    return await hubContract.getAssetStorageAddress(contractName);
  }

  async getContractAddressesFromHubContract(contractName) {
    const hubContract = new ethers.Contract(
      store.getters.selectedNetwork.hubContract,
      HubABI,
      this.ethersSigner,
    );
    return await hubContract.getContractAddress(contractName);
  }

  async getIdentity(operationalAddress, adminWalletAddress) {
    const address = await this.getContractAddress('IdentityStorage');
    const IdentityStorageContract = new ethers.Contract(
      address,
      IdentityStorageABI,
      this.ethersSigner,
    );
    const identity = await IdentityStorageContract.getIdentityId(operationalAddress);
    const adminKey = this.getAdminKeyFromWallet(adminWalletAddress);
    const hasPurpose = await IdentityStorageContract.keyHasPurpose(
      identity,
      adminKey,
      ADMIN_KEY_PURPOSE,
    );
    return hasPurpose ? identity : 0;
  }

  async getAsk(identityId) {
    const address = await this.getContractAddress('ProfileStorage');
    const ProfileStorageContract = new ethers.Contract(
      address,
      ProfileStorageABI,
      this.ethersSigner,
    );
    return await ProfileStorageContract.getAsk(identityId);
  }

  async isKeyAlreadyUsed(identityId, adminWallet) {
    const address = await this.getContractAddress('IdentityStorage');
    const IdentityStorageContract = new ethers.Contract(
      address,
      IdentityStorageABI,
      this.ethersSigner,
    );
    const adminKey = this.getAdminKeyFromWallet(adminWallet);
    const keyObject = await IdentityStorageContract.getKey(identityId, adminKey);
    return (keyObject['2'] ?? keyObject.key) !== adminKey;
  }

  getAdminKeyFromWallet(wallet) {
    return ethers.utils.keccak256(ethers.utils.solidityPack(['address'], [wallet]));
  }

  async updateAsk(identityId, newAsk) {
    const address = await this.getContractAddress('Profile');
    const ProfileContract = new ethers.Contract(address, ProfileABI, this.ethersSigner);
    const sanitizedNewAsk = getAmountWithDecimals(newAsk);
    return await (
      await ProfileContract.setAsk(identityId, sanitizedNewAsk, {
        gasPrice: 8,
        gasLimit: 120000,
      })
    ).wait();
  }

  async getStakeAmountPendingWithdrawal(identityId, adminWallet) {
    const address = await this.getContractAddress('StakingStorage');
    const stakeContract = new ethers.Contract(address, StakingStorageABI, this.ethersSigner);
    return await stakeContract.getWithdrawalRequestAmount(identityId, adminWallet);
  }

  async getSharesContractInfo(identityId, adminWallet) {
    const address = await this.getContractAddress('ProfileStorage');
    const ProfileStorageContract = new ethers.Contract(
      address,
      ProfileStorageABI,
      this.ethersSigner,
    );
    const sharesContractAddress = await ProfileStorageContract.getSharesContractAddress(identityId);
    const shareContract = new ethers.Contract(sharesContractAddress, TokenABI, this.ethersSigner);
    return {
      address: sharesContractAddress,
      name: await shareContract.name(),
      symbol: await shareContract.symbol(),
      totalSupply: await shareContract.totalSupply(),
      myBalance: await shareContract.balanceOf(adminWallet),
    };
  }

  async getTotalStake(identityId) {
    const address = await this.getContractAddress('StakingStorage');
    const stakeContract = new ethers.Contract(address, StakingStorageABI, this.ethersSigner);
    return await stakeContract.totalStakes(identityId);
  }

  async getAssetsOnDkg() {
    const address = await this.getContractAddress('ContentAssetStorage', true);
    return await this.ethersSigner.provider.getStorageAt(address, 7);
  }

  async getStakedTRAC() {
    const address = await this.getContractAddress('Token');
    const StakingStorageAddress = await this.getContractAddress('StakingStorage');
    const TRACContract = new ethers.Contract(address, TokenABI, this.ethersSigner);
    return await TRACContract.balanceOf(StakingStorageAddress);
  }

  async addStake(identityId, stakeAmountToAdd, loadingMessageCallback = null) {
    const gasPrices = await getOracleGnosisGasPrice(store.getters.selectedNetwork);
    const address = await this.getContractAddress('Token');
    const stakingContractAddress = await this.getContractAddress('Staking');
    const tokenContract = new ethers.Contract(address, TokenABI, this.ethersSigner);
    const stakeWei = ethers.utils.parseEther(stakeAmountToAdd);
    let allowanceReceipt = await tokenContract.increaseAllowance(
      stakingContractAddress,
      stakeWei,
      gasPrices.low,
    );
    if (loadingMessageCallback) {
      loadingMessageCallback('Adding stake (Transaction 1 of 2: Increasing Allowance)');
    }
    await allowanceReceipt.wait();
    const stakingContract = new ethers.Contract(
      stakingContractAddress,
      StakingABI,
      this.ethersSigner,
    );
    let stakingReceipt = await stakingContract['addStake(uint72,uint96)'](
      identityId,
      stakeWei,
      gasPrices.high,
    );
    if (loadingMessageCallback) {
      loadingMessageCallback('Adding stake (Transaction 2 of 2: Adding stake to the node)');
    }
    await stakingReceipt.wait();
  }

  async getLastWithdrawalTimestamp(identityId, adminWallet) {
    const address = await this.getContractAddress('StakingStorage');
    const stakingStorageContract = new ethers.Contract(
      address,
      StakingStorageABI,
      this.ethersSigner,
    );
    return await stakingStorageContract.getWithdrawalRequestTimestamp(identityId, adminWallet);
  }

  async requestWithdrawal(identityId, stakeToWithdraw) {
    const gasPrices = await getOracleGnosisGasPrice(store.getters.selectedNetwork);
    const address = await this.getContractAddress('ProfileStorage');
    const stakingContractAddress = await this.getContractAddress('Staking');
    const ProfileStorageContract = new ethers.Contract(
      address,
      ProfileStorageABI,
      this.ethersSigner,
    );
    const stakingContract = new ethers.Contract(
      stakingContractAddress,
      StakingABI,
      this.ethersSigner,
    );
    const sharesContractAddress = await ProfileStorageContract.getSharesContractAddress(identityId);

    const shareContract = new ethers.Contract(sharesContractAddress, TokenABI, this.ethersSigner);

    const totalSupply = await shareContract.totalSupply();
    const totalStakes = await this.getTotalStake(identityId);
    const sharesToBurn = ethers.utils
      .parseUnits(stakeToWithdraw, 18)
      .mul(totalSupply)
      .div(totalStakes);

    await (
      await shareContract.increaseAllowance(stakingContractAddress, sharesToBurn, gasPrices.low)
    ).wait();
    return await (
      await stakingContract.startStakeWithdrawal(identityId, sharesToBurn, gasPrices.high)
    ).wait();
  }

  async withdrawStake(identityId) {
    const gasPrices = await getOracleGnosisGasPrice(store.getters.selectedNetwork);
    const stakingContractAddress = await this.getContractAddress('Staking');
    const stakingContract = new ethers.Contract(
      stakingContractAddress,
      StakingABI,
      this.ethersSigner,
    );
    const removeKeyReceipt = await stakingContract.withdrawStake(identityId, gasPrices.high);
    return await removeKeyReceipt.wait();
  }

  async addAdminKey(identityId, newAdminWallet, purpose, type) {
    const gasPrices = await getOracleGnosisGasPrice(store.getters.selectedNetwork);
    const identityContractAddress = await this.getContractAddress('Identity');
    const identityContract = new ethers.Contract(
      identityContractAddress,
      IdentityABI,
      this.ethersSigner,
    );
    const adminKey = this.getAdminKeyFromWallet(newAdminWallet);
    const removeKeyReceipt = await identityContract.addKey(
      identityId,
      adminKey,
      purpose,
      type,
      gasPrices.high,
    );
    return await removeKeyReceipt.wait();
  }

  async removeKey(identityId, newAdminWallet) {
    const gasPrices = await getOracleGnosisGasPrice(store.getters.selectedNetwork);
    const identityContractAddress = await this.getContractAddress('Identity');
    const identityContract = new ethers.Contract(
      identityContractAddress,
      IdentityABI,
      this.ethersSigner,
    );
    const adminKey = this.getAdminKeyFromWallet(newAdminWallet);
    const removeKeyReceipt = await identityContract.removeKey(identityId, adminKey, gasPrices.high);
    return await removeKeyReceipt.wait();
  }

  async getOperatorFee(identityId) {
    const address = await this.getContractAddress('NodeOperatorFeesStorage');
    const NodeOperatorFeesStorageContract = new ethers.Contract(
      address,
      NodeOperatorFeesStorageABI,
      this.ethersSigner,
    );
    return await NodeOperatorFeesStorageContract.getActiveOperatorFeePercentage(identityId);
  }

  async getLastOperatorFeeChangeTimestamp(identityId) {
    const address = await this.getContractAddress('NodeOperatorFeesStorage');
    const NodeOperatorFeesStorageContract = new ethers.Contract(
      address,
      NodeOperatorFeesStorageABI,
      this.ethersSigner,
    );
    return await NodeOperatorFeesStorageContract.getLatestOperatorFeeEffectiveDate(identityId);
  }

  async changeOperatorFee(identityId, newOperatorFee) {
    const gasPrices = await getOracleGnosisGasPrice(store.getters.selectedNetwork);
    const stakingContractAddress = await this.getContractAddress('Staking');
    const stakingContract = new ethers.Contract(
      stakingContractAddress,
      StakingABI,
      this.ethersSigner,
    );

    return await (
      await stakingContract.startOperatorFeeChange(identityId, newOperatorFee, gasPrices.high)
    ).wait();
  }

  async getAccumulatedOperatorFee(identityId) {
    const address = await this.getContractAddress('ProfileStorage');
    const ProfileStorageContract = new ethers.Contract(
      address,
      ProfileStorageABI,
      this.ethersSigner,
    );
    return await ProfileStorageContract.getAccumulatedOperatorFee(identityId);
  }

  async getAccumulatedOperatorFeeWithdrawalTimestamp(identityId) {
    const address = await this.getContractAddress('ProfileStorage');
    const ProfileStorageContract = new ethers.Contract(
      address,
      ProfileStorageABI,
      this.ethersSigner,
    );
    return await ProfileStorageContract.getAccumulatedOperatorFeeWithdrawalTimestamp(identityId);
  }
  async getAccumulatedOperatorFeeWithdrawalAmount(identityId) {
    const address = await this.getContractAddress('ProfileStorage');
    const ProfileStorageContract = new ethers.Contract(
      address,
      ProfileStorageABI,
      this.ethersSigner,
    );
    return await ProfileStorageContract.getAccumulatedOperatorFeeWithdrawalAmount(identityId);
  }

  async stakeAccumulatedOperatorFee(identityId) {
    const gasPrices = await getOracleGnosisGasPrice(store.getters.selectedNetwork);
    const ProfileContractAddress = await this.getContractAddress('Profile');
    const ProfileContract = new ethers.Contract(
      ProfileContractAddress,
      ProfileABI,
      this.ethersSigner,
    );
    const stakeOperatorFee = await ProfileContract.stakeAccumulatedOperatorFee(
      identityId,
      gasPrices.high,
    );
    return await stakeOperatorFee.wait();
  }

  async requestAccumulatedOperatorFeeWithdrawal(identityId) {
    const gasPrices = await getOracleGnosisGasPrice(store.getters.selectedNetwork);
    const ProfileContractAddress = await this.getContractAddress('Profile');
    const ProfileContract = new ethers.Contract(
      ProfileContractAddress,
      ProfileABI,
      this.ethersSigner,
    );

    return await (
      await ProfileContract.startAccumulatedOperatorFeeWithdrawal(identityId, gasPrices.high)
    ).wait();
  }

  async withdrawAccumulatedOperatorFee(identityId) {
    const gasPrices = await getOracleGnosisGasPrice(store.getters.selectedNetwork);
    const ProfileContractAddress = await this.getContractAddress('Profile');
    const ProfileContract = new ethers.Contract(
      ProfileContractAddress,
      ProfileABI,
      this.ethersSigner,
    );
    const withdrawAccumulatedOperatorFeeReceipt =
      await ProfileContract.withdrawAccumulatedOperatorFee(identityId, gasPrices.high);
    return await withdrawAccumulatedOperatorFeeReceipt.wait();
  }
}

export default ContractService;
