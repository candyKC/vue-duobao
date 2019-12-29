<template>
    <div id="page-user-notice-type" class="navbar-fix">
      <navbar :title="title"></navbar>

      <div class="container">
        <div class="empty" v-if="isEmpty">
          <img style="width: 265px;height: auto;" src="../../assets/images/empty@2x.png" alt="">
          <p>暂无消息！</p>
        </div>
        <van-list v-model="message.loading" :finished="message.finished" finished-text="已加载完毕" :error.sync="message.error" error-text="请求失败，点击重新加载" @load="getData" v-else>
          <van-panel :title="item.title" :status="item.gmtCreate" v-for="(item, index) in message.list" :key="index">
            <van-card :desc="item.content" :class="{'no-thumb': !item.avatar}">
              <template slot="thumb">
                <van-image lazy-load fit="cover" v-if="item.avatar" :src="item.avatar">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </template>
            </van-card>
          </van-panel>
        </van-list>
      </div>
    </div>
</template>

<script>
import { MESSAGE_LIST_URL } from '../../api'

export default {
  name: 'userNoticeType',
  computed: {
    title () {
      let str = '通知类型'
      switch (this.$route.query.id) {
        case '1':
          str = '交易物流'
          break
        case '2':
          str = '账户通知'
          break
        case '3':
          str = '服务通知'
          break
      }
      return str
    }
  },
  data () {
    return {
      isEmpty: false,
      message: {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        list: []
      }
    }
  },
  methods: {
    getData () {
      this.$post(MESSAGE_LIST_URL, {
        page: this.message.current,
        limit: this.message.limit,
        type: this.$route.query.id
      }).then((res) => {
        console.log(res.data)
        this.message.loading = false
        if (this.message.current === 1) {
          this.message.list = res.data.records
        } else {
          for (let i = 0; i < res.data.records.length; i++) {
            this.message.list.push(res.data.records[i])
          }
        }
        if (this.message.list.length >= res.data.total) {
          this.message.finished = true
        } else {
          this.message.current++
        }
        this.isEmpty = !parseInt(res.data.total)
      }).catch((err) => {
        console.log(err)
        this.message.error = true
      })
    }
  }
}
</script>

<style scoped lang="less">
  .van-panel {margin: 10px 0;}
  .van-panel__header-value {color: #999;font-size: 12px;}
  .van-panel__content .van-card {background-color: transparent;padding-top: 0;padding-bottom: 15px;}
  .van-card__thumb {width: 60px;border-radius: 3px;overflow: hidden;height: 60px;}
  .van-card__thumb .van-image {width: 100%;height: 100%;}
  .van-card__content {min-height: 60px;}
  .van-card__desc {max-height: none;font-size: 14px;word-break: normal;white-space: normal;}
  .van-card.no-thumb .van-card__content {min-height: auto;}
</style>
