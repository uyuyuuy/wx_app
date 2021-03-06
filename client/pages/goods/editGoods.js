// pages/goods/editGoods.js

var util = require('../../utils/util.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    'goods_id': 0,
    'goods_info': {},
    'photo_list': []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'goods_id': options.goods_id
    })
    this.get_goods_info()

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
    this.get_goods_info()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  setGoodsName: function (e) {
    this.setData({
      'goods_info.goods_name': e.detail.value
    })
  },

  setGoodsDescription: function (e) {
    console.log(e)
    this.setData({
      'goods_info.goods_description': e.detail.value
    })
  },
  setGoodsSn: function (e) {
    this.setData({
      'goods_info.goods_sn': e.detail.value
    })
  },
  setGoodsPrice: function (e) {
    this.setData({
      'goods_info.goods_price': e.detail.value
    })
  },
  setGoodsTag: function (e) {
    this.setData({
      'goods_info.goods_tag': e.detail.value
    })
  },
  //设置封面图片
  setGoodsCover: function (e) {
    console.log(e)
    var photo_list = this.data.photo_list
    for (var i = 0; i < photo_list.length; i++) {
      photo_list[i]['is_cover'] = 0
    }
    photo_list[e.detail.id]['is_cover'] = 1
    this.setData({
      'goods_info.goods_img_url': photo_list[e.detail.id]['img_url']
    })
    this.setData({
      'photo_list': photo_list
    })
  }, 

  get_goods_info: function () {
    var goods_id = this.data.goods_id
    var that = this
    wx.request({
      url: app.config.service.goodsInfoUrl, //仅为示例，并非真实的接口地址
      data: {
        'goods_id': goods_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          'goods_info': res.data.data.goods_info,
          'photo_list': res.data.data.photo_list,
        })
        console.log(that.data)
      },
      fail: function (e) {
        util.showModel('错误', e)
      }
    })
  },

  // 上传图片接口
  doUpload: function () {
    var that = this

    // 选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.showBusy('正在上传')
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          var filePath = res.tempFilePaths[i]
          // 上传图片
          wx.uploadFile({
            url: app.config.service.uploadUrl,
            filePath: filePath,
            name: 'file',

            success: function (res) {
              util.showSuccess('上传图片成功')
              console.log(res)
              res = JSON.parse(res.data)
              console.log(res)

              var photo_list = that.data.photo_list
              photo_list.push({ 'goods_path': res.data.imgUrl, 'is_cover': 0})
              that.setData({
                'photo_list': photo_list,
                'goods_info.goods_img_url': res.data.imgUrl
              })
              console.log(that.data)
            },

            fail: function (e) {
              console.log(app.config.service.uploadUrl)
              console.error(e)
              util.showModel('错误', e)
            }
          })
        }

      },
      fail: function (e) {
        console.error(e)
      }
    })
  },

  // 预览图片
  // previewImg: function () {
  //   wx.previewImage({
  //     current: this.data.goods_info.goodsImgUrl,
  //     urls: [this.data.goods_info.goodsImgUrl]
  //   })
  // },

  editGoods: function () {
    // 新增，编辑图片在编辑接口中处理，用图片id来区分是新增还是编辑
    wx.request({
      url: app.config.service.editGoodsUrl, //仅为示例，并非真实的接口地址
      data: {
        goods_id: this.data.goods_id,
        goods_name: this.data.goods_info.goods_name,
        goods_description: this.data.goods_info.goods_description,
        goods_img_url: this.data.goods_info.goods_img_url,
        goods_sn: this.data.goods_info.goods_sn,
        // goods_tag: this.data.goods_info.goods_tag,
        goods_price: this.data.goods_info.goods_price,
        shop_id: this.data.goods_info.shop_id,
        photo_list: this.data.photo_list
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == '200') {
          util.showSuccess('成功', res.data.message)
        } else {
          util.showModel('失败', res.data.message)
        }
      }
    })
  },

  delPhoto: function (event) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定删除该图片？',
      success: function (res) {
        if (res.confirm) {
          var i = event.currentTarget.dataset.index
          console.log(event)
          var photo_list = that.data.photo_list
          var del_photo_info = photo_list[i]

          if (del_photo_info.id > 0) {
            wx.request({
              url: app.config.service.delPhotoUrl, //仅为示例，并非真实的接口地址
              data: {
                photo_id: del_photo_info.id,
                goods_id: that.data.goods_id
              },
              method: 'GET',
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                if (res.data.code == '200') {
                  photo_list.splice(i, 1)
                  photo_list.sort()
                  that.setData({
                    'photo_list': photo_list
                  })
                  console.log(that.data)

                  util.showSuccess('成功', res.data.message)
                } else {
                  util.showModel('失败', res.data.message)
                }
              }
            })
          } else {
            photo_list.splice(i, 1)
            that.setData({
              'photo_list': photo_list
            })
            console.log(that.data)
          }
        } else if (res.cancel) {
          return
        }
      }
    })
  }

})