var api = require("../../utils/api.js");
var util = require("../../utils/util.js");
var config = require("../../config.js");
var _ = require("../../utils/underscore.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        page:1, //当前页
        pageSize:5, //每页数量
        list:[],
        currentTab: 0,
        noData:false //没有数据
    },

    bindData: function (page) {
        var that = this;
        if (page) {
            that.setData({
                page: page
            });
        }
        var status = null;
        switch (that.data.currentTab) {
            case '0': //全部
                status = null;
                break;
            case '1': //待付款
                status = 50;
                break;
            case '2': //待发货
                status = 60;
                break;
            case '3': //已发货
                status = 80;
                break;
            case '4': //已完成
                status = 100;
                break;
        }
        //获取订单列表
        api.orders(status,that.data.page,that.data.pageSize).then(res => {
            var list = that.data.list || [];
            if (that.data.page > 1)
                _.each(res.data, (item) => {
                    list.push(item);
                });
            else
                list = res.data;
            that.setData({
                list: list,
                noData: res.data.length < that.data.pageSize
            });
        });
    },

    /**
    * 生命周期函数--监听页面加载
    * @param {object} options -参数选项
    */
    onLoad: function (options) {
        var secondId = options.id || 0;
        this.setData({
            currentTab: secondId
        });
        this.bindData(1);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    },

    // 导航切换监听
    clickTab: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            });

            this.bindData(1);
        }
    },

    
    /**
     * 支付订单
     * */
    tapPay: function () {
        var that = this;
        var order = this.data.carts[0];
        if (order) {
            //总金额为0，则跳转到已支付订单列表
            if (that.data.totalPrice === 0) {
                wx.redirectTo({
                    url: '/pages/order/list?id=2'
                });
            } else {
                //支付
                api.pay({
                    appId: config.appId,
                    name: order.name
                }).then((res) => {
                    res.success = that.paySuccess;
                    res.fail = that.payFail;
                    wx.requestPayment(res);
                });
            }
        }
    },
    /**
     * 跳转到确认订单
     * @param {object} e - 事件
     **/
    toOrderDetail: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/order/detail?id=' + id
        });
    },
    /**
     * 支付成功后
     */
    paySuccess: function () {
        util.alert('支付成功');
        setTimeout(function () {
            wx.redirectTo({
                url: '/pages/order/list?id=2'
            });
        }, 1200);
    },

    /**
     * 支付失败后
     * @param {Object} res -错误结果
     */
    payFail: function (res) {
        if (res.errMsg === "requestPayment:fail cancel") {
            util.alert('支付取消');
        } else {
            util.error('支付失败');
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.setData({
            page: 1,
            currentTab:0,
            noData: false
        });
        this.bindData(1);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (!this.data.noData) {
            var page = this.data.page;
            page++;
            this.bindData(page);
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
});