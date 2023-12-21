<template>
  <div class="login-view-wrapper">
    <div class="header">
      <img class="top-image" src="/images/houston-logo.svg" />
    </div>
    <div class="login-form">
      <el-form :model="userForm" :rules="userRules" ref="loginFrom" @validate="validateStatus">
        <div class="form-item">
          <div class="label label-inline-12">Choose the network</div>
          <el-form-item prop="network">
            <el-select v-model="userForm.network" placeholder="Please select your network">
              <el-option
                v-for="net of networkOptions"
                :key="net.internalId"
                :label="net.label"
                :value="net.internalId"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="label label-inline-12 blockchain-select" v-if="userForm.network">
            Choose the blockchain
          </div>
          <el-form-item prop="blockchain" v-if="userForm.network">
            <el-select v-model="userForm.blockchain" placeholder="Please select your blockchain">
              <el-option
                v-for="net of selectedSubnetworks"
                :key="net.chainId"
                :label="net.label"
                :value="net.chainId"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="form-item">
          <div class="label label-inline-12">Admin wallet address</div>
          <el-form-item>
            <metamask-connect-button
              :disabled="!userForm.network"
              :button-text="walletAddress"
              :error="metamaskError"
              :success="!!$store.getters.connectedAddress"
              @click="connectToMetamask"
            />
          </el-form-item>
          <div class="label label-inline-12">Operational wallet address</div>
          <el-form-item prop="operationalWallet">
            <el-input
              class="operational-wallet"
              placeholder="Please input your operational wallet"
              v-model="userForm.operationalWallet"
              v-on:keyup.enter.native="loginAction"
            ></el-input>
          </el-form-item>
          <m-notification type="danger" class="mt-3" v-if="error">
            {{ error }}
          </m-notification>
          <m-notification type="danger" class="mt-3" v-if="error && networkError">
            Please select the correct network, or click
            <span class="add-network-button" @click="addNewChain">here</span> to add it to your
            wallet
          </m-notification>
        </div>
        <el-form-item class="cta-section text-start">
          <Button
            type="button"
            :disabled="
              !connectedAddress ||
              metamaskError ||
              !userForm.operationalWallet ||
              !validationStatus['operationalWallet']
            "
            class="login-button"
            @click="loginAction"
            >Connect via Houston</Button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import MetamaskConnectButton from '@/components/shared/MetamaskConnectButton';
import { getAddressShortForm } from '@/utils/stringUtil';
import metamask from '@/service/metamask';
import MNotification from '@/components/shared/Notification';
import Button from '@/components/Button';
import { networkList } from '@/utils/lists';
import { networkErrors } from '@/utils/errorMessages';
export default {
  name: 'LoginComponent',
  components: { Button, MNotification, MetamaskConnectButton },
  data() {
    const validateWalletAddress = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input your operational wallet'));
      } else if (!metamask.isAddress(value)) {
        callback(new Error('Please input a valid wallet'));
      } else {
        callback();
      }
    };
    return {
      userForm: {
        network: null,
        operationalWallet: null,
        blockchain: null,
      },
      userRules: {
        network: [
          { required: true, message: 'Please choose your network.', trigger: ['blur', 'change'] },
        ],
        blockchain: [
          {
            required: true,
            message: 'Please choose your blockchain.',
            trigger: ['blur', 'change'],
          },
        ],
        operationalWallet: [
          {
            required: true,
            message: 'Please input your operational wallet',
            trigger: ['blur', 'change'],
          },
          {
            validator: validateWalletAddress,
            message: 'Please input a valid operational wallet',
            trigger: ['blur', 'change'],
          },
        ],
      },
      validationStatus: { operationalWallet: false },
      error: null,
      metamaskError: null,
      networkError: null,
      networkOptions: networkList,
    };
  },
  computed: {
    walletAddress() {
      const address = this.$store.getters.connectedAddress;
      return address
        ? getAddressShortForm(address, { rightHandLength: 15, leftHandLength: 12 })
        : 'Connect admin wallet';
    },
    selectedSubnetworks() {
      return (
        this.userForm.network &&
        this.networkOptions
          .find((e) => e.internalId === this.userForm.network)
          ?.subNetworks?.filter((e) => !e.disabled)
      );
    },
    connectedAddress() {
      return this.$store.getters.connectedAddress;
    },
  },
  methods: {
    addNewChain() {
      return metamask.addMetamaskChain(this.$store.getters.selectedNetwork);
    },
    validateStatus(prop, status) {
      if (prop === 'blockchain' && status) {
        const network = this.networkOptions
          .find((e) => e.internalId === this.userForm.network)
          ?.subNetworks.find((e) => e.chainId === this.userForm.blockchain);
        this.$store.commit('SAVE_NETWORK_CHOICE', network);
        if (this.$store.getters.isLoggedIn) {
          metamask.chainUpdateProcess(network.chainId);
        }
      }
      if (prop === 'network' && status) {
        this.userForm.blockchain = null;
      }
      this.validationStatus[prop] = status;
    },
    loginAction() {
      this.error = null;
      this.metamaskError = null;
      this.networkError = null;
      const loader = this.$loading({
        target: '.login-view-wrapper',
        text: 'Verifying operational wallet',
        customClass: 'backdrop_border_radius',
      });
      this.$store
        .dispatch('getIdentityAction', {
          opw: this.userForm.operationalWallet,
          adminw: metamask.accounts[0],
        })
        .then(() => {
          this.$router.push({
            name: 'overview',
          });
        })
        .catch((err) => {
          this.error =
            err?.data?.message ??
            err?.message ??
            networkErrors[err] ??
            'An error has occurred with your login';
        })
        .finally(() => {
          loader.close();
        });
    },

    connectToMetamask() {
      this.error = null;
      this.metamaskError = null;
      this.networkError = null;
      const isAlreadyConnected = this.$store.getters.isLoggedIn;
      if (isAlreadyConnected) {
        this.$store.dispatch('disconnectFromMetamask');
        if (this.$route.name !== 'login') {
          this.$router.push({
            name: 'login',
          });
        }
      } else {
        const loader = this.$loading({ target: 'body' });
        this.$store
          .dispatch('connectToMetamask')
          .catch((err) => {
            this.metamaskError = true;
            if (err.message === 'netError') {
              this.networkError = true;
              this.error = 'Failed to connect to the MetaMask.';
            } else {
              this.error = 'Failed to connect to the MetaMask.';
            }
          })
          .finally(() => {
            loader.close();
          });
      }
    },

    async getIdentityId() {
      return metamask.contractService
        .getIdentity(this.userForm.operationalWallet, metamask.accounts[0])
        .then((identity) => {
          console.log(identity);
          if (Number(identity) > 0) {
            this.$store.commit('SAVE_IDENTITY', identity);
            this.$store.commit('SAVE_OPERATIONAL_WALLET', this.userForm.operationalWallet);
            return identity;
          } else {
            throw 'NOT_CONNECTED_OP_WALLET';
          }
        });
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../assets/variable';
@import '../../assets/general';
.login-view-wrapper {
  padding: 64px 24px;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  text-align: left;
  width: 415px;
  background-color: white;
  box-shadow: 0px 0px 17px rgba(14, 63, 229, 0.04), 4px 6px 17px rgba(14, 63, 229, 0.15);
  .header {
    margin-bottom: 56px;
    text-align: center;
    color: black;
    .top-image {
      margin-bottom: 32px;
    }
  }
  .login-form {
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

      .blockchain-select {
        margin-top: 24px;
      }
      .metamask-button {
        height: 40px;
        width: 100%;
        margin-bottom: 16px;
      }

      .operational-wallet {
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
</style>
