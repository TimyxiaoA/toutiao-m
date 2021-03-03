<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search.js'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      try {
        // 1. 异步更新数据
        const { data: res } = await getSearchResult({
          page: this.page,
          per_page: this.perPage,
          q: this.searchText
        })
        // 2. 将数据 push到 list数组中
        console.log(res)
        this.list.push(...res.data.results)
        // 3.加载状态结束
        this.loading = false
        // 4.数据是否加载完毕
        // 4.1
        if (res.data.results.length) {
          this.page++
        } else {
          // 4.2
          this.finished = true
        }
      } catch (err) {
        console.log(err)
        // this.$toast('搜索数据失败')
        this.loading = false
        this.error = true
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
