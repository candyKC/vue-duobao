<template>
    <div id="page-user-notice" class="navbar-fix">
      <navbar title="消息通知"></navbar>

      <van-cell-group style="margin-top: -1px;" v-if="message.length">
        <van-cell v-for="(item, index) in message" :key="index" :to="{name: 'userNoticeType', query: {id: item.type}}" :label="item.content">
          <div slot="icon" :class="'van-cell__left-icon i' + item.type" v-if="item.type === 1">
            <span v-if="!item.read"></span>
            <van-icon name="logistics" />
          </div>
          <div slot="icon" :class="'van-cell__left-icon i' + item.type" v-if="item.type === 2">
            <span v-if="!item.read"></span>
            <van-icon name="pending-payment" />
          </div>
          <div slot="icon" :class="'van-cell__left-icon i' + item.type" v-if="item.type === 3">
            <span v-if="!item.read"></span>
            <van-icon name="apps-o" />
          </div>
          <div class="tt" slot="title"><span>{{item.gmtCreate}}</span>{{item.typeName}}</div>
        </van-cell>
      </van-cell-group>
    </div>
</template>

<script>
import { MESSAGE_TYPE_URL } from '../../api'

export default {
  name: 'userNotice',
  data () {
    return {
      message: []
    }
  },
  created () {
    this.$post(MESSAGE_TYPE_URL, {}).then((res) => {
      console.log(res)
      this.message = res.data
    }).catch(() => {})
  }
}
</script>

<style scoped lang="less">
  .van-cell__left-icon {width: 45px;height: 45px;text-align: center;border-radius: 3px;font-size: 26px;margin-right: 10px;position: relative;}
  .van-cell__left-icon span {width: 10px;height: 10px;position: absolute;right: 0;top: 0;background-color: #D63C3C;border-radius: 50%;margin: -3px -3px 0 0;}
  .van-cell__left-icon .van-icon {line-height: 45px;}
  .van-cell .van-cell__left-icon.i1 {background-color: #3BD18C;color: #fff;}
  .van-cell .van-cell__left-icon.i2 {background-color: #E57D30;color: #fff;}
  .van-cell .van-cell__left-icon.i3 {background-color: #DD6EDD;color: #fff;}
  .van-cell__value {flex: none;font-size: 12px;}
  .tt span {float: right;font-size: 12px;color: #999;}
</style>
