<template>
  <div class="overview-wrapper">
    <h2>Overview</h2>
    <div class="page-content">
      <div class="trac-balance">
        <h3>TRAC balance</h3>
        <div class="stakes">
          <div class="property-wrapper">
            <p class="title">Staked</p>
            <p class="value">{{ formatNumberWithSpaces(balances.staked) }} TRAC</p>
          </div>
          <div class="property-wrapper">
            <p class="title">Delegated</p>
            <p class="value multi-line">0 TRAC <br />(Delegator share 0%)</p>
          </div>
          <div class="property-wrapper">
            <p class="title">Slashed</p>
            <p class="value">0 TRAC <span class="faded">(slashing is inactive)</span></p>
          </div>
          <div class="property-wrapper">
            <p class="title">Total</p>
            <p class="value">{{ formatNumberWithSpaces(balances.total) }} TRAC</p>
          </div>
        </div>
      </div>
      <div class="network-metrics">
        <h3>Network metrics</h3>
        <div class="stakes">
          <div class="property-wrapper full">
            <p class="title label-inline-12">Assets on DKG</p>
            <p class="value label-plat-h5">
              {{ formatNumberWithSpaces(networkMetrics.assetsOnDKG) }}
            </p>
          </div>
          <div class="property-wrapper full">
            <p class="title label-inline-12">Total TRAC Staked</p>
            <p class="value label-plat-h5">
              {{ formatNumberWithSpaces(networkMetrics.stakedTRAC) }} TRAC
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="useful-links">
      <h3>Useful links:</h3>
      <div class="social-icons">
        <link-button
          href="https://docs.origintrail.io/decentralized-knowledge-graph-layer-2/testnet-node-setup-instructions/houston-origintrail-node-control-center"
          target="_blank"
          ><img src="images/icons/file-icon.svg" alt=""
        /></link-button>
        <link-button href="https://discord.com/invite/FCgYk2S">
          <img src="images/icons/discord-icon.svg" alt="" />
        </link-button>
        <link-button href="https://origintrail.io/">
          <img src="images/icons/ot-icon.svg" />
        </link-button>
      </div>
    </div>
  </div>
</template>

<script>
import LinkButton from '@/components/shared/LinkButton';
import { formatNumberWithSpaces } from '@/utils/stringUtil';

export default {
  name: 'Overview',
  components: { LinkButton },
  data() {
    return {};
  },
  computed: {
    balances() {
      return this.$store.getters.getTracBalance;
    },
    rewards() {
      return this.$store.getters.getRewards;
    },
    networkMetrics() {
      return this.$store.getters.getNetworkMetrics;
    },
  },
  mounted() {
    this.getOverviewData();
  },
  methods: {
    formatNumberWithSpaces,
    async getOverviewData() {
      const loader = this.$loading({ target: '.trac-balance' });
      const loader2 = this.$loading({ target: '.network-metrics' });
      await this.$store.dispatch('getOverviewData', this.$store.getters.isIdentityResolved);
      loader.close();
      loader2.close();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/variable.scss';

.overview-wrapper {
  .page-content {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    .trac-balance {
      .stakes {
        display: flex;
        flex-wrap: wrap;
        padding: 16px;
        margin-top: 32px;
        gap: 8px;
        width: 504px;
        background: #ffffff;
        box-shadow: 0px 4px 8px rgba(82, 97, 115, 0.18);
        border-radius: 16px;

        .property-wrapper {
          display: flex;
          flex-direction: column;
          padding: 8px 16px;
          gap: 8px;
          min-width: 48%;
          flex-grow: 2;
          height: 101px;
          background: linear-gradient(0deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)),
            $blue-primary;
          border-radius: 8px;

          &.full {
            width: 100%;
          }
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
            &.disabled {
              color: $black-tertiary;
            }
            .faded {
              color: #dadce4;
            }
            &.multi-line {
              line-height: 150%;
            }
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
          min-width: 48%;
          flex-grow: 2;
          height: 61px;
          background: $section-grey-50;
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
    }

    .network-metrics {
      .stakes {
        display: flex;
        flex-wrap: wrap;
        padding: 16px;
        margin-top: 32px;
        gap: 8px;
        width: 504px;
        background: #ffffff;
        box-shadow: 0px 4px 8px rgba(82, 97, 115, 0.18);
        border-radius: 16px;

        .property-wrapper {
          display: flex;
          flex-direction: column;
          padding: 22.5px 16px;
          gap: 8px;
          min-width: 48%;
          flex-grow: 2;
          height: 101px;
          background: linear-gradient(0deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)),
            $blue-primary;
          border-radius: 8px;

          &.full {
            width: 100%;
          }
          .title {
            font-weight: 400;
            color: $black-tertiary;
          }

          .value {
            width: 200px;
            color: $blue-primary;
            &.disabled {
              color: $black-tertiary;
            }
          }
        }

        .property-short {
          height: 56px;
        }
      }
    }
  }
  .useful-links {
    margin-top: 64px;
    .social-icons {
      display: flex;
      column-gap: 16px;
      margin-top: 32px;
      .link-button {
        height: 56px;
        width: 56px;
      }
    }
  }
}
</style>
