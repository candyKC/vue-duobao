<template>
  <div id="page-category" class="navbar-fix">
    <navbar :cart-show="true" :notice-show="true" :title="title"></navbar>
    <div class="container" v-if="isEmpty">
      <div class="empty">
        <img style="width: 265px;height: auto;" src="../../assets/images/empty@2x.png" alt="">
        <p>抱歉，暂时没有搜到您想要的房源哦！</p>
      </div>
    </div>
    <van-list v-else v-model="house.loading" :finished="house.finished" finished-text="已加载完毕" :error.sync="house.error" error-text="请求失败，点击重新加载" @load="getData">
      <div class="container">
        <van-row gutter="10" style="margin-top: 10px;">
          <van-col span="12" v-for="(item, index) in house.list" :key="index">
            <router-link tag="div" class="goods-style-1" :to="{name: 'goods', query: {id: item.id}}">
              <van-image lazy-load fit="cover" :src="item.avatar.split(',')[0]">
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
  name: 'category',
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
        list: []
      }
    }
  },
  computed: {
    title () {
      return this.$route.query.name
    }
  },
  created () {
  },
  methods: {
    getData () {
      this.$post(QUERY_BY_CONDITION_URL, {
        page: this.house.current,
        limit: this.house.limit,
        category: this.$route.query.id
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
    }
  },
  watch: {
    $route (to, from) {
      this.isEmpty = false
      this.house = {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        list: []
      }
      this.getData()
    }
  }
}
</script>

<style scoped>

</style>
