<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <!-- 评论项组件 -->
    <comment-item
      v-for="(comment, index) in list"
      :key="index"
      :comment="comment"
    ></comment-item>
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment.js'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10
    }
  },
  created() {
    this.onLoad()
  },
  methods: {
    async onLoad() {
      try {
        // 1
        const { data: res } = await getComments({
          type: 'a',
          source: this.source,
          offset: this.offset,
          limit: this.limit
        })
        // 2
        console.log(res)
        this.list.push(...res.data.results)
        this.$emit('onload-success', res.data)
        // 3.加载状态结束
        this.loading = false

        // 4.判断数据全部加载完成
        if (res.data.results.length) {
          this.offset = res.data.last_id
        } else {
          this.finished = true
        }
      } catch (err) {}
    }
  }
}
</script>

<style lang="less" scoped></style>
