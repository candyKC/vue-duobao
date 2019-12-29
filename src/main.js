import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './assets/js/axios'
import './registerServiceWorker'
import MyNavbar from './components/navbar'
import GoodsLike from './components/goods-like'
import FilterMenu from './components/filter-menu'

import { Icon, Grid, GridItem, Image, Lazyload, Loading, List, Sticky, DropdownMenu, DropdownItem, CountDown, NoticeBar, Button, Row, Col, Cell, CellGroup, Tag, Field, Picker, Popup, Divider, NavBar, PasswordInput, NumberKeyboard, IndexBar, IndexAnchor, Checkbox, CheckboxGroup, SubmitBar, Dialog, Tab, Tabs, Panel, Card, Toast, ActionSheet, Switch } from 'vant'
import 'vant/lib/icon/local.css'
import './assets/css/style.css'

Vue.use(Icon).use(Grid).use(GridItem).use(MyNavbar).use(Image).use(Lazyload).use(Loading).use(List).use(Sticky).use(DropdownMenu).use(DropdownItem).use(CountDown).use(NoticeBar).use(Button).use(Row).use(Col).use(Cell).use(CellGroup).use(Tag).use(Field).use(Picker).use(Popup).use(Divider).use(GoodsLike).use(NavBar).use(PasswordInput).use(NumberKeyboard).use(IndexBar).use(IndexAnchor).use(Checkbox).use(CheckboxGroup).use(SubmitBar).use(Dialog).use(Tab).use(Tabs).use(Panel).use(Card).use(axios).use(Toast).use(FilterMenu).use(ActionSheet).use(Switch)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth || to.meta.checkedAuth) {
    if (store.getters.getUserInfo && localStorage.getItem('user_id')) {
      next()
    } else {
      store.dispatch('checkedLogin').then(() => {
        next()
      }).catch((err) => {
        if (to.meta.requireAuth) {
          Dialog.confirm({
            title: '温馨提示',
            message: err.msg
          }).then(() => {
            next({
              name: 'account',
              query: { redirect: to.fullPath }
            })
          }).catch(() => {
            next(false)
          })
        } else {
          next()
        }
      })
    }
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
