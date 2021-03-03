<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(item, index) in suggestions"
      :key="index"
      icon="search"
      @click="$emit('search', item)"
    >
      <div slot="title" v-html="highlight(item)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search.js'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: [] // 搜索联想建议列表
    }
  },
  computed: {},
  watch: {
    // 设置防抖
    searchText: {
      handler: debounce(function(value) {
        console.log(value)
        this.loadSearchSuggestions(value)
      }, 300),
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    async loadSearchSuggestions(q) {
      const { data: res } = await getSearchSuggestions(q)
      console.log(res)
      this.suggestions = res.data.options
    },
    highlight(item) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      //! 直接写正则 /this.searchText/gi  正则不会解析数据变量
      //! 需要直接 创建一个正则对象来动态获取正则 第一个参数 正则替换的字符串,第二个参数 正则配置参数
      const reg = new RegExp(this.searchText, 'gi')
      return item.replace(reg, highlightStr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/span.active {
    color: #3296fa;
  }
}
</style>
