<template>
  <van-button
    :class="{
      collected: value
    }"
    :icon="value ? 'star' : 'star-o'"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article.js'
export default {
  name: 'CollectArticle',
  props: {
    value: {
      type: Boolean,
      required: true
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
    async onCollect() {
      //! 防抖优化 按钮loading状态下 点击事件不能触发(vant 内部处理)
      this.loading = true
      try {
        if (this.value) {
          // 已收藏,取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 未收藏,添加收藏
          await addCollect(this.articleId)
        }
        // 更新视图
        this.$emit('input', !this.value)
        // 这里需要获取父组件改变后最新的value
        this.$nextTick(() => {
          this.$toast.success(this.value ? '收藏成功' : '已取消收藏')
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
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
