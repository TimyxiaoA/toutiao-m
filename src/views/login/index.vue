<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <template #left>
        <!-- 添加 v-if 判断是否从 /my 路由跳转过来 控制是否显示 'x'图标 -->
        <van-icon
          v-if="$route.params.redirect"
          name="cross"
          @click="$router.back()"
        />
      </template>
    </van-nav-bar>

    <!-- 登录表单 -->
    <van-form ref="loginFormRef" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <template #left-icon>
          <i class="toutiao toutiao-shouji"> </i>
        </template>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <template #left-icon>
          <i class="toutiao toutiao-yanzhengma"> </i>
        </template>
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 6"
            format="ss s "
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            round
            size="small"
            type="default"
            native-type="button"
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user.js'
export default {
  name: 'loginPage',

  data() {
    return {
      user: {
        mobile: '13911111111',
        code: 246810
      },
      userFormRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[35678]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      // 控制倒计时组件是否显示
      isCountDownShow: false
    }
  },

  methods: {
    // 登录
    async onSubmit(values) {
      // console.log( values) value 也可以获取表单数据
      // 1.获取数据
      // 2.表单验证
      this.$toast.loading({
        message: '登陆中',
        forbidClick: true,
        duration: 0
      })
      // 3.发送登录请求
      try {
        const { data: res } = await login(this.user)
        console.log(res)
        this.$toast.success('登陆成功')
        // 4.处理登录完成后操作 储存 token到 vuex 中
        this.$store.commit('setUser', res.data)
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登陆失败')
        }
      }
    },
    // 发送验证码
    async onSendSms() {
      console.log('sms')
      //  1.效验手机号
      try {
        this.$refs.loginFormRef.validate('mobile')
      } catch (err) {
        return console.log(err)
      }

      // 2.效验通过展示倒计时
      this.isCountDownShow = true
      // 3.发送请求获取短信验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败,关闭倒计时
        if (err.response.status === 429) {
          this.$toast('发送太频繁了,请稍后再试')
        } else {
          this.$toast('发送失败,请稍后再试')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 37px;
  }
  // /deep/ 会去除局部作用域的组件中被标记的样式名直接作用到未标记的样式名
  /deep/.van-field__button {
    display: flex;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
    padding: 0;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      border-radius: 10px;
    }
  }
}
</style>
