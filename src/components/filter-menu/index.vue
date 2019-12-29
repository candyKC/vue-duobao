<template>
  <van-sticky :offset-top="46" ref="filter">
    <van-dropdown-menu class="container" active-color="#D63C3C">
      <van-dropdown-item v-model="filter.sort.value" :options="filter.sort.option" @change="changeFilterSort" />
      <van-dropdown-item :title="filter.area.text" ref="filter-area">
        <van-tree-select :items="filter.area.list" @click-nav="onAreaNav" @click-item="onAreaItem" :main-active-index="filter.area.mainActiveIndex" :active-id="filter.area.activeId" />
        <van-grid :border="false" :column-num="2">
          <van-grid-item>
            <van-button type="default" block @click="onFilterCancel('filter-area')">不限条件</van-button>
          </van-grid-item>
          <van-grid-item>
            <van-button type="primary" block @click="onFilterConfirm('filter-area')">确认</van-button>
          </van-grid-item>
        </van-grid>
      </van-dropdown-item>
      <van-dropdown-item :title="filter.price.text" ref="filter-price">
        <div class="filter-box">
          <div class="filter-title">价格区间（万）</div>
          <div class="filter-input">
            <van-row gutter="10">
              <van-col span="10">
                <div class="van-hairline--bottom">
                  <input type="tel" v-model="filter.price.min" placeholder="最低">
                </div>
              </van-col>
              <van-col span="4">至</van-col>
              <van-col span="10">
                <div class="van-hairline--bottom">
                  <input type="tel" v-model="filter.price.max" placeholder="最高">
                </div>
              </van-col>
            </van-row>
          </div>
          <van-row gutter="10">
            <van-col span="6" v-for="(item, index) in filter.price.list" :key="index">
              <span :class="['filter-select', filter.price.active === index + 1 ? 'active' : '']" @click="onFilterPriceSelect(index, item)">{{item.text}}</span>
            </van-col>
          </van-row>
        </div>
        <van-grid :border="false" :column-num="2">
          <van-grid-item>
            <van-button type="default" block @click="onFilterCancel('filter-price')">不限条件</van-button>
          </van-grid-item>
          <van-grid-item>
            <van-button type="primary" block @click="onFilterConfirm('filter-price')">确认</van-button>
          </van-grid-item>
        </van-grid>
      </van-dropdown-item>
      <van-dropdown-item title="更多" ref="filter-more">
        <div class="filter-box">
          <div class="filter-title">建筑面积（m²）</div>
          <van-row gutter="10">
            <van-col span="6" v-for="(item, index) in filter.space.list" :key="index">
              <span :class="['filter-select', filter.space.active === index + 1 ? 'active' : '']" @click="onFilterSpaceSelect(index, item)">{{item.text}}</span>
            </van-col>
          </van-row>
        </div>
        <div class="filter-box">
          <div class="filter-title">建筑面积（m²）</div>
          <van-row gutter="10">
            <van-col span="6" v-for="(item, index) in filter.other.list" :key="index">
              <span :class="['filter-select', filter.other.active === index + 1 ? 'active' : '']" @click="onFilterOtherSelect(index, item)">{{item.text}}</span>
            </van-col>
          </van-row>
        </div>
        <van-grid :border="false" :column-num="2">
          <van-grid-item>
            <van-button type="default" block @click="onFilterCancel('filter-more')">不限条件</van-button>
          </van-grid-item>
          <van-grid-item>
            <van-button type="primary" block @click="onFilterConfirm('filter-more')">确认</van-button>
          </van-grid-item>
        </van-grid>
      </van-dropdown-item>
      <van-dropdown-item v-if="loansShow" v-model="filter.loans.value" :options="filter.loans.option" @change="changeFilterLoans" />
    </van-dropdown-menu>
  </van-sticky>
</template>

<script>
import { TreeSelect } from 'vant'
import { QUERY_REGION_URL } from '../../api'

export default {
  name: 'filterMenu',
  components: {
    [TreeSelect.name]: TreeSelect
  },
  props: {
    loansShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      filter: {
        sort: {
          value: 0,
          option: [{
            text: '默认排序',
            value: 0
          }, {
            text: '最新发布',
            value: 1
          }, {
            text: '价格从高到低',
            value: 2
          }, {
            text: '价格从低到高',
            value: 3
          }, {
            text: '出价次数由高到低',
            value: 4
          }]
        },
        loans: {
          value: '0,',
          option: [{
            text: '可贷款',
            value: '0,'
          }, {
            text: '不限购',
            value: '1,'
          }, {
            text: '有报告',
            value: '2,'
          }]
        },
        area: {
          text: '区域',
          mainActiveIndex: 0,
          activeId: 0,
          list: [{
            text: '所有区域',
            children: []
          }]
        },
        price: {
          text: '价格',
          active: 0,
          min: '',
          max: '',
          list: [{
            text: '200以下',
            minPrice: 1,
            maxPrice: 199
          }, {
            text: '200-300',
            minPrice: 200,
            maxPrice: 300
          }, {
            text: '300-400',
            minPrice: 300,
            maxPrice: 400
          }, {
            text: '400-500',
            minPrice: 400,
            maxPrice: 500
          }, {
            text: '500-1000',
            minPrice: 500,
            maxPrice: 1000
          }, {
            text: '1000以上',
            minPrice: 1000,
            maxPrice: 10000000
          }]
        },
        space: {
          active: 0,
          list: [{
            text: '200以下',
            minSize: 1,
            maxSize: 199
          }, {
            text: '200-300',
            minSize: 200,
            maxSize: 300
          }, {
            text: '300-400',
            minSize: 300,
            maxSize: 400
          }, {
            text: '400-500',
            minSize: 400,
            maxSize: 500
          }, {
            text: '500-1000',
            minSize: 500,
            maxSize: 1000
          }, {
            text: '1000以上',
            minSize: 1000,
            maxSize: 100000
          }]
        },
        other: {
          active: 0,
          list: [{
            text: '必看好房',
            value: '0,'
          }, {
            text: '满两年',
            value: '2,'
          }, {
            text: '满五年',
            value: '1,'
          }, {
            text: '近地铁',
            value: '3,'
          }]
        }
      }
    }
  },
  created () {
    this.$post(QUERY_REGION_URL, {
      level: 2,
      pid: 610000
    }).then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].text = res.data[i].sname
      }
      this.filter.area.list[0].children = res.data
    })
  },
  methods: {
    changeFilterSort (value) {
      this.$emit('filter-sort', value)
      this.goTop()
    },
    changeFilterLoans (value) {
      this.$emit('filter-loans', value)
      this.goTop()
    },
    onAreaNav (index) {
      this.filter.area.mainActiveIndex = index
      this.$emit('filter-area-nav', index)
    },
    onAreaItem (data) {
      this.filter.area.activeId = data.id
      this.$emit('filter-area-item', data)
    },
    onFilterPriceSelect (index, value) {
      this.filter.price.active = index + 1
      this.filter.price.min = value.minPrice
      this.filter.price.max = value.maxPrice
    },
    onFilterSpaceSelect (index, value) {
      this.filter.space.active = index + 1
      this.$emit('filter-space', value)
    },
    onFilterOtherSelect (index, value) {
      this.filter.other.active = index + 1
      this.$emit('filter-other', value)
    },
    onFilterCancel (el) {
      switch (el) {
        case 'filter-area':
          this.filter.area.activeId = 0
          break
        case 'filter-price':
          this.filter.price.active = 0
          this.filter.price.min = ''
          this.filter.price.max = ''
          break
        case 'filter-more':
          this.filter.space.active = 0
          this.filter.other.active = 0
          break
      }
      this.$emit('filter-cancel', el)
      this.goTop()
      this.$refs[el].toggle()
    },
    onFilterConfirm (el) {
      if (el === 'filter-price') {
        if (this.filter.price.min && !this.filter.price.max) {
          this.$toast('请填写最高价格')
          return
        }
        if (!this.filter.price.min && this.filter.price.max) {
          this.$toast('请填写最低价格')
          return
        }
        if (this.filter.price.min && this.filter.price.max) {
          if (!/^[1-9]\d*$/.test(this.filter.price.min) || !/^[1-9]\d*$/.test(this.filter.price.max)) {
            this.$toast('请填写正整数')
            return
          }
          this.filter.price.active = 0
        }
      }
      this.$emit('filter-confirm', el, this.filter.price.min, this.filter.price.max)
      this.goTop()
      this.$refs[el].toggle()
    },
    goTop () {
      this.$nextTick(() => {
        let offsetTop = this.$refs['filter'].$el.offsetTop
        document.documentElement.scrollTop = offsetTop - 46
      })
    }
  }
}
</script>

<style scoped lang="less">
  .filter-box {padding: 15px 10px 0;}
  .filter-title {margin-bottom: 15px;}
  .filter-select {display: block;background-color: #f2f2f2;text-align: center;font-size: 12px;line-height: 26px;margin-bottom: 10px;border-radius: 3px;}
  .filter-select.active {background-color: #D63C3C;color: #fff;}
  .filter-input {text-align: center;margin-bottom: 15px;}
  .filter-input input {display: block;width: 100%;border: 0;text-align: center;padding: 0 0 5px 0;}
</style>
