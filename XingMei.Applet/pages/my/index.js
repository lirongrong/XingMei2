const api = require("../../utils/api.js");
const app = getApp();

Page({
    data: {
        //用户个人信息
        userInfo: {
            avatarUrl: "",//用户头像
            nickName: ""//用户昵称
        },
        //状态数量
        statusCount: {
            waitingPayment: 0,
            paid: 0,
            sended: 0,
            finish: 0
        },
        tabbar: {},
        groupCount: 0, //团队数量
        fansCount: 0 //粉丝数量
    },
    /**
     * 页面加载事件 
     */
    onLoad: function () {
        app.editTabbar();
    },
    /**
     * 页面显示事件 
     */
    onShow: function () {
        var that = this;
        api.orderStatusCount().then(res => {
            var statusCount = {
                paid: res.Paid || 0,
                waitingPayment: res.WaitingPayment || 0,
                sended: res.Sended || 0,
                finish: res.Finish || 0
            };
            that.setData({
                statusCount: statusCount
            });
        });
        //团队数量
        api.social().then((res) => {
            that.setData({
                groupCount: res.shareLv1Count + res.shareLv2Count
            });
        });
        //粉丝数量
        api.fansCount().then((res) => {
            that.setData({
                fansCount: res
            });
        });
    },

    /**
     * 点击地址事件
     */
    tapAddress: function () {
        wx.navigateTo({
            url: '/pages/address/list'
        });
    },

    /**
     * 点击订单事件
     * @param {any} e -事件源
     */
    tapOrder: function (e) {
        var index = e.currentTarget.dataset.typeid;
        wx.navigateTo({
            url: '/pages/order/list?id=' + index
        });
    }
});