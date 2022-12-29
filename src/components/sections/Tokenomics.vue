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
              ref="askUpdateInput"
              input-type="number"
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
            <Button class="cta-button" :disabled="!newAsk || Number(newAsk) <= 0" @click="updateAsk"
              >Update ask</Button
            >
          </div>
        </div>
      </tokenomics-card>
    </div>

    <!-- Stake Settings -->
    <h2 class="section-heading stake-settings-heading">Node stake settings</h2>
    <div class="node-stake">
      <Card class="wide-card">
        <div class="property-wrapper">
          <p class="title label-inline-12">Total stake</p>
          <p class="value label-inline-14">
            {{
              formatNumberWithSpaces(
                Number(getStakeData.activeStake) + Number(getStakeData.pendingWithdrawal),
              )
            }}
            TRAC
          </p>
        </div>
        <div class="property-wrapper">
          <p class="title label-inline-12">Current active stake</p>
          <p class="value label-inline-14">
            {{ formatNumberWithSpaces(getStakeData.activeStake) }} TRAC
          </p>
        </div>
        <div class="property-wrapper">
          <p class="title label-inline-12">Pending withdrawal</p>
          <p class="value label-inline-14">
            {{ formatNumberWithSpaces(getStakeData.pendingWithdrawal) }} TRAC
          </p>
        </div>
      </Card>
      <div class="stake-update-cards">
        <tokenomics-card title="Add TRAC to Node stake" class="add-stake-card">
          <div class="card-content">
            <div class="description label-inline-14">
              This will add additional TRAC tokens to your node. You need to use the admin wallet
              for adding stake. This will execute two transactions on the blockchain (the allowance
              transaction and adding stake). This action will mint share tokens.
            </div>
            <div class="form ask-form">
              <InputPairWithBtn
                ref="newStakeInput"
                :button="false"
                input-type="number"
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
                Total stake after addition:
                <span class="trac-amount"
                  >{{ formatNumberWithSpaces(getTotalStakeValueAfterAddition) }} TRAC</span
                >
              </div>
            </div>
            <div class="cta-section">
              <Button
                :disabled="!newStake || Number(newStake) <= 0"
                class="cta-button"
                @click="addStake"
                >Add stake</Button
              >
            </div>
          </div>
        </tokenomics-card>
        <tokenomics-card title="Withdraw TRAC from Node stake" class="withdraw-stake-card">
          <div class="card-content">
            <div class="description label-inline-14">
              Withdrawing TRAC stake from your node is executed in two transactions, with the second
              transaction being delayed in time for XX minutes. Once you start the withdrawal, a
              counter will appear to instruct you on when to execute the second transaction.
            </div>
            <div class="form ask-form">
              <InputPairWithBtn
                ref="withdrawStakeInput"
                input-type="number"
                :button="false"
                color="red"
                input-suffix="TRAC"
                input-prefix="+"
                btnLabel="start withdrawal"
                :input-value="'0'"
                @update="(v) => (withdrawalStake = v)"
              >
                <img
                  slot="inputPrefix"
                  class="input-prefix-plus"
                  src="/images/icons/minus-grey-icon.svg"
                />
              </InputPairWithBtn>
              <div class="sub-label label-inline-12">
                Total free stake after withdrawal:
                <span class="trac-amount"
                  >{{ formatNumberWithSpaces(getTotalStakeAfterWithdrawal) }} TRAC</span
                >
              </div>
            </div>
            <div class="cta-section-with-steps">
              <div class="step-count">Step 1</div>
              <div>
                <Button
                  :disabled="!withdrawalStake || Number(withdrawalStake) <= 0"
                  class="cta-button"
                  @click="startWithdrawal"
                  >Start withdrawal</Button
                >
              </div>
              <div class="step-divider"></div>
              <div class="step-count">Step 2</div>
              <div class="extra-step-cta">
                <Button
                  class="cta-button"
                  :disabled="!getRequestTime || getRequestTime < 0 || mustWaitForWithdrawal"
                  @click="withdrawStake"
                  >Withdraw now</Button
                >
                <el-tooltip
                  content="How long until withdrawal is available"
                  placement="top"
                  effect="light"
                >
                  <img src="/images/icons/info-icon.svg" />
                  <div slot="content" class="withdrawal-availability-message label-inline-14">
                    How long until withdrawal is available
                  </div>
                </el-tooltip>

                <div class="estimate-time-counter label-inline-12">
                  Estimated time:
                  <span
                    ><backward-timer
                      @over="timerOver"
                      ref="timer"
                      :instantly-start="getRequestTime !== 0"
                      :start-timestamp="null"
                      :end-timestamp="getRequestTime"
                  /></span>
                </div>
              </div>
            </div>
          </div>
        </tokenomics-card>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '../Button';
import InputPairWithBtn from '../InputPairWithBtn';
import metamask from '@/service/metamask';
import { getReadableTokenAmount } from '@/utils/cryptoUtils';
import TokenomicsCard from '@/components/shared/TokenomicsCard';
import Card from '@/components/shared/Card';
import {
  formatNumbersToShort,
  formatNumberWithSpaces,
  getAddressShortForm,
} from '@/utils/stringUtil';
import BackwardTimer from '@/components/shared/BackwardTimer';
import * as moment from 'moment';
import { generateToast } from '@/utils/toastObjectGenerator';

export default {
  name: 'Tokenomics',
  components: { BackwardTimer, Card, TokenomicsCard, Button, InputPairWithBtn },
  data() {
    return {
      currentAsk: null,
      newAsk: null,
      newStake: null,
      withdrawalStake: null,
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
      return this.$store.getters.getNodeSharesToken;
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
    getTotalStakeAfterWithdrawal() {
      return Number(this.getTotalStakeValue) - Number(this.withdrawalStake ?? '0');
    },
    getRequestTime() {
      return Number(this.getWithdrawalInfo?.requestTime ?? '0') - 70;
    },
    //you need to wait
    mustWaitForWithdrawal() {
      return Number(this.getRequestTime) > 0 && moment.unix(this.getRequestTime) >= moment();
    },
  },
  async mounted() {
    await this.refreshAllTokenomicsData();
    this.refreshWithdrawalTimer();
  },
  methods: {
    formatNumberWithSpaces,
    getAddressShortForm,
    formatNumbersToShort,
    refreshWithdrawalTimer() {
      if (this.mustWaitForWithdrawal) {
        this.$refs.timer.startTimer();
      }
    },
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
          this.notify(null, 'Ask updated successfully!', 'success');
          await this.refreshAllTokenomicsData();
          this.newAsk = 0;
          this.$refs.askUpdateInput.value = 0;
        } catch (err) {
          console.log(err);
          this.notify(null, 'Ask update error occurred!', 'error');
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
          this.notify(null, 'Stake added successfully!', 'success');
          await this.refreshAllTokenomicsData();
          this.newStake = 0;
          this.$refs.newStakeInput.value = 0;
        } catch (err) {
          console.log(err);
          this.notify(null, 'An error occurred when adding stake', 'error');
        } finally {
          loader.close();
        }
      }
    },
    async startWithdrawal() {
      if (this.withdrawalStake) {
        const loader = this.$loading({
          target: '.withdraw-stake-card',
          text: 'Requesting stake withdrawal...',
        });
        try {
          await metamask.contractService.requestWithdrawal(
            this.getIdentityId,
            this.withdrawalStake,
          );
          this.notify(null, 'Stake withdrawal requested successfully!', 'success');
          await this.refreshAllTokenomicsData();
          this.$refs.withdrawStakeInput.value = 0;
          this.withdrawalStake = 0;
          this.refreshWithdrawalTimer();
        } catch (err) {
          console.log(err);
          this.notify(null, 'An error occurred when requesting stake withdrawal', 'error');
        } finally {
          loader.close();
        }
      }
    },
    async withdrawStake() {
      if (!this.mustWaitForWithdrawal) {
        const loader = this.$loading({
          target: '.withdraw-stake-card',
          text: 'Withdrawing stake...',
        });
        try {
          await metamask.contractService.withdrawStake(this.getIdentityId);
          this.notify(null, 'Stake withdrawn successfully!', 'success');
          await this.refreshAllTokenomicsData();
          this.refreshWithdrawalTimer();
        } catch (err) {
          console.log(err);
          this.notify(null, 'An error occurred when withdrawing stake', 'error');
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
    async timerOver() {
      await this.refreshAllTokenomicsData();
      this.refreshWithdrawalTimer();
      this.$forceUpdate();
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
}
</style>
