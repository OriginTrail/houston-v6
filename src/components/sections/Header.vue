<template>
  <div class="header-wrapper">
    <div class="logo-node-and-assets-info">
      <img class="logo" src="images/logo.svg" alt="Houston application logo" />
      <!--      <div class="node-info">
        <info-pair
          title="Node version"
          description="v6-beta.3.0.1 (autoupdate <b>ON</b>)"
        ></info-pair>
        <info-pair title="Latest version" description="v6-beta.3.0.1"></info-pair>
        <info-pair title="Last start time" description="2022-11-08 12:31 (1667939511)"></info-pair>
      </div>
      <div class="assets-info">
        <info-pair title="Number of hosted assets" description="80219"></info-pair>
        <info-pair title="Stake" description="50 500 TRAC (Delegated 0 TRAC)"></info-pair>
        <info-pair title="Operational wallet" description="0x1234563234123411334"></info-pair>
      </div>-->
    </div>

    <!--    <div class="blockchain-rpc-status">
      <p class="rpc-status">Blockchain RPC status</p>
      <div class="status-pair">
        <img src="images/circle-green.svg" alt="" />
        <p>OriginTrail Parachain</p>
      </div>
      <div class="status-pair">
        <img src="images/circle-green.svg" alt="" />
        <p>Polygon</p>
      </div>
      <div class="status-pair">
        <img src="images/circle-amber.svg" alt="" />
        <p>Ethereum</p>
      </div>
    </div>-->
    <div class="user-control">
      <houston-account-button />
    </div>
  </div>
</template>

<script>
import InfoPair from '../InfoPair.vue';
import HoustonAccountButton from '@/components/shared/HoustonAccountButton';

export default {
  name: 'Header',
  // eslint-disable-next-line vue/no-unused-components
  components: { HoustonAccountButton, InfoPair },
};
</script>

<style lang="scss" scoped>
@import '../../assets/variable.scss';

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;

  .logo {
    width: 218px;
    height: 42px;
  }

  .logo-node-and-assets-info {
    display: flex;

    .node-info {
      display: flex;
      flex-direction: column;
      height: 56px;
      margin-left: 114px;
      row-gap: 4px;
    }

    .assets-info {
      display: flex;
      flex-direction: column;
      height: 56px;
      margin-left: 18px;
      row-gap: 4px;
    }
  }

  .blockchain-rpc-status {
    height: 98px;
    margin-right: 40px;

    p {
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      color: $black-primary;
      margin: 0;
    }

    .rpc-status {
      color: $black-tertiary;
    }

    .status-pair {
      display: flex;
      margin-top: 10px;
      margin-left: 2px;

      img {
        margin-right: 9px;
      }
    }
  }
}
</style>
