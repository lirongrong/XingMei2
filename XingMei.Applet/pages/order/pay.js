const config = require("../../config.js");
const api = require("../../utils/api.js");
const util = require("../../utils/util.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderId: '',
        address: {},
        carts: [], // 修改标识为false，显示购物车为空页面
        totalPrice: 0, // 总价，初始为0
        selectAllStatus: true, // 全选状态，默认全选
        selectarr: [] //选中数组
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function() {
        var that = this;
        //获取订单缓存
        var order = wx.getStorageSync('order');
        if (!order) {
            wx.navigateTo({
                url: '/pages/index/index'
            });
        }
        //取默认地址
        if (!order.address) {
            api.address().then(res => {
                that.setData({
                    address: res
                });
                order.address = res;
                wx.setStorageSync('order', order);
            });
        } else {
            that.setData({
                address: order.address
            });
        }
        //显示产品
        var showProduct = function(res) {
            res.count = order.count || 1;
            res.selected = true;
            var carts = [res];
            that.setData({
                carts: carts
            });
            that.getTotalPrice();
        }
        api.product(order.productId).then(product => {
            showProduct(product);
        });
    },

    /**
     * 选择地址
     * */
    tapAddress() {
        wx.setStorageSync('address-choose', true);
        wx.navigateTo({
            url: '/pages/address/list'
        });
    },

    /**
     * 提交订单
     * */
    tapOrder() {
        var that = this;
        var data = wx.getStorageSync('order');
        if (!data) {
            util.alert('订单异常！');
            wx.redirectTo({
                url: '/pages/index/index'
            });
        }
        if (!data.address) {
            util.alert('请选择收获地址！');
            return;
        }
        api.order(data).then(order => {
            console.log(order);
            that.setData({
                orderId: order.name
            });
            //总金额为0，则跳转到已支付订单列表
            if (that.data.totalPrice == 0) {
                that.toOrder();
            } else {
                //支付
                api.pay({
                    appId: config.appId,
                    id: order.id
                }).then((res) => {
                    res.success = that.paySuccess;
                    res.fail = that.payFail;
                    wx.requestPayment(res);
                });
            }
        });
    },

    /**
     * 计算总价
     */
    getTotalPrice() {
        let carts = this.data.carts; // 获取购物车列表
        let total = 0;
        for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
            if (carts[i].selected) { // 判断选中才会计算价格
                total += carts[i].count * carts[i].price; // 所有价格加起来
            }
        }
        this.setData({
            totalPrice: total.toFixed(2)
        });
    },

    /**
     * 支付成功后
     */
    paySuccess: function() {
        util.alert('支付成功').then(() => {
            this.toOrder();
        });
    },

    /**
     * 支付失败后
     * @param {Object} res -错误结果
     */
    payFail: function(res) {
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
    toOrder: function() {
        wx.removeStorageSync('order');
        wx.redirectTo({
            url: '/pages/order/detail?id=' + this.data.orderId
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})