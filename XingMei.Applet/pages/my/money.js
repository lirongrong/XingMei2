const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
const html = require('../../wxParse/wxParse.js');

// pages/bonus/bonus.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dlgType:0, //弹窗类型
        topList: ["0", "0", "0"],
        withdrawMoney: '',
        getInput: '',
        desc: '',//文案-获取奖金
        //累计佣金
        totalBrokerage: [],
        //已提现佣金
        withdrawList: [],
        //可提现金额
        remainAmount: 0
    },
    //获取input 提现的数
    getInput: function (e) {
        this.setData({
            withdrawMoney: e.detail.value
        });
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
    tapWithdrawDlg() {
        this.setData({
            dlgType: 3
        });
    },
    //点击提现
    tapWithdraw(e) {
        this.setData({
            dlgType: 4
        });
    },
    //确认提现
    tapSubmitWithdraw(e) {
        var that = this;
        if (that.data.remainAmount < that.data.withdrawMoney) {
            util.alert('提现金额不能大于可领取金额！');
        } else {
            api.withdraw(that.data.withdrawMoney).then(() => {
                that.setData({
                    withdrawMoney: ''
                });
                that.bindclones();
                util.alert('提现成功，等待客服与你联系转账！');
                setTimeout(function () {
                    that.onLoad();
                }, 2000);
            });
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        var that = this;

        //获取用户社交信息
        api.social(true).then(res => {
            that.setData({
                topList: [res.totalBrokerage, res.usedBrokerage, res.totalBrokerage - res.usedBrokerage - res.usingBrokerage],
                remainAmount: res.totalBrokerage - res.usedBrokerage - res.usingBrokerage
            });
        });
        //延迟获取记录
        setTimeout(function () {
            //累计奖金
            api.moneyLog(1).then(res => {
                that.setData({
                    totalBrokerage: res.data
                });
            });
            //已提现奖金
            api.moneyLog(-1).then(res => {
                that.setData({
                    withdrawList: res.data
                });
            });
            //文案-如何获取面膜
            api.article(1).then(res => {
                html.wxParse('article', 'html', res.content, that, 0);
                that.setData({
                    desc: res.content
                });
            });
        }, 1000);
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
})