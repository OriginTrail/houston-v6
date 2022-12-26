<template>
  <div class="houston-account-button">
    <el-dropdown
      @command="logoutCommands"
      class="user-management-dropdown"
      :trigger="'click'"
      @visible-change="dropdownStatusEvent"
    >
      <span class="el-dropdown-link my-auto dropdown-head">
        <img src="/images/icons/hash-icon.svg" class="hash-image" />
        <span class="text label-inline-16">{{ walletAddress }}</span>
        <i
          :class="{
            'el-icon-arrow-down el-icon--right': true,
            open: dropdownStatus,
          }"
        ></i>
      </span>
      <el-dropdown-menu slot="dropdown" class="user-management-dropdown-slider">
        <el-dropdown-item command="no-command" class="user-info-item">
          <div class="user-info">
            <div class="item">
              <div class="label">Network</div>
              <div class="value">{{ $store.getters.selectedNetwork.label }}</div>
            </div>
            <div class="item">
              <div class="label">Operational wallet</div>
              <div class="value">{{ operationalWalletAddress }}</div>
            </div>
          </div>
        </el-dropdown-item>
        <el-dropdown-item command="logout" class="disconnect-item-wrapper">
          <div class="disconnect-item">
            <span>Disconnect from Houston</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { getAddressShortForm } from '@/utils/stringUtil';

export default {
  name: 'HoustonAccountButton',
  data() {
    return {
      dropdownStatus: false,
    };
  },
  computed: {
    walletAddress() {
      const address = this.$store.getters.connectedAddress;
      return address
        ? getAddressShortForm(address, {
            leftHandLength: 13,
            rightHandLength: 4,
          })
        : 'Connect wallet';
    },
    operationalWalletAddress() {
      const address = this.$store.getters.useOperationalWallet;
      return address
        ? getAddressShortForm(address, {
            leftHandLength: 13,
            rightHandLength: 4,
          })
        : 'Connect wallet';
    },
  },
  methods: {
    async logoutCommands(command) {
      switch (command) {
        case 'logout': {
          await this.$store.dispatch('disconnectFromHouston');
          this.$router.push({
            name: 'login',
          });
          break;
        }
        default: {
          break;
        }
      }
    },
    dropdownStatusEvent(status) {
      this.dropdownStatus = status;
    },
  },
};
</script>

<style lang="scss">
@import '../../assets/variable.scss';
@import '../../assets/general.scss';
.user-management-dropdown {
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  width: 261px;
  border: 1px solid $grey-300;
  border-radius: 8px;
  &.el-dropdown {
    .el-dropdown-link {
      padding: 0px 8px;
      display: flex;
      border-radius: 8px;
      font-weight: 500;
      color: $black;
      &:hover {
        cursor: pointer;
      }
      &.context-switcher {
        border-radius: 0px;
      }
      .current-context {
        height: 100%;
        margin-top: auto;
        margin-bottom: auto;
      }
      &.dropdown-head {
        background: #fffffff2;
        text-align: center;
        display: flex;
        gap: 8px;
        height: 48px;
        .text {
          margin: auto;
          color: $grey-400;
        }
        .hash-image {
          margin: auto;
          height: 24px;
          width: 24px;
        }
      }
      img {
        margin-right: 1em;
      }
      .el-icon-arrow-down,
      .icon-img {
        height: 24px;
        width: 24px;
        margin: auto;
        display: flex;
        transition: all 0.3s ease-in-out;
        font-weight: 900;
        &::before {
          margin: auto;
        }
        &.open {
          rotate: 180deg;
        }
      }
    }
  }
}

.el-dropdown-menu.el-popper {
  &.user-management-dropdown-slider {
    padding: 0;
    width: 261px;
    border-radius: 8px;
    .el-dropdown-menu__item {
      padding: 0;
    }

    .user-info-item {
      &:hover,
      &:active {
        cursor: default;
        background-color: white;
      }
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 32px 16px 24px 16px;
      .item {
        .label {
          @extend .label-inline-14;
          color: $black-tertiary;
          margin-bottom: 8px;
        }
        .value {
          @extend .label-inline-14;
          color: $black-primary;
        }
      }
    }

    .disconnect-item-wrapper {
      border-top: 1px solid $section-grey-100;
      border-radius: 0px 0px 8px 8px;
      &:hover {
        background-color: $cta-card-grey;
      }
      &:active {
        background-color: $brand-blue-light-focus-button;
      }
      .disconnect-item {
        height: 40px;
        display: flex;
        span {
          @extend .label-inline-14;
          margin: auto;
          color: $brand-blue;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
