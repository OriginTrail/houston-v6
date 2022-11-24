<template>
  <div class="overview-wrapper">
    <h2>Overview</h2>
    <div class="page-content">
      <div class="trac-balance">
        <h3>TRAC balance</h3>
        <div class="stakes">
          <div class="property-wrapper">
            <p class="title">Staked</p>
            <p class="value">50 500 TRAC</p>
          </div>
          <div class="property-wrapper">
            <p class="title">Delegated</p>
            <p class="value">0 TRAC <br />(Delegator share 0%)</p>
          </div>
          <div class="property-wrapper property-short">
            <p class="title">Slashed</p>
            <p class="value">0 TRAC</p>
          </div>
          <div class="property-wrapper property-short">
            <p class="title">Total</p>
            <p class="value">50 500 TRAC</p>
          </div>
        </div>
        <div class="rewards">
          <div class="property-wrapper">
            <p class="title">Total rewards in prev.epoch</p>
            <p class="value">1509 TRAC</p>
          </div>
          <div class="property-wrapper">
            <p class="title">Your rewards</p>
            <p class="value">1509 TRAC</p>
          </div>
          <div class="property-wrapper property-short full-width">
            <p class="title">Delegator rewards</p>
            <p class="value">0 TRAC</p>
          </div>
        </div>
      </div>

      <div class="useful-links">
        <h3>Useful links:</h3>
        <div class="social-icons">
          <a
            href="https://docs.origintrail.io/decentralized-knowledge-graph-layer-2/testnet-node-setup-instructions/houston-origintrail-node-control-center"
            target="_blank"
            ><img src="../../../public/images/icons/file-icon.svg" alt=""
          /></a>
          <a href="https://discord.com/invite/FCgYk2S" target="_blank"
            ><img src="../../../public/images/icons/discord-icon.svg" alt=""
          /></a>
          <a href="https://origintrail.io/" target="_blank"
            ><img src="../../../public/images/icons/origintrail-icon.svg" alt=""
          /></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Overview',
};
</script>

<style lang="scss" scoped>
@import '../../assets/variable.scss';

.overview-wrapper {
  min-width: 944px;
  width: 100%;
  height: 880px;
  background: #f6f6f6;
  border-radius: 20px;
  padding: 82px 40px;

  .page-content {
    display: flex;
    column-gap: 32px;

    .trac-balance {
      width: 504px;

      .stakes {
        display: flex;
        flex-wrap: wrap;
        padding: 16px;
        margin-top: 32px;
        gap: 8px;
        width: 504px;
        height: 178px;
        background: #ffffff;
        box-shadow: 0px 4px 8px rgba(82, 97, 115, 0.18);
        border-radius: 16px;

        .property-wrapper {
          display: flex;
          flex-direction: column;
          padding: 8px 16px;
          gap: 8px;
          width: 232px;
          height: 82px;
          background: linear-gradient(0deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)),
            $blue-primary;
          border-radius: 8px;

          .title {
            font-weight: 400;
            font-size: 12px;
            line-height: 16px;
            color: $black-tertiary;
          }

          .value {
            width: 200px;
            height: 16px;
            font-weight: 400;
            font-size: 14px;
            line-height: 16px;
            color: $blue-primary;
          }
        }

        .property-short {
          height: 56px;
        }
      }

      .rewards {
        display: flex;
        flex-wrap: wrap;
        padding: 16px;
        margin-top: 16px;
        gap: 8px;
        width: 504px;
        height: 157px;
        background: #ffffff;
        box-shadow: 0px 4px 8px rgba(82, 97, 115, 0.18);
        border-radius: 16px;

        .property-wrapper {
          display: flex;
          flex-direction: column;
          padding: 8px 16px;
          gap: 8px;
          width: 232px;
          height: 61px;
          background: $grey-light;
          border-radius: 8px;

          .title {
            font-weight: 400;
            font-size: 12px;
            line-height: 16px;
            color: $black-tertiary;
          }

          .value {
            width: 200px;
            height: 16px;
            font-weight: 400;
            font-size: 14px;
            line-height: 16px;
            color: $blue-primary;
          }
        }

        .property-short {
          height: 56px;
        }

        .full-width {
          width: 100%;
        }
      }
    }

    .useful-links {
      .social-icons {
        display: flex;
        column-gap: 16px;
        margin-top: 32px;
      }
    }
  }
}
</style>
