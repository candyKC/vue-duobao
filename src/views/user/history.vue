<template>
  <div id="page-user-history" class="navbar-fix tabbar-fix">
    <navbar title="浏览记录" :edit-show="!isEdit" @edit="onEdit" @edit-complete="onEditComplete" :edit-complete-show="isEdit"></navbar>

    <div class="empty" v-if="isEmpty">
      <img style="width: 265px;height: auto;" src="../../assets/images/empty@2x.png" alt="">
      <p>没有任何浏览记录哦！</p>
    </div>
    <van-list v-model="history.loading" :finished="history.finished" finished-text="已加载完毕" :error.sync="history.error" error-text="请求失败，点击重新加载" @load="getDate" v-else>
      <ul class="goods-list" style="padding: 15px 10px;margin-top: 0;">
        <li v-for="(item, index) in history.list" :key="index">
          <router-link :to="{}">
            <div class="m">
              <van-image lazy-load fit="cover" :src="item.avatar.split(',')[0]">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </div>
            <div class="text">
              <h4 class="van-ellipsis">{{item.goodsName}}</h4>
              <div class="info">
                <span class="van-ellipsis">当前价：<strong>{{item.currentPrice | $_moneyFormat}}</strong></span>
                <span class="van-ellipsis">面积：{{item.size}}m²</span>
              </div>
              <div class="count">
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
              <van-checkbox v-model="item.checked" checked-color="#D63C3C" @change="checkedOne(item.id)" v-if="isEdit" />
            </div>
          </router-link>
        </li>
      </ul>
    </van-list>

    <van-submit-bar button-text="删除" safe-area-inset-bottom button-type="primary" @submit="onDelete" v-if="isEdit">
      <van-checkbox v-model="allChecked" checked-color="#D63C3C" style="margin-left: 15px;" @change="checkedAll">清空</van-checkbox>
      <div class="van-submit-bar__text"></div>
    </van-submit-bar>
  </div>
</template>

<script>
import { HISTORY_LIST_URL, HISTORY_DEL_URL, HISTORY_DELALL_URL } from '../../api'
import filters from '../../mixin/filters'

export default {
  name: 'userHistory',
  mixins: [filters],
  data () {
    return {
      isEdit: false,
      allChecked: false,
      isEmpty: false,
      history: {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        list: []
      },
      ids: []
    }
  },
  methods: {
    getDate () {
      this.$post(HISTORY_LIST_URL, {
        page: this.history.current,
        limit: this.history.limit,
        order: 'desc'
      }).then((res) => {
        console.log(res)
        this.history.loading = false
        if (this.history.current === 1) {
          this.history.list = res.data.records
        } else {
          for (let i = 0; i < res.data.records.length; i++) {
            this.history.list.push(res.data.records[i])
          }
        }
        if (this.history.list.length >= res.data.total) {
          this.history.finished = true
        } else {
          this.history.current++
        }
        this.isEmpty = !parseInt(res.data.total)
      }).catch((err) => {
        console.log(err)
        this.history.error = true
      })
    },
    onDelete () {
      let ids = this.ids.join(',')
      if (!ids.length && !this.allChecked) return false
      this.$dialog.confirm({
        title: '温馨提示',
        message: '确定删除记录'
      }).then(() => {
        if (this.allChecked) {
          this.$post(HISTORY_DELALL_URL, {}).then((res) => {
            console.log(res)
            this.isEmpty = true
            this.history = {
              loading: false,
              error: false,
              finished: false,
              current: 1,
              limit: 10,
              list: []
            }
            this.ids = []
          }).catch()
        } else {
          this.$post(HISTORY_DEL_URL, {
            ids: ids
          }).then((res) => {
            console.log(res)
            this.history.list = this.history.list.filter(item => this.ids.indexOf(item.id) === -1)
            this.ids = []
          }).catch()
        }
      }).catch(() => {
        // on cancel
      })
    },
    onEdit () {
      this.isEdit = true
    },
    onEditComplete () {
      this.isEdit = false
    },
    checkedOne (id) {
      let index = this.ids.indexOf(id)
      if (index >= 0) {
        this.ids.splice(index, 1)
      } else {
        this.ids.push(id)
      }
    },
    checkedAll () {
    }
  }
}
</script>

<style scoped lang="less">
   .goods-list .van-checkbox {float: right;margin-top: 8px;}
</style>
