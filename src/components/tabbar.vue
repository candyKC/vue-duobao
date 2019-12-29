<template>
  <van-tabbar v-model="active" active-color="#D63C3C" :z-index="9" safe-area-inset-bottom>
    <van-tabbar-item v-for="(item, index) in tabbar" :key="index" :to="item.path" :replace="item.replace">
      <span>{{item.name}}</span>
      <img slot="icon" slot-scope="props" :src="props.active ? item.icon.active : item.icon.normal" />
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant'

export default {
  name: 'tabbar',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  data () {
    return {
      active: '',
      tabbar: [{
        name: '首页',
        path: {
          name: 'index'
        },
        icon: {
          normal: require('../assets/images/tabbar_icon1@2x.png'),
          active: require('../assets/images/tabbar_icon1_a@2x.png')
        },
        replace: true
      }, {
        name: '关注上新',
        path: {
          name: 'concern'
        },
        icon: {
          normal: require('../assets/images/tabbar_icon2@2x.png'),
          active: require('../assets/images/tabbar_icon2_a@2x.png')
        },
        replace: false
      }, {
        name: '拍卖提醒',
        path: {
          name: 'remind'
        },
        icon: {
          normal: require('../assets/images/tabbar_icon3@2x.png'),
          active: require('../assets/images/tabbar_icon3_a@2x.png')
        },
        replace: false
      }, {
        name: '我的',
        path: {
          name: 'user'
        },
        icon: {
          normal: require('../assets/images/tabbar_icon4@2x.png'),
          active: require('../assets/images/tabbar_icon4_a@2x.png')
        },
        replace: true
      }]
    }
  },
  created () {
    const toName = this.$route.name
    this.setActive(toName)
  },
  methods: {
    changeActive ({ name }) {
      this.setActive(name)
    },
    setActive (name) {
      for (let i = 0; i < this.tabbar.length; i++) {
        if (this.tabbar[i].path.name === name) {
          this.active = i
          return false
        }
      }
    }
  },
  watch: {
    '$route': 'changeActive'
  }
}
</script>

<style lang="less">
  .van-tabbar-item__icon {font-size: 22px;}
  .van-tabbar-item__icon img {height: 22px;}
</style>
