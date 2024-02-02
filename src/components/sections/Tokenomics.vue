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
      <tokenomics-card
        title="Set node operator fee"
        class="operator-fee-card"
        v-if="doesSupportV2Features"
      >
        <div class="card-content">
          <div class="description label-inline-14">
            The operator fee is a percentage of TRAC fees your node will collect prior to including
            it into the delegator share pool.
            <b>Changing the operator fee incurs a 28 day delay</b> (and requires two transactions -
            the initiating transaction and completing transaction)
          </div>
          <div class="form operator-fee-form">
            <InputPairWithBtn
              ref="setOperatorFeeInput"
              input-type="number"
              :button="false"
              color="blue"
              input-suffix="%"
              btnLabel="start operator fee change"
              :input-value="Number(getCurrentOperatorFee)"
              @update="(v) => (operatorFee = v)"
              :max="100"
            >
            </InputPairWithBtn>
            <div class="sub-label label-inline-12">
              Current operator fee :
              <span class="trac-amount">{{ formatNumberWithSpaces(getCurrentOperatorFee) }}%</span>
            </div>
            <div class="sub-label italic label-inline-12">
              * Note: The 28 day delay is not applied only when you set your node operator fee for
              the first time
            </div>
          </div>
          <div class="cta-section-with-steps">
            <div class="step-count">Step 1</div>
            <div>
              <Button
                :disabled="!operatorFee || !operatorFee.toString().length"
                class="cta-button"
                @click="startOperatorFeeUpdate"
                >Update operator fee</Button
              >
            </div>
            <div class="step-divider"></div>
            <div class="step-count">Step 2</div>
            <div class="extra-step-cta">
              <Button
                class="cta-button"
                :disabled="
                  !getOperatorFeeChangeTime ||
                  getOperatorFeeChangeTime < 0 ||
                  mustWaitForOperatorFee
                "
                @click="changeOperatorFee"
                >Complete fee update</Button
              >
              <el-tooltip
                content="How long until withdrawal is available"
                placement="top"
                effect="light"
              >
                <img src="/images/icons/info-icon.svg" />
                <div slot="content" class="withdrawal-availability-message label-inline-14">
                  How long until operator fee update is available
                </div>
              </el-tooltip>

              <div class="estimate-time-counter label-inline-12">
                Waiting time:
                <span
                  ><backward-timer
                    @over="operatorFeeTimerOver"
                    ref="opFeeTimer"
                    :instantly-start="getOperatorFeeChangeTime !== 0"
                    :start-timestamp="null"
                    :end-timestamp="getOperatorFeeChangeTime"
                /></span>
              </div>
            </div>
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
            {{ getTotalStake }}
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
              transaction being delayed in time. Once you start the withdrawal, a counter will
              appear to instruct you on when to execute the second transaction.
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
                :max="Number(getStakeData.activeStake)"
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

    <!-- Fees Management -->
    <h2
      class="section-heading stake-settings-heading fees-management-settings"
      v-if="supportFeesManagement && doesSupportV2Features"
    >
      Node fees management
    </h2>
    <div class="node-stake" v-if="supportFeesManagement && doesSupportV2Features">
      <div class="stake-update-cards">
        <tokenomics-card title="Restake accumulated fee" class="restake-card">
          <div class="card-content">
            <div class="description label-inline-14">
              Restaking your accumulated fee will increase your stake position and mint additional
              node share tokens for you, increasing the nodes propensity for acquiring additional
              fees.
            </div>
            <div class="form ask-form">
              <div class="sub-label label-inline-12">
                Accumulated fees:
                <span class="trac-amount"
                  >{{ formatNumberWithSpaces(getOperatorInfo.accumulatedFee) }} TRAC</span
                >
              </div>
              <div class="sub-label label-inline-12">
                Total stake after addition::
                <span class="trac-amount"
                  >{{ formatNumberWithSpaces(getTotalStakeValueAfterRestake) }} TRAC</span
                >
              </div>
            </div>
            <div class="cta-section">
              <Button
                :disabled="
                  !getOperatorInfo.accumulatedFee || Number(getOperatorInfo.accumulatedFee) <= 0
                "
                class="cta-button"
                @click="restakeAccumulatedFee"
                >Restake all fees</Button
              >
            </div>
          </div>
        </tokenomics-card>
        <tokenomics-card title="Withdraw accumulated fees" class="withdraw-accumulated-fees-card">
          <div class="card-content">
            <div class="description label-inline-14">
              Withdrawing fees from your node is executed in two transactions, with the second
              transaction being delayed in time for 28 days. Once you start the withdrawal, a
              counter will appear to instruct you on when to execute the second transaction.
            </div>
            <div class="form ask-form">
              <div class="sub-label label-inline-12">
                Accumulated fees:
                <span class="trac-amount"
                  >{{ formatNumberWithSpaces(getOperatorInfo.accumulatedFee) }} TRAC</span
                >
              </div>
            </div>
            <div class="cta-section-with-steps">
              <div class="step-count">Step 1</div>
              <div>
                <Button
                  :disabled="
                    !getOperatorInfo.accumulatedFee || Number(getOperatorInfo.accumulatedFee) <= 0
                  "
                  class="cta-button"
                  @click="startAccumulatedFeesWithdrawal"
                  >Start withdrawal</Button
                >
              </div>
              <div class="step-divider"></div>
              <div class="step-count">Step 2</div>
              <div class="extra-step-cta">
                <Button
                  class="cta-button"
                  :disabled="
                    !getAccumulatedFeeWithdrawalChangeTime ||
                    getAccumulatedFeeWithdrawalChangeTime < 0 ||
                    mustWaitForAccumulatedFee
                  "
                  @click="withdrawAccumulatedFeesStake"
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
                      @over="accumulatedFeesTimerOver"
                      ref="accumulatedFees"
                      :instantly-start="getAccumulatedFeeWithdrawalChangeTime !== 0"
                      :start-timestamp="null"
                      :end-timestamp="getAccumulatedFeeWithdrawalChangeTime"
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
import { FeatureVersions } from '@/utils/lists';

export default {
  name: 'Tokenomics',
  components: { BackwardTimer, Card, TokenomicsCard, Button, InputPairWithBtn },
  data() {
    return {
      currentAsk: null,
      supportFeesManagement: false,
      newAsk: null,
      newStake: null,
      withdrawalStake: null,
      operatorFee: null,
      timerActive: 0,
      operatorFeeTimer: 0,
      accumulatedFeeTimer: 0,
    };
  },
  computed: {
    doesSupportV2Features() {
      return this.$store.getters.selectedNetwork.featureList.includes(
        FeatureVersions.OPERATOR_FEES_FEATURES,
      );
    },
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
    getOperatorInfo() {
      return this.$store.getters.getOperationalInfo;
    },
    getAskValueInString() {
      return this.getAskData?.currentAsk ?? '0';
    },
    getCurrentOperatorFeeInString() {
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
    getCurrentOperatorFee() {
      return this.getOperatorInfo.currentFee;
    },
    getRequestTime() {
      return Number(this.getWithdrawalInfo?.requestTime ?? '0');
    },
    getOperatorFeeChangeTime() {
      return Number(this.getOperatorInfo?.requestTime ?? '0');
    },
    getAccumulatedFeeWithdrawalChangeTime() {
      return Number(this.getOperatorInfo?.accumulatedFeeRequestTime ?? '0');
    },
    getTotalStakeValueAfterRestake() {
      return Number(this.getTotalStakeValue) + Number(this.getOperatorInfo.accumulatedFee ?? '0');
    },
    //you need to wait
    mustWaitForWithdrawal() {
      this.timerActive;
      return Number(this.getRequestTime) > 0 && moment.unix(this.getRequestTime) >= moment();
    },
    //you need to wait for operatorFee change
    mustWaitForOperatorFee() {
      this.operatorFeeTimer;
      return (
        Number(this.getOperatorFeeChangeTime) > 0 &&
        moment.unix(this.getOperatorFeeChangeTime) >= moment()
      );
    },
    //you need to wait for accumulated fee withdrawal
    mustWaitForAccumulatedFee() {
      this.accumulatedFeeTimer;
      return (
        Number(this.getAccumulatedFeeWithdrawalChangeTime) > 0 &&
        moment.unix(this.getAccumulatedFeeWithdrawalChangeTime) >= moment()
      );
    },

    getTotalStake() {
      return formatNumberWithSpaces(
        Number(formatNumberWithSpaces(this.getStakeData.activeStake).replace(/\s/g, '')) +
          Number(formatNumberWithSpaces(this.getStakeData.pendingWithdrawal).replace(/\s/g, '')),
      );
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
      this.timerActive++;
      if (this.mustWaitForWithdrawal) {
        this.$refs.timer.startTimer();
      }
    },
    refreshOperatorFeeTimer() {
      this.operatorFeeTimer++;
      if (this.mustWaitForOperatorFee) {
        this.$refs.opFeeTimer.startTimer();
      }
    },
    refreshAccumulatedFeesTimer() {
      this.accumulatedFeeTimer++;
      if (this.mustWaitForAccumulatedFee) {
        this.$refs.accumulatedFees.startTimer();
      }
    },
    async refreshAllTokenomicsData() {
      const loader = this.$loading({
        target: '.tokenomics-wrapper',
        customClass: 'backdrop_border_radius',
      });
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
        const loader = this.$loading({
          target: '.ask-card',
          text: 'Updating ask value...',
          customClass: 'backdrop_border_radius',
        });
        try {
          await metamask.contractService.updateAsk(this.getIdentityId, this.newAsk);
          this.notify(null, 'Ask updated successfully!', 'success');
          await this.refreshAllTokenomicsData();
          this.newAsk = 0;
          this.$refs.askUpdateInput.value = 0;
        } catch (err) {
          console.log(err);
          this.notify(
            null,
            err.code === 'ACTION_REJECTED'
              ? 'METAMASK_TRANSACTION_REFUSED'
              : 'Ask update error occurred!',
            'error',
          );
        } finally {
          loader.close();
        }
      }
    },
    async addStake() {
      if (this.newStake) {
        const loader = this.$loading({
          target: '.add-stake-card',
          text: 'Adding stake...',
          customClass: 'backdrop_border_radius',
        });
        try {
          await metamask.contractService.addStake(this.getIdentityId, this.newStake, (msg) => {
            loader.text = msg;
          });
          this.notify(null, 'Stake added successfully!', 'success');
          await this.refreshAllTokenomicsData();
          this.newStake = 0;
          this.$refs.newStakeInput.value = 0;
        } catch (err) {
          console.log(err);
          this.notify(
            null,
            err.code === 'ACTION_REJECTED'
              ? 'METAMASK_TRANSACTION_REFUSED'
              : 'An error occurred when adding stake',
            'error',
          );
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
          customClass: 'backdrop_border_radius',
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
          this.notify(
            null,
            err.code === 'ACTION_REJECTED'
              ? 'METAMASK_TRANSACTION_REFUSED'
              : 'An error occurred when requesting stake withdrawal',
            'error',
          );
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
          customClass: 'backdrop_border_radius',
        });
        try {
          await metamask.contractService.withdrawStake(this.getIdentityId);
          this.notify(null, 'Stake withdrawn successfully!', 'success');
          await this.refreshAllTokenomicsData();
          this.refreshWithdrawalTimer();
        } catch (err) {
          console.log(err);
          this.notify(
            null,
            err.code === 'ACTION_REJECTED'
              ? 'METAMASK_TRANSACTION_REFUSED'
              : 'An error occurred when withdrawing stake',
            'error',
          );
        } finally {
          loader.close();
        }
      }
    },
    async startOperatorFeeUpdate() {
      if (this.operatorFee) {
        const loader = this.$loading({
          target: '.operator-fee-card',
          text: 'Requesting operator fee change...',
          customClass: 'backdrop_border_radius',
        });
        try {
          await metamask.contractService.requestOperatorFeeChange(
            this.getIdentityId,
            this.operatorFee,
          );
          this.notify(null, 'Operator fee change requested successfully!', 'success');
          await this.refreshAllTokenomicsData();
          this.$refs.setOperatorFeeInput.value = 0;
          this.operatorFee = 0;
          this.refreshOperatorFeeTimer();
        } catch (err) {
          console.log(err);
          this.notify(
            null,
            err.code === 'ACTION_REJECTED'
              ? 'METAMASK_TRANSACTION_REFUSED'
              : 'An error occurred when changing operator fee',
            'error',
          );
        } finally {
          loader.close();
        }
      }
    },
    async changeOperatorFee() {
      if (!this.mustWaitForOperatorFee) {
        const loader = this.$loading({
          target: '.operator-fee-card',
          text: 'Updating Operator fee...',
          customClass: 'backdrop_border_radius',
        });
        try {
          await metamask.contractService.changeOperatorFee(this.getIdentityId);
          this.notify(null, 'Operator fee updated successfully!', 'success');
          await this.refreshAllTokenomicsData();
          this.refreshOperatorFeeTimer();
        } catch (err) {
          console.log(err);
          this.notify(
            null,
            err.code === 'ACTION_REJECTED'
              ? 'METAMASK_TRANSACTION_REFUSED'
              : 'An error occurred when updating operator fee',
            'error',
          );
        } finally {
          loader.close();
        }
      }
    },
    async restakeAccumulatedFee() {
      if (this.newStake) {
        const loader = this.$loading({
          target: '.restake-card',
          text: 'Restaking fees...',
          customClass: 'backdrop_border_radius',
        });
        try {
          await metamask.contractService.stakeAccumulatedOperatorFee(this.getIdentityId, (msg) => {
            loader.text = msg;
          });
          this.notify(null, 'Stake added successfully!', 'success');
          await this.refreshAllTokenomicsData();
        } catch (err) {
          console.log(err);
          this.notify(
            null,
            err.code === 'ACTION_REJECTED'
              ? 'METAMASK_TRANSACTION_REFUSED'
              : 'An error occurred when adding stake',
            'error',
          );
        } finally {
          loader.close();
        }
      }
    },
    async startAccumulatedFeesWithdrawal() {
      if (this.withdrawalStake) {
        const loader = this.$loading({
          target: '.withdraw-accumulated-fees-card',
          text: 'Requesting stake withdrawal...',
          customClass: 'backdrop_border_radius',
        });
        try {
          await metamask.contractService.requestAccumulatedOperatorFeeWithdrawal(
            this.getIdentityId,
          );
          this.notify(null, 'Accumulated fees withdrawal requested successfully!', 'success');
          await this.refreshAllTokenomicsData();
          this.refreshAccumulatedFeesTimer();
        } catch (err) {
          console.log(err);
          this.notify(
            null,
            err.code === 'ACTION_REJECTED'
              ? 'METAMASK_TRANSACTION_REFUSED'
              : 'An error occurred when requesting accumulated fees withdrawal',
            'error',
          );
        } finally {
          loader.close();
        }
      }
    },
    async withdrawAccumulatedFeesStake() {
      if (!this.mustWaitForWithdrawal) {
        const loader = this.$loading({
          target: '.withdraw-accumulated-fees-card',
          text: 'Withdrawing stake...',
          customClass: 'backdrop_border_radius',
        });
        try {
          await metamask.contractService.withdrawAccumulatedOperatorFee(this.getIdentityId);
          this.notify(null, 'Accumulated fees withdrawn successfully!', 'success');
          await this.refreshAllTokenomicsData();
          this.refreshAccumulatedFeesTimer();
        } catch (err) {
          console.log(err);
          this.notify(
            null,
            err.code === 'ACTION_REJECTED'
              ? 'METAMASK_TRANSACTION_REFUSED'
              : 'An error occurred when withdrawing accumulated fees',
            'error',
          );
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
      this.refreshOperatorFeeTimer();
      this.refreshAccumulatedFeesTimer();
      this.$forceUpdate();
    },
    async operatorFeeTimerOver() {
      await this.refreshAllTokenomicsData();
      this.refreshOperatorFeeTimer();
      this.$forceUpdate();
    },
    async accumulatedFeesTimerOver() {
      await this.refreshAllTokenomicsData();
      this.refreshOperatorFeeTimer();
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
  .node-ask {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    .operator-fee-card {
      .operator-fee-form {
        .italic {
          font-style: italic;
        }
      }
    }
  }
}
</style>
