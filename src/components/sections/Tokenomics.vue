<template>
  <div class="tokenomics-wrapper">
    <!-- Service Tokenomics -->
    <h2 class="section-heading">Service tokenomics</h2>
    <div class="current-form">
      <div class="first-col">
        <div class="label-and-first-input">
          <p class="settings-label">Current ask</p>
          <InputPair label="TRAC / (kb-epoch)" isYellow="true" />
        </div>
        <InfoPair
          class="average-ask-neighbourhoods"
          title="Average ask in neighborhoods"
          description="0.000012"
        />
        <InfoPair title="Average ask on the network" description="0.000013" />
      </div>

      <div class="second-col">
        <InputPairWithBtn label="TRAC / (kb-epoch)" btnLabel="Update ask" />
      </div>
    </div>

    <!-- Stake Settings -->
    <h2 class="section-heading stake-settings-heading">Stake settings</h2>
    <div class="current-form">
      <div class="first-col">
        <div class="label-and-first-input">
          <p class="settings-label">Current stake</p>
          <InputPair label="TRAC" />
        </div>
        <InfoPair class="average-ask-neighbourhoods" title="Delegated:" description="0" />
      </div>

      <div class="second-col">
        <InputPairWithBtn label="TRAC" btnLabel="Update stake" />
      </div>
    </div>

    <!-- Claim Rewards -->
    <div class="claim-rewards">
      <div class="property-wrapper">
        <p class="title">Claimable TRAC:</p>
        <p class="value">1092.43 TRAC</p>
      </div>
      <div class="property-wrapper">
        <p class="title">Commited for:</p>
        <p class="value">3021.74 TRAC</p>
      </div>
      <Button class="full-width">Claim rewards</Button>
    </div>
  </div>
</template>

<script>
import Button from '../Button';
import InputPair from '../InputPair';
import InfoPair from '../InfoPair';
import InputPairWithBtn from '../InputPairWithBtn';

export default {
  name: 'Tokenomics',
  components: { Button, InputPair, InfoPair, InputPairWithBtn },
};
</script>

<style lang="scss" scoped>
@import '../../assets/variable.scss';

.tokenomics-wrapper {
  width: 100%;
  height: 880px;
  background: #f6f6f6;
  border-radius: 20px;
  padding: 82px 40px;

  .section-heading {
    margin-bottom: 24px;
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
      background: $grey-light;
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
