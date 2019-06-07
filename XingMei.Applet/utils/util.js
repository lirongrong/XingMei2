const config = require("../config.js");

module.exports = {
    

    /*
     * 格式化时间
     * @param {DateTime} date 时间
     **/
    formatTime: (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        //格式化数字
        const formatNumber = n => {
            n = n.toString();
            return n[1] ? n : '0' + n;
        };
        return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
    },

    /*
     * 创建随机码
     * @param {Number} num -个数
     * @param {Boolean} hasLetter -是否包含字母
     **/
    createCode: (num, hasLetter) => {
        var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var res = "";
        var count = 9;
        if (hasLetter)
            count = 35;
        for (var i = 0; i < num; i++) {
            var id = Math.ceil(Math.random() * count);
            res += chars[id];
        }
        return res;
    },

    /*
     * 错误提醒
     * @param {msg} msg -提醒消息
     **/
    alert: (msg, duration) => {
        return new Promise((resolve) => {
            wx.showToast({
                title: msg,
                icon: 'none',
                duration: duration || 1500
            });
            setTimeout(()=>{
                resolve();
            }, duration || 1500);
        });
    },

    /*
     * 错误提醒
     * @param {String} msg -错误消息
     **/
    error: (msg) => {
        wx.showModal({
            title: '提示',
            content: msg,
            showCancel: false
        });
    },

    /*
     * 把字符串转化成对象，如 userId=1&shopId=1
     * @param {String} str -Url字符串
     **/
    toObject: (str) => {
        var obj = {};
        var arr = str.split(/[=,&]/);
        if (arr.length > 0 && arr.length % 2 === 0) {
            for (var i = 0; i < arr.length; i + 2) {
                obj[arr[i]] = obj[arr[i + 1]];
            }
        }
        return obj;
    }
};