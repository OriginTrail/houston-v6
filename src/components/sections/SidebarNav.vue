<template>
  <div class="sidebar-nav-wrapper">
    <ul class="sidebar-nav">
      <router-link
        :class="{ disabled: link.disable }"
        :to="link.link"
        v-for="link of sidebarList"
        :key="link.label + link.route"
      >
        <li :class="{ active: isActive(link.route) }">{{ link.label }}</li>
        <Pill v-if="link.disable" class="coming-soon">coming soon</Pill>
      </router-link>
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
      sidebarList: [
        {
          label: 'Overview',
          link: '/',
          route: 'overview',
        },
        {
          label: 'Service tokenomics',
          link: '/tokenomics',
          route: 'tokenomics',
        },
        {
          label: 'Node configuration',
          link: '#',
          route: 'nodeConfig',
          disable: true,
        },
        {
          label: 'Node telemetry',
          link: '#',
          route: 'nodeTelemetry',
          disable: true,
        },
        {
          label: 'Logs',
          link: '#',
          route: 'logs',
          disable: true,
        },
        {
          label: 'Backups',
          link: '#',
          route: 'backups',
          disable: true,
        },
      ],
    };
  },
  methods: {
    activate: function (element) {
      this.activeElement = element;
    },
    isActive(routeName) {
      return this.$route.name === routeName;
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
      transition: all 0.2s ease-out;
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
