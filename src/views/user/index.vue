<template>
  <div id="page-user" class="tabbar-fix">
    <navbar :setting-show="true" bg-color="transparent" :border="false" :white-color="true" :back-show="false" style="position: absolute;"></navbar>
    <div class="user-info navbar-fix">
      <dl class="member">
        <dt>
          <van-image lazy-load round width="60px" height="60px" fit="cover" :src="userInfo.avatar || require('../../assets/images/avatar@2x.png')">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
        </dt>
        <dd v-if="userInfo.id">
          <h4>{{userInfo.username}}</h4>
          <router-link :to="{name: 'userSetting'}" tag="p">查看或修改我的账户</router-link>
        </dd>
        <dd v-else>
          <router-link :to="{name: 'account'}" tag="h4">登陆/注册</router-link>
          <router-link :to="{name: 'account'}" tag="p">请登录后查看更多信息</router-link>
        </dd>
      </dl>
      <van-row>
        <van-col span="6">
          <router-link :to="{name: 'concern'}" tag="div" class="item">{{userInfo.singleConcernTotal || 0}}<small>单房关注</small></router-link>
        </van-col>
        <van-col span="6">
          <router-link :to="{name: 'concern', query: {type: 1}}" tag="div" class="item">{{userInfo.categoryConcernTotal || 0}}<small>类别关注</small></router-link>
        </van-col>
        <van-col span="6">
          <router-link :to="{name: 'userNotice'}" tag="div" class="item">{{userInfo.messageTotal || 0}}<small>我的消息</small></router-link>
        </van-col>
        <van-col span="6">
          <router-link :to="{name: 'userHistory'}" tag="div" class="item">{{userInfo.viewsTotal || 0}}<small>浏览记录</small></router-link>
        </van-col>
      </van-row>
    </div>

    <div class="container">
      <div class="user-box">
        <div class="user-card">
          <div class="user-card-title">我的订单</div>
          <van-grid :border="false" :column-num="4" center>
            <van-grid-item :to="{name: item.path, query: {type: item.type}}" v-for="(item, index) in orderList" :key="index" :text="item.text" :icon="item.icon" />
          </van-grid>
          <div class="user-card-title">我的拍卖</div>
          <van-grid :border="false" :column-num="5" center>
            <van-grid-item :to="{name: item.path, query: {type: item.type}}" v-for="(item, index) in paimaiList" :key="index" :text="item.text" :icon="item.icon" />
          </van-grid>
        </div>
        <div class="user-card">
          <div class="user-card-title">工具与服务</div>
          <van-grid :border="false" :column-num="4" center>
            <van-grid-item :to="{name: item.path}" v-for="(item, index) in toolList" :key="index" :text="item.text" :icon="item.icon" />
          </van-grid>
        </div>
      </div>

      <div class="section-title">可能你喜欢</div>
      <goods-like></goods-like>
    </div>
  </div>
</template>

<script>
export default {
  name: 'user',
  computed: {
    userInfo () {
      console.log(this.$store.getters.getUserInfo)
      return this.$store.getters.getUserInfo || {}
    }
  },
  data () {
    return {
      orderList: [{
        text: '待付款',
        icon: require('../../assets/images/user-icon1@2x.png'),
        path: 'order',
        type: 0
      }, {
        text: '待发货',
        icon: require('../../assets/images/user-icon2@2x.png'),
        path: 'order',
        type: 1
      }, {
        text: '待收货',
        icon: require('../../assets/images/user-icon3@2x.png'),
        path: 'order',
        type: 2
      }, {
        text: '待评价',
        icon: require('../../assets/images/user-icon4@2x.png'),
        path: 'order',
        type: 3
      }],
      paimaiList: [{
        text: '待交保',
        icon: require('../../assets/images/user-icon6@2x.png'),
        path: 'auctionOrder',
        type: 0
      }, {
        text: '待开拍',
        icon: require('../../assets/images/user-icon7@2x.png'),
        path: 'auctionOrder',
        type: 1
      }, {
        text: '竞价中',
        icon: require('../../assets/images/user-icon8@2x.png'),
        path: 'auctionOrder',
        type: 2
      }, {
        text: '已结束',
        icon: require('../../assets/images/user-icon9@2x.png'),
        path: 'auctionOrder',
        type: 3
      }, {
        text: '已拍下',
        icon: require('../../assets/images/user-icon10@2x.png'),
        path: 'auctionOrder',
        type: 4
      }],
      toolList: [{
        text: '我的保证金',
        icon: 'balance-list-o'
      }, {
        text: '我的客服',
        icon: 'service-o'
      }, {
        text: '新手指南',
        icon: 'bookmark-o',
        path: 'thread'
      }, {
        text: '关于多宝',
        icon: 'records'
      }]
    }
  },
  created () {
    this.$store.dispatch('checkedLogin')
  }
}
</script>

<style scoped lang="less">
  .user-info {background: url(../../assets/images/user-bg@2x.png) no-repeat center;background-size: cover;color: #fff;padding-bottom: 35px;padding-left: 20px;padding-right: 20px;}
  .user-info dl {margin: 0 0 10px 0;overflow: hidden;}
  .user-info dt {float: left;font-size: 0;}
  .user-info dd {line-height: 20px;margin: 0 0 0 80px;padding: 8px 0;}
  .user-info dd h4 {margin: 0;font-size: 16px;font-weight: normal;}
  .user-info dd p {margin: 5px 0 0;font-size: 12px;opacity: 0.8;}
  .user-info .item {text-align: center;font-size: 16px;}
  .user-info .item small {display: block;font-size: 12px;}

  .user-card {padding: 15px 15px 0;border-bottom: 4px solid #f4f4f4;}
  .user-card:last-child {border-bottom: 0;}
  .user-card-title {margin-bottom: 15px;}
</style>
