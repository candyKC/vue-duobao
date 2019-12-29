export default {
  filters: {
    $_moneyFormat: (value) => {
      value = value >= 10000 ? value / 10000 : value
      return parseFloat(value) + '万'
    }
  }
}
