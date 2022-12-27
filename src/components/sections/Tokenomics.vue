<template>
  <div class="tokenomics-wrapper">
    <!-- Service Tokenomics -->
    <h2 class="section-heading">Service tokenomics</h2>
    <div class="node-ask">
      <tokenomics-card title="Set your node ask" class="ask-card">
        <div class="card-content">
          <div class="description label-inline-14">
            Setting a node service ask will determine the preferred amount of TRAC your node is
            requiring for its services in the network. Your node ask is denominated in TRAC /
            kb-epoch.
            <br />
            <br />
            Setting ask will execute one transaction.
          </div>
          <div class="form ask-form">
            <InputPairWithBtn
              :button="false"
              color="blue"
              input-suffix="TRAC / (kb-epoch)"
              btnLabel="Update ask"
              :input-value="getAskValueInString"
              @update="(v) => (newAsk = v)"
            />
            <div class="sub-label label-inline-12">
              Current ask <span class="trac-amount">{{ getAskValueInString }} TRAC</span>
            </div>
          </div>
          <div class="cta-section">
            <Button class="cta-button" @click="updateAsk">Update ask</Button>
          </div>
        </div>
      </tokenomics-card>
    </div>

    <!-- Stake Settings -->
    <h2 class="section-heading stake-settings-heading">Node stake settings</h2>
    <div class="node-stake">
      <tokenomics-card title="Add TRAC to Node stake" class="add-stake-card">
        <div class="card-content">
          <div class="description label-inline-14">
            This will add additional TRAC tokens to your node. You need to use the admin wallet for
            adding stake. This will execute two transactions on the blockchain (the allowance
            transaction and adding stake). This action will mint share tokens.
          </div>
          <div class="form ask-form">
            <InputPairWithBtn
              :button="false"
              color="green"
              input-suffix="TRAC"
              input-prefix="+"
              btnLabel="Update ask"
              :input-value="'0'"
              @update="(v) => (newStake = v)"
            >
              <img
                slot="inputPrefix"
                class="input-prefix-plus"
                src="/images/icons/plus-grey-icon.svg"
              />
            </InputPairWithBtn>
            <div class="sub-label label-inline-12">
              Total stake after addition
              <span class="trac-amount">{{ getTotalStakeValueAfterAddition }} TRAC</span>
            </div>
          </div>
          <div class="cta-section">
            <Button class="cta-button" @click="addStake">Add stake</Button>
          </div>
        </div>
      </tokenomics-card>
    </div>
  </div>
</template>

<script>
import Button from '../Button';
import InputPairWithBtn from '../InputPairWithBtn';
import metamask from '@/service/metamask';
import { getReadableTokenAmount } from '@/utils/cryptoUtils';
import TokenomicsCard from '@/components/shared/TokenomicsCard';

export default {
  name: 'Tokenomics',
  components: { TokenomicsCard, Button, InputPairWithBtn },
  data() {
    return {
      currentAsk: null,
      newAsk: null,
      newStake: null,
    };
  },
  computed: {
    getIdentityId() {
      return this.$store.getters.isIdentityResolved;
    },
    getStakeData() {
      return this.$store.getters.getStake;
    },
    getAskData() {
      return this.$store.getters.getAsk;
    },
    getNodeSharesToken() {
      return this.$store.getters.nodeShareTokens;
    },
    getWithdrawalInfo() {
      return this.$store.getters.getWithdrawalInfo;
    },
    getAskValueInString() {
      return this.getAskData?.currentAsk ?? '0';
    },
    getTotalStakeValue() {
      return this.getStakeData?.activeStake ?? '0';
    },
    getTotalStakeValueAfterAddition() {
      return Number(this.getTotalStakeValue) + Number(this.newStake ?? '0');
    },
  },
  async mounted() {
    await this.refreshAllTokenomicsData();
  },
  methods: {
    async refreshAllTokenomicsData() {
      const loader = this.$loading({ target: '.tokenomics-wrapper' });
      await this.$store.dispatch('getOverviewData', this.getIdentityId);
      loader.close();
    },
    getReadableTokenAmount,
    getAsk() {
      const loader = this.$loading({ target: '.ask-setting' });
      metamask.contractService.getAsk(this.getIdentityId).then((askData) => {
        this.currentAsk = askData;
        loader.close();
      });
    },

    async updateAsk() {
      if (this.newAsk) {
        const loader = this.$loading({ target: '.ask-card', text: 'Updating ask value...' });
        try {
          await metamask.contractService.updateAsk(this.getIdentityId, this.newAsk);
          this.$notify.success('Ask updated successfully!');
          await this.refreshAllTokenomicsData();
        } catch (err) {
          console.log(err);
          this.$notify.error('Ask update error occurred!');
        } finally {
          loader.close();
        }
      }
    },
    async addStake() {
      if (this.newStake) {
        const loader = this.$loading({ target: '.add-stake-card', text: 'Adding stake...' });
        try {
          await metamask.contractService.addStakeEthers(this.getIdentityId, this.newStake);
          this.$notify.success('Stake added successfully!');
          await this.refreshAllTokenomicsData();
        } catch (err) {
          console.log(err);
          this.$notify.error('An error occurred when adding stake');
        } finally {
          loader.close();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/variable.scss';

.tokenomics-wrapper {
  .section-heading {
    margin-bottom: 24px;
  }

  .tokenomics-card-wrapper {
    max-width: 504px;
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
    }

    .full-width {
      width: 100%;
    }
  }
}
</style>
