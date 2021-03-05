module.exports = {
  plugins: {
    // VueCLI 内部已开启 autoprefixer
    /* autoprefixer: {
      browsers: ['Android >= 4.0', 'iOS >= 8']
    }, */
    'postcss-pxtorem': {
      // vant 按照 375 分成 10 份 设计稿为 750
      rootValue({ file }) {
        // file => 要编译的样式的路径
        return file.includes('vant') ? 37.5 : 75
      },
      propList: ['*'],
      // exclude (String, Regexp, Function) The file path to ignore and leave as px
      exclude: 'github-markdown.css'
    }
  }
}
