<template>
  <div class="my-container">
    <!-- 未登录 -->
    <div class="header not-login">
      <div
        class="login-btn"
        @click="
          $router.push({
            name: 'login',
            params: {
              redirect: '/my'
            }
          })
        "
      >
        <img class="mobile-img" src="../../assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- 未登录 -->
  </div>
</template>

<script>
export default {
  name: 'myIndex',

  data() {
    return {}
  },

  methods: {}
}
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url(~@/assets/banner.png) no-repeat;
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
      }
      .text {
        margin-top: 15px;
        font-size: 28px;
        color: #fff;
      }
    }
  }
}
</style>
