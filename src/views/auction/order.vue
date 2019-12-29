<template>
  <div id="page-auction-order" class="navbar-fix">
    <navbar title="我的拍卖"></navbar>
    <van-sticky :offset-top="46">
    <van-tabs v-model="active" color="#D63C3C" line-width="30" line-height="2" @click="onTab" :swipe-threshold="5">
      <van-tab title="待交保" />
      <van-tab title="待开拍" />
      <van-tab title="竞价中" />
      <van-tab title="已结束" />
      <van-tab title="已拍下" />
    </van-tabs>
    </van-sticky>

    <div class="container">
      <div class="empty" v-if="isEmpty">
        <img style="width: 115px;height: auto;" src="../../assets/images/empty2@2x.png" alt="">
        <p>还没任何拍卖信息</p>
      </div>
      <van-list v-model="order.loading" :finished="order.finished" finished-text="已加载完毕" :error.sync="order.error" error-text="请求失败，点击重新加载" @load="getData" v-else>
        <van-panel v-for="(item, index) in order.list" :key="index">
          <van-cell slot="header" class="van-panel__header" value-class="van-panel__header-value">
            <div class="count" v-if="parseInt($route.query.type) === 2">
              <span>仅剩：</span>
              <van-count-down :time="parseInt(item.endTime)">
                <template v-slot="timeData">
                  <span>{{ timeData.days > 9 ? timeData.days : '0' + timeData.days }}</span>
                  <em>天</em>
                  <span>{{ timeData.hours > 9 ? timeData.hours : '0' + timeData.hours }}</span>
                  <em>:</em>
                  <span>{{ timeData.minutes > 9 ? timeData.minutes : '0' + timeData.minutes }}</span>
                  <em>:</em>
                  <span>{{ timeData.seconds > 9 ? timeData.seconds : '0' + timeData.seconds }}</span>
                </template>
              </van-count-down>
            </div>
          </van-cell>
          <van-card :title="item.goodsName" @click="$router.push({name: 'goods', query: {id: item.goodsId}})">
            <template slot="thumb">
              <van-image lazy-load fit="cover" :src="item.avatar.split(',')[0]">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </template>
            <div slot="desc" class="van-card__desc van-ellipsis">
              当前价：<div class="van-card__price">{{item.currentPrice | $_moneyFormat}}</div>
              <span>面积：{{item.size}}m²</span>
            </div>
            <div slot="desc" class="van-card__desc progress" v-if="parseInt($route.query.type) === 1 || parseInt($route.query.type) === 2">
              <span class="van-ellipsis">{{item.totalSignup}}人报名</span>
              <em><i :style="{width: item.totalSignup / 3000 * 100 + '%'}"></i></em>
            </div>
            <div slot="desc" class="van-card__desc van-ellipsis views" v-if="parseInt($route.query.type) === 1 || parseInt($route.query.type) === 2"><van-icon name="eye-o" size="12" /> {{item.totalViews}}人围观</div>
          </van-card>
        </van-panel>
      </van-list>

      <div class="section-title">可能你喜欢</div>
      <goods-like></goods-like>
    </div>
  </div>
</template>

<script>
import { GOODS_AUCTION_LIST_URL } from '../../api'
import filters from '../../mixin/filters'

export default {
  name: 'auctionOrder',
  mixins: [filters],
  computed: {
    active: {
      get () {
        return parseInt(this.$route.query.type) || 0
      },
      set () {}
    }
  },
  data () {
    return {
      isEmpty: false,
      order: {
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
    onTab (index) {
      this.$router.replace({ name: 'auctionOrder', query: { type: index } })
    },
    getData () {
      this.$post(GOODS_AUCTION_LIST_URL, {
        page: this.order.current,
        limit: this.order.limit,
        status: this.$route.query.type || 0
      }).then((res) => {
        console.log(res)
        this.order.loading = false
        if (this.order.current === 1) {
          this.order.list = res.data.records
        } else {
          for (let i = 0; i < res.data.records.length; i++) {
            this.order.list.push(res.data.records[i])
          }
        }
        if (this.order.list.length >= res.data.total) {
          this.order.finished = true
        } else {
          this.order.current++
        }
        this.isEmpty = !parseInt(res.data.total)
      }).catch((err) => {
        console.log(err)
        this.order.error = true
      })
    }
  },
  watch: {
    $route (to, from) {
      this.isEmpty = false
      this.order = {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        list: []
      }
    }
  }
}
</script>

<style scoped lang="less">
  .van-panel {margin: 10px 0 0;}
  .van-panel .count {font-size: 0;text-align: right;}
  .van-panel .count span {font-size: 14px;display: inline-block;vertical-align: top;}
  .van-panel .van-count-down {display: inline-block;vertical-align: top;line-height: 24px;}
  .van-panel .van-count-down span {color: #fff;background-color: #000;border-radius: 3px;font-size: 12px;vertical-align: top;display: inline-block;width: 21px;text-align: center;line-height: 16px;margin-top: 4px;}
  .van-panel .van-count-down em {font-style: normal;display: inline-block;font-size: 12px;vertical-align: top;margin: 0 5px;}
  .van-panel__content .van-card {background-color: transparent;padding-top: 0;padding-bottom: 15px;}
  .van-card__content {min-height: 80px;}
  .van-card__title {font-size: 14px;line-height: 20px;max-height: 40px;}
  .van-card__thumb {height: auto;border-radius: 3px;overflow: hidden;}
  .van-card__thumb .van-image {height: 80px;width: 100%;display: block;}
  .van-card__price {font-size: 14px;}
  .van-card__desc span {margin-left: 10px;}
  .van-card__desc.tips {font-size: 10px;color: #999;}
  .van-card__desc.progress {font-size: 0;line-height: 12px;overflow: hidden;margin-top: 5px;}
  .van-card__desc.progress em {display: block;margin-right: 65px;height: 6px;background-color: #f2f2f2;border-radius: 5px;overflow: hidden;margin-top: 3px;}
  .van-card__desc.progress i {display: block;height: 100%;width: 0;background-color: #D63C3C;}
  .van-card__desc.progress span {float: right;font-size: 12px;color: #999;width: 55px;text-align: right;}
  .van-card__desc.views {font-size: 12px;color: #999;line-height: 12px;margin-top: 5px;}
  .van-card__desc.views .van-icon {vertical-align: top;}
</style>
