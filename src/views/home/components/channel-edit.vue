<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        slot="default"
        class="edit-btn"
        round
        size="mini"
        type="danger"
        plain
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <!-- 我的频道内容 -->
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="toOrRemove(index, channel.id)"
      >
        <!-- 右侧 x 图标 -->
        <van-icon
          v-show="isEdit && !defaultChannel.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <!-- 中间文字 -->
        <span
          slot="text"
          class="text"
          :class="{
            active: index === active
          }"
          >{{ channel.name }}</span
        >
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <!-- 频道推荐内容 -->
    <van-grid direction="horizontal" :gutter="10" class="recommend-grid">
      <van-grid-item
        v-for="(channel, index) in recommendChannels"
        :key="index"
        icon="plus"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  removeChannelById,
  addChannelById
} from '@/api/channel.js'
import { setItem } from '@/utils/storage.js'
import { mapState } from 'vuex'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制频道是否编辑 频道右上角 x 是否显示
      defaultChannel: [0] // 默认不能删除的频道,储存频道的id
    }
  },
  computed: {
    /* recommendChannels() {
      const channels = []
      this.allChannels.forEach(channel => {
        // find 找到符合条件的第一个就返回，后面就不再查找！
        const ret = this.myChannels.find(
          myChannel => myChannel.id === channel.id
        )
        // 我的频道没有找到 channel，则收集
        if (!ret) {
          channels.push(channel)
        }
      })
      return channels
    } */
    // 推荐频道列表
    recommendChannels() {
      // filter 把符合条件的元素返回到新数组
      return this.allChannels.filter(channel => {
        // find 找到符合条件的第一个就返回，后面就不再查找！
        return !this.myChannels.find(myChannel => myChannel.id === channel.id)
      })
    },
    ...mapState(['user'])
  },
  created() {
    this.loadAllChannels()
  },
  methods: {
    // 加载所有频道
    async loadAllChannels() {
      try {
        const { data: res } = await getAllChannels()
        this.allChannels = res.data.channels
      } catch (err) {
        this.$toast('获取所有频道数据失败')
      }
    },
    // 点击添加频道
    async onAddChannel(channel) {
      this.myChannels.push(channel)
      try {
        if (this.user) {
          const { data: res } = await addChannelById([
            {
              id: channel.id,
              seq: this.myChannels.length
            }
          ])
          console.log(res)
        } else {
          // 未登录,将频道存放到本地中
          setItem('unLoginChannel', this.myChannels)
        }
      } catch (err) {
        console.log(err)
        this.$toast('添加频道失败')
      }
    },
    // 点击频道 显示高亮 或者 删除频道
    async toOrRemove(index, id) {
      if (!this.isEdit) {
        this.$emit('change-active', { index: index, flag: false })
      } else {
        if (id === 0) return false
        if (index <= this.active) {
          this.$emit('change-active', { index: this.active - 1, flag: true })
        }
        // 前端删除
        this.myChannels.splice(index, 1)
        // 判断是否登录
        if (this.user) {
          // 后端删除
          try {
            const res = await removeChannelById(id)
            console.log(res)
            this.$emit('change-active', { id: id, flag: true })
          } catch (err) {
            this.$toast('删除失败')
          }
        } else {
          // 未登录,将频道存放到本地中
          setItem('unLoginChannel', this.myChannels)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding-top: 85px;
  /deep/.van-grid-item__content {
    width: 160px;
    height: 86px;
    background-color: #f4f5f6;
    border-radius: 6px;
    padding: 20px 16px;

    .active {
      color: red;
    }
  }
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .van-cell__value {
    display: flex;
    flex-direction: row-reverse;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/.my-grid {
    .van-grid-item {
      .van-grid-item__text,
      .text {
        white-space: nowrap;
        font-size: 28px;
        margin-top: 0;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
      .van-icon-clear {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 30px;
        color: #c2c2c2;
        z-index: 2;
      }
    }
  }

  /deep/.recommend-grid {
    .van-grid-item {
      .van-icon-plus {
        font-size: 24px;
      }
      .van-grid-item__text {
        white-space: nowrap;
        margin-left: 6px;
        font-size: 28px;
      }
    }
  }
}
</style>
