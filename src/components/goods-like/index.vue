<template>
  <van-row gutter="10" style="margin-bottom: 10px;">
    <van-col span="12" v-for="(item, index) in list" :key="index">
      <router-link tag="div" class="goods-style-1" :to="{name: 'goods', query: {id: item.id}}">
        <van-image lazy-load fit="cover" :src="item.avatar[0]">
          <template v-slot:loading>
            <van-loading type="spinner" size="20" />
          </template>
        </van-image>
        <div class="text">
          <h4 class="van-ellipsis">{{item.name}}</h4>
          <div class="van-ellipsis info"><van-tag mark type="danger">起拍价</van-tag><strong>{{item.currentPrice | $_moneyFormat}}</strong></div>
          <div class="views"><span>{{item.size}}m²</span><van-icon name="eye-o" size="12" /> {{item.view}}人围观</div>
        </div>
      </router-link>
    </van-col>
  </van-row>
</template>

<script>
import { QUERY_BY_CONDITION_URL } from '../../api'
import filters from '../../mixin/filters'

export default {
  name: 'goodsLike',
  mixins: [filters],
  data () {
    return {
      list: []
    }
  },
  created () {
    this.$post(QUERY_BY_CONDITION_URL, {
      page: 1,
      limit: 10
    }).then((res) => {
      for (let i = 0; i < res.goodsList.records.length; i++) {
        res.goodsList.records[i].avatar = res.goodsList.records[i].avatar.split(',')
      }
      this.list = res.goodsList.records
    })
  }
}
</script>

<style scoped lang="less">
</style>
