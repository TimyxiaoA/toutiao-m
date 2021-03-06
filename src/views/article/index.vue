<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>

          <!-- 关注按钮 -->
          <!--//! 当传递给组件的数据既要使用又要修改时,使用 v-model-->
          <!-- v-model 默认props 为value 自定义事件名为 input -->
          <!-- 注意 v-model只能使用一次 要是用多次 推荐 :title.sync 和 updata:tilte -->
          <follow-user
            class="follow-btn"
            v-model="article.is_followed"
            :user-id="article.aut_id"
          ></follow-user>
          <!-- <follow-user
            :is_followed="article.is_followed"
            :user_id="article.aut_id"
            @update-follow="article.is_followed = $event"
          >
          </follow-user> -->
          <!--  <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            :loading="isLoadingFollow"
            @click="onFollow"
            >已关注</van-button
          >
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            :loading="isLoadingFollow"
            @click="onFollow"
            >关注</van-button
          > -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="contentRef"
        ></div>
        <van-divider>正文结束</van-divider>

        <!-- 评论列表 -->
        <comment-list
          :list="commentList"
          :source="article.art_id"
          @onload-success="totalCommentCount = $event.total_count"
          @reply-click="onReplyClick"
        ></comment-list>

        <!-- 底部区域 -->
        <div class="article-bottom">
          <!-- 发布评论按钮 -->
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
            >写评论</van-button
          >

          <van-icon color="#777" name="comment-o" :badge="totalCommentCount" />
          <!-- 收藏图标组件 -->
          <collect-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id="article.art_id"
          ></collect-article>

          <!-- 点赞图标组件 -->
          <like-article
            class="btn-item"
            v-model="article.attitude"
            :article-id="article.art_id"
          ></like-article>

          <van-icon color="#777" name="share"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 发布评论弹出层 -->
        <van-popup v-model="isPostShow" position="bottom">
          <!-- 发布评论组件 -->
          <comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          ></comment-post>
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复 -->
    <!--//! 弹出层是懒渲染的：只有在第一次展示的时候才会渲染里面的内容，之后它的关闭和显示都是在切换内容的显示和隐藏  这里需要更新组件 -->
    <!-- v-if="isReplyShow"  或者 :key="isReplyShow"-->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 100%;">
      <comment-reply
        :key="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      />
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article.js'
import './github-markdown.css'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  provide: function() {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      article: {}, // 文章详情
      loading: false, // 控制 loading 状态
      errStatus: 0, // 错误状态码
      isLoadingFollow: false, // 控制按钮的loading状态-----防抖优化
      totalCommentCount: 0, // 总评论数
      isPostShow: false,
      commentList: [], // 添加的评论列表
      isReplyShow: false,
      currentComment: {} // 当前点击回复的评论项
    }
  },
  created() {
    this.loadArticle()
  },
  methods: {
    async loadArticle() {
      this.loading = true
      try {
        // 制造随机错误
        /*  if (Math.random() > 0.5) {
          JSON.parse('dfdsfdfd')
        }  */

        const { data: res } = await getArticleById(this.articleId)
        console.log(res)
        this.article = res.data
        this.loading = false

        // $nextTick 将回调函数延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
        this.$nextTick(() => {
          //! 待数据更新后才能获取 $refs.contentRef
          this.previewImg()
        })
      } catch (err) {
        console.log(err)
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        this.loading = false
      }
    },
    previewImg() {
      //! 获取 this.$refs.contentRef dom元素
      const contentEl = this.$refs.contentRef
      const allImg = contentEl.querySelectorAll('img')
      const images = []
      allImg.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            images,
            startPosition: index
          })
        }
      })
    },
    /*  async onFollow() {
      //! 防抖优化 按钮loading状态下 点击事件不能触发(vant 内部处理)
      this.isLoadingFollow = true
      try {
        if (this.article.is_followed) {
          // 已关注就取消关注
          await deleteFollow(this.article.aut_id)
        } else {
          // 未关注就添加关注
          await addFollow(this.article.aut_id)
        }
        // 更新视图
        this.article.is_followed = !this.article.is_followed
      } catch (err) {
        this.$toast('设置失败,请稍后再试')
      }
      this.isLoadingFollow = false
    } */
    onPostSuccess(res) {
      // 将发布内容展示到页面顶部
      this.commentList.unshift(res.new_obj)
      // 关闭弹层
      this.isPostShow = false
    },
    onReplyClick(comment) {
      console.log(comment)
      this.currentComment = comment
      this.isReplyShow = true
    }
  }
}
</script>

<style lang="less" scoped>
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/.van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: 0;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777777;
    }
  }
}
</style>
