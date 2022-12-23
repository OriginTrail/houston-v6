<template>
  <div :class="{ 'main-layout-wrapper': true, fullPage: isFullPage }">
    <img class="background-image" src="/images/login-background-elements.svg" v-if="isFullPage" />
    <Header v-if="!isFullPage"></Header>
    <div class="page-body">
      <template v-if="isFullPage">
        <router-view></router-view>
      </template>
      <template v-else>
        <sidebar-nav></sidebar-nav>
        <div class="main-content" v-if="identityId">
          <div class="upper-section">
            <metamask-connect-button :button-text="walletAddress" @click="connectToMetamask" />
          </div>
          <router-view></router-view>
        </div>
        <login-view v-else />
      </template>
    </div>
  </div>
</template>

<script>
import Header from '../components/sections/Header';
import SidebarNav from '../components/sections/SidebarNav';
import MetamaskConnectButton from '@/components/shared/MetamaskConnectButton';
import { getAddressShortForm } from '@/utils/stringUtil';
import LoginView from '@/components/sections/LoginView';

export default {
  name: 'MainLayout',
  components: {
    LoginView,
    MetamaskConnectButton,
    Header,
    SidebarNav,
  },
  data() {
    return {
      list: [],
    };
  },
  computed: {
    isFullPage() {
      return this.$route.meta.fullPage;
    },
    walletAddress() {
      const address = this.$store.getters.connectedAddress;
      return address ? getAddressShortForm(address) : 'Connect wallet';
    },
    identityId() {
      return this.$store.getters.isIdentityResolved;
    },
  },
  async created() {
    try {
      this.list = await this.fetchData();
    } catch (e) {
      console.log('ERROR HANDLING');
    }
  },
  methods: {
    async fetchData() {
      return this.$http.get([1, 2, 3, 4, 5], true);
    },
    connectToMetamask() {
      const isAlreadyConnected = this.$store.getters.isLoggedIn;
      if (isAlreadyConnected) {
        this.$store.dispatch('disconnectFromMetamask');
        this.$router.push({
          name: 'login',
        });
      } else {
        this.$store.dispatch('connectToMetamask');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main-layout-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  position: relative;

  &.fullPage {
    background: url('/images/login-background.svg');
    background-repeat: no-repeat;
    background-size: cover;
  }

  .background-image {
    position: absolute;
    z-index: 0;
    width: 100vw;
    height: 100%;
    max-width: 1128px;
    right: 10%;
  }

  .page-body {
    display: flex;
    column-gap: 24px;
    padding: 0 30px;
    height: 100%;
    flex-grow: 4;
    z-index: 1;
    @media screen and (min-width: 1440px) {
      column-gap: 48px;
    }
    .main-content {
      min-width: 944px;
      width: 100%;
      height: 880px;
      background: #f6f6f6;
      border-radius: 20px;
      padding: 0 40px 82px 40px;

      .upper-section {
        display: flex;
        padding: 24px 0px 10px 0px;

        .metamask-button {
          margin-left: auto;
        }
      }
    }
    .login-page-wrapper {
      height: auto;
      display: flex;
    }
  }
}
</style>
