<template>
  <div id="page-cart" class="navbar-fix">
    <navbar title="购物车"></navbar>

    <div class="container">
      <template v-if="userInfo.id">
        <div class="empty" v-if="isEmpty">
          <img style="width: 265px;height: auto;" src="../../assets/images/empty@2x.png" alt="">
          <p>抱歉，没有任何商品哦！</p>
        </div>
        <van-list v-model="cart.loading" :finished="cart.finished" finished-text="已加载完毕" :error.sync="cart.error" error-text="请求失败，点击重新加载" @load="getData" v-else>
          <div class="van-card" v-for="(item, index) in cart.list" :key="index">
            <van-checkbox v-model="item.isChecked" :disabled="!item.active" checked-color="#D63C3C" @change="onCheckbox()"></van-checkbox>
            <div class="van-card__header">
              <a class="van-card__thumb">
                <van-image lazy-load fit="cover" :src="item.avatar">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </a>
              <div class="van-card__content">
                <div class="van-card__title">{{item.goodsName}}</div>
                <div class="van-card__desc van-ellipsis" v-if="item.type === 1">所在城市：{{item.address}}</div>
                <div class="van-card__desc van-ellipsis" v-else>面积：{{item.size}}m²</div>
                <div class="van-card__bottom">
                  <van-icon name="delete" size="18" @click="onDelete(index, item.id)" style="float: right;" />
                  <div class="van-card__price">¥ {{item.price}}</div>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </template>
      <div class="empty" v-else>
        <img style="width: 265px;height: auto;" src="../../assets/images/empty@2x.png" alt="">
        <van-button round type="primary" style="width: 140px;margin-top: 30px;" :to="{name: 'account'}">登陆/注册</van-button>
      </div>
    </div>

    <van-submit-bar :price="cartPrice * 100" :disabled="disabled" @submit="onSubmit" button-text="结算" safe-area-inset-bottom v-if="userInfo.id">
      <van-checkbox v-model="allChecked" @click="onAllCheckbox" checked-color="#D63C3C">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>

<script>
import { CART_LIST_URL, ORDER_CART_URL, CART_DELETE_URL } from '../../api'

export default {
  name: 'cart',
  computed: {
    userInfo () {
      return this.$store.getters.getUserInfo || {}
    },
    disabled () {
      let flag = 0
      for (let i = 0; i < this.cart.list.length; i++) {
        if (this.cart.list[i].isChecked) {
          flag++
        }
      }
      return !flag
    }
  },
  data () {
    return {
      result: [],
      allChecked: false,
      isEmpty: false,
      cart: {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        list: []
      },
      cartPrice: 0
    }
  },
  methods: {
    getData () {
      this.$post(CART_LIST_URL, {
        page: this.cart.current,
        limit: this.cart.limit
      }).then((res) => {
        console.log(res.data)
        this.cart.loading = false
        if (this.cart.current === 1) {
          this.cart.list = res.data.records
        } else {
          for (let i = 0; i < res.data.records.length; i++) {
            this.cart.list.push(res.data.records[i])
          }
        }
        for (let i = 0; i < this.cart.list.length; i++) {
          if (this.cart.list[i].active) {
            this.$set(this.cart.list[i], 'isChecked', true)
          } else {
            this.$set(this.cart.list[i], 'isChecked', false)
          }
        }
        if (this.cart.list.length >= res.data.total) {
          this.cart.finished = true
        } else {
          this.cart.current++
        }
        this.setAllCheckbox()
        this.totalPrice()
        this.isEmpty = !parseInt(res.data.total)
      }).catch((err) => {
        console.log(err)
        this.cart.error = true
      })
    },
    totalPrice () {
      let price = 0
      for (let i = 0; i < this.cart.list.length; i++) {
        if (this.cart.list[i].isChecked) {
          price += parseFloat(this.cart.list[i].price)
        }
      }
      this.cartPrice = price
    },
    setAllCheckbox () {
      let checked = false
      for (let i = 0; i < this.cart.list.length; i++) {
        checked = this.cart.list[i].isChecked
        if (!checked) break
      }
      this.allChecked = checked
    },
    onCheckbox () {
      this.setAllCheckbox()
      this.totalPrice()
    },
    onAllCheckbox () {
      for (let i = 0; i < this.cart.list.length; i++) {
        if (this.cart.list[i].active) {
          this.$set(this.cart.list[i], 'isChecked', !this.allChecked)
        }
      }
      this.totalPrice()
    },
    onSubmit () {
      if (this.userInfo.balance < this.cartPrice) {
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
      let data = []
      for (let i = 0; i < this.cart.list.length; i++) {
        if (this.cart.list[i].isChecked) {
          data.push({
            id: this.cart.list[i].id,
            goodsId: this.cart.list[i].goodsId,
            type: this.cart.list[i].type,
            quantity: this.cart.list[i].quantity
          })
        }
      }
      console.log(data)
      this.$post(ORDER_CART_URL, {
        carts: data
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        this.$router.push({
          name: 'orderPay',
          params: { 'id': res.orderId.join(','), 'type': 'shopcart' }
        })
      })
    },
    onDelete (index, id) {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '确定删除该商品吗？'
      }).then(() => {
        this.$post(CART_DELETE_URL, {
          ids: id
        }).then((res) => {
          this.cart.list.splice(index, 1)
          this.setAllCheckbox()
          this.totalPrice()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang="less">
  .van-card {background-color: #fff;border-radius: 5px;margin: 10px 0;padding: 15px;}
  .van-card .van-checkbox {margin-right: 10px;float: left;margin-top: 20px;}
  .van-card__header {margin-left: 30px;}
  .van-card__thumb {width: 90px;border-radius: 3px;overflow: hidden;height: 60px;}
  .van-card__thumb .van-image {width: 100%;height: 100%;}
  .van-card__title {font-size: 14px;line-height: 20px;max-height: 40px;}
  .van-card__content {min-height: 60px;}

  .van-submit-bar__bar .van-checkbox {margin-left: 15px;}
</style>
