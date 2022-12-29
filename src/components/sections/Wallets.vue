<template>
  <div class="wallet-management-wrapper">
    <!-- Service Tokenomics -->
    <h2 class="section-heading">Node wallets</h2>
    <div class="wallet-key-management">
      <tokenomics-card title="Add key" class="add-key-card">
        <div class="card-content">
          <div class="description label-inline-14">
            Using this interface you can add additional keys to your node. To find out more about
            OriginTrail Node keys, visit this page:
            <a
              target="_blank"
              href="https://docs.origintrail.io/decentralized-knowledge-graph-layer-2/testnet-node-setup-instructions/node-keys"
              >Setup instructions : node keys</a
            >
          </div>
          <div class="form add-key-form">
            <el-form
              @submit.native.prevent
              :model="userForm"
              :rules="userRules"
              ref="addKeyForm"
              @validate="validateStatus"
            >
              <div class="form-item">
                <div class="label label-inline-12">Select key purpose</div>
                <el-form-item prop="purpose">
                  <el-select
                    v-model="userForm.purpose"
                    placeholder="Please select your key purpose"
                  >
                    <el-option
                      v-for="net of purposeList"
                      :key="net.label"
                      :label="net.label"
                      :value="net.disabled ? undefined : net.value"
                      :disabled="net.disabled"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="form-item">
                <div class="label label-inline-12">Select key type</div>
                <el-form-item prop="keyType">
                  <el-select
                    v-model="userForm.keyType"
                    placeholder="Please select your key purpose"
                  >
                    <el-option
                      v-for="net of keyTypeList"
                      :key="net.label"
                      :label="net.label"
                      :value="net.disabled ? undefined : net.value"
                      :disabled="net.disabled"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="form-item">
                <div class="label label-inline-12">New key wallet</div>
                <el-form-item prop="walletKey">
                  <el-input
                    class="walletKey-wallet"
                    placeholder="Please input a valid wallet to create a key from"
                    v-model="userForm.walletKey"
                    v-on:keyup.enter.native.stop.prevent="addKey"
                  ></el-input>
                </el-form-item>
              </div>

              <m-notification type="danger" class="mt-3" v-if="error">
                {{ error }}
              </m-notification>
            </el-form>
          </div>
          <div class="cta-section">
            <Button type="button" class="cta-button" :disabled="isAddFormInvalid" @click="addKey"
              >Add key</Button
            >
          </div>
        </div>
      </tokenomics-card>
      <tokenomics-card title="Remove key" class="remove-key-card">
        <div class="card-content">
          <div class="description label-inline-14">
            Insert the address of the key you want to remove. Note that you can only remove a key
            (of a certain type) if there is at least two keys available for that type (e.g. you
            cannot remove your only admin key, as you would lose the ability to manage your node).
            <br />
            <br />
            To find out more about OriginTrail Node keys, visit this page:
            <a
              target="_blank"
              href="https://docs.origintrail.io/decentralized-knowledge-graph-layer-2/testnet-node-setup-instructions/node-keys"
            >
              Setup instructions : node keys
            </a>
          </div>
          <div class="form add-key-form">
            <el-form
              @submit.native.prevent
              :model="removeKeyUserForm"
              :rules="removeKeyUserRules"
              ref="removeKeyForm"
              @validate="validateRemoveKeyStatus"
            >
              <div class="form-item">
                <div class="label label-inline-12">Wallet to remove key of</div>
                <el-form-item prop="walletKey">
                  <el-input
                    class="walletKey-wallet"
                    placeholder="Please input a valid wallet to remove the associated key from"
                    v-model="removeKeyUserForm.walletKey"
                    v-on:keyup.enter.native.stop.prevent="removeKey()"
                  ></el-input>
                </el-form-item>
              </div>

              <m-notification type="danger" class="mt-3" v-if="removeKeyError">
                {{ removeKeyError }}
              </m-notification>
            </el-form>
          </div>
          <div class="cta-section">
            <Button
              type="button"
              class="cta-button"
              :disabled="isRemoveFormInvalid"
              @click="removeKey"
              >Remove key</Button
            >
          </div>
        </div>
      </tokenomics-card>
    </div>
  </div>
</template>

<script>
import Button from '../Button';
import metamask from '@/service/metamask';
import TokenomicsCard from '@/components/shared/TokenomicsCard';
import { getAddressShortForm } from '@/utils/stringUtil';
import { generateToast } from '@/utils/toastObjectGenerator';
import { keyTypeList, purposeList } from '@/utils/lists';
import MNotification from '@/components/shared/Notification';

export default {
  name: 'WalletManagement',
  components: {
    MNotification,
    TokenomicsCard,
    Button,
  },
  data() {
    const validateWalletAddressWithoutVerification = async (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input your wallet address'));
      } else if (!metamask.isAddress(value)) {
        callback(new Error('Please input a valid wallet address'));
      } else {
        callback();
      }
    };
    const validateWalletAddress = async (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input your wallet address'));
      } else if (!metamask.isAddress(value)) {
        callback(new Error('Please input a valid wallet address'));
      }
      const keysMatch = await this.isKeyUsed(value);
      if (!keysMatch) {
        callback(new Error('Please input a new wallet'));
      } else {
        callback();
      }
    };
    return {
      currentAsk: null,
      newAsk: null,
      newStake: null,
      withdrawalStake: null,
      purposeList: purposeList,
      keyTypeList: keyTypeList,
      error: null,
      userForm: {
        purpose: null,
        keyType: null,
        walletKey: null,
      },
      userRules: {
        keyType: [
          {
            required: true,
            message: "Please choose your key's type",
            trigger: ['blur', 'change'],
          },
        ],
        purpose: [
          {
            required: true,
            message: "Please choose your key's purpose",
            trigger: ['blur', 'change'],
          },
        ],
        walletKey: [
          {
            required: true,
            message: 'Please input your new key wallet',
            trigger: ['blur', 'change'],
          },
          {
            validator: validateWalletAddress,
            trigger: ['blur', 'change'],
          },
        ],
      },
      validationStatus: { walletKey: false },
      validationKey: 0,
      removeKeyError: null,
      removeKeyUserForm: {
        purpose: null,
        keyType: null,
        walletKey: null,
      },
      removeKeyUserRules: {
        keyType: [
          {
            required: true,
            message: "Please choose your key's type",
            trigger: ['blur', 'change'],
          },
        ],
        purpose: [
          {
            required: true,
            message: "Please choose your key's purpose",
            trigger: ['blur', 'change'],
          },
        ],
        walletKey: [
          {
            required: true,
            message: "Please input your existing key's wallet",
            trigger: ['blur', 'change'],
          },
          {
            validator: validateWalletAddressWithoutVerification,
            message: 'Please input a valid wallet',
            trigger: ['blur', 'change'],
          },
        ],
      },
      removeKeyValidationStatus: { walletKey: false },
    };
  },
  computed: {
    getIdentityId() {
      return this.$store.getters.isIdentityResolved;
    },
    isRemoveFormInvalid() {
      return (
        !this.removeKeyValidationStatus.walletKey || !this.removeKeyValidationStatus['walletKey']
      );
    },
    isAddFormInvalid() {
      this.validationKey;
      return (
        !this.userForm.walletKey ||
        !this.validationStatus['walletKey'] ||
        !this.validationStatus['keyType'] ||
        !this.validationStatus['purpose']
      );
    },
  },
  async mounted() {},
  methods: {
    async isKeyUsed(adminWallet) {
      const loader = this.$loading({
        target: '.add-key-card',
        text: 'Validating wallet...',
        customClass: 'backdrop_border_radius',
      });
      try {
        return await metamask.contractService.isKeyAlreadyUsed(this.getIdentityId, adminWallet);
      } catch (err) {
        console.log(err);
        this.notify(null, 'An error occurred when validating a key', 'error');
        return false;
      } finally {
        loader.close();
      }
    },
    getAddressShortForm,
    resetValidationStatus() {
      this.validationStatus = {
        walletKey: false,
      };
    },
    resetRemoveFormValidationStatus() {
      this.removeKeyValidationStatus = {
        walletKey: false,
      };
    },
    async addKey() {
      if (!this.isAddFormInvalid) {
        const loader = this.$loading({
          target: '.add-key-card',
          text: 'Adding new key...',
          customClass: 'backdrop_border_radius',
        });
        try {
          await metamask.contractService.addAdminKey(
            this.getIdentityId,
            this.userForm.walletKey,
            this.userForm.purpose,
            this.userForm.keyType,
          );
          this.notify(null, 'Key added successfully!', 'success');
          this.newAsk = 0;
          this.$refs.addKeyForm.resetFields();
          this.resetValidationStatus();
        } catch (err) {
          console.log(err);
          this.notify(
            null,
            err.code === 4001
              ? 'METAMASK_TRANSACTION_REFUSED'
              : 'An error occurred when adding a new key',
            'error',
          );
        } finally {
          loader.close();
        }
      }
    },

    async removeKey() {
      if (!this.isRemoveFormInvalid) {
        const loader = this.$loading({
          target: '.remove-key-card',
          text: 'Removing key...',
          customClass: 'backdrop_border_radius',
        });
        try {
          await metamask.contractService.removeKey(
            this.getIdentityId,
            this.removeKeyUserForm.walletKey,
          );
          this.notify(null, 'Key removed successfully!', 'success');
          this.$refs.removeKeyForm.resetFields();
          this.resetRemoveFormValidationStatus();
        } catch (err) {
          console.log(err);
          this.notify(
            null,
            err.code === 4001
              ? 'METAMASK_TRANSACTION_REFUSED'
              : 'An error occurred when removing a key',
            'error',
          );
        } finally {
          loader.close();
        }
      }
    },
    notify(title, message, type, options) {
      const notificationArray = generateToast(title, message, type, options);
      return this.$toast(notificationArray[0], notificationArray[1]);
    },
    async copyAddress(address) {
      await navigator.clipboard.writeText(address);
    },
    validateStatus(prop, status) {
      this.validationKey++;
      this.validationStatus[prop] = status;
    },
    validateRemoveKeyStatus(prop, status) {
      this.removeKeyValidationStatus[prop] = status;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/variable.scss';
@import '../../assets/general.scss';

.wallet-management-wrapper {
  .section-heading {
    margin-bottom: 24px;
  }

  .wallet-key-management {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .tokenomics-card-wrapper {
    max-width: 504px;
    height: 100%;
    .card-content {
      display: flex;
      flex-direction: column;
      gap: 32px;
      .description {
        color: $black-secondary;
        line-height: 150%;
      }
      .form {
        .sub-label {
          margin-top: 16px;
          color: $black-tertiary;
          .trac-amount {
            margin-left: 8px;
            color: $black;
          }
        }
        .input-prefix-plus {
          width: 14px;
          height: 14px;
        }
      }
      .cta-section {
        display: flex;
        .cta-button {
          align-self: flex-start;
        }
      }
      .cta-section-with-steps {
        display: flex;
        flex-direction: column;
        gap: 16px;
        .step-divider {
          height: 1px;
          width: 100%;
          background-color: $grey-200;
          margin-top: 12px;
        }
        .extra-step-cta {
          display: flex;
          gap: 16px;
          .cta-button {
            align-self: flex-start;
          }
          .estimate-time-counter {
            display: flex;
            gap: 12px;
            align-items: center;
          }
        }
      }
    }
  }

  .current-form {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    min-width: 864px;
    max-width: 1024px;
    height: 170px;
    background: #ffffff;
    box-shadow: 0px 4px 8px rgba(82, 97, 115, 0.18);
    border-radius: 16px;

    @media screen and (min-width: 1440px) {
      height: 128px;
    }

    .first-col {
      display: flex;
      flex-direction: column;
    }

    .second-col {
      display: flex;
      flex-direction: column;
      padding-top: 37px;
      width: 50%;

      @media screen and (min-width: 1440px) {
        width: 43%;
        padding-top: 0;
      }
    }

    .label-and-first-input {
      margin-bottom: 16px;

      @media screen and (min-width: 1440px) {
        display: flex;
        align-items: center;
      }

      .settings-label {
        margin-bottom: 16px !important;

        @media screen and (min-width: 1440px) {
          margin: 0 16px 0 0 !important;
        }
      }
    }

    .average-ask-neighbourhoods {
      margin-bottom: 10px;
    }
  }

  .stake-settings-heading {
    margin-top: 40px;
  }

  .claim-rewards {
    display: flex;
    flex-wrap: wrap;
    padding: 16px;
    margin-top: 40px;
    gap: 8px;
    width: 504px;
    height: 144px;
    background: #ffffff;
    box-shadow: 0px 4px 8px rgba(82, 97, 115, 0.18);
    border-radius: 16px;

    .property-wrapper {
      display: flex;
      flex-direction: column;
      padding: 8px 16px;
      gap: 8px;
      width: 232px;
      height: 56px;
      background: $section-grey-50;
      border-radius: 8px;

      .title {
        font-weight: 400;
        font-size: 16px;
        line-height: 16px;
        color: $black-primary;
      }

      .value {
        width: 200px;
        height: 16px;
        font-weight: 700;
        font-size: 16px;
        line-height: 16px;
        color: $blue-primary;
      }
      .item {
        display: flex;
        flex-direction: row;
      }
    }

    .full-width {
      width: 100%;
    }
  }

  .node-stake {
    .wide-card {
      margin-bottom: 16px;
      display: flex;
      flex-direction: row;
      padding: 16px;
      gap: 16px;
      flex-wrap: wrap;
      .property-wrapper {
        display: flex;
        flex-direction: column;
        padding: 8px 16px;
        gap: 8px;
        flex-grow: 1;
        background: $section-grey-50;
        border-radius: 8px;

        .title {
          color: $black-tertiary;
        }

        .value {
          color: $blue-primary;
        }
        .item {
          display: flex;
          color: $black-secondary;
          .item-value {
            color: $brand-blue;
          }
          .copy-button-wrapper {
            margin-left: auto;
          }
        }
      }
    }
    .stake-update-cards {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
  }

  .add-key-card,
  .remove-key-card {
    .walletKey-wallet {
      ::v-deep {
        input {
          @extend .label-inline-14;
          color: $black-secondary;
        }
      }
    }
    .add-key-form {
      .el-form {
        display: flex;
        flex-direction: column;
        gap: 40px;
        .label {
          margin-bottom: 8px;
        }
        .error-message {
          color: #b62f2f;
        }
        .el-form-item {
          width: 100%;
          margin-bottom: 0px;
        }
        .el-form-item__content {
          margin-left: 0;
          text-align: left;

          .el-select {
            width: 100%;
            ::v-deep {
              .el-input__inner {
                border-radius: 8px;
                @extend .label-inline-14;
                color: $black-secondary;
              }
              .el-select_caret {
                font-weight: 900;
                color: $grey-300;
              }
            }
          }

          .el-button {
            margin-top: 0.8em;
            width: 100%;
          }
        }
        .metamask-button {
          height: 40px;
          width: 100%;
          margin-bottom: 16px;
        }

        .walletKey-wallet {
          ::v-deep {
            input {
              @extend .label-inline-14;
              color: $black-secondary;
            }
          }
        }

        .cta-section {
          .login-button {
            width: 100%;
            @extend .label-inline-16-semi-bold;
          }
        }
        .notification {
          margin-top: 16px;
          width: 100%;
        }
      }
    }
  }
}
</style>
