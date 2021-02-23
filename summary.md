### 1.eslint 忽略文件

在头部加一行 /_ eslint-disable _/

### 2.postcss

1\. 不转译为 rem,可使用大写的 PX 单位

2.\ 当设计稿和 vant 大小不一致时 使用

```js
'postcss-pxtorem': {
      // vant 按照 375 分成 10 份 设计稿为 750
      rootValue({ file }) {
        // file => 要编译的样式的路径
        return file.includes('vant') ? 37.5 : 75
      },
      propList: ['*']
    }
```
