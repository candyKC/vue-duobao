<template>
  <div id="page-service" class="navbar-fix">
    <navbar title="拍卖服务"></navbar>
    <div class="service-banner">
      <img src="../../assets/images/service-banner@2x.png" alt="">
    </div>
    <van-tabs v-model="active" sticky color="#D63C3C" :offset-top="46" @click="onTab">
      <van-tab title="律师尽调" />
      <van-tab title="委托看样" />
      <van-tab title="过户办证" />
      <van-tab title="拍卖资讯" />
    </van-tabs>
    <div class="container">
      <div class="empty" v-if="isEmpty">
        <img style="width: 265px;height: auto;" src="../../assets/images/empty@2x.png" alt="">
        <p>暂无服务</p>
      </div>
      <van-list v-model="service.loading" :finished="service.finished" finished-text="已加载完毕" :error.sync="service.error" error-text="请求失败，点击重新加载" @load="getData" v-else>
        <van-row gutter="10" style="margin-top: 10px;">
          <van-col span="12" v-for="(item, index) in service.list" :key="index">
            <router-link tag="div" :to="{name: 'serviceGoods', query: {id: item.id}}" class="goods-style-2">
              <van-image lazy-load fit="cover" :src="item.avatar.split(',')[0]">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
              <div class="text">
                <h4 class="van-ellipsis">{{item.name}}</h4>
                <div class="area">服务地区：{{item.province}}</div>
                <div class="van-ellipsis price">¥ {{item.price}}</div>
              </div>
            </router-link>
          </van-col>
        </van-row>
      </van-list>
    </div>
  </div>
</template>

<script>
import { SERVICE_LIST_URL } from '../../api'

export default {
  name: 'service',
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
      service: {
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
      this.$router.replace({ name: 'service', query: { type: index } })
    },
    getData () {
      this.$post(SERVICE_LIST_URL, {
        page: this.service.current,
        limit: this.service.limit,
        type: (parseInt(this.$route.query.type) || 0) + 1
      }).then((res) => {
        console.log(res)
        this.service.loading = false
        if (this.service.current === 1) {
          this.service.list = res.data.records
        } else {
          for (let i = 0; i < res.data.records.length; i++) {
            this.service.list.push(res.data.records[i])
          }
        }
        if (this.service.list.length >= res.data.total) {
          this.service.finished = true
        } else {
          this.service.current++
        }
        this.isEmpty = !parseInt(res.data.total)
      }).catch((err) => {
        console.log(err)
        this.service.error = true
      })
    }
  },
  watch: {
    $route (to, from) {
      this.isEmpty = false
      this.service = {
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
  .service-banner img {display: block;width: 100%;height: auto;}
</style>
