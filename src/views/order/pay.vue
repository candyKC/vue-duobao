<template>
  <div id="page-order-pay" class="tabbar-fix navbar-fix">
    <navbar title="确认订单"></navbar>

    <div class="container">
      <van-panel style="margin-top: 10px">
        <van-cell-group>
          <van-cell v-if="!address" title="请添加收货地址" is-link center :to="{name: 'userAddress'}" />
          <van-cell v-else :title="address.name + ' ' + address.tel" :label="address.province + address.city + address.county + address.detail" is-link center :to="{name: 'userAddress'}" />
        </van-cell-group>
      </van-panel>
      <template v-if="$route.params.type === 'shopcart'">
        <van-panel style="margin-top: 10px" v-for="(item, index) in cartInfo" :key="index">
          <template v-if="item.goodsInfo.onePrice">
          <van-card :desc="'面积：' + item.goodsInfo.size + 'm²'" :title="item.goodsInfo.name">
            <template slot="thumb">
              <van-image lazy-load fit="cover" :src="item.goodsInfo.avatar">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </template>
            <template slot="price">价格：¥ {{item.orderInfo.price}}</template>
          </van-card>
          </template>
          <template v-else>
            <van-card :desc="'地区：' + item.goodsInfo.province + item.goodsInfo.city" :title="item.goodsInfo.name">
              <template slot="thumb">
                <van-image lazy-load fit="cover" :src="item.goodsInfo.avatar">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </template>
              <template slot="price">价格：¥ {{item.orderInfo.price}}</template>
            </van-card>
          </template>
        </van-panel>
      </template>
      <template v-else>
        <template v-if="$route.params.type !== 'service'">
          <van-panel style="margin-top: 10px" v-if="info">
            <van-card :desc="'面积：' + info.size + 'm²'" :title="info.name">
              <template slot="thumb">
                <van-image lazy-load fit="cover" :src="info.avatar[0]">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </template>
              <template v-if="info.onePrice">
                <template slot="price">当前价：¥ {{info.currentPrice}}</template>
              </template>
              <template v-else>
                <template slot="price" v-if="$route.params.type === 'add-price'">加价：¥ {{info.step}}</template>
                <template slot="price" v-else>保证金：¥ {{info.securityMoney}}</template>
              </template>
              <template slot="origin-price">市场价：¥ {{info.marketPrice}}</template>
            </van-card>
            <div class="buy-tips van-hairline--top">
              <h4>购买须知：</h4>
              <p>1.拍卖的人数没有限制，在规定时间内交付了保证金的用户可以随时进行加价拍卖，时间截止后取最高价。</p>
              <p>2.交了当前商品的保证金只能拍对应的商品，如果拍卖其他商品则需要另交保证金</p>
              <p>3.交了保证金后的用户可以进行拍卖，每次加价金额为2万。</p>
            </div>
          </van-panel>
        </template>
        <template v-else>
          <van-panel style="margin-top: 10px" v-if="info">
            <van-card :desc="'地区：' + info.province + info.city" :title="info.name">
              <template slot="thumb">
                <van-image lazy-load fit="cover" :src="info.avatar[0]">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </template>
              <template slot="price">价格：¥ {{info.price}}</template>
            </van-card>
          </van-panel>
        </template>
      </template>
    </div>

    <template v-if="$route.params.type === 'shopcart'">
      <van-submit-bar :price="cartPrice * 100" button-text="确认支付" button-type="primary" @submit="onSubmit" />
    </template>
    <template v-else>
      <template v-if="$route.params.type !== 'service'">
        <van-submit-bar v-if="info.onePrice" :price="info.currentPrice * 100 || 0" button-text="确认支付" button-type="primary" @submit="onSubmit" />
        <van-submit-bar v-else :price="$route.params.type === 'add-price' ? info.step * 100 || 0 : info.securityMoney * 100 || 0" button-text="确认支付" button-type="primary" @submit="onSubmit" />
      </template>
      <template v-else>
        <van-submit-bar :price="info.price * 100 || 0" button-text="确认支付" button-type="primary" @submit="onSubmit" />
      </template>
    </template>

    <van-popup v-model="payPassShow" round position="bottom" :style="{ height: '80%' }">
      <div class="number-keyboard-title">支付密码<p>请输入支付密码，以验证身份</p></div>
      <van-password-input :value="payPass" gutter="5px" info="密码为 6 位数字" @focus="showKeyboard = true" />
      <van-number-keyboard :show="true" close-button-text="完成" :hide-on-click-outside="false" @input="onInput" @delete="onDelete" @close="onClose" safe-area-inset-bottom />
    </van-popup>
  </div>
</template>

<script>
import { ORDER_INFO_URL, ORDER_SIGNUP_URL, ORDER_ADDPRICE_URL, ORDER_ONEPRICEPAY_URL, ORDER_SERVICE_INFO_URL, ORDER_SERVICEPAY_URL, ORDER_CARTINFO_URL, ORDER_CARTPAY_URL } from '../../api'

export default {
  name: 'orderPay',
  computed: {
    userInfo () {
      return this.$store.getters.getUserInfo || {}
    }
  },
  data () {
    return {
      address: '',
      info: '',
      order: '',
      payPass: '',
      payPassShow: false,
      cartInfo: [],
      cartPrice: 0
    }
  },
  created () {
    if (this.userInfo.address) {
      this.address = JSON.parse(this.userInfo.address)
    }
    this.getOrder()
  },
  methods: {
    getOrder () {
      let url = this.$route.params.type === 'service' ? ORDER_SERVICE_INFO_URL : ORDER_INFO_URL
      if (this.$route.params.type === 'shopcart') {
        this.$post(ORDER_CARTINFO_URL, {
          ids: this.$route.params.id
        }).then((res) => {
          console.log(res)
          this.cartInfo = res.data
          this.totalPrice()
        })
      } else {
        this.$post(url + this.$route.params.id, {}).then((res) => {
          console.log(res)
          res.goodsInfo.avatar = res.goodsInfo.avatar.split(',')
          this.info = res.goodsInfo
          this.order = res.orderInfo
        })
      }
    },
    onSubmit () {
      if (!this.address) {
        this.$toast('请添加收货地址')
        return false
      }
      if (this.userInfo.payPasswordStatus) {
        if (this.payPass.length === 6) {
          let url = ''
          if (this.$route.params.type === 'one-price') {
            url = ORDER_ONEPRICEPAY_URL
          }
          if (this.$route.params.type === 'add-price') {
            url = ORDER_ADDPRICE_URL
          }
          if (this.$route.params.type === 'signup') {
            url = ORDER_SIGNUP_URL
          }
          if (this.$route.params.type === 'service') {
            url = ORDER_SERVICEPAY_URL
          }
          if (this.$route.params.type === 'shopcart') {
            let ids = []
            for (let i = 0; i < this.cartInfo.length; i++) {
              ids.push(this.cartInfo[i].orderInfo.id)
            }
            this.$post(ORDER_CARTPAY_URL, {
              ids: ids,
              payType: 3,
              payPassword: this.payPass
            }, {
              headers: {
                'Content-Type': 'application/json'
              }
            }).then((res) => {
              console.log(res)
              this.$router.replace({
                name: 'orderStatus',
                params: {
                  id: this.$route.params.id,
                  status: 'success',
                  type: this.$route.params.type
                }
              })
            }).catch((err) => {
              console.log(err)
              this.payPass = ''
            })
          } else {
            this.$post(url, {
              id: this.order.id,
              payType: 3,
              payPassword: this.payPass
            }).then((res) => {
              console.log(res)
              this.$router.replace({
                name: 'orderStatus',
                params: {
                  id: this.order.id,
                  status: 'success',
                  type: this.$route.params.type
                },
                query: {
                  id: this.info.id
                }
              })
            }).catch((err) => {
              console.log(err)
              this.payPass = ''
            })
          }
        } else {
          this.payPassShow = true
        }
      } else {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '请设置支付密码'
        }).then(() => {
          this.$router.push({
            name: 'userPaypass'
          })
        }).catch(() => {})
      }
    },
    onInput (key) {
      this.payPass = (this.payPass + key).slice(0, 6)
    },
    onDelete () {
      this.payPass = this.payPass.slice(0, this.payPass.length - 1)
    },
    onClose () {
      this.onSubmit()
      this.payPassShow = false
    },
    totalPrice () {
      let price = 0
      for (let i = 0; i < this.cartInfo.length; i++) {
        price += this.cartInfo[i].orderInfo.price
      }
      console.log(price)
      this.cartPrice = price
    }
  }
}
</script>

<style scoped lang="less">
  .van-panel__header {display: none;}

  .van-card {background-color: transparent;padding: 15px 16px;}
  .van-card__title {font-size: 14px;line-height: 20px;max-height: 40px;}
  .van-card__content {min-height: 76px;}
  .van-card__price {display: block;}
  .van-card__origin-price {display: block;margin: 0;text-decoration: none;}
  .van-card__thumb {height: 80px;border-radius: 3px;overflow: hidden;}
  .van-card__thumb .van-image {height: 80px;width: 100%;display: block;}

  .buy-tips {font-size: 12px;padding: 15px 16px;}
  .buy-tips h4 {margin: 0;}
  .buy-tips p {margin: 5px 0 0;color: #999;}

  .van-password-input__security li {border: 1px solid #eee;}
</style>
