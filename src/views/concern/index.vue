<template>
  <div id="page-concern" class="navbar-fix tabbar-fix">
    <navbar :back-show="false" :cart-show="true" :notice-show="true" title="关注上新"></navbar>
    <van-tabs v-model="active" sticky color="#D63C3C" :offset-top="46" line-width="30" line-height="2" @click="onTab" @disabled="onTabsDisabled">
      <van-tab title="单个房源" :disabled="!userInfo.id">
        <div class="empty" v-if="concern.isEmpty">
          <img style="width: 265px;height: auto;" src="../../assets/images/empty@2x.png" alt="">
          <p>抱歉，没有任何关注哦！</p>
        </div>
        <van-list v-else v-model="concern.loading" :finished="concern.finished" finished-text="已加载完毕" :error.sync="concern.error" error-text="请求失败，点击重新加载" @load="getSingle">
        <ul class="goods-list concern-single container">
          <router-link tag="li" :to="{name: 'goods', query: {id: item.goodsId}}" v-for="(item, index) in concern.list" :key="index">
            <div class="m">
              <van-image lazy-load fit="cover" :src="item.avatar.split(',')[0]">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </div>
            <div class="text">
              <h4 class="van-ellipsis"><van-button color="#999" plain hairline size="mini" @click.stop="followSingleCancel(item.goodsId, item)">已关注</van-button>{{item.goodsName}}</h4>
              <div class="info">
                <span class="van-ellipsis">当前价：<strong>{{item.currentPrice | $_moneyFormat}}</strong></span>
                <span class="van-ellipsis">面积：{{item.size}}m²</span>
              </div>
              <div class="progress">
                <span class="van-ellipsis">{{item.totalSignup}}人报名</span>
                <em><i :style="{width: item.totalSignup / 3000 * 100 + '%'}"></i></em>
              </div>
              <div class="views"><van-icon name="eye-o" size="12" /> {{item.totalViews}}人围观</div>
            </div>
          </router-link>
        </ul>
        </van-list>
      </van-tab>
      <van-tab title="关注类别" :disabled="!userInfo.id">
        <div class="empty" v-if="category.isEmpty">
          <img style="width: 265px;height: auto;" src="../../assets/images/empty@2x.png" alt="">
          <p>抱歉，没有任何关注哦！</p>
        </div>
        <van-list v-else v-model="category.loading" :finished="category.finished" finished-text="已加载完毕" :error.sync="category.error" error-text="请求失败，点击重新加载" @load="getCategory">
        <div class="concern-category">
          <dl class="van-hairline--bottom" v-for="(item, index) in category.list" :key="index">
            <dt>
              <van-button color="#999" plain hairline size="mini" @click="followCancel(item.id, item)">已关注</van-button>
              <van-icon :name="item.icon" size="24" />{{item.name}}
            </dt>
            <router-link tag="dd" :to="{name: 'category', query: {id: item.id, name: item.name}}">
              <van-row gutter="5">
                <van-col span="6" v-for="(item2, index2) in item.goodsList.slice(0,4)" :key="index2">
                  <div class="m">
                    <van-image lazy-load fit="cover" :src="item2.avatar.split(',')[0]">
                      <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                      </template>
                    </van-image>
                  </div>
                  <p class="van-ellipsis">价格：<strong>{{item2.currentPrice | $_moneyFormat}}</strong></p>
                </van-col>
              </van-row>
            </router-link>
          </dl>
        </div>
        </van-list>
      </van-tab>
      <van-tab title="推荐类别">
        <div class="empty" v-if="recommend.isEmpty">
          <img style="width: 265px;height: auto;" src="../../assets/images/empty@2x.png" alt="">
          <p>抱歉，没有任何关注哦！</p>
        </div>
        <van-list v-model="recommend.loading" :finished="recommend.finished" finished-text="已加载完毕" :error.sync="recommend.error" error-text="请求失败，点击重新加载" @load="getRecommend">
          <div class="concern-category">
            <dl class="van-hairline--bottom" v-for="(item, index) in recommend.list" :key="index">
              <dt>
                <van-button type="primary" plain hairline size="mini" @click="follow(item.id, item)">关注</van-button>
                <van-icon :name="item.icon" size="24" />{{item.name}}
              </dt>
              <router-link tag="dd" :to="{name: 'category', query: {id: item.id, name: item.name}}">
                <van-row gutter="5">
                  <van-col span="6" v-for="(item2, index2) in item.goodsList.slice(0,4)" :key="index2">
                    <div class="m">
                      <van-image lazy-load fit="cover" :src="item2.avatar.split(',')[0]">
                        <template v-slot:loading>
                          <van-loading type="spinner" size="20" />
                        </template>
                      </van-image>
                    </div>
                    <p class="van-ellipsis">价格：<strong>{{item2.currentPrice | $_moneyFormat}}</strong></p>
                  </van-col>
                </van-row>
              </router-link>
            </dl>
          </div>
        </van-list>
      </van-tab>
    </van-tabs>

    <!--<div class="container" v-if="!userInfo.id">
      <div class="empty">
        <img style="width: 265px;height: auto;" src="../../assets/images/empty@2x.png" alt="">
        <van-button round type="primary" style="width: 140px;margin-top: 30px;" :to="{name: 'account'}">登陆/注册</van-button>
      </div>
    </div>-->

    <van-action-sheet cancel-text="取消" round safe-area-inset-bottom v-model="show" :actions="actions" @select="onSelect" />
  </div>
</template>

<script>
import { CONCERN_LIST_URL, CATEGORY_LIST_URL, CONCERN_TYPE_URL, CONCERN_TYPE_CANCEL_URL, CONCERN_DELETE_URL } from '../../api'
import filters from '../../mixin/filters'

export default {
  name: 'concern',
  mixins: [filters],
  computed: {
    active: {
      get () {
        return parseInt(this.$route.query.type) || 0
      },
      set () {}
    },
    userInfo () {
      return this.$store.getters.getUserInfo || {}
    }
  },
  data () {
    return {
      concern: {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        list: [],
        isEmpty: false
      },
      category: {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        list: [],
        isEmpty: false
      },
      recommend: {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        list: [],
        isEmpty: false
      },
      show: false,
      actions: [
        { subname: '取消关注', className: 'action-subname' },
        { name: '确认', color: '#D63C3C', id: null, item: null, type: false }
      ]
    }
  },
  created () {
  },
  methods: {
    onTab (index) {
      this.$router.replace({ name: 'concern', query: { type: index } })
    },
    getSingle () {
      this.$post(CONCERN_LIST_URL, {
        page: this.concern.current,
        limit: this.concern.limit,
        single: 1
      }).then((res) => {
        console.log(res.data)
        this.concern.loading = false
        if (this.concern.current === 1) {
          this.concern.list = res.data.records
        } else {
          for (let i = 0; i < res.data.records.length; i++) {
            this.concern.list.push(res.data.records[i])
          }
        }
        if (this.concern.list.length >= res.data.total) {
          this.concern.finished = true
        } else {
          this.concern.current++
        }
        this.concern.isEmpty = !parseInt(res.data.total)
      }).catch((err) => {
        console.log(err)
        this.concern.error = true
      })
    },
    getCategory () {
      this.$post(CATEGORY_LIST_URL, {
        page: this.category.current,
        limit: this.category.limit,
        concern: 1
      }).then((res) => {
        console.log(res.data)
        this.category.loading = false
        if (this.category.current === 1) {
          this.category.list = res.data.records
        } else {
          for (let i = 0; i < res.data.records.length; i++) {
            this.category.list.push(res.data.records[i])
          }
        }
        if (this.category.list.length >= res.data.total) {
          this.category.finished = true
        } else {
          this.category.current++
        }
        this.category.isEmpty = !parseInt(res.data.total)
      }).catch((err) => {
        console.log(err)
        this.category.error = true
      })
    },
    getRecommend () {
      this.$post(CATEGORY_LIST_URL, {
        page: this.recommend.current,
        limit: this.recommend.limit
      }).then((res) => {
        console.log(res.data)
        this.recommend.loading = false
        if (this.recommend.current === 1) {
          this.recommend.list = res.data.records
        } else {
          for (let i = 0; i < res.data.records.length; i++) {
            this.recommend.list.push(res.data.records[i])
          }
        }
        if (this.recommend.list.length >= res.data.total) {
          this.recommend.finished = true
        } else {
          this.recommend.current++
        }
        this.recommend.isEmpty = !parseInt(res.data.total)
      }).catch((err) => {
        console.log(err)
        this.recommend.error = true
      })
    },
    follow (id, item) {
      this.$post(CONCERN_TYPE_URL, {
        type: id
      }).then((res) => {
        this.$toast('已关注')
        this.$store.commit('updateUserInfo', {
          categoryConcernTotal: parseInt(this.userInfo.categoryConcernTotal) + 1
        })
        let index = this.recommend.list.indexOf(item)
        if (index > -1) {
          this.recommend.list.splice(index, 1)
          this.category.list.push(item)
        }
        this.recommend.isEmpty = !this.recommend.list.length
        this.category.isEmpty = !this.category.list.length
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
    followCancel (id, item) {
      console.log(id, item)
      this.show = true
      this.actions[1].id = id
      this.actions[1].item = item
      this.actions[1].type = true
    },
    followSingleCancel (id, item) {
      console.log(id, item)
      this.show = true
      this.actions[1].id = id
      this.actions[1].item = item
      this.actions[1].type = false
    },
    onSelect (item) {
      console.log(item)
      let url = ''
      let data = {}
      if (item.type) {
        url = CONCERN_TYPE_CANCEL_URL
        data.type = item.id
      } else {
        url = CONCERN_DELETE_URL
        data.ids = item.id
      }
      this.show = false
      this.$post(url, data).then((res) => {
        if (item.type) {
          let index = this.category.list.indexOf(item.item)
          if (index > -1) {
            this.category.list.splice(index, 1)
            this.recommend.list.push(item.item)
          }
          this.category.isEmpty = !this.category.list.length
          this.recommend.isEmpty = !this.recommend.list.length

          this.$store.commit('updateUserInfo', {
            categoryConcernTotal: parseInt(this.userInfo.categoryConcernTotal) - 1
          })
        } else {
          let index = this.concern.list.indexOf(item.item)
          if (index > -1) {
            this.concern.list.splice(index, 1)
          }
          this.concern.isEmpty = !this.concern.list.length

          this.$store.commit('updateUserInfo', {
            singleConcernTotal: parseInt(this.userInfo.singleConcernTotal) - 1
          })
        }
      }).catch((err) => {
        this.show = false
        console.log(err)
      })
    },
    onTabsDisabled () {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '未登录，请登录账户'
      }).then(() => {
        this.$router.push({
          name: 'account',
          query: { redirect: this.$route.fullPath }
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang="less">
  .concern-single .m {width: 82px;height: 82px;}
  .concern-single .text {margin-left: 92px;}
  .concern-single .text h4 .van-button {float: right;}
  .concern-single .text .progress span {width: 80px;}
  .concern-single .text .progress em {margin-right: 90px;}

  .concern-category {padding: 0 10px;}
  .concern-category dl {margin: 0;padding: 15px 0;}
  .concern-category dt {line-height: 24px;}
  .concern-category dt .van-button {float: right;margin-top: 1px;}
  .concern-category dt .van-icon {vertical-align: top;margin-right: 8px;}
  .concern-category dd {margin: 10px 0 0;}
  .concern-category dd a {display: block;}
  .concern-category dd .m {position: relative;height: 0;padding-top: 100%;}
  .concern-category dd .van-image {position: absolute;left: 0;top: 0;width: 100%;height: 100%;border-radius: 3px;overflow: hidden;}
  .concern-category dd p {margin: 5px 0 0;font-size: 12px;text-align: center;}
  .concern-category dd p strong {color: #D63C3C;}
</style>
