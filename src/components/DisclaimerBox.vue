<template>
  <div class="disclaimer-box-wrapper">
    <p>
      NOTE: When you stake TRAC tokens to your DKG node with an admin wallet, that admin wallet will
      receive a certain amount of “Stake Share Tokens” in return. Stake share tokens are ERC20
      tokens that represent the amount of shares of the total token stake that this particular
      wallet owns. Unstaking TRAC tokens from your DKG node is performed by “burning” an amount of
      share tokens. (e.g. you can burn 10% of your share tokens to get back 10% of your staked TRAC.
      This approach is similar to AMMs such as Uniswap and their LP tokens representing ownership
      share in token pairs liquidity pools).
    </p>

    <p>
      This means that, in case you want to use multiple admin wallets to manage your node (by adding
      additional admin wallets), only the wallets that own share tokens will be able to manage the
      TRAC stake.
    </p>

    <p>
      For example, if you would like to swap one admin wallet which has already staked TRAC tokens,
      for another fresh admin wallet, apart from adding the new admin wallet you should make sure to
      also transfer your TRAC stake to the new wallet. This can be done in two ways:
    </p>

    <p>
      By transferring share tokens from the current admin wallet to the new wallet (since the Share
      token is ERC20, they can be transferred to another wallet easily) You can see your node share
      token address in Houston. This is the recommended option as your node TRAC stake will not
      change during this operation.
    </p>

    <p>
      Unstaking all TRAC tokens and moving them to the new admin wallet. After transferring the
      tokens to the new wallet, they must be staked again with the new admin wallet. This means that
      for the period of time that your node is without TRAC stake, it will not participate in
      hosting in the network, risking that it can lose rewards.
    </p>

    <p>
      Please make sure to exercise caution when handling staked tokens and make sure to choose the
      best approach that meets your needs.
    </p>
  </div>
</template>

<script>
export default {
  name: 'DisclaimerBox',
};
</script>

<style lang="scss" scoped>
@import '../assets/variable.scss';

.disclaimer-box-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  padding: 12px;
  width: 504px;
  height: 240px;
  background: rgba(234, 169, 1, 0.1);
  border: 1px solid $yellow-500;
  border-radius: 8px;
  overflow-y: auto;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: $dark-text-primary;
}
</style>
