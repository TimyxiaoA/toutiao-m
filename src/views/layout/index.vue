<template>
  <div class="layout-container">
    <!-- 路由出口 -->
    <router-view></router-view>
    <!-- 路由出口 -->

    <van-tabbar class="footer-tabber" route>
      <van-tabbar-item to="/">
        <template #icon>
          <i class="toutiao toutiao-shouye"> </i>
        </template>
        <span>首页</span>
      </van-tabbar-item>
      <van-tabbar-item to="/qa">
        <template #icon>
          <i class="toutiao toutiao-wenda"> </i>
        </template>
        <span>问答</span>
      </van-tabbar-item>
      <van-tabbar-item to="/video">
        <template #icon>
          <i class="toutiao toutiao-shipin"> </i>
        </template>
        <span>视频</span>
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <template #icon>
          <i class="toutiao toutiao-wode"> </i>
        </template>
        <span>我的</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'layoutIndex',

  data() {
    return {
      active: 0
    }
  },

  methods: {}
}
</script>

<style lang="less" scoped>
.layout-container {
  .footer-tabber {
    .toutiao {
      font-size: 40px;
    }
    span {
      font-size: 20px;
    }
  }
}
</style>
