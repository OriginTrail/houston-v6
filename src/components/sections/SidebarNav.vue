<template>
  <div class="sidebar-nav-wrapper">
    <ul class="sidebar-nav">
      <li>Overview</li>
      <li class="active">Service tokenomics</li>
      <li>Node configuration</li>
      <li>API keys</li>
      <li>Node telemetry</li>
      <li>Logs</li>
      <li>Backups</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SidebarNav',
};
</script>

<style lang="scss" scoped>
@import '../../assets/variable';

.sidebar-nav-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 40px 16px 0px;
  gap: 5px;
  width: 240px;
  height: 880px;
  background: $blue-primary;
  border-radius: 20px;

  .sidebar-nav {
    list-style: none;
    padding-left: 0;

    li {
      padding: 9px 12px 12px;
      gap: 8px;
      width: 208px;
      height: 40px;
      border-radius: 8px;
      color: $white-secondary;

      &.active {
        background-color: white;
        color: $blue-primary;
      }

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
