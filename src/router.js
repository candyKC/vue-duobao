import Vue from 'vue'
import Router from 'vue-router'
import Tabbar from './components/tabbar'
Vue.use(Router)

const Index = () => import('./views/index/index.vue')
const IndexCity = () => import('./views/index/city.vue')
const Auction = () => import('./views/auction/index.vue')
const AuctionOrder = () => import('./views/auction/order.vue')
const AuctionHerald = () => import('./views/auction/herald.vue')
const House = () => import('./views/house/index.vue')
const One = () => import('./views/one/index.vue')
const Concern = () => import('./views/concern/index.vue')
const Account = () => import('./views/account/index.vue')
const AccountIndex = () => import('./views/account/index2.vue')
const Thread = () => import('./views/thread/index.vue')
const User = () => import('./views/user/index.vue')
const UserSetting = () => import('./views/user/setting.vue')
const UserAvatar = () => import('./views/user/avatar.vue')
const UserNickname = () => import('./views/user/nickname.vue')
const UserPhone = () => import('./views/user/phone.vue')
const UserEmail = () => import('./views/user/email.vue')
const UserPassword = () => import('./views/user/password.vue')
const UserAddress = () => import('./views/user/address.vue')
const UserSafety = () => import('./views/user/safety.vue')
const UserCertification = () => import('./views/user/certification.vue')
const UserWechat = () => import('./views/user/wechat.vue')
const UserAlipay = () => import('./views/user/alipay.vue')
const UserPaypass = () => import('./views/user/paypass.vue')
const UserRecharge = () => import('./views/user/recharge.vue')
const UserBankcards = () => import('./views/user/bankcards.vue')
const UserBankcardAdd = () => import('./views/user/bankcard-add.vue')
const UserHistory = () => import('./views/user/history.vue')
const UserNotice = () => import('./views/user/notice.vue')
const UserNoticeType = () => import('./views/user/notice-type.vue')
const Order = () => import('./views/order/index.vue')
const OrderPay = () => import('./views/order/pay.vue')
const OrderStatus = () => import('./views/order/status.vue')
const Cart = () => import('./views/cart/index.vue')
const Goods = () => import('./views/goods/index.vue')
const GoodsRecord = () => import('./views/goods/record.vue')
const GoodsBidService = () => import('./views/goods/bid-service.vue')
const GoodsDbService = () => import('./views/goods/db-service.vue')
const GoodsIdentification = () => import('./views/goods/identification.vue')
const Category = () => import('./views/category/index.vue')
const Remind = () => import('./views/remind/index.vue')
const RemindSettiong = () => import('./views/remind/setting.vue')
const Service = () => import('./views/service/index.vue')
const ServiceGoods = () => import('./views/service/goods.vue')

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      components: {
        default: Index,
        tabbar: Tabbar
      },
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/auction',
      name: 'auction',
      components: {
        default: Auction
      },
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/auction/herald',
      name: 'auctionHerald',
      components: {
        default: AuctionHerald
      },
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/auction/order',
      name: 'auctionOrder',
      components: {
        default: AuctionOrder
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/house',
      name: 'house',
      components: {
        default: House
      },
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/one',
      name: 'one',
      components: {
        default: One
      },
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/concern',
      name: 'concern',
      components: {
        default: Concern,
        tabbar: Tabbar
      },
      meta: {
        keepAlive: false,
        checkedAuth: true
      }
    },
    {
      path: '/city',
      name: 'city',
      components: {
        default: IndexCity
      },
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/remind',
      name: 'remind',
      components: {
        default: Remind,
        tabbar: Tabbar
      },
      meta: {
        keepAlive: false,
        checkedAuth: true
      }
    },
    {
      path: '/remind/setting',
      name: 'remindSetting',
      components: {
        default: RemindSettiong
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/thread',
      name: 'thread',
      components: {
        default: Thread
      },
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/account',
      name: 'account',
      components: {
        default: Account
      },
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/account/login',
      name: 'accountLogin',
      components: {
        default: AccountIndex
      },
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/account/login-sms',
      name: 'accountLoginSms',
      components: {
        default: AccountIndex
      },
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/account/forgot-password',
      name: 'accountForgotPassword',
      components: {
        default: AccountIndex
      },
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/account/register',
      name: 'accountRegister',
      components: {
        default: AccountIndex
      },
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/user',
      name: 'user',
      components: {
        default: User,
        tabbar: Tabbar
      },
      meta: {
        keepAlive: false,
        checkedAuth: true
      }
    },
    {
      path: '/user/setting',
      name: 'userSetting',
      components: {
        default: UserSetting
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/user/setting/avatar',
      name: 'userAvatar',
      components: {
        default: UserAvatar
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/user/setting/nickname',
      name: 'userNickname',
      components: {
        default: UserNickname
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/user/setting/phone',
      name: 'userPhone',
      components: {
        default: UserPhone
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/user/setting/password',
      name: 'userPassword',
      components: {
        default: UserPassword
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/user/setting/address',
      name: 'userAddress',
      components: {
        default: UserAddress
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/user/setting/email',
      name: 'userEmail',
      components: {
        default: UserEmail
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/user/setting/safety',
      name: 'userSafety',
      components: {
        default: UserSafety
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/user/setting/certification',
      name: 'userCertification',
      components: {
        default: UserCertification
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/user/setting/wechat',
      name: 'userWechat',
      components: {
        default: UserWechat
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/user/setting/alipay',
      name: 'userAlipay',
      components: {
        default: UserAlipay
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/user/setting/paypass',
      name: 'userPaypass',
      components: {
        default: UserPaypass
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/user/setting/recharge',
      name: 'userRecharge',
      components: {
        default: UserRecharge
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/user/setting/bankcards',
      name: 'userBankcards',
      components: {
        default: UserBankcards
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/user/setting/bankcards/add',
      name: 'userBankcardAdd',
      components: {
        default: UserBankcardAdd
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/user/history',
      name: 'userHistory',
      components: {
        default: UserHistory
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/user/notice',
      name: 'userNotice',
      components: {
        default: UserNotice
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/user/notice/type',
      name: 'userNoticeType',
      components: {
        default: UserNoticeType
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/order',
      name: 'order',
      components: {
        default: Order
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/order/pay/:type/:id',
      name: 'orderPay',
      components: {
        default: OrderPay
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/order/pay/:type/:id/:status',
      name: 'orderStatus',
      components: {
        default: OrderStatus
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/goods',
      name: 'goods',
      components: {
        default: Goods
      },
      meta: {
        keepAlive: false,
        checkedAuth: true
      }
    },
    {
      path: '/goods/record',
      name: 'goodsRecord',
      components: {
        default: GoodsRecord
      },
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/goods/bid-service',
      name: 'goodsBidService',
      components: {
        default: GoodsBidService
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/goods/db-service',
      name: 'goodsDbService',
      components: {
        default: GoodsDbService
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/goods/:type/identification',
      name: 'goodsIdentification',
      components: {
        default: GoodsIdentification
      },
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: '/cart',
      name: 'cart',
      components: {
        default: Cart
      },
      meta: {
        keepAlive: false,
        checkedAuth: true
      }
    },
    {
      path: '/category',
      name: 'category',
      components: {
        default: Category
      },
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/service',
      name: 'service',
      components: {
        default: Service
      },
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/service/goods',
      name: 'serviceGoods',
      components: {
        default: ServiceGoods
      },
      meta: {
        keepAlive: false,
        checkedAuth: true
      }
    }
  ]
})

export default router
