// pages/goods/goodsList.js

var util = require('../../utils/util.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    'page': 1,
    'page_count': 0,
    'count': 0,
    'page_size': app.config.page.page_size,
    'goodsList': [],
    'options': {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'options': options
    }) 
    this.get_goods_list()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.get_goods_list()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.page < this.data.page_count) {
      this.setData({
        'page': this.data.page + 1
      })
      this.get_goods_list()
    } else {
      util.showSuccess('提示', '没有数据')
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '商品列表',
      path: '/pages/goods/goodsList'
    }
  },

  get_goods_list: function () {
    console.log(this.route) //当前页面路径  pages/goods/goodsList
    console.log(getCurrentPages()) //获取当前页面栈的实例
    var shop_id = this.data.options.shop_id
    var that = this
    wx.request({
      url: app.config.service.goodsListUrl, //仅为示例，并非真实的接口地址
      data: {
        'shop_id': shop_id,
        'page': that.data.page,
        'page_size': that.data.page_size
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          'goodsList': res.data.data.rows,
          'page_count': res.data.data.page_count,
          'count': res.data.data.count
        })
        console.log(that.data.goodsList)
      },
      fail: function (e) {
        util.showModel('错误', e)
      }
    })

  }
})