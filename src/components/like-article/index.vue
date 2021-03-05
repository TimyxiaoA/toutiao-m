<template>
  <van-button
    :class="{
      liked: value === 1
    }"
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :loading="loading"
    @click="onLike"
  />
</template>

<script>
import { addLike, deleteLike } from '@/api/article.js'
export default {
  name: 'LikeArticle',
  props: {
    value: {
      type: Number,
      requried: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },

  methods: {
    async onLike() {
      this.loading = true
      try {
        let attitude = -1
        if (this.value === 1) {
          // 已点赞,取消点赞
          await deleteLike(this.articleId)
        } else {
          // 未点赞,添加点赞
          await addLike(this.articleId)
          attitude = 1
        }
        // 更新视图
        this.$emit('input', attitude)
        // 这里需要获取父组件改变后最新的value
        this.$nextTick(() => {
          this.$toast.success(this.value === 1 ? '点赞成功' : '已取消点赞')
        })
      } catch (err) {
        this.$toast.fail('操作失败,请重试')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>
