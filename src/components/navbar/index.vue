<template>
  <van-nav-bar fixed :z-index="100" :style="{backgroundColor: bgColor}" :class="{'no-hairline--bottom': !border, 'navbar-white': whiteColor, 'header-scrool': scrollHeader}">
    <template slot="left">
      <span @click="back" class="icon" v-if="backShow"><van-icon name="arrow-left" size="20" /></span>
      <router-link v-if="cityShow" :to="{}" class="text van-ellipsis"><!--<van-icon name="arrow-down" style="float: right;line-height: 46px;" size="12" />-->西安</router-link>
    </template>
    <template slot="title">
      {{title}}
      <van-search v-if="searchShow" placeholder="请输入搜索关键词" shape="round" :clearable="false" v-model="searchValue" @search="onSearch" />
    </template>
    <template slot="right">
      <router-link :to="{name: 'cart'}" tag="span" class="icon" v-if="cartShow"><van-icon name="cart-o" size="20" /></router-link>
      <router-link :to="{name: 'userNotice'}" tag="span" class="icon" v-if="noticeShow"><van-icon name="comment-o" size="20" /></router-link>
      <span class="icon" v-if="editShow" @click="onEdit"><van-icon name="edit" size="20" /></span>
      <span class="icon" v-if="editCompleteShow" @click="onEditComplete">完成</span>
      <router-link :to="{name: 'userSetting'}" tag="span" class="icon" v-if="settingShow"><van-icon name="setting-o" size="20" /></router-link>
    </template>
  </van-nav-bar>
</template>

<script>
import { Search } from 'vant'

export default {
  name: 'navbar',
  components: {
    [Search.name]: Search
  },
  props: {
    title: String,
    searchShow: {
      type: Boolean,
      default: false
    },
    cityShow: {
      type: Boolean,
      default: false
    },
    cartShow: {
      type: Boolean,
      default: false
    },
    noticeShow: {
      type: Boolean,
      default: false
    },
    settingShow: {
      type: Boolean,
      default: false
    },
    backShow: {
      type: Boolean,
      default: true
    },
    bgColor: {
      type: String,
      default: '#fff'
    },
    border: {
      type: Boolean,
      default: true
    },
    whiteColor: {
      type: Boolean,
      default: false
    },
    editShow: {
      type: Boolean,
      default: false
    },
    editCompleteShow: {
      type: Boolean,
      default: false
    },
    scroll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      searchValue: '',
      scrollHeader: this.scroll
    }
  },
  created () {
    if (this.$route.query.search) {
      this.searchValue = this.$route.query.keywords
    }
    if (this.scroll) {
      document.addEventListener('scroll', () => {
        let top = document.documentElement.scrollTop
        this.scrollHeader = top <= 100
      })
    }
  },
  methods: {
    back () {
      this.$router.back(-1)
    },
    onSearch () {
      if (this.$route.query.search) {
        this.$router.replace({
          name: 'auction',
          query: {
            search: 1,
            keywords: this.searchValue
          }
        })
      } else {
        this.$router.push({
          name: 'auction',
          query: {
            search: 1,
            keywords: this.searchValue
          }
        })
      }
    },
    onEdit () {
      this.$emit('edit')
    },
    onEditComplete () {
      this.$emit('edit-complete')
    }
  },
  watch: {
    $route (to, from) {
      if (this.$route.query.search) {
        this.searchValue = this.$route.query.keywords
      } else {
        this.searchValue = ''
      }
    }
  }
}
</script>

<style lang="less">
  .header-scrool {background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0)) transparent !important;}
  .header-scrool .van-nav-bar__title {opacity: 0;}
  .header-scrool .van-icon {color: #fff !important;}
  .header-scrool .van-nav-bar__title {color: #fff !important;}
  .header-scrool:after {display: none !important;}

  .van-nav-bar .text {display: block;width: 50px;text-align: left;}
  .van-nav-bar .icon {display: inline-block;vertical-align: middle;}
  .van-nav-bar .van-icon {color: #333;}
  .van-nav-bar .van-icon-arrow-down {color: #999;}
  .van-nav-bar__right .icon {margin-left: 10px;}
  .van-nav-bar__title {max-width: none;margin: 0 70px;}
  .van-search {padding: 6px 10px;font-weight: normal;}

  .no-hairline--bottom:after {display: none;}

  .navbar-white .van-icon {color: #fff;}
  .navbar-white .van-nav-bar__title {color: #fff;}
</style>
