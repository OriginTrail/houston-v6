<template>
  <div class="sidebar-nav-wrapper">
    <ul class="sidebar-nav">
      <li @click="activate(1)" :class="{ active: activeElement === 1 }">Overview</li>
      <li @click="activate(2)" :class="{ active: activeElement === 2 }">Service tokenomics</li>
      <li @click="activate(3)" :class="{ active: activeElement === 3 }">Node configuration</li>
      <li @click="activate(4)" :class="{ active: activeElement === 4 }">API keys</li>
      <li @click="activate(5)" :class="{ active: activeElement === 5 }">Node telemetry</li>
      <li @click="activate(6)" :class="{ active: activeElement === 6 }">Logs</li>
      <li @click="activate(7)" :class="{ active: activeElement === 7 }">Backups</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SidebarNav',
  data() {
    return {
      activeElement: 1,
    };
  },
  methods: {
    activate: function (element) {
      this.activeElement = element;
    },
  },
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
