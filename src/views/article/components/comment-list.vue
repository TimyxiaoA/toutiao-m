<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :immediate-check="false"
    @load="onLoad"
  >
    <!-- 评论项组件 -->
    <comment-item
      v-for="(comment, index) in list"
      :key="index"
      :comment="comment"
      @reply-click="$emit('reply-click', $event)"
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
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      validator: value => {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10
    }
  },
  created() {},
  mounted() {
    this.loading = true
    this.onLoad()
  },
  methods: {
    async onLoad() {
      try {
        // 1
        const { data: res } = await getComments({
          type: this.type,
          source: this.source.toString(),
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
