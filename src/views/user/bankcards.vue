<template>
    <div id="page-user-bankcards" class="navbar-fix tabbar-fix">
      <navbar title="银行卡"></navbar>

      <div class="container">
        <van-list v-model="bankCard.loading" :finished="bankCard.finished" finished-text="已加载完毕" :error.sync="bankCard.error" error-text="请求失败，点击重新加载" @load="getData" v-if="!isEmpty">
          <ul class="bank-list">
            <li class="bank1" v-for="(item, index) in bankCard.list" :key="index">
              <h4>
                <van-icon :name="item.cardIcon" size="26px" />{{item.bankName}}
              </h4>
              <p>**** **** **** **** {{item.cardId}}</p>
            </li>
          </ul>
        </van-list>
      </div>

      <van-button class="bankcards-button" type="primary" square :to="{name: 'userBankcardAdd'}" block>添加银行卡</van-button>
    </div>
</template>

<script>
import { USER_BANKCARD_LIST_URL } from '../../api'

export default {
  name: 'userBankcards',
  data () {
    return {
      isEmpty: false,
      bankCard: {
        loading: false,
        error: false,
        finished: false,
        current: 1,
        limit: 10,
        list: []
      }
    }
  },
  methods: {
    getData () {
      this.$post(USER_BANKCARD_LIST_URL, {
        page: this.bankCard.current,
        limit: this.bankCard.limit
      }).then((res) => {
        console.log(res)
        this.bankCard.loading = false
        if (this.bankCard.current === 1) {
          this.bankCard.list = res.data.records
        } else {
          for (let i = 0; i < res.data.records.length; i++) {
            this.bankCard.list.push(res.data.records[i])
          }
        }
        if (this.bankCard.list.length >= res.data.total) {
          this.bankCard.finished = true
        } else {
          this.bankCard.current++
        }
        this.isEmpty = !parseInt(res.data.total)
      }).catch((err) => {
        console.log(err)
        this.bankCard.error = true
      })
    }
  }
}
</script>

<style scoped lang="less">
  .bank-list li {margin-top: 20px;background: no-repeat center / cover;padding: 20px 20px 40px;border-radius: 5px;}
  .bank-list li h4 {margin: 0;line-height: 26px;font-weight: normal;}
  .bank-list li h4 .van-icon {vertical-align: top;margin-right: 10px;}
  .bank-list li p {margin: 15px 0 0 36px;}
  .bank-list li.bank1 {background-image: url(../../assets/images/bank1@2x.png);color: #fff;}
  .bank-list li.bank2 {background-image: url(../../assets/images/bank2@2x.png);color: #fff;}

  .bankcards-button {position: fixed;bottom: 0;left: 0;z-index: 100;}
</style>
