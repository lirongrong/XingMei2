const api = require("../../utils/api.js");
const html = require('../../wxParse/wxParse.js');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        idBtn: 0,
        page:1,
        pageSize:8,
        list: [],
        nullhits: true, //先设置隐藏
        desc: '', //获取团队文案
        noData:false
    },

    bindData: function (page) {
        var that = this;
        if (page) {
            that.setData({
                page: page
            });
        }
        //推荐用户列表
        api.recommendUsers({
            hasOrder: true,
            showChildrenCount:6
        }).then(res => {
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
     */
    onLoad: function () {
        var that = this;

        that.bindData(1);

        //文案-如何获取团队
        api.article(3).then(res => {
            html.wxParse('article', 'html', res.content, that, 0);
            that.setData({
                desc: res.content
            });
        });
    },

    tapGroup: function (e) {
        var count = e.currentTarget.dataset.childrencount;
        if (count > 0) {
            wx.navigateTo({
                url: '/pages/my/groupChild?id=' + e.currentTarget.id
            });
        }
    },
    // 点击如何获取奖金
    tapOpen() {
        this.setData({
            nullhits: false, //弹窗显示
            idBtn: 2
        });
    },
    tapClose() {
        this.setData({
            nullhits: true //弹窗隐藏
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
        this.setData({
            page: 1,
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