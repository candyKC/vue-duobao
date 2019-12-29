<template>
  <div id="page-auction-herald" class="navbar-fix">
    <navbar title="预告" :notice-show="true"></navbar>

    <van-sticky :offset-top="46">
      <van-tabs v-model="active" class="herald-date" type="card" background="#129D5D" color="#fff" :swipe-threshold="5" @click="onTab">
        <van-tab :title="formatDate(item, 'MM月dd日')" v-for="(item, index) in date" :key="index" />
      </van-tabs>
    </van-sticky>

    <div class="container">
      <div class="empty" v-if="isEmpty">
        <img style="width: 265px;height: auto;" src="../../assets/images/empty@2x.png" alt="">
        <p>暂时没有符合该条件的房源</p>
      </div>
      <div v-for="(item, index) in auction" :key="index" v-else>
        <div class="herald-title" v-if="item.list.length">~ 开拍时间段：{{item.start}} - {{item.end}} ~</div>
        <van-row gutter="10" style="margin-top: 10px;" v-if="item.list.length">
          <van-col span="12" v-for="(item2, index2) in item.list" :key="index2">
            <router-link tag="div" class="goods-style-1" :to="{name: 'goods', query: {id: item2.id}}">
              <van-image lazy-load fit="cover" :src="item2.avatar[0]">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
              <div class="text">
                <div class="van-ellipsis info"><van-tag mark type="danger" color="#129D5D">价格</van-tag><strong>{{item2.currentPrice | $_moneyFormat}}</strong></div>
                <div class="views"><span>{{item2.size}}m²</span><van-icon name="eye-o" size="12" /> {{item2.view}}人围观</div>
                <h4 class="van-ellipsis">{{item2.name}}</h4>
              </div>
            </router-link>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import { QUERY_BY_CONDITION_URL } from '../../api'
import filters from '../../mixin/filters'

export default {
  name: 'auctionHerald',
  mixins: [filters],
  data () {
    return {
      active: 0,
      isEmpty: false,
      auction: [{
        start: '8:00',
        end: '12:00',
        current: 1,
        limit: 100,
        list: []
      }, {
        start: '13:00',
        end: '17:00',
        current: 1,
        limit: 100,
        list: []
      }, {
        start: '18:00',
        end: '22:00',
        current: 1,
        limit: 100,
        list: []
      }],
      date: []
    }
  },
  created () {
    let ss = 24 * 60 * 60 * 1000
    let timestamp = new Date().getTime()
    for (let i = 0; i < 5; i++) {
      let date = new Date(ss * i + timestamp)
      this.date.push(date)
    }
    this.getData()
  },
  methods: {
    onTab (index) {
      this.getData()
      this.isEmpty = false
    },
    getData () {
      let promiseAll = this.auction.map((item) => {
        return this.$post(QUERY_BY_CONDITION_URL, {
          page: item.current,
          limit: item.limit,
          status: 2,
          start: this.formatDate(this.date[this.active], 'yyyy-MM-dd') + ' ' + item.start + ':00',
          end: this.formatDate(this.date[this.active], 'yyyy-MM-dd') + ' ' + item.end + ':00'
        })
      })
      this.$all(promiseAll).then((resArr) => {
        resArr.forEach((res, index) => {
          console.log(res, index)
          for (let i = 0; i < res.goodsList.records.length; i++) {
            res.goodsList.records[i].avatar = res.goodsList.records[i].avatar.split(',')
          }
          this.auction[index].list = res.goodsList.records
        })
        if (!this.auction[0].list.length && !this.auction[1].list.length && !this.auction[2].list.length) {
          this.isEmpty = true
        }
      })
    },
    formatDate (date, format) {
      if (!date) return
      if (!format) {
        format = 'yyyy-MM-dd'
      }
      switch (typeof date) {
        case 'string':
          date = new Date(date.replace(/-/, '/'))
          break
        case 'number':
          date = new Date(date)
          break
      }
      if (date instanceof Date) {
        let dict = {
          'yyyy': date.getFullYear(),
          'M': date.getMonth() + 1,
          'd': date.getDate(),
          'H': date.getHours(),
          'm': date.getMinutes(),
          's': date.getSeconds(),
          'MM': ('' + (date.getMonth() + 101)).substr(1),
          'dd': ('' + (date.getDate() + 100)).substr(1),
          'HH': ('' + (date.getHours() + 100)).substr(1),
          'mm': ('' + (date.getMinutes() + 100)).substr(1),
          'ss': ('' + (date.getSeconds() + 100)).substr(1)
        }
        return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
          return dict[arguments[0]]
        })
      }
    }
  }
}
</script>

<style lang="less">
  .herald-date {padding: 0;}
  .herald-date>.van-tabs__wrap {height: 34px;}
  .herald-date .van-tabs__nav--card {margin: 0;border: 0;border-radius: 0;height: 34px;}
  .herald-date .van-tabs__nav--card .van-tab {border: 0;font-size: 12px;line-height: 34px;padding-top: 0;padding-bottom: 0;}
  .herald-date .van-tabs__nav--card .van-tab--active {background-color: #78c39d !important;}

  .herald-title {text-align: center;color: #129D5D;padding-top: 20px;}
</style>
