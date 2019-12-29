<template>
  <div id="page-user-address" class="navbar-fix">
    <navbar title="收货地址"></navbar>

    <van-address-edit :address-info="addressInfo" :area-list="areaList" @save="onSave" style="margin-top: 10px;" />
  </div>
</template>

<script>
import { AddressEdit } from 'vant'
// import areaList from '../../assets/js/area'
import { QUERY_REGIONLIST_URL, USER_UPDATE_URL } from '../../api'

export default {
  name: 'userAddress',
  components: {
    [AddressEdit.name]: AddressEdit
  },
  computed: {
    userInfo () {
      return this.$store.getters.getUserInfo
    }
  },
  data () {
    return {
      areaList: {},
      addressInfo: {}
    }
  },
  created () {
    console.log(this.userInfo)
    this.$post(QUERY_REGIONLIST_URL, {}).then((res) => {
      this.areaList = res.data
    })
    if (this.userInfo.address) {
      let obj = JSON.parse(this.userInfo.address)
      this.addressInfo.name = obj.name
      this.addressInfo.tel = obj.tel
      this.addressInfo.addressDetail = obj.detail
      this.addressInfo.province = obj.province
      this.addressInfo.city = obj.city
      this.addressInfo.county = obj.county
      this.addressInfo.areaCode = obj.areaCode
    }
  },
  methods: {
    onSave (content) {
      console.log(content)
      let obj = {
        name: content.name,
        province: content.province,
        city: content.city,
        county: content.county,
        tel: content.tel,
        detail: content.addressDetail,
        areaCode: content.areaCode
      }
      obj = JSON.stringify(obj)

      this.$post(USER_UPDATE_URL, {
        address: obj
      }).then((res) => {
        this.$store.commit('updateUserInfo', {
          address: obj
        })
        this.$toast({
          icon: 'success',
          message: '修改成功',
          forbidClick: true,
          duration: 2000
        })
        setTimeout(() => {
          this.$router.back(-1)
        }, 2000)
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
