<template>
  <div class="sidebar-nav-wrapper">
    <ul class="sidebar-nav">
      <template v-for="link of sidebarList">
        <router-link
          :class="{ disabled: link.disable }"
          :to="link.link"
          :key="link.label + link.route"
        >
          <li :class="{ active: isActive(link.route) }">{{ link.label }}</li>
          <Pill v-if="link.disable" class="coming-soon">coming soon</Pill>
        </router-link>
        <div
          :key="link.label + link.route + 'children'"
          class="link-children"
          v-if="link.children && link.children.length"
        >
          <ul>
            <li
              :class="{ disabled: link.disabled || child.disable }"
              v-for="child of link.children"
              :key="child.label + link.label + link.route"
            >
              <router-link
                :class="{ disabled: link.disabled || child.disable }"
                :to="child.link"
                :key="child.label + child.route"
              >
                <div :class="{ active: isActive(child.route) }">{{ child.label }}</div>
              </router-link>
            </li>
          </ul>
        </div>
      </template>
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
          label: 'Node wallets',
          link: '/wallet-management',
          route: 'wallet-management',
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
    .link-children {
      ul {
        list-style: none;
        padding-inline-start: 15px;
        li {
          .disabled {
            pointer-events: none;
            display: flex;
            align-items: center;
            color: rgba(255, 255, 255, 0.32);
            .coming-soon {
              width: 67px;
            }
          }
          &.disabled {
            &:hover {
              cursor: default;
            }
          }
        }
      }
    }
  }
}
</style>
