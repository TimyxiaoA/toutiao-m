import Vue from 'vue'
import dayjs from 'dayjs'
// 加载中文语言包
import 'dayjs/locale/zh-cn'

// 导入相对时间包
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// dayjs 默认语言为英文,这里全局配置为中文
dayjs.locale('zh-cn')

// 全局过滤器：处理相对时间
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
