const api = require("../../utils/api.js");
const util = require("../../utils/util.js");
const html = require('../../wxParse/wxParse.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:0,
        model:{}
    },

    /**
     * 生命周期函数--监听页面加载
     * @param {any} e-加载事件源
     */
    onLoad: function (e) {
        var that = this;
        var id = e.id || 1;
        api.product(id).then(function(res){
            html.wxParse('article', 'html', res.content || '', that, 0);
            that.setData({
                id:id,
                model:res
            });
        });
    },
    //点击立即购买
    tapPay: function () {
        var that = this;
        //试用款只能购买一次
        if(that.data.id == 5){
            api.existsOrder(that.data.id,true).then((res)=>{
                if(res){
                    util.error('试用装只能下单一次吆！');
                    return;
                }else{
                    that.toPay();
                }
            });
        }
        else{
            that.toPay();
        }
    },

    toPay:function(){
        var that = this;
        //下单
        api.existsOrder(that.data.id).then(res => {
            //还有未支付的订单
            if (res) {
                util.alert('该产品还有未支付的订单，请勿重复下单！');
                setTimeout(function () {
                    wx.redirectTo({
                        url: '../../pages/order/list?id=1'
                    });
                }, 2000);
            } else {
                wx.setStorage({
                    key: 'order',
                    data: {
                        productId: that.data.id,
                        count: 1
                    }
                });
                wx.redirectTo({
                    url: '/pages/order/pay'
                });
            }
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
})