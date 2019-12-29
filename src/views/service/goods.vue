<template>
  <div id="page-service-goods" class="tabbar-fix" v-if="goods">
    <navbar :cart-show="true" :notice-show="true" title="服务详情" :scroll="true"></navbar>

    <van-swipe :autoplay="3000" @change="onChangeSwipe" v-if="goods.avatar">
      <van-swipe-item v-for="(item, index) in goods.avatar" :key="index"><a href="javascript:;" :style="{backgroundImage: 'url('+ item +')'}"></a></van-swipe-item>
      <div class="custom-indicator" slot="indicator">
        {{ swipeIndex + 1 }} / {{goods.avatar.length}}
      </div>
    </van-swipe>

    <div class="goods-detail-title">
      <h1>{{goods.name}}</h1>
      <div class="price"><strong>¥ {{goods.price}}</strong></div>
    </div>

    <van-cell-group style="margin-bottom: 4px;">
      <van-cell>
        <van-row>
          <van-col span="8"><van-icon name="location-o" style="vertical-align: top;margin-top: 5px" /> {{goods.province + goods.city}}</van-col>
          <van-col span="8" style="text-align: center;">快递：免运费</van-col>
          <van-col span="8" style="text-align: right;">月销{{goods.saleByMonth}}</van-col>
        </van-row>
      </van-cell>
      <van-cell title="服务" value="45天发货 • 7天无理由" />
      <van-cell title="选择" :value="address ? address : '所在城市'" is-link @click="onAreaShow" />
    </van-cell-group>

    <van-cell-group style="margin-bottom: 4px;">
      <van-cell v-if="goods.questionList.length" is-link center>
        <div class="tiwen-title">大家的提问</div>
        <div class="tiwen-desc" v-for="(item, index) in goods.questionList.slice(0,1)" :key="index"><span>问：</span>{{item.question}}</div>
      </van-cell>
      <van-cell v-else>
        <van-button type="primary" plain round hairline size="small" class="tiwen-btn">去提问</van-button>
        <div class="tiwen-desc">还没有人提问哦，赶紧去提问吧</div>
      </van-cell>
    </van-cell-group>

    <div class="goods-detail-box">
      <div class="section-title">服务详情</div>
      <div style="margin: 0 -10px -15px;">
      <img src="../../assets/images/service-lc@2x.png" style="display: block;width: 100%;height: auto;" alt="">
      </div>
    </div>

    <div class="goods-detail-box" style="margin-bottom: 0;padding-bottom: 1px;">
      <div class="section-title">可能你喜欢</div>
      <goods-like></goods-like>
    </div>

    <van-popup v-model="areaShow" position="bottom">
      <van-area :area-list="areaList" :loading="areaLoading" :columns-num="2" @confirm="onAreaConfirm" />
    </van-popup>

    <van-goods-action safe-area-inset-bottom>
      <van-goods-action-icon icon="service-o" text="客服"/>
      <van-goods-action-button type="warning" @click="onAddCart" text="加入购物车" />
      <van-goods-action-button type="danger" @click="onBuy" text="立即购买" />
    </van-goods-action>
  </div>
</template>

<script>
import { SERVICE_DETAIL_URL, QUERY_REGIONLIST_URL, ORDER_SERVICE_URL, CART_ADD_URL } from '../../api'
import { Swipe, SwipeItem, GoodsAction, GoodsActionIcon, GoodsActionButton, Area } from 'vant'

export default {
  name: 'serviceGoods',
  components: {
    [SwipeItem.name]: SwipeItem,
    [Swipe.name]: Swipe,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionIcon.name]: GoodsActionIcon,
    [GoodsActionButton.name]: GoodsActionButton,
    [Area.name]: Area
  },
  computed: {
    userInfo () {
      return this.$store.getters.getUserInfo || {}
    }
  },
  data () {
    return {
      goods: null,
      swipeIndex: 0,
      areaList: {},
      areaShow: false,
      areaLoading: true,
      address: ''
    }
  },
  created () {
    this.getGoods()
  },
  methods: {
    getGoods () {
      this.$post(SERVICE_DETAIL_URL, {
        id: this.$route.query.id
      }).then((res) => {
        console.log(res)
        res.data.avatar = res.data.avatar.split(',')
        this.goods = res.data
      })
    },
    onChangeSwipe (index) {
      this.swipeIndex = index
    },
    onAreaShow () {
      this.areaShow = true
      if (this.areaList.county_list) return false
      this.$post(QUERY_REGIONLIST_URL, {}).then((res) => {
        this.areaList = res.data
        this.areaLoading = false
      })
    },
    onAreaConfirm (arr) {
      console.log(arr)
      let str = ''
      for (let i = 0; i < arr.length; i++) {
        str += arr[i].name
      }
      this.address = str
      this.areaShow = false
    },
    onBuy () {
      if (this.userInfo.balance < this.goods.price) {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '余额不足，请前往充值',
          confirmButtonText: '去充值'
        }).then(() => {
          this.$router.push({
            name: 'userRecharge'
          })
        }).catch(() => {})
        return false
      }
      this.$post(ORDER_SERVICE_URL, {
        goodsId: this.goods.id,
        address: this.address
      }).then((res) => {
        this.$router.push({
          name: 'orderPay',
          params: { 'id': res.orderId, 'type': 'service' }
        })
      }).catch((err) => {
        console.log(err)
        if (err.code === 1108) {
          this.$dialog.confirm({
            title: '温馨提示',
            message: err.msg
          }).then(() => {
            this.$router.push({
              name: 'account',
              query: { redirect: this.$route.fullPath }
            })
          }).catch(() => {})
        }
      })
    },
    onAddCart () {
      this.$post(CART_ADD_URL, {
        goodsId: this.goods.id,
        type: 1
      }).then((res) => {
        this.$toast('已加入购物车')
      }).catch((err) => {
        console.log(err)
        if (err.code === 1108) {
          this.$dialog.confirm({
            title: '温馨提示',
            message: err.msg
          }).then(() => {
            this.$router.push({
              name: 'account',
              query: { redirect: this.$route.fullPath }
            })
          }).catch(() => {})
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .van-swipe a {display: block;padding-top: 70%;width: 100%;background: no-repeat center;background-size: cover;}
  .custom-indicator {
    position: absolute;
    left: 50%;
    bottom: 10px;
    padding: 2px 5px;
    color: #fff;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    transform: translateX(-50%);
  }

  .goods-detail-title {background-color: #fff;padding: 15px 10px;position: relative;margin-bottom: 4px;}
  .goods-detail-title h1 {margin: 0;font-size: 16px;}
  .goods-detail-title .price {margin-top: 5px;font-size: 12px;}
  .goods-detail-title .price strong {font-size: 18px;color: #D63C3C;line-height: 1;}

  .goods-detail-box {background-color: #fff;padding: 15px 10px;margin-bottom: 4px;}

  .tiwen-btn {float: right;margin-top: 9px;}
  .tiwen-desc {font-size: 12px;color: #999;}
  .tiwen-desc span {color: #D63C3C;}

  .van-goods-action-button {height: 50px;border-radius: 0;margin: 0;line-height: 48px;}
</style>
