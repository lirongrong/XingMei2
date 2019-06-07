const api = require("../../utils/api.js");
const config = require("../../config.js");
const util = require("../../utils/util.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        order: {}
    },

    /**
     * 生命周期函数--监听页面加载
     * @param {object} options -参数选项
     */
    onLoad: function (options) {
        var that = this;
        var orderId = options.id;
        api.orderInfo(orderId).then(res => {
            that.setData({
                order: res
            });
        });
    },
    /**
     * 点击支付事件
     */
    tapPay:function(){
        var that = this;
        //支付
        api.pay({
            appId: config.appId,
            id: that.data.order.id
        }).then((res) => {
            res.success = that.paySuccess;
            res.fail = that.payFail;
            wx.requestPayment(res);
        });
    },
    
    /**
      * 支付成功后
      */
    paySuccess: function () {
        util.alert('支付成功').then(() => {
            this.toOrder();
        });
    },

    /**
     * 支付失败后
     * @param {Object} res -错误结果
     */
    payFail: function (res) {
        if (res.errMsg === "requestPayment:fail cancel") {
            util.alert('支付取消').then(() => {
                this.toOrder();
            });
        } else {
            util.error('支付失败').then(() => {
                this.toOrder();
            });
        }
    },

    /**
     * 跳转到订单详情
     */
    toOrder: function () {
        wx.removeStorageSync('order');
        wx.redirectTo({
            url: '/pages/order/detail?id=' + this.data.order.name
        });
    },

    /**
     * 跳转到首页
     */
    tapIndex:function(){
        wx.switchTab({
            url: '/pages/index/index'
        });
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

    }
});