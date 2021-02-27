<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        >
        </article-item>

        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article.js'
import ArticleItem from '@/components/article-item/index.vue'
export default {
  name: 'articleList',
  components: { ArticleItem },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [], // 列表数组数据
      loading: false, // 控制加载状态
      finished: false, // 控制完成状态
      timestamp: null, // 指定时间戳,控制下一页内容
      error: false, // 控制错误提示
      isRefreshLoading: false, // 控制下拉刷新是否加载
      refreshSuccessText: '刷新成功' // 刷新成功的文案
    }
  },

  methods: {
    async onLoad() {
      // 1. 请求获取数据
      try {
        const { data: res } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          timestamp: this.pre_timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // 2. 将请求的数据放入 list 数组中
        console.log(res)
        const { results, pre_timestamp } = res.data // eslint-disable-line
        this.list.push(...results)

        // 3. 本次加载完成后设置加载状态为结束
        this.loading = false

        // 4. 数据全部是否加载完成 设置完成状态
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = pre_timestamp // eslint-disable-line
        } else {
          this.finished = true
        }
      } catch (err) {
        this.loading = false // 关闭 loading 效果
        this.error = true // 开启错误提示
      }
    },
    async onRefresh() {
      // 1.请求获取数据
      try {
        const { data: res } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          timestamp: Date.now(), // 下拉刷新就用最新的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // 2.将数据追加到 list 数组最上方
        const { results } = res.data
        this.list.unshift(...results)

        // 3.关闭下拉刷新的 loading 状态  更新下拉刷新成功的提示文本
        this.isRefreshLoading = false
        this.refreshSuccessText = `刷新成功,更新了${results.length}条数据!`
      } catch (err) {
        // 4.更新失败时
        this.isRefreshLoading = false
        this.refreshSuccessText = '刷新失败,稍后再试!'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
