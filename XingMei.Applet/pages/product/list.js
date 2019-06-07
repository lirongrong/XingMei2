const _ = require("../../utils/underscore.js");
const api = require("../../utils/api.js");
const util = require("../../utils/util.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        api.products({
            minPrice:0.01,
            sort:10
        }).then((res)=>{
            _.each(res.data,function(item){
                if(item.id == 5){
                    item.tag = '试用装';
                    item.number = '5片';
                    item.text = '仅限1次';
                }else if(item.id==1){
                    item.tag = '明星款';
                    item.number = '6盒';
                } else if (item.id == 3) {
                    item.tag = '爆款';
                    item.number = '10盒';
                }
            });
            res.data.push({
                id: 0,
                tag: '预售款',
                number: '',
                title: '医用修复面膜补水提亮肤色',
                price: '敬请期待',
                image: '../../images/list04.png'
            });
            that.setData({
                list:res.data
            });
        });
    },
    /**
     * 点击产品事件
     */
    tapProduct(e){
        if (e.currentTarget.dataset.id == 0){
            util.alert('敬请期待新品发布！');
        }else{
            wx.navigateTo({
                url: '/pages/product/detail?id=' + e.currentTarget.dataset.id
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