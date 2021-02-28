<template>
  <div class="my-container">
    <!-- 已登录 -->
    <div v-if="user" class="header had-login">
      <div class="user-info">
        <div class="left">
          <van-image class="avatar" :src="userInfo.photo" round fit="cover" />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button class="user-edit" round>编辑资料</van-button>
        </div>
      </div>
      <div class="user-stats">
        <div class="stats-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="stats-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="stats-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="stats-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 已登录 -->

    <!-- 未登录 -->
    <div v-else class="header not-login">
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
        <img class="mobile-img" src="~@/assets/mobile.png" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- 未登录 -->

    <!-- 宫格导航 -->
    <van-grid :column-num="2" class="grid-nav mb-9" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>

    <!-- Cell 单元格 -->
    <van-cell title="消息通知" is-link />
    <van-cell class="mb-9" title="小智同学" is-link />
    <van-cell
      v-if="user"
      class="logout-cell"
      clickable
      title="退出登录"
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user.js'
export default {
  name: 'myIndex',

  data() {
    return {
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.getUser()
  },
  methods: {
    // 退出登录
    onLogout() {
      this.$dialog
        .confirm({
          title: '确认退出吗?'
        })
        .then(() => {
          // on confirm
          // 清除登录状态 (vuex中的 user 和 本地的user)
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel 直接关闭
        })
    },
    async getUser() {
      const { data: res } = await getUserInfo()
      console.log(res)
      this.userInfo = res.data
    }
  }
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
  .had-login {
    .user-info {
      height: 231px;
      // background-color: pink;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
        }
        .name {
          font-size: 28px;
          color: #fff;
          margin-left: 23px;
        }
      }
      .right {
        .user-edit {
          width: 115px;
          height: 32px;
          font-size: 20px;
          color: #666;
          padding: 0;
          letter-spacing: 1px;
        }
      }
    }
    .user-stats {
      height: 130px;
      display: flex;
      .stats-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-9 {
    margin-bottom: 9px;
  }
}
</style>
