var api = require("../../utils/api.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isChoose: false,
        addressList: [],
    },
    // 编辑地址
    tapEdit: function (e) {
        wx.redirectTo({
            url: '../../pages/address/edit?id=' + e.currentTarget.dataset.id
        });
    },
    /**
     * 新增地址
     * @param {object} e - 事件
     */
    tapAdd: function (e) {
        wx.redirectTo({
            url: '../../pages/address/edit'
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        var that = this;
        var isChoose = wx.getStorageSync('address-choose'); 
        that.setData({
            isChoose: isChoose
        });
        api.addresses().then(res => {
            that.setData({
                addressList: res.data
            });
        });
    },

    /**
     * 选中地址
     */
    addressChoose:function(e){
        var that = this;
        var index = e.currentTarget.dataset.id;
        if(that.data.isChoose){ 
            //设置缓存中的订单
            var address = that.data.addressList[index];
            var order = wx.getStorageSync('order'); 
            order.address = address;
            wx.setStorageSync('order',order);
            //清除选中
            wx.removeStorageSync('address-choose'); 
            wx.navigateTo({
                url:'../../pages/order/pay'
            });
        }
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