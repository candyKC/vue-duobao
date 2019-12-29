<template>
  <div id="page-index" class="navbar-fix tabbar-fix">
    <navbar :city-show="true" :search-show="true" :back-show="false" :cart-show="true" :notice-show="true"></navbar>

    <van-swipe :autoplay="3000" indicator-color="#333">
      <van-swipe-item v-for="(item, index) in bannerList" :key="index"><router-link tag="a" :to="{name: 'goods', query: {id: item.id}}" href="javascript:;" :style="{backgroundImage: 'url('+ item.avatar.split(',')[0] +')'}"></router-link></van-swipe-item>
    </van-swipe>

    <van-notice-bar background="#F5F5F5" color="#D63C3C" :text="message" left-icon="volume"/>
    <van-grid :border="false">
      <van-grid-item :to="{name: 'house'}">
        <div class="item"><van-icon :name="require('../../assets/images/index-icon1.png')" />房产</div>
      </van-grid-item>
      <van-grid-item :to="{name: 'one'}">
        <div class="item"><van-icon :name="require('../../assets/images/index-icon4.png')" />一口价</div>
      </van-grid-item>
      <van-grid-item :to="{name: 'auctionHerald'}">
        <div class="item"><van-icon :name="require('../../assets/images/index-icon3.png')" />预告</div>
      </van-grid-item>
      <van-grid-item :to="{name: 'one', query: {type: 'activities'}}">
        <div class="item"><van-icon name="discount" size="24px" />特惠活动</div>
      </van-grid-item>
    </van-grid>

    <div class="section-title">好房推荐</div>

    <ul class="tuijian container">
      <li v-for="(item, index) in tuijianList" :key="index">
        <router-link :to="{name: 'goods', query: {id: item.id}}">
          <van-image lazy-load fit="cover" :src="item.avatar[0]">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
          <h4 class="van-ellipsis">{{item.name}}</h4>
          <p class="van-ellipsis">当前价：<strong>{{item.currentPrice | $_moneyFormat}}</strong></p>
        </router-link>
      </li>
    </ul>

    <div class="section-title" style="margin-bottom: 0;">今日拍卖</div>
    <filter-menu @filter-sort="changeFilterSort" @filter-loans="changeFilterLoans" @filter-area-item="onAreaItem" @filter-cancel="onFilterCancel" @filter-confirm="onFilterConfirm" @filter-space="onFilterSpace" @filter-other="onFilterOther" :loans-show="true"></filter-menu>
    <div class="container" v-if="isEmpty">
      <div class="empty" style="padding-bottom: 0;">
        <img style="width: 265px;height: auto;" src="../../assets/images/empty@2x.png" alt="">
        <p>暂时没有符合该条件的房源</p>
      </div>
    </div>
    <van-list v-model="paimai.loading" :finished="paimai.finished" :error.sync="paimai.error" error-text="请求失败，点击重新加载" @load="getPaimai">
      <ul class="goods-list container">
        <li v-for="(item, index) in paimai.list" :key="index">
          <router-link :to="{name: 'goods', query: {id: item.id}}">
            <div class="m">
              <van-image lazy-load fit="cover" :src="item.avatar[0]">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
              <!--<span>可贷款</span>-->
            </div>
            <div class="text">
              <h4 class="van-ellipsis">{{item.name}}</h4>
              <div class="info">
                <span class="van-ellipsis">当前价：<strong>{{item.currentPrice | $_moneyFormat}}</strong></span>
                <span class="van-ellipsis">面积：{{item.size}}m²</span>
              </div>
              <div class="count">
                <span>仅剩：</span>
                <van-count-down :time="item.endTime">
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
              <div class="progress">
                <span class="van-ellipsis">{{item.signup}}人报名</span>
                <em><i :style="{width: item.signup / 100 * 100 + '%'}"></i></em>
              </div>
              <div class="views"><van-icon name="eye-o" size="12" /> {{item.view}}人围观</div>
            </div>
          </router-link>
        </li>
      </ul>
    </van-list>
    <div class="button-area">
      <van-button type="primary" :to="{name: 'auction'}" block>更多拍卖</van-button>
    </div>
  </div>
</template>

<script>
import { QUERY_BY_CONDITION_URL, INDEX_MESSAGE_URL } from '../../api'
import { Swipe, SwipeItem } from 'vant'
import filters from '../../mixin/filters'

export default {
  name: 'index',
  mixins: [filters],
  components: {
    [SwipeItem.name]: SwipeItem,
    [Swipe.name]: Swipe
  },
  data () {
    return {
      bannerList: [],
      tuijianList: [],
      isEmpty: false,
      paimai: {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        list: []
      },
      filterParam: {
        isNew: false,
        sort: '',
        province: '',
        city: '',
        minPrice: '',
        maxPrice: '',
        minSize: '',
        maxSize: '',
        houseFeature: '',
        goodsFeature: '0,',
        recordCount: ''
      },
      message: ''
    }
  },
  created () {
    this.getBanner()
    this.getMessage()
    this.getTuijian()
  },
  methods: {
    getBanner () {
      this.$post(QUERY_BY_CONDITION_URL, {
        showInNav: true,
        page: 1,
        limit: 5
      }).then((res) => {
        console.log(res)
        this.bannerList = res.goodsList.records
      }).catch((err) => {
        console.log(err)
      })
    },
    getMessage () {
      this.$post(INDEX_MESSAGE_URL, {
        page: 1,
        limit: 1
      }).then((res) => {
        console.log(res.data.records[0])
        let data = res.data.records[0]
        this.message = data.goodsName + ' ' + (data.price >= 10000 ? (data.price / 10000) + '万' : data.price) + ' ' + data.gmtCreate
      }).catch((err) => {
        console.log(err)
      })
    },
    getTuijian () {
      this.$post(QUERY_BY_CONDITION_URL, {
        houseFeature: '0,',
        page: 1,
        limit: 10
      }).then((res) => {
        for (let i = 0; i < res.goodsList.records.length; i++) {
          res.goodsList.records[i].avatar = res.goodsList.records[i].avatar.split(',')
        }
        this.tuijianList = res.goodsList.records
      })
    },
    getPaimai () {
      this.$post(QUERY_BY_CONDITION_URL, {
        page: this.paimai.current,
        limit: this.paimai.limit,
        isNew: this.filterParam.isNew,
        sort: this.filterParam.sort,
        province: this.filterParam.province,
        city: this.filterParam.city,
        minPrice: this.filterParam.minPrice,
        maxPrice: this.filterParam.maxPrice,
        minSize: this.filterParam.minSize,
        maxSize: this.filterParam.maxSize,
        houseFeature: this.filterParam.houseFeature,
        goodsFeature: this.filterParam.goodsFeature,
        recordCount: this.filterParam.recordCount
      }).then((res) => {
        this.paimai.loading = false
        if (this.paimai.current === 1) {
          for (let i = 0; i < res.goodsList.records.length; i++) {
            res.goodsList.records[i].endTime = parseInt(res.goodsList.records[i].endTime)
            res.goodsList.records[i].avatar = res.goodsList.records[i].avatar.split(',')
          }
          this.paimai.list = res.goodsList.records
        } else {
          for (let i = 0; i < res.goodsList.records.length; i++) {
            res.goodsList.records[i].endTime = parseInt(res.goodsList.records[i].endTime)
            res.goodsList.records[i].avatar = res.goodsList.records[i].avatar.split(',')
            this.paimai.list.push(res.goodsList.records[i])
          }
        }
        if (this.paimai.list.length >= res.goodsList.total || this.paimai.list.length >= 20) {
          this.paimai.finished = true
        } else {
          this.paimai.current++
        }
        this.isEmpty = !parseInt(res.goodsList.total)
      }).catch((err) => {
        console.log(err)
        this.paimai.error = true
      })
    },
    changeFilterSort (value) {
      switch (value) {
        case 1:
          this.filterParam.sort = ''
          this.filterParam.recordCount = ''
          this.filterParam.isNew = true
          break
        case 2:
          this.filterParam.sort = 1
          this.filterParam.recordCount = ''
          this.filterParam.isNew = false
          break
        case 3:
          this.filterParam.sort = 0
          this.filterParam.recordCount = ''
          this.filterParam.isNew = false
          break
        case 4:
          this.filterParam.sort = ''
          this.filterParam.recordCount = 0
          this.filterParam.isNew = false
          break
        default:
          this.filterParam.sort = ''
          this.filterParam.recordCount = ''
          this.filterParam.isNew = false
          break
      }
      this.paimai.loading = true
      this.paimai.error = false
      this.paimai.finished = false
      this.paimai.current = 1
      this.getPaimai()
    },
    changeFilterLoans (value) {
      this.filterParam.goodsFeature = value
      this.paimai.loading = true
      this.paimai.error = false
      this.paimai.finished = false
      this.paimai.current = 1
      this.getPaimai()
    },
    onAreaItem (data) {
      this.filterParam.city = data.name
    },
    onFilterSpace (index, value) {
      this.filterParam.minSize = value.minSize
      this.filterParam.maxSize = value.maxSize
    },
    onFilterOther (index, value) {
      this.filterParam.houseFeature = value.value
    },
    onFilterCancel (el) {
      switch (el) {
        case 'filter-area':
          this.filterParam.city = ''
          break
        case 'filter-price':
          this.filterParam.minPrice = ''
          this.filterParam.maxPrice = ''
          break
        case 'filter-more':
          this.filterParam.minSize = ''
          this.filterParam.maxSize = ''
          this.filterParam.houseFeature = ''
          break
      }
      this.paimai.loading = true
      this.paimai.error = false
      this.paimai.finished = false
      this.paimai.current = 1
      this.getPaimai()
    },
    onFilterConfirm (el, min, max) {
      if (el === 'filter-price') {
        min = parseInt(min)
        max = parseInt(max)
        if (min && max) {
          this.filterParam.minPrice = min * 10000
          this.filterParam.maxPrice = max * 10000
        } else {
          this.filterParam.minPrice = ''
          this.filterParam.maxPrice = ''
        }
      }
      this.paimai.loading = true
      this.paimai.error = false
      this.paimai.finished = false
      this.paimai.current = 1
      this.getPaimai()
    }
  }
}
</script>

<style scoped lang="less">
  .van-swipe a {display: block;padding-top: 59%;width: 100%;background: no-repeat center;background-size: cover;}

  .van-grid .item {font-size: 12px;text-align: center;}
  .van-grid .item .van-icon {font-size: 20px;line-height: 44px;width: 44px;height: 44px;border-radius: 50%;color: #fff;display: block;margin-bottom: 10px;}
  .van-grid-item:nth-of-type(1) .item .van-icon {background-color: #EB8C47;box-shadow: 0 3px 6px rgba(235,140,71,0.2);}
  .van-grid-item:nth-of-type(2) .item .van-icon {background-color: #4A98E6;box-shadow: 0 3px 6px rgba(74,152,230,0.2);}
  .van-grid-item:nth-of-type(3) .item .van-icon {background-color: #F0D019;box-shadow: 0 3px 6px rgba(240,208,25,0.2);}
  .van-grid-item:nth-of-type(4) .item .van-icon {background-color: #57C1C1;box-shadow: 0 3px 6px rgba(87,193,193,0.2);}

  .tuijian {white-space: nowrap; overflow-x:scroll;margin-bottom: 15px;height: 160px;}
  .tuijian li {display: inline-block;margin-left: 15px;width: 140px;}
  .tuijian li:first-child {margin-left: 0;}
  .tuijian a {display: block;}
  .tuijian .van-image {display: block;border-radius: 3px;overflow: hidden;width: 100%;height: 100px;}
  .tuijian h4 {margin: 5px 0;font-weight: normal;}
  .tuijian p {margin: 0;font-size: 12px;color: #999;}
  .tuijian p strong {font-size: 14px;color: #D63C3C;}
</style>
