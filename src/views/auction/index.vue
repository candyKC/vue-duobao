<template>
    <div id="page-auction" class="navbar-fix">
      <navbar :search-show="true" :notice-show="true"></navbar>
      <filter-menu @filter-sort="changeFilterSort" @filter-loans="changeFilterLoans" @filter-area-item="onAreaItem" @filter-cancel="onFilterCancel" @filter-confirm="onFilterConfirm" @filter-space="onFilterSpace" @filter-other="onFilterOther" :loans-show="true"></filter-menu>
      <div class="container" v-if="isEmpty">
        <div class="empty">
          <img style="width: 265px;height: auto;" src="../../assets/images/empty@2x.png" alt="">
          <p>暂时没有符合该条件的房源</p>
        </div>
      </div>
      <van-list v-model="auction.loading" :finished="auction.finished" finished-text="已加载完毕" :error.sync="auction.error" error-text="请求失败，点击重新加载" @load="getData" v-else>
        <ul class="goods-list container">
          <li v-for="(item, index) in auction.list" :key="index">
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

      <div class="container" v-if="$route.query.search">
        <div class="section-title">可能你喜欢</div>
        <goods-like></goods-like>
      </div>
    </div>
</template>

<script>
import { QUERY_BY_CONDITION_URL } from '../../api'
import filters from '../../mixin/filters'

export default {
  name: 'auction',
  mixins: [filters],
  data () {
    return {
      isEmpty: false,
      auction: {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        name: '',
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
        recordCount: '',
        list: []
      }
    }
  },
  created () {
    if (this.$route.query.search) {
      this.auction.name = this.$route.query.keywords
    }
  },
  methods: {
    getData () {
      this.$post(QUERY_BY_CONDITION_URL, {
        page: this.auction.current,
        limit: this.auction.limit,
        name: this.auction.name,
        isNew: this.auction.isNew,
        sort: this.auction.sort,
        province: this.auction.province,
        city: this.auction.city,
        minPrice: this.auction.minPrice,
        maxPrice: this.auction.maxPrice,
        minSize: this.auction.minSize,
        maxSize: this.auction.maxSize,
        houseFeature: this.auction.houseFeature,
        goodsFeature: this.auction.goodsFeature,
        recordCount: this.auction.recordCount
      }).then((res) => {
        this.auction.loading = false
        if (this.auction.current === 1) {
          for (let i = 0; i < res.goodsList.records.length; i++) {
            res.goodsList.records[i].endTime = parseInt(res.goodsList.records[i].endTime)
            res.goodsList.records[i].avatar = res.goodsList.records[i].avatar.split(',')
          }
          this.auction.list = res.goodsList.records
        } else {
          for (let i = 0; i < res.goodsList.records.length; i++) {
            res.goodsList.records[i].endTime = parseInt(res.goodsList.records[i].endTime)
            res.goodsList.records[i].avatar = res.goodsList.records[i].avatar.split(',')
            this.auction.list.push(res.goodsList.records[i])
          }
        }
        if (this.auction.list.length >= res.goodsList.total) {
          this.auction.finished = true
        } else {
          this.auction.current++
        }
        this.isEmpty = !parseInt(res.goodsList.total)
      }).catch((err) => {
        console.log(err)
        this.auction.error = true
      })
    },
    changeFilterSort (value) {
      switch (value) {
        case 1:
          this.auction.sort = ''
          this.auction.recordCount = ''
          this.auction.isNew = true
          break
        case 2:
          this.auction.sort = 1
          this.auction.recordCount = ''
          this.auction.isNew = false
          break
        case 3:
          this.auction.sort = 0
          this.auction.recordCount = ''
          this.auction.isNew = false
          break
        case 4:
          this.auction.sort = ''
          this.auction.recordCount = 0
          this.auction.isNew = false
          break
        default:
          this.auction.sort = ''
          this.auction.recordCount = ''
          this.auction.isNew = false
          break
      }
      this.init()
    },
    changeFilterLoans (value) {
      this.auction.goodsFeature = value
      this.init()
    },
    onAreaItem (data) {
      this.auction.city = data.name
    },
    onFilterSpace (value) {
      this.auction.minSize = value.minSize
      this.auction.maxSize = value.maxSize
    },
    onFilterOther (value) {
      this.auction.houseFeature = value.value
    },
    onFilterCancel (el) {
      switch (el) {
        case 'filter-area':
          this.auction.city = ''
          break
        case 'filter-price':
          this.auction.minPrice = ''
          this.auction.maxPrice = ''
          break
        case 'filter-more':
          this.auction.minSize = ''
          this.auction.maxSize = ''
          this.auction.houseFeature = ''
          break
      }
      this.init()
    },
    onFilterConfirm (el, min, max) {
      if (el === 'filter-price') {
        min = parseInt(min)
        max = parseInt(max)
        if (min && max) {
          this.auction.minPrice = min * 10000
          this.auction.maxPrice = max * 10000
        } else {
          this.auction.minPrice = ''
          this.auction.maxPrice = ''
        }
      }
      this.init()
    },
    init () {
      this.auction.loading = true
      this.auction.error = false
      this.auction.finished = false
      this.auction.current = 1
      this.auction.list = []
      this.getData()
    }
  },
  watch: {
    $route (to, from) {
      if (this.$route.query.search) {
        this.auction.name = this.$route.query.keywords
      } else {
        this.auction.name = ''
      }
      this.init()
    }
  }
}
</script>

<style scoped>

</style>
