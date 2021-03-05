<template>
  <van-button
    type="info"
    color="#3296fa"
    round
    v-if="!isFollowed"
    size="small"
    icon="plus"
    :loading="isFollowLoading"
    @click="onFollow"
    >关注</van-button
  >
  <van-button
    v-else
    round
    :loading="isFollowLoading"
    size="small"
    @click="onFollow"
    >已关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  data() {
    return {
      isFollowLoading: false
    }
  },
  model: {
    prop: 'isFollowed', // 默认为 value
    event: 'update-follow' // 默认为input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },

  created() {},

  methods: {
    // 关注用户
    async onFollow() {
      this.isFollowLoading = true
      try {
        // 如果已关注，则取消关注
        const authorId = this.userId
        if (this.isFollowed) {
          await deleteFollow(authorId)
        } else {
          // 否则添加关注
          await addFollow(authorId)
        }

        // 更新视图
        this.$emit('update-follow', !this.isFollowed)
      } catch (err) {
        console.dir(err)
        if (err.response && err.response.status === 400) {
          return this.$toast.fail('不能关注自己')
        }
        this.$toast.fail('操作失败')
      }

      // 关闭按钮的 loading 状态
      this.isFollowLoading = false
    }
  }
}
</script>

<style scoped lang="less"></style>
