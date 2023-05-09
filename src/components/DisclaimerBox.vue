<template>
  <div class="disclaimer-box-wrapper">
    <p>
      NOTE: When you stake TRAC tokens to your DKG node using an admin wallet, that admin wallet
      will receive a certain amount of "Stake Share Tokens" in return. Stake Share Tokens are ERC20
      tokens that represent the amount of shares of the total token stake owned by this particular
      wallet. Unstaking TRAC tokens from your DKG node is performed by "burning" a certain amount of
      share tokens (e.g., you can burn 10% of your share tokens to retrieve 10% of your staked
      TRAC). This approach is similar to AMMs such as Uniswap and their LP tokens, which represent
      ownership share in token pair liquidity pools.
    </p>

    <p>
      This means that if you want to use multiple admin wallets to manage your node (by adding
      additional admin wallets), only the wallets that possess share tokens will be able to manage
      the TRAC stake.
    </p>

    <p>
      For example, if you would like to swap an admin wallet that has already staked TRAC tokens
      with a fresh admin wallet, apart from adding the new admin wallet, you should also make sure
      that you transfer your TRAC stake to the new wallet. This can be done in two ways:
    </p>

    <p>
      By transferring share tokens from the current admin wallet to the new wallet (since the Stake
      Share Token is ERC20, they can be easily transferred to another wallet). You can find your
      node share token address in Houston. This is the recommended option as your node TRAC stake
      will remain unchanged during this operation.
    </p>

    <p>
      Unstaking all TRAC tokens and transferring them to the new admin wallet. After transferring
      the tokens to the new wallet, they must be staked again with the new admin wallet. However,
      please note that during the period when your node has no TRAC stake, it will not participate
      in hosting on the network, risking that it can lose rewards.
    </p>

    <p>
      Please exercise caution when handling staked tokens and carefully choose the best approach
      that suits your needs.
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
