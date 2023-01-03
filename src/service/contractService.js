/* eslint-disable no-unused-vars */
// noinspection ES6UnusedImports

import stakingAbi from '../abis/Staking.json';
import stakingStorage from '../abis/StakingStorage.json';
import profileAbi from '../abis/Profile.json';
import profileStorage from '../abis/ProfileStorage.json';
import IdentityStorage from '../abis/identityStorage.json';
import identity from '../abis/identityContracts.json';
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
  constructor(ethersSigner) {
    this.ethersSigner = ethersSigner;
  }

  async getContractAddress(contractName) {
    if (!this[contractName]) {
      this[contractName] = await this.getContractAddressesFromHubContract(contractName);
    }
    return this[contractName];
  }
  async getContractAddressesFromHubContract(contractName) {
    const hubContract = new ethers.Contract(
      store.getters.selectedNetwork.hubContract,
      hubContractAbi,
      this.ethersSigner,
    );
    return await hubContract.getContractAddress(contractName);
  }

  async getIdentity(operationalAddress, adminWalletAddress) {
    const address = await this.getContractAddress('IdentityStorage');
    const IdentityStorageContract = new ethers.Contract(
      address,
      IdentityStorage,
      this.ethersSigner,
    );
    const identity = await IdentityStorageContract.getIdentityId(operationalAddress);
    const adminKey = this.getAdminKeyFromWallet(adminWalletAddress);
    const hasPurpose = await IdentityStorageContract.keyHasPurpose(identity, adminKey, 1);
    return hasPurpose ? identity : 0;
  }

  async getAsk(identityId) {
    const address = await this.getContractAddress('ProfileStorage');
    const ProfileStorageContract = new ethers.Contract(address, profileStorage, this.ethersSigner);
    return await ProfileStorageContract.getAsk(identityId);
  }

  async isKeyAlreadyUsed(identityId, adminWallet) {
    const address = await this.getContractAddress('IdentityStorage');
    const IdentityStorageContract = new ethers.Contract(
      address,
      IdentityStorage,
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
    const ProfileContract = new ethers.Contract(address, profileAbi, this.ethersSigner);
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
    const stakeContract = new ethers.Contract(address, stakingStorage, this.ethersSigner);
    return await stakeContract.getWithdrawalRequestAmount(identityId, adminWallet);
  }

  async getSharesContractInfo(identityId, adminWallet) {
    const address = await this.getContractAddress('ProfileStorage');
    const ProfileStorageContract = new ethers.Contract(address, profileStorage, this.ethersSigner);
    const sharesContractAddress = await ProfileStorageContract.getSharesContractAddress(identityId);
    const shareContract = new ethers.Contract(sharesContractAddress, ERC20Token, this.ethersSigner);
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
    const stakeContract = new ethers.Contract(address, stakingStorage, this.ethersSigner);
    return await stakeContract.totalStakes(identityId);
  }
  async getAccumulatorOperatorFee(identityId) {
    const address = await this.getContractAddress('ProfileStorage');
    const ProfileStorageContract = new ethers.Contract(address, profileStorage, this.ethersSigner);
    return await ProfileStorageContract.getAccumulatedOperatorFee(identityId);
  }

  async getAssetsOnDkg() {
    const address = store.getters.selectedNetwork.contentAssetStorageContractAddress;
    return await this.ethersSigner.provider.getStorageAt(address, 7);
  }

  async getStakedTRAC() {
    const address = await this.getContractAddress('Token');
    const StakingStorageAddress = await this.getContractAddress('StakingStorage');
    const TRACContract = new ethers.Contract(address, ERC20Token, this.ethersSigner);
    return await TRACContract.balanceOf(StakingStorageAddress);
  }

  async addStakeEthers(identityId, stakeAmountToAdd, loadingMessageCallback = null) {
    const address = await this.getContractAddress('Token');
    const stakingContractAddress = await this.getContractAddress('Staking');
    const tokenContract = new ethers.Contract(address, ERC20Token, this.ethersSigner);
    const stakeWei = ethers.utils.parseEther(stakeAmountToAdd);
    let allowanceReceipt = await tokenContract.increaseAllowance(stakingContractAddress, stakeWei, {
      gasPrice: 8,
      gasLimit: 500000,
    });
    if (loadingMessageCallback) {
      loadingMessageCallback('Adding stake (Transaction 1 of 2: Increasing Allowance)');
    }
    await allowanceReceipt.wait();
    const stakingContract = new ethers.Contract(
      stakingContractAddress,
      stakingAbi,
      this.ethersSigner,
    );
    let stakingReceipt = await stakingContract['addStake(uint72,uint96)'](identityId, stakeWei, {
      gasPrice: 16,
      gasLimit: 500000,
    });
    if (loadingMessageCallback) {
      loadingMessageCallback('Adding stake (Transaction 2 of 2: Adding stake to the node)');
    }
    await stakingReceipt.wait();
  }

  async getLastWithdrawalTimestamp(identityId, adminWallet) {
    const address = await this.getContractAddress('StakingStorage');
    const stakingStorageContract = new ethers.Contract(address, stakingStorage, this.ethersSigner);
    return await stakingStorageContract.getWithdrawalRequestTimestamp(identityId, adminWallet);
  }

  async requestWithdrawal(identityId, stakeToWithdraw, loadingMessageCallback = null) {
    const address = await this.getContractAddress('ProfileStorage');
    const stakingContractAddress = await this.getContractAddress('Staking');
    const ProfileStorageContract = new ethers.Contract(address, profileStorage, this.ethersSigner);
    const stakingContract = new ethers.Contract(
      stakingContractAddress,
      stakingAbi,
      this.ethersSigner,
    );
    const sharesContractAddress = await ProfileStorageContract.getSharesContractAddress(identityId);

    const shareContract = new ethers.Contract(sharesContractAddress, ERC20Token, this.ethersSigner);

    const totalSupply = await shareContract.totalSupply();
    const totalStakes = await this.getTotalStake(identityId);
    const sharesToBurn = Big(getAmountWithDecimals(stakeToWithdraw))
      .mul(totalSupply)
      .div(totalStakes)
      .round()
      .toString();

    await (
      await shareContract.increaseAllowance(stakingContractAddress, sharesToBurn, {
        gasPrice: 8,
        gasLimit: 500000,
      })
    ).wait();
    return await (
      await stakingContract.startStakeWithdrawal(identityId, sharesToBurn, {
        gasPrice: 16,
        gasLimit: 500000,
      })
    ).wait();
  }

  async withdrawStake(identityId) {
    const stakingContractAddress = await this.getContractAddress('Staking');
    const stakingContract = new ethers.Contract(
      stakingContractAddress,
      stakingAbi,
      this.ethersSigner,
    );
    const removeKeyReceipt = await stakingContract.withdrawStake(identityId, {
      gasPrice: 16,
      gasLimit: 500000,
    });
    return await removeKeyReceipt.wait();
  }

  async addAdminKey(identityId, newAdminWallet, purpose, type) {
    const identityContractAddress = await this.getContractAddress('Identity');
    const identityContract = new ethers.Contract(
      identityContractAddress,
      identity,
      this.ethersSigner,
    );
    const adminKey = this.getAdminKeyFromWallet(newAdminWallet);
    const removeKeyReceipt = await identityContract.addKey(identityId, adminKey, purpose, type, {
      gasPrice: 16,
      gasLimit: 500000,
    });
    return await removeKeyReceipt.wait();
  }
  async removeKey(identityId, newAdminWallet) {
    const identityContractAddress = await this.getContractAddress('Identity');
    const identityContract = new ethers.Contract(
      identityContractAddress,
      identity,
      this.ethersSigner,
    );
    const adminKey = this.getAdminKeyFromWallet(newAdminWallet);
    const removeKeyReceipt = await identityContract.removeKey(identityId, adminKey, {
      gasPrice: 16,
      gasLimit: 500000,
    });
    return await removeKeyReceipt.wait();
  }
}

export default ContractService;
