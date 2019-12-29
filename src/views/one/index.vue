<template>
    <div id="page-one" class="navbar-fix">
      <navbar :cart-show="true" :notice-show="true" :title="isActivities ? '特惠活动' : '一口价'"></navbar>
      <filter-menu @filter-sort="changeFilterSort" @filter-area-item="onAreaItem" @filter-cancel="onFilterCancel" @filter-confirm="onFilterConfirm" @filter-space="onFilterSpace" @filter-other="onFilterOther" v-if="!isActivities"></filter-menu>

      <div class="container">
        <div class="empty" v-if="isEmpty">
          <img style="width: 265px;height: auto;" src="../../assets/images/empty@2x.png" alt="">
          <p>抱歉，暂时没有搜到您想要的房源哦！</p>
        </div>
        <van-list v-model="house.loading" :finished="house.finished" finished-text="已加载完毕" :error.sync="house.error" error-text="请求失败，点击重新加载" @load="getData" v-else>
          <ul class="goods-list container" v-if="isActivities">
            <li v-for="(item, index) in house.list" :key="index">
              <router-link :to="{name: 'goods', query: {id: item.id}}">
                <div class="m">
                  <van-image lazy-load fit="cover" :src="item.avatar.split(',')[0]">
                    <template v-slot:loading>
                      <van-loading type="spinner" size="20" />
                    </template>
                  </van-image>
                  <!--<span>可贷款</span>-->
                </div>
                <div class="text">
                  <h4 class="van-ellipsis">{{item.name}}</h4>
                  <van-tag color="#FFDBDB" text-color="#D63C3C" style="margin: 0 5px 5px 0;">1年历史最低价</van-tag>
                  <div class="info">
                    <span class="van-ellipsis" style="width: 100%;text-align: left;"><strong>¥ {{item.currentPrice | $_moneyFormat}}</strong><small style="margin-left: 5px;text-decoration: line-through;">暂无市场价字段</small></span>
                  </div>
                  <van-button type="primary" size="mini" style="float: right;min-width: 60px;">立即购买</van-button>
                  <div class="info" style="margin-bottom: 0;">
                    <span class="van-ellipsis" style="width: auto;text-align: left;">面积：{{item.size}}m²</span>
                  </div>
                </div>
              </router-link>
            </li>
          </ul>
          <van-row gutter="10" style="margin-top: 10px;" v-else>
            <van-col span="12" v-for="(item, index) in house.list" :key="index">
              <router-link tag="div" :to="{name: 'goods', query: {id: item.id}}" class="goods-style-1">
                <van-image lazy-load fit="cover" :src="item.avatar.split(',')[0]">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
                <div class="text">
                  <div class="van-ellipsis info"><span class="size">{{item.size}}m²</span><van-tag mark type="danger">价格</van-tag><strong>{{item.currentPrice | $_moneyFormat}}</strong></div>
                  <div class="views"><!--<van-icon name="eye-o" size="12" /> {{item.view}}人围观--></div>
                  <h4 class="van-ellipsis">{{item.name}}</h4>
                </div>
              </router-link>
            </van-col>
          </van-row>
        </van-list>
      </div>
    </div>
</template>

<script>
import { QUERY_BY_CONDITION_URL } from '../../api'
import filters from '../../mixin/filters'

export default {
  name: 'one',
  mixins: [filters],
  computed: {
    isActivities () {
      return this.$route.query.type === 'activities'
    }
  },
  data () {
    return {
      isEmpty: false,
      house: {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        isNew: false,
        sort: '',
        province: '',
        city: '',
        minPrice: '',
        maxPrice: '',
        minSize: '',
        maxSize: '',
        houseFeature: '',
        recordCount: '',
        list: []
      }
    }
  },
  methods: {
    getData () {
      this.$post(QUERY_BY_CONDITION_URL, {
        page: this.house.current,
        limit: this.house.limit,
        onePrice: 1,
        isNew: this.house.isNew,
        sort: this.house.sort,
        province: this.house.province,
        city: this.house.city,
        minPrice: this.house.minPrice,
        maxPrice: this.house.maxPrice,
        minSize: this.house.minSize,
        maxSize: this.house.maxSize,
        houseFeature: this.house.houseFeature,
        recordCount: this.house.recordCount
      }).then((res) => {
        console.log(res)
        this.house.loading = false
        if (this.house.current === 1) {
          for (let i = 0; i < res.goodsList.records.length; i++) {
            res.goodsList.records[i].endTime = parseInt(res.goodsList.records[i].endTime)
          }
          this.house.list = res.goodsList.records
        } else {
          for (let i = 0; i < res.goodsList.records.length; i++) {
            res.goodsList.records[i].endTime = parseInt(res.goodsList.records[i].endTime)
            this.house.list.push(res.goodsList.records[i])
          }
        }
        if (this.house.list.length >= res.goodsList.total) {
          this.house.finished = true
        } else {
          this.house.current++
        }
        this.isEmpty = !parseInt(res.goodsList.total)
      }).catch((err) => {
        console.log(err)
        this.house.error = true
      })
    },
    changeFilterSort (value) {
      switch (value) {
        case 1:
          this.house.sort = ''
          this.house.recordCount = ''
          this.house.isNew = true
          break
        case 2:
          this.house.sort = 1
          this.house.recordCount = ''
          this.house.isNew = false
          break
        case 3:
          this.house.sort = 0
          this.house.recordCount = ''
          this.house.isNew = false
          break
        case 4:
          this.house.sort = ''
          this.house.recordCount = 0
          this.house.isNew = false
          break
        default:
          this.house.sort = ''
          this.house.recordCount = ''
          this.house.isNew = false
          break
      }
      this.init()
    },
    onAreaItem (data) {
      this.house.city = data.name
    },
    onFilterSpace (value) {
      this.house.minSize = value.minSize
      this.house.maxSize = value.maxSize
    },
    onFilterOther (value) {
      this.house.houseFeature = value.value
    },
    onFilterCancel (el) {
      switch (el) {
        case 'filter-area':
          this.house.city = ''
          break
        case 'filter-price':
          this.house.minPrice = ''
          this.house.maxPrice = ''
          break
        case 'filter-more':
          this.house.minSize = ''
          this.house.maxSize = ''
          this.house.houseFeature = ''
          break
      }
      this.init()
    },
    onFilterConfirm (el, min, max) {
      if (el === 'filter-price') {
        min = parseInt(min)
        max = parseInt(max)
        if (min && max) {
          this.house.minPrice = min * 10000
          this.house.maxPrice = max * 10000
        } else {
          this.house.minPrice = ''
          this.house.maxPrice = ''
        }
      }
      this.init()
    },
    init () {
      this.house.loading = true
      this.house.error = false
      this.house.finished = false
      this.house.current = 1
      this.house.list = []
      this.getData()
    }
  }
}
</script>

<style scoped>

</style>
