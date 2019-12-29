<template>
    <div id="page-goods" class="tabbar-fix" v-if="goods" :class="{'goods-herald': goods.status === 2}">
      <navbar :cart-show="true" :notice-show="true" :title="goods.onePrice ? '一口价详情' : '拍卖详情'" :scroll="true"></navbar>
      <van-swipe :autoplay="3000" @change="onChangeSwipe" v-if="goods.avatar">
        <van-swipe-item v-for="(item, index) in goods.avatar" :key="index"><a href="javascript:;" :style="{backgroundImage: 'url('+ item +')'}"></a></van-swipe-item>
        <div class="custom-indicator" slot="indicator">
          {{ swipeIndex + 1 }} / {{goods.avatar.length}}
        </div>
      </van-swipe>

      <div class="goods-detail-top clearfix" v-if="!goods.onePrice">
        <div class="set">
          <div class="timer" v-if="goods.status === 2">
            <span>开拍时间</span>
            <div class="van-count-down">
              <span style="width: auto;padding: 0 3px;">{{goods.gmtStart}}</span>
            </div>
          </div>
          <div class="timer" v-else>
            <span>距结束还剩</span>
            <van-count-down :time="goods.endTime">
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
        </div>
        <dl class="price">
          <dt v-if="goods.startPrice === goods.currentPrice">起拍价：</dt>
          <dt v-else>当前价：</dt>
          <dd>
            <strong>{{goods.currentPrice | $_moneyFormat}}</strong>
            <small>市场价 {{goods.marketPrice | $_moneyFormat}}</small>
          </dd>
        </dl>
      </div>

      <div class="goods-detail-title">
        <van-button icon="like" color="#999" size="small" v-if="goods.concern" @click="followCancel(goods.id)">取消</van-button>
        <van-button icon="like-o" type="primary" size="small" :color="goods.status === 2 ? '#129D5D' : ''" v-else @click="follow(goods.id)">关注</van-button>
        <div class="price" v-if="goods.onePrice"><span>价格：</span><strong>{{goods.currentPrice | $_moneyFormat}}</strong><small>市场价 {{goods.marketPrice | $_moneyFormat}}</small></div>
        <h1 v-if="!goods.onePrice">{{goods.saleTotal === 1 ? '【第一次拍卖】' : ''}}{{goods.name}}</h1>
        <h1 v-else>{{goods.name}}</h1>
        <p>
          <span>面积：{{goods.size}}m²</span>
          <span v-if="!goods.onePrice">{{goods.signupTotal}}人报名</span>
          <span><van-icon name="eye-o" size="12" /> {{goods.viewTotal}}人围观</span>
        </p>
      </div>
      <template v-if="goods.onePrice">
        <!--<van-row class="goods-detail-box" style="text-align: center;margin-top: -4px;padding-top: 0;">
          <van-col span="12"><van-icon name="good-job-o" size="20" style="vertical-align: top;" /> 4人赞过</van-col>
          <van-col span="12"><van-icon name="certificate" size="20" style="vertical-align: top;" /> 帮我选</van-col>
        </van-row>-->
        <van-cell-group style="margin-bottom: 4px;">
          <van-cell>
            <van-row>
              <van-col span="8"><van-icon name="location-o" style="vertical-align: top;margin-top: 5px" /> 陕西西安</van-col>
              <van-col span="8" style="text-align: center;">快递：免运费</van-col>
              <van-col span="8" style="text-align: right;">月销170</van-col>
            </van-row>
          </van-cell>
          <van-cell title="服务" value="45天发货 • 7天无理由" />
        </van-cell-group>
      </template>

      <van-cell-group v-if="goods.recordList && !goods.onePrice && goods.status !== 2" class="goods-detail-record">
        <van-cell title="拍卖记录" :value="goods.recordTotal" :icon="require('../../assets/images/goods-icon3@2x.png')" is-link :to="{name: 'goodsRecord', query: {id: goods.id}}" />
        <van-cell v-for="(item, index) in goods.recordList" :key="index" :label="item.gmtCreate" :class="{'t1': index === 0, 't2': index === 1, 't3': index === 2}" icon="user-o">
          {{item.price | $_moneyFormat}}
          <template slot="title">{{item.username}}
            <span class="tag" v-if="index === 0">领先</span>
            <span class="tag" v-else>淘汰</span>
          </template>
        </van-cell>
      </van-cell-group>

      <van-cell-group class="goods-detail-promise" v-if="!goods.onePrice">
        <van-cell class="tit">
          <van-row slot="title">
            <van-col span="8"><strong>保证金</strong>{{goods.securityMoney | $_moneyFormat}}</van-col>
            <van-col span="8" style="text-align: center;"><strong>加价幅度</strong>{{goods.step | $_moneyFormat}}</van-col>
            <van-col span="8" style="text-align: right;"><strong>延长周期</strong>{{goods.extendedCycle}}分钟</van-col>
          </van-row>
        </van-cell>
        <van-cell class="desc">
          <template slot="title">
            <p><span :style="{color: goods.status === 2 ? '#129D5D' : '#D63C3C'}">竞价规则：</span>一人报名且不低于起拍价，方可成交</p>
            <p><span :style="{color: goods.status === 2 ? '#129D5D' : '#D63C3C'}">处置单位：</span>招商银行城南支行</p>
            <p><span :style="{color: goods.status === 2 ? '#129D5D' : '#D63C3C'}">联系方式：400-888888</span></p>
          </template>
        </van-cell>
      </van-cell-group>

      <div class="goods-detail-box">
        <div class="section-title">拍卖服务<p>平台优选 &bull; 企业认证 &bull; 专业高效</p></div>
        <van-grid :border="false" :column-num="5" class="goods-detail-server">
          <van-grid-item :to="{name: 'service'}">
            <div class="item"><van-icon style="background-color: #DE7C47;" size="20" :name="require('../../assets/images/goods-icon8@2x.png')" />律师尽调</div>
          </van-grid-item>
          <van-grid-item :to="{name: 'service'}">
            <div class="item"><van-icon style="background-color: #4792DE;" size="20" :name="require('../../assets/images/goods-icon4@2x.png')" />委托看样</div>
          </van-grid-item>
          <van-grid-item :to="{name: 'service'}">
            <div class="item"><van-icon style="background-color: #27C39F;" size="20" :name="require('../../assets/images/goods-icon6@2x.png')" />过户办证</div>
          </van-grid-item>
          <van-grid-item :to="{name: 'service'}">
            <div class="item"><van-icon style="background-color: #AA60BC;" size="20" :name="require('../../assets/images/goods-icon5@2x.png')" />拍卖资讯</div>
          </van-grid-item>
          <van-grid-item :to="{name: 'service'}">
            <div class="item"><van-icon style="background-color: #EFBF3D;" size="20" :name="require('../../assets/images/goods-icon7@2x.png')" />我要贷款</div>
          </van-grid-item>
        </van-grid>
      </div>

      <div class="goods-detail-box">
        <div class="section-title" v-if="!goods.onePrice">拍卖须知<p>标的物情况表</p></div>
        <div class="section-title" v-else>房产详情<p>标的物情况表</p></div>
        <table class="goods-detail-table">
          <tr>
            <td style="width: 80px;text-align: center;">标的物介绍</td>
            <td>{{goods.goodsDetail.introduce}}</td>
          </tr>
          <tr>
            <td style="width: 80px;text-align: center;">房屋证号</td>
            <td>{{goods.goodsDetail.houseNumber}}</td>
          </tr>
          <tr>
            <td style="width: 80px;text-align: center;">土地证号</td>
            <td>{{goods.goodsDetail.landNumber}}</td>
          </tr>
          <tr>
            <td style="width: 80px;text-align: center;">标的物现状</td>
            <td>{{goods.goodsDetail.currentState}}</td>
          </tr>
          <tr>
            <td style="width: 80px;text-align: center;">情况说明</td>
            <td>{{goods.goodsDetail.specialStatement}}</td>
          </tr>
          <tr>
            <td style="width: 80px;text-align: center;">基础状况</td>
            <td>{{goods.goodsDetail.basicStatus}}</td>
          </tr>
          <tr>
            <td style="width: 80px;text-align: center;">配套设施</td>
            <td>{{goods.goodsDetail.matchSetting}}</td>
          </tr>
        </table>
      </div>

      <div class="goods-detail-box" v-if="!goods.onePrice">
        <div class="section-title">拍卖公告</div>
        <div class="goods-detail-gg" v-html="goods.goodsDetail.content"></div>
      </div>

      <van-cell-group v-if="!goods.onePrice">
        <van-cell title="优先购买人" value="无" />
      </van-cell-group>
      <div class="goods-detail-box" v-else style="margin-bottom: 0;padding-bottom: 1px;">
        <div class="section-title">可能你喜欢</div>
        <goods-like></goods-like>
      </div>

      <van-goods-action safe-area-inset-bottom>
        <van-goods-action-icon icon="service-o" text="客服"/>
        <van-goods-action-icon @click="onRemind" v-if="!goods.onePrice">
          <template v-if="goods.remind"><van-icon :name="require('../../assets/images/goods-icon1_a@2x.png')" slot="icon" />已提醒</template>
          <template v-else><van-icon :name="require('../../assets/images/goods-icon1@2x.png')" slot="icon" />提醒</template>
        </van-goods-action-icon>
        <van-goods-action-button :disabled="goods.endTime < 0" type="warning" @click="onAddCart" text="加入购物车" v-if="goods.onePrice" />
        <van-goods-action-button :disabled="goods.endTime < 0" type="danger" :color="goods.status === 2 ? '#129D5D' : ''" @click="onSignup" :text="goods.signUp ? '我要加价' : '提交保证金'"  v-if="!goods.onePrice" />
        <van-goods-action-button type="danger" @click="onBuy" text="立即购买" v-else />
      </van-goods-action>
    </div>
</template>

<script>
import { GOODS_DETAIL_URL, GOODS_AUCTION_URL, ORDER_ADDPRICEORDER_URL, CONCERN_SAVE_URL, CONCERN_DELETE_URL, REMIND_SAVE_URL, ORDER_ONEPRICE_URL, CART_ADD_URL, REMIND_CANCEL_URL } from '../../api'
import { Swipe, SwipeItem, GoodsAction, GoodsActionIcon, GoodsActionButton } from 'vant'
import filters from '../../mixin/filters'

export default {
  name: 'goods',
  mixins: [filters],
  components: {
    [SwipeItem.name]: SwipeItem,
    [Swipe.name]: Swipe,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionIcon.name]: GoodsActionIcon,
    [GoodsActionButton.name]: GoodsActionButton
  },
  computed: {
    userInfo () {
      return this.$store.getters.getUserInfo || {}
    }
  },
  data () {
    return {
      goods: null,
      swipeIndex: 0
    }
  },
  created () {
    this.getGoods()
  },
  methods: {
    getGoods () {
      this.goods = null
      this.$post(GOODS_DETAIL_URL, {
        id: this.$route.query.id
      }).then((res) => {
        console.log(res)
        this.goods = res.goodsInfo
        this.goods.avatar = this.goods.avatar.split(',')
        this.goods.endTime = parseInt(this.goods.endTime)
      })
    },
    onChangeSwipe (index) {
      this.swipeIndex = index
    },
    onSignup () {
      let amount = this.goods.signUp ? this.goods.step : this.goods.securityMoney
      if (this.userInfo.balance < amount) {
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
      if (this.userInfo.bidServiceStatus === false) {
        this.$router.push({
          name: 'goodsBidService',
          query: { 'goods-id': this.goods.id }
        })
      } else {
        let url = this.goods.signUp ? ORDER_ADDPRICEORDER_URL : GOODS_AUCTION_URL
        this.$post(url, {
          goodsId: this.$route.query.id
        }).then((res) => {
          this.$router.push({
            name: 'orderPay',
            params: { 'id': res.orderId, type: this.goods.signUp ? 'add-price' : 'signup' }
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
      }
    },
    onBuy () {
      if (this.userInfo.balance < this.goods.currentPrice) {
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
      if (this.userInfo.dbServiceStatus === false) {
        this.$router.push({
          name: 'goodsDbService',
          query: { 'goods-id': this.goods.id }
        })
      } else {
        this.$post(ORDER_ONEPRICE_URL, {
          goodsId: this.$route.query.id
        }).then((res) => {
          this.$router.push({
            name: 'orderPay',
            params: { 'id': res.orderId, 'type': 'one-price' }
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
      }
    },
    onRemind () {
      if (this.goods.remind) {
        this.$post(REMIND_CANCEL_URL, {
          goodsId: this.goods.id
        }).then((res) => {
          this.$toast('已取消提醒')
          this.goods.remind = false
        })
      } else {
        this.$post(REMIND_SAVE_URL, {
          goodsId: this.goods.id,
          type: 0
        }).then((res) => {
          this.$toast('已设置\n结束前会以消息形式提醒')
          this.goods.remind = true
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
    },
    follow (id) {
      console.log(id)
      this.$post(CONCERN_SAVE_URL, {
        goodsId: id
      }).then((res) => {
        this.$toast('已关注')
        this.goods.concern = true
        this.$store.commit('updateUserInfo', {
          singleConcernTotal: parseInt(this.userInfo.singleConcernTotal) + 1
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
    followCancel (id) {
      console.log(id)
      this.$post(CONCERN_DELETE_URL, {
        ids: id
      }).then((res) => {
        this.$toast('已取消关注')
        this.goods.concern = false
        this.$store.commit('updateUserInfo', {
          singleConcernTotal: parseInt(this.userInfo.singleConcernTotal) - 1
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    onAddCart () {
      this.$post(CART_ADD_URL, {
        goodsId: this.goods.id,
        type: 0
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
  },
  watch: {
    '$route': 'getGoods'
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

  .goods-detail-top {background-color: #f8dede;color: #D63C3C;}
  .goods-detail-top .price {padding: 10px;color: #fff;background: url(../../assets/images/goods-icon2@2x.png) no-repeat right center / cover;margin: 0 150px 0 0;overflow: hidden;}
  .goods-detail-top .price dt {float: left;font-size: 12px;line-height: 32px;}
  .goods-detail-top .price dd {margin-left: 50px;}
  .goods-detail-top .price dd strong {display: block;font-size: 16px;line-height: 1;}
  .goods-detail-top .price dd small {display: block;line-height: 1;font-size: 12px;margin-top: 4px;text-decoration: line-through;}
  .goods-detail-top .set {float: right;font-size: 12px;text-align: center;padding: 9px 0;}
  .goods-detail-top .set span {display: block;line-height: 1;}
  .goods-detail-top .timer {float: left;width: 150px;}
  .goods-detail-top .timer .van-count-down {font-size: 0;vertical-align: middle;line-height: 16px;margin-top: 6px;}
  .goods-detail-top .timer .van-count-down span {color: #fff !important;background-color: #000;border-radius: 3px;font-size: 12px;vertical-align: middle;line-height: 16px;display: inline-block;width: 21px;}
  .goods-detail-top .timer .van-count-down em {font-style: normal;display: inline-block;font-size: 12px;vertical-align: middle;margin: 0 5px;}
  .goods-detail-top .notice {float: left;}
  .goods-detail-top .notice .van-icon {font-size: 16px;margin-top: 6px;display: block;}

  .goods-detail-title {background-color: #fff;padding: 15px 70px 15px 10px;position: relative;margin-bottom: 4px;}
  .goods-detail-title h1 {margin: 0;font-size: 16px;}
  .goods-detail-title p {color: #999;margin: 5px 0 0;line-height: 12px;font-size: 0;}
  .goods-detail-title p span {display: inline-block;font-size: 12px;margin-right: 10px;margin-top: 5px;}
  .goods-detail-title p .van-icon {vertical-align: top;}
  .goods-detail-title .van-button {position: absolute;right: 0;top: 50%;transform: translateY(-50%);border-radius: 20px 0 0 20px;}
  .goods-detail-title .price {margin-bottom: 5px;font-size: 12px;}
  .goods-detail-title .price strong {font-size: 18px;color: #D63C3C;line-height: 1;}
  .goods-detail-title .price small {color: #999;font-size: 12px;margin-left: 10px;text-decoration: line-through;}

  .goods-detail-record {margin-bottom: 4px;}
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

  .goods-detail-promise {margin-bottom: 4px;}
  .goods-detail-promise .tit {font-size: 12px;color: #999;}
  .goods-detail-promise .tit strong {margin-right: 5px;color: #333;}
  .goods-detail-promise .desc {font-size: 12px;}
  .goods-detail-promise .desc p {margin: 0;}

  .goods-detail-box {background-color: #fff;padding: 15px 10px;margin-bottom: 4px;}

  .goods-detail-server .item {font-size: 12px;margin: -16px -8px;}
  .goods-detail-server .item i {display: block;width: 40px;height: 40px;border-radius: 3px;text-align: center;line-height: 40px;margin: 0 auto 5px;}

  .goods-detail-table {width: 100%;border-collapse: collapse;font-size: 12px;}
  .goods-detail-table td {border: 1px solid #eee;padding: 5px;}

  .goods-detail-gg {font-size: 12px;color: #666;}

  .van-goods-action-button {height: 50px;border-radius: 0;margin: 0;line-height: 48px;}

  .goods-herald .goods-detail-top {background-color: #d8eee3;}
  .goods-herald .goods-detail-top .set span {color: #129D5D;}
  .goods-herald .goods-detail-top .price {background-image: url(../../assets/images/goods-icon9@2x.png);}
</style>
