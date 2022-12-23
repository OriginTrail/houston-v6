<template>
  <div class="login-view-wrapper">
    <Card class="login-card">
      <h4>Operational wallet</h4>
      <input class="operational-wallet-input" v-model="operationalWallet" />
      <metamask-connect-button :button-text="walletAddress" @click="connectToMetamask" />
    </Card>
  </div>
</template>

<script>
import Card from '@/components/shared/Card';
import MetamaskConnectButton from '@/components/shared/MetamaskConnectButton';
import { getAddressShortForm } from '@/utils/stringUtil';
import metamask from '@/service/metamask';
export default {
  name: 'LoginView',
  components: { MetamaskConnectButton, Card },
  data() {
    return {
      operationalWallet: null,
    };
  },
  computed: {
    walletAddress() {
      const address = this.$store.getters.connectedAddress;
      return address ? getAddressShortForm(address) : 'Connect wallet';
    },
  },
  methods: {
    connectToMetamask() {
      const isAlreadyConnected = this.$store.getters.isLoggedIn;
      if (isAlreadyConnected) {
        this.$store.dispatch('disconnectFromMetamask');
        this.$router.push({
          name: 'login',
        });
      } else {
        const loader = this.$loading({ target: 'body' });
        this.$store.dispatch('connectToMetamask').then(async () => {
          const identity = await metamask.contractService.getIdentity(this.operationalWallet);
          if (Number(identity) > 0) {
            this.$store.commit('SAVE_IDENTITY', identity);
            this.$router.push({
              name: 'overview',
            });
          } else {
            this.$notify({ type: 'error', message: 'Identity not found' });
            this.$store.dispatch('disconnectFromMetamask');
          }
          loader.close();
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../assets/variable.scss';

.login-view-wrapper {
  width: 100%;
  display: flex;
  .login-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: auto;
    width: 540px;
    height: 250px;
    padding: 16px;
    .operational-wallet-input {
      padding: 10px 10px 8px;
      height: 40px;
      background: #ffffff;
      border: 1px solid #dfdfdf;
      border-radius: 8px;
      color: $green-500;
      outline: none;
      width: 100%;
    }
    .metamask-button {
      margin-left: auto;
    }
  }
}
</style>
