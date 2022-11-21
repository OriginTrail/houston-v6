<template>
  <div class="tokenomics-wrapper">
    <!-- Service Tokenomics -->
    <h2 class="section-heading">Service tokenomics</h2>
    <div class="current-ask">
      <div class="top-row">
        <p class="current-ask-label">Current ask</p>
        <input type="text" class="yellow-500" />
        <p>TRAC / (kb-epoch)</p>
        <input type="text" />
        <p>TRAC / (kb-epoch)</p>
      </div>
      <div class="bottom-row">
        <div class="average-ask-info">
          <info-pair title="Average ask in neighborhoods" description="0.000012"></info-pair>
          <info-pair title="Average ask on the network" description="0.000013"></info-pair>
        </div>
        <Button class="update-button">Update ask</Button>
      </div>
    </div>

    <!-- Stake Settings -->
    <h2 class="section-heading stake-settings-heading">Stake settings</h2>
    <div class="current-ask">
      <div class="top-row">
        <p class="current-ask-label">Current stake</p>
        <input type="text" />
        <p>TRAC</p>
        <input type="text" class="trac-input-2" />
        <p>TRAC</p>
      </div>
      <div class="bottom-row">
        <div class="average-ask-info">
          <info-pair title="Delegated" description="0"></info-pair>
        </div>
        <Button class="update-button">Update stake</Button>
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
import InfoPair from '../InfoPair';
import Button from '../Button';

export default {
  name: 'Tokenomics',
  components: { InfoPair, Button },
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

  .current-ask {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    gap: 10px;
    max-width: 1024px;
    height: 128px;
    background: #ffffff;
    box-shadow: 0px 4px 8px rgba(82, 97, 115, 0.18);
    border-radius: 16px;

    .top-row {
      display: flex;
      align-items: center;
      column-gap: 16px;

      .current-ask-label {
        max-width: 108px;
      }

      input {
        padding: 10px 10px 8px;
        width: 244px;
        height: 40px;
        background: #ffffff;
        border: 1px solid #dfdfdf;
        border-radius: 8px;
        color: $green-500;
        text-align: right;
      }

      .trac-input-2 {
        margin-left: 95px;
      }

      .yellow-500 {
        color: $yellow-500;
      }
    }

    .bottom-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      .average-ask-info {
        display: flex;
        flex-direction: column;
        row-gap: 8px;
        margin-top: 8px;
      }

      .update-button {
        margin-right: 173px;
      }
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

    .property-short {
      height: 56px;
    }

    .full-width {
      width: 100%;
    }
  }
}
</style>
