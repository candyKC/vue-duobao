<template>
  <div id="page-goods-record" class="navbar-fix">
    <navbar title="拍卖记录"></navbar>

    <div class="empty" v-if="isEmpty">
      <img style="width: 265px;height: auto;" src="../../assets/images/empty@2x.png" alt="">
      <p>暂时还没有拍卖记录</p>
    </div>
    <van-list v-model="record.loading" :finished="record.finished" finished-text="已加载完毕" :error.sync="record.error" error-text="请求失败，点击重新加载" @load="getData" v-else>
      <van-cell-group class="goods-detail-record">
        <van-cell v-for="(item, index) in record.list" :key="index" :label="item.gmtCreate" :class="{'t1': index === 0, 't2': index === 1, 't3': index >= 2}" icon="user-o">
          {{item.price | $_moneyFormat}}
          <template slot="title">{{item.username}}
            <span class="tag" v-if="index === 0">领先</span>
            <span class="tag" v-else>淘汰</span>
          </template>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import { GOODS_RECORD_LIST_URL } from '../../api'
import filters from '../../mixin/filters'

export default {
  name: 'goodsRecord',
  mixins: [filters],
  data () {
    return {
      isEmpty: false,
      record: {
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
    getData () {
      this.$post(GOODS_RECORD_LIST_URL, {
        page: this.record.current,
        limit: this.record.limit,
        goodsId: this.$route.query.id
      }).then((res) => {
        console.log(res)
        this.record.loading = false
        if (this.record.current === 1) {
          this.record.list = res.data.records
        } else {
          for (let i = 0; i < res.data.records.length; i++) {
            this.record.list.push(res.data.records[i])
          }
        }
        if (this.record.list.length >= res.data.total) {
          this.record.finished = true
        } else {
          this.record.current++
        }
        this.isEmpty = !parseInt(res.data.total)
      }).catch((err) => {
        console.log(err)
        this.record.error = true
      })
    }
  }
}
</script>

<style scoped title="">
  .goods-detail-record .t1 {color: #D63C3C;}
  .goods-detail-record .t1 .van-cell__value {color: #D63C3C;}
  .goods-detail-record .t1 .van-cell__label {color: #D63C3C;}
  .goods-detail-record .t2 {color: #666;}
  .goods-detail-record .t2 .van-cell__value {color: #666;}
  .goods-detail-record .t2 .van-cell__label {color: #666;}
  .goods-detail-record .t3 {color: #999;}
  .goods-detail-record .t3 .van-cell__value {color: #999;}
  .goods-detail-record .t3 .van-cell__label {color: #999;}
  .goods-detail-record .tag {margin-left: 10px;font-size: 12px;}
</style>
