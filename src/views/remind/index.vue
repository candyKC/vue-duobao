<template>
  <div id="page-remind" class="navbar-fix tabbar-fix">
    <van-nav-bar fixed>
      <template slot="title">
        <van-tabs v-model="active" color="#D63C3C" type="card"  @click="onTab">
          <van-tab title="拍卖提醒" />
          <van-tab title="加价提醒" />
        </van-tabs>
      </template>
      <van-icon name="setting-o" size="20" slot="right" @click="$router.push({name: 'remindSetting'})" />
    </van-nav-bar>

    <div class="container">
      <div class="container" v-if="!userInfo.id">
        <div class="empty">
          <img style="width: 265px;height: auto;" src="../../assets/images/empty@2x.png" alt="">
          <van-button round type="primary" style="width: 140px;margin-top: 30px;" :to="{name: 'account'}">登陆/注册</van-button>
        </div>
      </div>
      <template v-else>
        <template v-if="parseInt($route.query.type) !== 1">
          <div class="empty" v-if="remind.isEmpty">
            <img style="width: 181px;height: auto;" src="../../assets/images/transfer_money@2x.png" alt="">
            <p>您还没订阅任何提醒</p>
          </div>
          <van-list v-model="remind.loading" :finished="remind.finished" finished-text="已加载完毕" :error.sync="remind.error" error-text="请求失败，点击重新加载" @load="getRemind">
            <van-panel v-for="(item, index) in remind.list" :key="index">
              <van-cell slot="header" class="van-panel__header" value-class="van-panel__header-value">
                <div slot="title" style="width: 210px;">预计 {{item.gmtEnd}} 结束</div>
                <span v-if="item.endTime > 0">进行中</span>
                <span v-else style="color: #999">已结束</span>
              </van-cell>
              <van-card :title="item.goodsName" @click="$router.push({name: 'goods', query: {id: item.goodsId}})">
                <template slot="thumb">
                  <van-image lazy-load fit="cover" :src="item.avatar.split(',')[0]">
                    <template v-slot:loading>
                      <van-loading type="spinner" size="20" />
                    </template>
                  </van-image>
                </template>
                <div slot="desc" class="van-card__desc van-ellipsis">当前价：<div class="van-card__price">{{item.currentPrice | $_moneyFormat}}</div><span>面积：{{item.size}}m²</span></div>
                <div slot="desc" class="van-card__desc van-ellipsis tips">价格仅供参考</div>
              </van-card>
            </van-panel>
          </van-list>
        </template>
        <template v-else>
          <div class="empty" v-if="remindAdd.isEmpty">
            <img style="width: 265px;height: auto;" src="../../assets/images/transfer_money@2x.png" alt="">
            <p>您还没订阅任何提醒</p>
          </div>
          <van-list v-model="remindAdd.loading" :finished="remindAdd.finished" finished-text="已加载完毕" :error.sync="remindAdd.error" error-text="请求失败，点击重新加载" @load="getRemind">
            <van-panel v-for="(item, index) in remindAdd.list" :key="index">
              <van-cell slot="header" class="van-panel__header" value-class="van-panel__header-value">
                <div slot="title" style="width: 210px;">已有 {{item.overPriceTotal}} 人出价高于你</div>
                <van-button plain hairline size="mini" type="primary" :to="{name: 'goods', query: {id: item.goodsId}}">去加价</van-button>
              </van-cell>
              <van-card :title="item.goodsName" @click="$router.push({name: 'goods', query: {id: item.goodsId}})">
                <template slot="thumb">
                  <van-image lazy-load fit="cover" :src="item.avatar.split(',')[0]">
                    <template v-slot:loading>
                      <van-loading type="spinner" size="20" />
                    </template>
                  </van-image>
                </template>
                <div slot="desc" class="van-card__desc van-ellipsis">当前价：<div class="van-card__price">{{item.currentPrice | $_moneyFormat}}</div><span>面积：{{item.size}}m²</span></div>
                <div slot="desc" class="van-card__desc van-ellipsis count">
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
              </van-card>
            </van-panel>
          </van-list>
        </template>
      </template>

      <div class="section-title">可能你喜欢</div>
      <goods-like></goods-like>
    </div>
  </div>
</template>

<script>
import { REMIND_LIST_URL } from '../../api'
import filters from '../../mixin/filters'

export default {
  name: 'remind',
  mixins: [filters],
  computed: {
    active: {
      get () {
        return parseInt(this.$route.query.type) || 0
      },
      set () {}
    },
    userInfo () {
      return this.$store.getters.getUserInfo || {}
    }
  },
  data () {
    return {
      remind: {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        list: [],
        isEmpty: false
      },
      remindAdd: {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        list: [],
        isEmpty: false
      }
    }
  },
  methods: {
    onTab (index) {
      this.$router.replace({ name: 'remind', query: { type: index } })
    },
    getRemind () {
      if (parseInt(this.$route.query.type) === 1) {
        this.$post(REMIND_LIST_URL, {
          page: this.remind.current,
          limit: this.remind.limit,
          type: 1
        }).then((res) => {
          console.log(res)
          this.remindAdd.loading = false
          if (this.remindAdd.current === 1) {
            this.remindAdd.list = res.data.records
          } else {
            for (let i = 0; i < res.data.records.length; i++) {
              this.remindAdd.list.push(res.data.records[i])
            }
          }
          if (this.remindAdd.list.length >= res.data.total) {
            this.remindAdd.finished = true
          } else {
            this.remindAdd.current++
          }
          this.remindAdd.isEmpty = !parseInt(res.data.total)
        }).catch((err) => {
          console.log(err)
          this.remindAdd.error = true
        })
      } else {
        this.$post(REMIND_LIST_URL, {
          page: this.remind.current,
          limit: this.remind.limit,
          type: 0
        }).then((res) => {
          console.log(res)
          this.remind.loading = false
          if (this.remind.current === 1) {
            this.remind.list = res.data.records
          } else {
            for (let i = 0; i < res.data.records.length; i++) {
              this.remind.list.push(res.data.records[i])
            }
          }
          if (this.remind.list.length >= res.data.total) {
            this.remind.finished = true
          } else {
            this.remind.current++
          }
          this.remind.isEmpty = !parseInt(res.data.total)
        }).catch((err) => {
          console.log(err)
          this.remind.error = true
        })
      }
    }
  },
  watch: {
    $route (to, from) {
      this.remind = {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        list: [],
        isEmpty: false
      }
      this.remindAdd = {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        list: [],
        isEmpty: false
      }
    }
  }
}
</script>

<style scoped lang="less">
  .van-tabs--card {padding-top: 8px;}

  .van-panel {margin: 10px 0 0;}
  .van-panel__content .van-card {background-color: transparent;padding-top: 0;padding-bottom: 15px;}
  .van-card__content {min-height: 60px;}
  .van-card__title {font-size: 14px;line-height: 20px;max-height: 40px;}
  .van-card__thumb {height: auto;border-radius: 3px;overflow: hidden;}
  .van-card__thumb .van-image {height: 60px;width: 100%;display: block;}
  .van-card__price {font-size: 14px;}
  .van-card__desc span {margin-left: 10px;}
  .van-card__desc.tips {font-size: 10px;color: #999;}
  .van-card__desc.count {font-size: 0;}
  .van-card__desc.count span {margin: 0;font-size: 12px;}
  .van-card__desc .van-count-down {display: inline-block;vertical-align: top;}
  .van-card__desc .van-count-down span {color: #fff;background-color: #000;border-radius: 3px;font-size: 12px;vertical-align: top;display: inline-block;width: 21px;text-align: center;line-height: 16px;margin-top: 2px;}
  .van-card__desc .van-count-down em {font-style: normal;display: inline-block;font-size: 12px;vertical-align: top;margin: 0 5px;}
</style>
