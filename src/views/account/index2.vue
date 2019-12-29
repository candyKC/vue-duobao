<template>
  <div id="page-account-index" class="navbar-fix">
    <div class="account-login">
      <div class="account-login-title">{{accountType.title}}</div>

      <template v-if="accountType.name === 'accountRegister' || accountType.name === 'accountForgotPassword'">
        <van-cell-group>
          <van-field label-width="auto" clearable v-model="tel" type="tel" placeholder="请输入手机号码">
            <!--<template slot="label">
              <div style="margin-right: 15px;" @click="show = true">+86 <van-icon name="arrow-down" size="12px" color="#999" style="line-height: 24px;vertical-align: top;" /></div>
            </template>-->
          </van-field>
          <van-field clearable v-model="code" placeholder="请输入短信验证码">
            <van-button slot="button" round size="small" type="primary" :disabled="codeDisabled" @click="getCode">{{codeText}}</van-button>
          </van-field>
          <van-field clearable v-model="password" :type="passwordShow ? 'text' : 'password'" placeholder="请输入密码" :right-icon="passwordShow ? 'eye-o' : 'eye'" @click-right-icon="passwordShow = !passwordShow" />
          <van-field clearable v-model="password_c" :type="passwordShow ? 'text' : 'password'" placeholder="请再次确认密码" />
        </van-cell-group>

        <div style="margin: 40px 15px;">
          <van-button v-if="accountType.name === 'accountRegister'" type="primary" round block style="font-size: 18px;line-height: 46px;height: 48px;" @click="register">注册</van-button>
          <van-button v-if="accountType.name === 'accountForgotPassword'" type="primary" round block style="font-size: 18px;line-height: 46px;height: 48px;" @click="register">确认</van-button>
          <div class="account-login-tips" style="text-align: center;margin-top: 40px;">
            <router-link :to="{name: 'accountLogin'}" replace><van-icon name="arrow-left" color="#999" style="line-height: 20px;vertical-align: top;" /> 返回登陆</router-link>
          </div>
        </div>
      </template>

      <template v-if="accountType.name === 'accountLogin'">
        <van-cell-group>
          <van-field clearable v-model="username" placeholder="请输入用户名" />
          <van-field clearable v-model="password" type="password" placeholder="请输入密码" />
        </van-cell-group>

        <div style="margin: 40px 15px;">
          <van-button type="primary" round block style="font-size: 18px;line-height: 46px;height: 48px;" @click="login">登陆</van-button>
          <div class="account-login-tips">
            <router-link :to="{name: 'accountForgotPassword'}" style="float: right;">忘记密码？</router-link><router-link :to="{name: 'accountLoginSms'}" replace>短信验证登陆</router-link>
          </div>
        </div>

        <div style="position: absolute;bottom: 30px;left: 0;width: 100%;text-align: center;display: none">
          <van-divider>使用微信登陆</van-divider>
          <a href="javascript:;">
            <img src="../../assets/images/icon-wx@2x.png" style="width: 45px;height: auto;display: inline-block;" alt="">
          </a>
        </div>
      </template>

      <template v-if="accountType.name === 'accountLoginSms'">
        <van-cell-group>
          <van-field label-width="auto" clearable v-model="tel" type="tel" placeholder="请输入手机号码">
            <!--<template slot="label">
              <div style="margin-right: 15px;" @click="show = true">+86 <van-icon name="arrow-down" size="12px" color="#999" style="line-height: 24px;vertical-align: top;" /></div>
            </template>-->
          </van-field>
          <van-field clearable v-model="code" placeholder="请输入短信验证码">
            <van-button slot="button" round size="small" type="primary" :disabled="codeDisabled" @click="getCode">{{codeText}}</van-button>
          </van-field>
        </van-cell-group>

        <div style="margin: 40px 15px;">
          <van-button type="primary" round block style="font-size: 18px;line-height: 46px;height: 48px;" @click="login">登陆</van-button>
          <div class="account-login-tips">
            <router-link :to="{name: 'accountForgotPassword'}" style="float: right;">忘记密码？</router-link><router-link :to="{name: 'accountLogin'}" replace>账号登陆</router-link>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { USER_REGISTER_URL, USER_SMSCODE_URL, USER_LOGIN_URL, USER_SMSLOGIN_URL, USER_FORPASSWORD_URL } from '../../api'

export default {
  name: 'accountIndex',
  computed: {
    accountType () {
      let title = ''
      let name = this.$route.name
      switch (name) {
        case 'accountRegister':
          title = '账号注册'
          break
        case 'accountLogin':
          title = '账号登陆'
          break
        case 'accountLoginSms':
          title = '短信登陆'
          break
        case 'accountForgotPassword':
          title = '找回密码'
          break
      }
      return {
        title: title,
        name: name
      }
    }
  },
  data () {
    return {
      tel: '',
      code: '',
      codeText: '获取验证码',
      codeDisabled: false,
      username: '',
      password: '',
      password_c: '',
      passwordShow: false,
      timer: null
    }
  },
  methods: {
    register () {
      if (!(/^1([3456789])\d{9}$/.test(this.tel))) {
        this.$toast('请输入正确的手机号码')
        return false
      }
      if (!this.code) {
        this.$toast('请输入短信验证码')
        return false
      }
      if (this.password.length < 6) {
        this.$toast('密码不能小于6位')
        return false
      }
      if (this.password !== this.password_c) {
        this.$toast('两次密码不一致')
        return false
      }

      let url = ''
      if (this.accountType.name === 'accountRegister') {
        url = USER_REGISTER_URL
      } else {
        url = USER_FORPASSWORD_URL
      }
      this.$post(url, {
        tel: this.tel,
        code: this.code,
        password: this.password
      }).then((res) => {
        this.$toast({
          icon: 'success',
          message: this.accountType.name === 'accountRegister' ? '注册成功' : '找回成功',
          forbidClick: true,
          mask: true,
          duration: 2000
        })
        setTimeout(() => {
          this.accountType.name === 'accountRegister' ? this.$router.replace({ name: 'accountLoginSms' }) : this.$router.replace({ name: 'accountLogin' })
        }, 2000)
      }).catch((err) => {
        console.log(err)
      })
    },
    login () {
      let data = {}
      let url = ''
      if (this.accountType.name === 'accountLoginSms') {
        url = USER_SMSLOGIN_URL
        if (!(/^1([3456789])\d{9}$/.test(this.tel))) {
          this.$toast('请输入正确的手机号码')
          return false
        }
        if (!this.code) {
          this.$toast('请输入短信验证码')
          return false
        }
        data.tel = this.tel
        data.code = this.code
      } else {
        url = USER_LOGIN_URL
        if (!this.username) {
          this.$toast('请输入用户名')
          return false
        }
        if (!this.password) {
          this.$toast('请输入密码')
          return false
        }
        data.username = this.username
        data.password = this.password
      }
      this.$post(url, data).then((res) => {
        this.$store.commit('login', res.userInfo)
        this.$toast({
          icon: 'success',
          message: '登陆成功',
          forbidClick: true,
          mask: true,
          duration: 2000
        })
        setTimeout(() => {
          this.$router.replace({ name: 'index' })
        }, 2000)
      }).catch((err) => {
        console.log(err)
      })
    },
    getCode () {
      if (!(/^1([3456789])\d{9}$/.test(this.tel))) {
        this.$toast('请输入正确的手机号码')
        return false
      }
      this.$post(USER_SMSCODE_URL, {
        tel: this.tel
      }).then((res) => {
        this.codeDisabled = true
        let time = 60
        this.timer = setInterval(() => {
          time = time - 1
          this.codeText = '重新发送(' + time + ')'
          if (time < 0) {
            this.codeDisabled = false
            clearInterval(this.timer)
            this.codeText = '获取验证码'
          }
        }, 1000)
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    window.document.body.setAttribute('style', 'background-color:#fff')
    next()
  },
  beforeRouteLeave (to, from, next) {
    window.document.body.removeAttribute('style')
    next()
  },
  watch: {
    $route (to, from) {
      this.tel = ''
      this.code = ''
      this.codeText = '获取验证码'
      this.codeDisabled = false
      this.username = ''
      this.password = ''
      this.password_c = ''
      this.passwordShow = false
      if (this.timer) {
        clearInterval(this.timer)
      } else {
        this.timer = null
      }
    }
  }
}
</script>

<style scoped>

</style>
