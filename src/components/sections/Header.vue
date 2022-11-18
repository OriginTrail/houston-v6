<template>
  <div class="header-wrapper">
    <img class="logo" src="../../../public/images/logo.svg" alt="Houston application logo" />

    <div class="node-info">
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
    </div>

    <div class="blockchain-rpc-status">
      <p class="rpc-status">Blockchain RPC status</p>
      <div class="status-pair">
        <img src="../../../public/images/circle-green.svg" alt="" />
        <p>OriginTrail Parachain</p>
      </div>
      <div class="status-pair">
        <img src="../../../public/images/circle-green.svg" alt="" />
        <p>Polygon</p>
      </div>
      <div class="status-pair">
        <img src="../../../public/images/circle-amber.svg" alt="" />
        <p>Ethereum</p>
      </div>
    </div>
  </div>
</template>

<script>
import InfoPair from '../InfoPair.vue';

export default {
  name: 'Header',
  components: { InfoPair },
};
</script>

<style lang="scss" scoped>
@import '../../assets/variable.scss';

.header-wrapper {
  display: flex;
  align-items: center;
  height: 128px;
  padding: 20px 30px;

  .logo {
    width: 218px;
    height: 42px;
  }

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

  .blockchain-rpc-status {
    height: 98px;
    margin-left: 200px;

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
