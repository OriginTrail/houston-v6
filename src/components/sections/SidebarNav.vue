<template>
  <div class="sidebar-nav-wrapper">
    <ul class="sidebar-nav">
      <router-link to="/"
        ><li @click="activate(1)" :class="{ active: activeElement === 1 }">
          Overview
        </li></router-link
      >
      <router-link to="/tokenomics"
        ><li @click="activate(2)" :class="{ active: activeElement === 2 }">
          Service tokenomics
        </li></router-link
      >
      <router-link to="#" class="disabled"
        ><li @click="activate(3)" :class="{ active: activeElement === 3 }">Node configuration</li>
        <Pill class="coming-soon">coming soon</Pill></router-link
      >
      <router-link to="#" class="disabled"
        ><li @click="activate(4)" :class="{ active: activeElement === 4 }">API keys</li>
        <Pill class="coming-soon">coming soon</Pill></router-link
      >
      <router-link to="#" class="disabled"
        ><li @click="activate(5)" :class="{ active: activeElement === 5 }">Node telemetry</li>
        <Pill class="coming-soon">coming soon</Pill></router-link
      >
      <router-link to="#" class="disabled"
        ><li @click="activate(6)" :class="{ active: activeElement === 6 }">Logs</li>
        <Pill class="coming-soon">coming soon</Pill></router-link
      >
      <router-link to="#" class="disabled"
        ><li @click="activate(7)" :class="{ active: activeElement === 7 }">Backups</li>
        <Pill class="coming-soon">coming soon</Pill></router-link
      >
    </ul>
  </div>
</template>

<script>
import Pill from '../Pill.vue';

export default {
  name: 'SidebarNav',
  components: { Pill },
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
      font-size: 14px;
      padding: 9px 12px;
      gap: 8px;
      width: 208px;
      height: 40px;
      border-radius: 8px;
      color: $white-secondary;
      white-space: nowrap;

      &.active {
        background-color: white;
        color: $blue-primary;
      }

      &:hover {
        cursor: pointer;
      }
    }

    a {
      text-decoration: none;
    }

    .disabled {
      pointer-events: none;
      display: flex;
      align-items: center;

      & > li {
        width: auto;
        padding-right: 8px;
      }

      .coming-soon {
        width: 67px;
      }
    }
  }
}
</style>
