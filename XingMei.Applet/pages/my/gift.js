const api = require("../../utils/api.js");
const html = require('../../wxParse/wxParse.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        dlgType: 0, //弹窗类型
        topList: ["0", "0", "0"],
        desc: '', //文案获取面膜
        totalList: [],  //累计面膜列表
        sendList: [] //发货列表
    },
    /**
     * 页面加载事件 
     */
    onLoad: function () {
        var that = this;

        //获取用户社交信息
        api.social().then(res => {
            that.setData({
                topList: [res.totalGiftCount, res.usedGiftCount, res.totalGiftCount - res.usedGiftCount - res.usingGiftCount]
            });
        });
        //延迟获取记录
        setTimeout(function () {
            //已获取的礼品
            api.giftLog(1).then(res => {
                that.setData({
                    totalList: res.data
                });
            });
            //已使用的礼品
            api.giftLog(-1).then(res => {
                that.setData({
                    sendList: res.data
                });
            });
            //文案-如何获取面膜
            api.article(2).then(res => {
                html.wxParse('article', 'html', res.content, that, 0);
                that.setData({
                    desc: res.content
                });
            });
        }, 1000);
    },
    //关闭弹窗
    tapCloseDlg() {
        this.setData({
            dlgType: 0 //弹窗隐藏
        });
    },
    //点击如何获取奖金
    tapDescDlg() {
        this.setData({
            dlgType: 1
        });
    },
    //点击累积奖金
    tapTotalDlg() {
        this.setData({
            dlgType: 2
        });
    },
    //点击已提现奖金
    tapSendDlg() {
        this.setData({
            dlgType: 3
        });
    },
    //点击发货
    tapSend: function () {
        var remainCount = parseInt(this.data.topList[2]);
        if (remainCount < 5) {
            wx.showToast({
                title: '5片以上才能发货！',
                icon: 'none',
                duration: 1200
            });
            return;
        }
        var count = remainCount - remainCount % 5;
        //设置订单缓存
        wx.setStorageSync('order', {
            productId: 2,
            count: count
        });
        wx.redirectTo({
            url: '/pages/order/pay'
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