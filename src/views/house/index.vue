<template>
    <div id="page-house" class="navbar-fix">
      <navbar :cart-show="true" :notice-show="true" title="房产"></navbar>
      <filter-menu @filter-sort="changeFilterSort" @filter-area-item="onAreaItem" @filter-cancel="onFilterCancel" @filter-confirm="onFilterConfirm" @filter-space="onFilterSpace" @filter-other="onFilterOther"></filter-menu>

      <div class="container" v-if="isEmpty">
        <div class="empty">
          <img style="width: 265px;height: auto;" src="../../assets/images/empty@2x.png" alt="">
          <p>抱歉，暂时没有搜到您想要的房源哦！</p>
        </div>
      </div>
      <van-list v-model="house.loading" :finished="house.finished" finished-text="已加载完毕" :error.sync="house.error" error-text="请求失败，点击重新加载" @load="getData">
        <div class="container">
          <van-row gutter="10" style="margin-top: 10px;">
            <van-col span="12" v-for="(item, index) in house.list" :key="index">
              <router-link tag="div" class="goods-style-1" :to="{name: 'goods', query: {id: item.id}}">
                <van-image lazy-load fit="cover" :src="item.avatar[0]">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
                <div class="text">
                  <div class="van-ellipsis info"><van-tag mark type="danger">起拍价</van-tag><strong>{{item.currentPrice | $_moneyFormat}}</strong></div>
                  <div class="views"><span>{{item.size}}m²</span><van-icon name="eye-o" size="12" /> {{item.view}}人围观</div>
                  <h4 class="van-ellipsis">{{item.name}}</h4>
                </div>
              </router-link>
            </van-col>
          </van-row>
        </div>
      </van-list>
    </div>
</template>

<script>
import { QUERY_BY_CONDITION_URL } from '../../api'
import filters from '../../mixin/filters'

export default {
  name: 'house',
  mixins: [filters],
  data () {
    return {
      isEmpty: false,
      house: {
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
        houseFeature: '0,',
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
        name: this.house.name,
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
        this.house.loading = false
        if (this.house.current === 1) {
          for (let i = 0; i < res.goodsList.records.length; i++) {
            res.goodsList.records[i].endTime = parseInt(res.goodsList.records[i].endTime)
            res.goodsList.records[i].avatar = res.goodsList.records[i].avatar.split(',')
          }
          this.house.list = res.goodsList.records
        } else {
          for (let i = 0; i < res.goodsList.records.length; i++) {
            res.goodsList.records[i].endTime = parseInt(res.goodsList.records[i].endTime)
            res.goodsList.records[i].avatar = res.goodsList.records[i].avatar.split(',')
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
  },
  beforeRouteEnter (to, from, next) {
    window.document.body.setAttribute('style', 'background-color:#fff')
    next()
  },
  beforeRouteLeave (to, from, next) {
    window.document.body.removeAttribute('style')
    next()
  }
}
</script>

<style scoped>

</style>
