<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form class="search-from" action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296FA"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 搜索结果 -->
    <!-- //! 搜索结果优先级最高 -->
    <search-result v-if="isResultShow" :search-text="searchText" />
    <!-- /搜索结果 -->

    <!-- 搜索联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- /搜索联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @search="onSearch"
    />
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { getItem, setItem } from '@/utils/storage.js'
export default {
  name: 'searchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  data() {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('toutiao-searchHistories') || [] // 搜索历史记录
    }
  },
  watch: {
    searchHistories(value) {
      setItem('toutiao-searchHistories', value)
    }
  },
  methods: {
    //! 此页面的核心逻辑(有三个地方触发此函数)
    onSearch(val) {
      console.log(val)
      // 1.将输入框重新赋值
      this.searchText = val
      // 2.储存历史记录,将最新的没有重复的内容放在数组的最前面
      const r = this.searchHistories.indexOf(val)
      if (r !== -1) {
        this.searchHistories.splice(r, 1)
      }
      this.searchHistories.unshift(val)
      // 3.展示搜索页面
      this.isResultShow = true
    },
    onCancel() {
      console.log('onCancle')
      this.$router.push(this.$route.params.redirect || '/')
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-from {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
