const config = require("../../config.js");
const api = require("../../utils/api.js");
const util = require("../../utils/util.js");
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        backgroundImg: null,
        avatarUrl: '',
        nickName: '',
        qrcodeImg: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        var that = this;
        that.setData({
            backgroundImg: config.imgHost + 'config/sharedbg.jpg'
        });

        wx.showLoading({
            title: '正在加载中..',
        });
        Promise.all([that.getUser(), that.getQrcode()]).then(() => {
            Promise.all([
                that.downloadImg(that.data.backgroundImg),
                that.downloadImg(that.data.avatarUrl),
                that.downloadImg(that.data.qrcodeImg)])
            .then((res) => {
                wx.hideLoading();
                const ctx = wx.createCanvasContext('shareCanvas', that);
                ctx.drawImage(res[0], 0, 0, 320, 569);
                // 头像
                //绘制白色小圆
                // ctx.beginPath();
                // ctx.arc(200, 160, 40, 0, Math.PI * 2, true);
                // ctx.fillStyle = "white";
                // ctx.closePath();
                // ctx.fill();
                
                
                ctx.save(); // 对当前区域保存
                ctx.beginPath() // 开始新的区域
                ctx.arc(60, 130, 28, 0, 2 * Math.PI, true);
                ctx.fillStyle = "white";
                ctx.clip(); // 从画布上裁剪出这个圆形
                ctx.drawImage(res[1], 30, 90, 60, 70);//头像
                ctx.restore(); // 恢复
                ctx.setTextAlign('center'); // 文字居中
                ctx.setFillStyle('#000000'); // 文字颜色：黑色
                ctx.setFontSize(13); // 文字字号：12px
                ctx.fillText(that.data.nickName, 114, 125);
                ctx.setFontSize(14) // 文字字号：14px
                ctx.fillText("我为第二肌代言", 145, 145);
                //二维码
                ctx.drawImage(res[2], 107, 417, 108, 108);
                ctx.stroke();
                ctx.draw();
            });
        });
    },
    //获取用户信息
    getUser: function () {
        var that = this;
        return new Promise((resolve, reject) => {
            wx.getUserInfo({
                success: function (res) {
                    //用户已经授权过
                    that.setData({
                        avatarUrl: res.userInfo.avatarUrl,
                        nickName: res.userInfo.nickName
                    });
                    resolve(res.userInfo);
                }
            });
        });
    },
    //获取二维码
    getQrcode: function () {
        var that = this;
        return api.qrcode(true).then(res => {
            that.setData({
                qrcodeImg: config.imgHost + "user/qrcode/" + app.globalData.appUser.id + ".jpg"
            });
        });
    },
    //下载图片
    downloadImg: function (url) {
        return new Promise((resolve, reject) => {
            wx.getImageInfo({
                src: url,
                success: function (res) {
                    resolve(res.path);
                }
            });
        });
    },
    //分享按钮
    shareBtn: function () {
        const wxCanvasToTempFilePath = this.wxPromisify(wx.canvasToTempFilePath);
        const wxSaveImageToPhotosAlbum = this.wxPromisify(wx.saveImageToPhotosAlbum);
        wxCanvasToTempFilePath({
            canvasId: 'shareCanvas'
        }, this).then(res => {
            return wxSaveImageToPhotosAlbum({
                filePath: res.tempFilePath
            });
        }).then(res => {
            wx.showToast({
                title: '已保存到相册，可以直接到微信中分享'
            });
        });
    },

    wxPromisify: function (fn) {
        return function (obj = {}) {
            return new Promise((resolve, reject) => {
                obj.success = function (res) {
                    resolve(res);
                };
                obj.fail = function (res) {
                    reject(res);
                };
                fn(obj);
            });
        };
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