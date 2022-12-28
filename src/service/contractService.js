/* eslint-disable no-unused-vars */
// noinspection ES6UnusedImports

import stakingAbi from '../abis/Staking.json';
import stakingStorage from '../abis/StakingStorage.json';
import profileAbi from '../abis/Profile.json';
import profileStorage from '../abis/ProfileStorage.json';
import IdentityStorage from '../abis/identityStorage.json';
import hubContractAbi from '../abis/HubContract.json';
import contentAssetStorage from '../abis/contentAssetStorage.json';
import ERC20Token from '../abis/ERC20Token.json';
import { ethers } from 'ethers';
import store from '../store';

import {
  STAKING_CONTRACT_ADDRESS,
  PROFILE_CONTRACT_ADDRESS,
  STAKING_STORAGE_CONTRACT_ADDRESS,
  HUB_CONTRACT_ADDRESS,
} from '@/utils/constants';
import { getAmountWithDecimals } from '@/utils/cryptoUtils';
import Big from 'big.js';

class ContractService {
  constructor(web3, ethersSigner) {
    this.web3 = web3;
    this.ethersSigner = ethersSigner;
  }

  async getContractAddress(contractName) {
    if (!this[contractName]) {
      this[contractName] = await this.getContractAddressesFromHubContract(contractName);
    }
    return this[contractName];
  }
  getContractAddressesFromHubContract(contractName) {
    const hubContract = new this.web3.eth.Contract(
      hubContractAbi,
      store.getters.selectedNetwork.hubContract,
    );
    return hubContract.methods.getContractAddress(contractName).call();
  }

  async getIdentity(operationalAddress, adminWalletAddress) {
    const address = await this.getContractAddress('IdentityStorage');
    const IdentityStorageProfile = new this.web3.eth.Contract(IdentityStorage, address);
    const identity = await IdentityStorageProfile.methods
      .getIdentityId(operationalAddress)
      .call({ from: this.web3.eth.defaultAccount });
    const adminKey = ethers.utils.keccak256(
      ethers.utils.solidityPack(['address'], [adminWalletAddress]),
    );
    const hasPurpose = await IdentityStorageProfile.methods
      .keyHasPurpose(identity, adminKey, 1)
      .call({ from: this.web3.eth.defaultAccount });
    return hasPurpose ? identity : 0;
  }

  async getAsk(identityId) {
    const address = await this.getContractAddress('ProfileStorage');
    const ProfileStorageContract = new this.web3.eth.Contract(profileStorage, address);
    return ProfileStorageContract.methods.getAsk(identityId).call();
  }

  async updateAsk(identityId, newAsk) {
    const address = await this.getContractAddress('Profile');
    const ProfileContract = new this.web3.eth.Contract(profileAbi, address);
    const sanitizedNewAsk = getAmountWithDecimals(newAsk);
    return await ProfileContract.methods.setAsk(identityId, sanitizedNewAsk).send({
      from: this.web3.eth.defaultAccount,
    });
  }

  async getStakeAmountPendingWithdrawal(identityId, adminWallet) {
    const address = await this.getContractAddress('StakingStorage');
    const stakeContract = new this.web3.eth.Contract(stakingStorage, address);
    return await stakeContract.methods.getWithdrawalRequestAmount(identityId, adminWallet).call();
  }

  async getSharesContractInfo(identityId, adminWallet) {
    const address = await this.getContractAddress('ProfileStorage');
    const ProfileStorageContract = new this.web3.eth.Contract(profileStorage, address);
    const sharesContractAddress = await ProfileStorageContract.methods
      .getSharesContractAddress(identityId)
      .call();
    const shareContract = new this.web3.eth.Contract(ERC20Token, sharesContractAddress);
    return {
      address: sharesContractAddress,
      name: await shareContract.methods.name().call(),
      symbol: await shareContract.methods.symbol().call(),
      totalSupply: await shareContract.methods.totalSupply().call(),
      myBalance: await shareContract.methods.balanceOf(adminWallet).call(),
    };
  }

  async getTotalStake(identityId) {
    const address = await this.getContractAddress('StakingStorage');
    const stakeContract = new this.web3.eth.Contract(stakingStorage, address);
    return await stakeContract.methods.totalStakes(identityId).call();
  }
  async getAccumulatorOperatorFee(identityId) {
    const address = await this.getContractAddress('ProfileStorage');
    const ProfileStorageContract = new this.web3.eth.Contract(profileStorage, address);
    return await ProfileStorageContract.methods.getAccumulatedOperatorFee(identityId).call();
  }

  async getAssetsOnDkg() {
    const address = store.getters.selectedNetwork.contentAssetStorageContractAddress;
    return await this.ethersSigner.provider.getStorageAt(address, 7);
  }

  async getStakedTRAC() {
    const address = await this.getContractAddress('Token');
    const StakingStorageAddress = await this.getContractAddress('StakingStorage');
    const TRACContract = new this.web3.eth.Contract(ERC20Token, address);
    return await TRACContract.methods.balanceOf(StakingStorageAddress).call();
  }

  async addStake(identityId, stakeAmountToAdd) {
    const address = await this.getContractAddress('Token');
    const stakingContractAddress = await this.getContractAddress('Staking');
    const TRACContract = new this.web3.eth.Contract(ERC20Token, address);
    const sanitizedAmount = getAmountWithDecimals(stakeAmountToAdd);
    await TRACContract.methods.increaseAllowance(stakingContractAddress, sanitizedAmount).send({
      from: this.web3.eth.defaultAccount,
    });
    const stakingContract = new this.web3.eth.Contract(stakingAbi, stakingContractAddress);
    return await stakingContract.methods.addStake(identityId, sanitizedAmount).send({
      from: this.web3.eth.defaultAccount,
    });
  }
  async addStakeEthers(identityId, stakeAmountToAdd) {
    const address = await this.getContractAddress('Token');
    const stakingContractAddress = await this.getContractAddress('Staking');
    const tokenContract = new ethers.Contract(address, ERC20Token, this.ethersSigner);
    const stakeWei = ethers.utils.parseEther(stakeAmountToAdd);
    let allowanceReceipt = await tokenContract.increaseAllowance(stakingContractAddress, stakeWei, {
      gasPrice: 8,
      gasLimit: 500000,
    });
    await allowanceReceipt.wait();
    const stakingContract = new ethers.Contract(
      stakingContractAddress,
      stakingAbi,
      this.ethersSigner,
    );
    let stakingReceipt = await stakingContract['addStake(uint72,uint96)'](identityId, stakeWei, {
      gasPrice: 1000,
      gasLimit: 500000,
    });
    await stakingReceipt.wait();
  }

  async getLastWithdrawalTimestamp(identityId, adminWallet) {
    const address = await this.getContractAddress('StakingStorage');
    const stakeContract = new this.web3.eth.Contract(stakingStorage, address);
    return await stakeContract.methods
      .getWithdrawalRequestTimestamp(identityId, adminWallet)
      .call();
  }

  async requestWithdrawal(identityId, stakeToWithdraw) {
    const address = await this.getContractAddress('ProfileStorage');
    const stakingContractAddress = await this.getContractAddress('Staking');
    const ProfileStorageContract = new this.web3.eth.Contract(profileStorage, address);
    const stakingContract = new this.web3.eth.Contract(stakingAbi, stakingContractAddress);
    const sharesContractAddress = await ProfileStorageContract.methods
      .getSharesContractAddress(identityId)
      .call();
    const shareContract = new this.web3.eth.Contract(ERC20Token, sharesContractAddress);
    const totalSupply = await shareContract.methods.totalSupply().call();
    const totalStakes = await this.getTotalStake(identityId);
    const sharesToBurn = Big(getAmountWithDecimals(stakeToWithdraw))
      .mul(totalSupply)
      .div(totalStakes)
      .toString();

    await shareContract.methods.increaseAllowance(stakingContractAddress, sharesToBurn).send({
      from: this.web3.eth.defaultAccount,
      gasLimit: 500000,
    });
    return await stakingContract.methods.startStakeWithdrawal(identityId, sharesToBurn).send({
      from: this.web3.eth.defaultAccount,
      gasLimit: 500000,
    });
  }

  async withdrawStake(identityId) {
    const stakingContractAddress = await this.getContractAddress('Staking');
    const stakingContract = new this.web3.eth.Contract(stakingAbi, stakingContractAddress);
    return await stakingContract.methods.withdrawStake(identityId).send({
      from: this.web3.eth.defaultAccount,
      gasLimit: 500000,
    });
  }
}

export default ContractService;
