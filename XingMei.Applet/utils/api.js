const config = require("../config.js");
const md5 = require("security.js");
const _ = require("underscore.js");
const util = require("util.js");

//处理API请求头
const getHeader = () => {
    //添加api验证信息
    var appKey = config.apiConfig.appKey;
    var appSecret = config.apiConfig.appSecret;
    var apiVersion = "1";
    var now = new Date();
    var timeStamp = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    var headers = {};
    headers["X-AppKey"] = appKey;
    headers["X-ApiVersion"] = apiVersion;
    headers["X-TimeStamp"] = timeStamp;
    var strSign = appSecret + "apiVersion" + apiVersion + "appKey" + appKey + "timeStamp" + timeStamp;
    var sign = md5.md5(strSign);
    headers["X-Sign"] = sign;
    //是否登录
    var user = wx.getStorageSync("currentUser");
    if (user) {
        headers["X-Authorization"] = user.token;
    }
    return headers;
}

//请求API
const api = (opts) => {
    //是否有loading加载
    if (opts.loading) {
        wx.showLoading({
            title: '加载中',
        });
    }
    return new Promise((resolve, reject) => {
        var headers = opts.header || getHeader();
        //请求内容类型
        opts.dataType = "json";
        if (!opts.type)
            opts.type = "GET";
        opts.contentType = "application/json";
        //动态删除为null的参数属性
        for (var key in opts.data) {
            if (opts.data[key] == null || typeof(opts.data[key]) == undefined)
                delete opts.data[key];
        }
        if (opts.data && opts.type) {
            var type = opts.type.toUpperCase();
            if (type == "POST" || type == "PUT")
                opts.data = JSON.stringify(opts.data);
        };
        wx.request({
            url: config.apiConfig.host + opts.url,
            header: headers,
            data: opts.data,
            method: opts.type,
            contentType: opts.contentType,
            success: res => {
                //业务异常处理
                if (res.statusCode == 250) {
                    wx.showToast({
                        title: res.data,
                        icon: "none",
                        duration: 2000
                    });
                    reject(res);
                } else if (res.statusCode == 500) {
                    wx.showToast({
                        title: '系统异常，请联系客服',
                        icon: "none",
                        duration: 2000
                    });
                    reject(res);
                } else {
                    resolve(res.data);
                }
            },
            fail: res => {
                wx.showToast({
                    icon: "none",
                    title: "操作失败：" + res.errMsg,
                    duration: 3000
                });
                reject(res);
            },
            complete: res => {
                //隐藏加载
                if (opts.loading) {
                    wx.hideLoading();
                }
            }
        });
    });
};


module.exports = {
    /**
     * 记录日志
     * @param {String} msg -消息
     * @param {Boolean} isError -是否是错误消息
     * @return {Boolean} -是否执行成功
     */
    log: (msg, isError) => {
        return api({
            url: 'helper/log' + (error ? '/error' : ''),
            type: 'post',
            data: {
                data: msg
            }
        });
    },

    /**
     * 登录
     * @param {appId} appId -应用编号
     * @param {code} code -代码
     */
    login: (appId, code) => {
        return api({
            url: 'wechat/applet/login',
            data: {
                code: code,
                appId: appId
            }
        });
    },

    /**
     * 登录并缓存用户
     * @param {Boolean} hasLoading -是否有加载弹窗
     * @return {Object} -登录后的应用用户
     */
    wxLogin: (hasLoading) => {
        if (hasLoading) {
            wx.showLoading({
                title: '加载中'
            });
        }
        return new Promise((resolve, reject) => {
            // 没有授权则进入授权页面
            wx.getSetting({
                success: res => {
                    if (!res.authSetting['scope.userInfo']) {
                        resolve();
                        wx.reLaunch({
                            url: "/pages/index/login"
                        });
                    } else {
                        wx.login({
                            success: res => {
                                api({
                                    url: 'wechat/applet/login',
                                    data: {
                                        code: res.code,
                                        appId: config.appId
                                    }
                                }).then((res) => {
                                    wx.setStorageSync("currentUser", res);
                                    if (hasLoading) {
                                        wx.hideLoading();
                                    }
                                    resolve(res);
                                });
                            }
                        });
                    }
                }
            });
        });
    },

    /**
     * 获取横幅列表
     * @param {Number} typeId -横幅类型编号
     */
    banners: (typeId) => {
        return new Promise(function(resolve, reject) {
            api({
                url: 'site/adimage/' + typeId
            }).then(res => {
                _.each(res, function(item) {
                    item.image = config.imgHost + item.image;
                });
                resolve(res);
            }, err => {
                reject(err);
            });
        });
    },

    /**
     * 获取文章
     * @param {int} id -文章编号
     */
    article: (id) => {
        return api({
            url: 'site/article/' + id
        });
    },

    /**
     * 获取产品列表
     * @param {Object} param -请求参数
     * @param {Number} param.type - 产品类型编号
     * @param {Number} param.parentType -父产品类型编号
     * @param {Number} param.minPrie -最小金额
     * @param {Number} param.maxPrice -最大金额
     * @param {Number} attr -特性：1,首页;2,推荐;4,精选
     * @param {Number} page -页数
     * @param {Number} pageSize -每页数量
     * @param {Number} sort -排序：0,最新;1,最热;2,价格;10,排序;
     */
    products: (param) => {
        return new Promise((resolve, reject) => {
            api({
                url: 'product',
                data: param
            }).then(res => {
                _.each(res.data, function(item) {
                    item.image = config.imgHost + item.image;
                });
                resolve(res);
            });
        });
    },

    /**
     * 获取产品详情
     * @param {int} id -产品编号
     */
    product: (id) => {
        return new Promise(function(resolve, reject) {
            var model = wx.getStorageSync('product-' + id);
            if (!model) {
                api({
                    url: 'product/' + id
                }).then(res => {
                    res.image = config.imgHost + res.image;
                    if (!res.imageList || res.imageList.length == 0) {
                        res.imageList = [];
                        res.imageList.push({
                            path: res.image
                        });
                    }
                    wx.setStorageSync('product-' + res.id, res);
                    resolve(res);
                });
            } else
                resolve(model);
        });
    },

    /**
     * 获取地址列表
     */
    addresses: () => {
        return api({
            url: 'user/address'
        });
    },

    /**
     * 获取地址
     * @param {int} id -地址编号，如无则为默认地址
     * @param {bool} loading -是否展示加载弹窗
     */
    address: (id, loading) => {
        if (id) {
            return api({
                url: 'user/address/' + id,
                loading: loading
            });
        } else {
            return api({
                url: 'user/address/default'
            });
        }
    },

    /**
     * 保存地址
     * @param {Object} address -地址对象
     */
    saveAddress: (address) => {
        return api({
            url: 'user/address' + (address.id ? '/' + address.id : ''),
            type: address.id ? 'put' : 'post',
            data: {
                id: address.id,
                name: address.name,
                mobile: address.mobile,
                province: address.province,
                city: address.city,
                area: address.area,
                address: address.address,
                isDefault: address.isDefault || true
            }
        });
    },

    /**
     * 是否存在订单
     * @param {Number} productId -产品编号
     * @param {Boolean} hasPaid -是否支付
     */
    existsOrder: (productId, hasPaid) => {
        return api({
            url: 'trade/order/exists',
            data: {
                productId: productId,
                hasPaid: hasPaid
            }
        });
    },

    /**
     * 下单
     * @param {Object} order -地址对象
     */
    order: (order) => {
        //参数对象
        var data = {
            productId: order.productId,
            count: order.count
        };
        //收获地址
        if (order.address) {
            data.receiverName = order.address.name;
            data.receiverMobile = order.address.mobile;
            data.receiverProvince = order.address.province;
            data.receiverCity = order.address.city;
            data.receiverArea = order.address.area;
            data.receiverAddress = order.address.address;
        }

        return api({
            url: 'trade/order',
            type: 'post',
            data: data,
            loading: true
        });
    },

    /**
     * 支付
     * @param {Object} payModel -支付对象
     * @param {Number} payModel.id -订单编号(id或name必传一个)
     * @param {String} payModel.name -订单名称(id或name必传一个)
     * @param {String} payModel.appId -应用ID(必传)
     * @param {String} payModel.deviceInfo -设备号
     */
    pay: (payModel) => {
        return api({
            url: 'trade/order/pay/applet',
            type: 'post',
            data: {
                id: payModel.id,
                name: payModel.name,
                appId: config.appId,
                deviceInfo: payModel.deviceInfo
            }
        });
    },

    /**
     * 保存用户微信信息
     * @param {Object} user -用户授权后的信息，例如授权后的 e.detail.userInfo
     */
    saveWechatInfo: (user) => {
        return api({
            url: 'user/wechat/info',
            type: 'put',
            data: user
        });
    },

    /**
     * 获取二维码图片链接
     * @param {Boolean} loading -是否显示加载框
     */
    qrcode: (loading) => {
        var user = wx.getStorageSync("currentUser");
        return api({
            url: 'user/wechat/qrcode/applet',
            data: {
                openId: user.extend
            },
            loading: loading
        });
    },

    /**
     * 订单状态数量
     */
    orderStatusCount: () => {
        return api({
            url: 'trade/order/status/count'
        });
    },

    /**
     * 订单列表
     * @param {Number} status -状态
     * @param {Number} page -当前页
     * @param {Number} pageSize -每页数量
     */
    orders: (status, page, pageSize) => {
        return new Promise(function(resolve, reject) {
            api({
                url: 'trade/order',
                data: {
                    status: status,
                    page: page,
                    pageSize: pageSize
                }
            }).then(resOrders => {
                _.each(resOrders.data, function(order) {
                    if (order.firstProduct && order.firstProduct.image && order.firstProduct.image.indexOf('http') < 0)
                        order.firstProduct.image = config.imgHost + order.firstProduct.image;
                    _.each(order.productList, function(item) {
                        if (item.image && item.image.indexOf('http') < 0)
                            item.image = config.imgHost + item.image;
                    });
                });
                resolve(resOrders);
            });
        });
    },

    /**
     * 订单详情
     * @param {Number} orderId -订单编号
     */
    orderInfo: (orderId) => {
        return new Promise(function(resolve, reject) {
            api({
                url: 'trade/order/' + orderId
            }).then(res => {
                if (res.firstProduct && res.firstProduct.image && res.firstProduct.image.indexOf('http') < 0)
                    res.firstProduct.image = config.imgHost + res.firstProduct.image;
                _.each(res.productList, function(item) {
                    if (item.image && item.image.indexOf('http') < 0)
                        item.image = config.imgHost + item.image;
                });
                resolve(res);
            });
        });
    },

    /**
     * 用户社交信息
     * @param {Boolean} loading -是否显示加载弹出窗
     */
    social: (loading) => {
        return api({
            url: 'user/social',
            loading: loading
        });
    },

    /**
     * 设置推荐人
     * @param {Number} recommendUserId -推荐人编号
     */
    recommend: (recommendUserId) => {
        return api({
            url: 'user/recommend',
            type: 'put',
            data: {
                recommendUserId: recommendUserId
            }
        });
    },

    /**
     * 签到信息
     */
    checkinInfo: () => {
        return api({
            url: 'user/checkin'
        });
    },

    /**
     * 签到
     */
    checkin: () => {
        return api({
            url: 'user/checkin',
            data: {},
            type: 'post'
        });
    },

    /**
     * 金额日志
     * @param {Number} operate -操作：1,已获取的奖金；-1,已提现的奖金
     */
    moneyLog: (operate) => {
        return api({
            url: 'trade/money/log',
            data: {
                operate: operate
            }
        });
    },

    /**
     * 提现
     * @param {Number} money -提现金额
     */
    withdraw: (money) => {
        return api({
            url: 'trade/money/withdraw',
            type: 'post',
            data: {
                money: money
            }
        });
    },

    /**
     * 金额日志
     * @param {Number} operate -操作：1,已获取的礼品；-1,已使用的礼品
     */
    giftLog: (operate) => {
        return api({
            url: 'trade/gift/log',
            data: {
                operate: operate
            }
        });
    },

    /**
     * 粉丝数量
     * @param {Number} userId -用户编号
     */
    fansCount: () => {
        return api({
            url: 'user/social/recommendUser/count',
            data: {
                hasOrder: false
            }
        });
    },

    /**
     * 推荐用户列表
     * @param {Object} param -请求参数对象
     * @param {Number} param.recommendUserId -用户编号
     * @param {Number} param.showChildrenCount -查看子分类数量
     * @param {Boolean} param.hasOrder -是否有订单
     * @param {Number} param.page -当前页
     * @param {Number} param.pageSize -每页数量
     */
    recommendUsers: (param) => {
        return api({
            url: 'user/social/recommendUser',
            data: param
        });
    },

    /**
     * 上传
     * @param {String} path -路径
     * @param {String} folder -文件夹
     */
    upload: (path, folder) => {
        return new Promise((resolve, reject) => {
            var headers = getHeader();
            headers["Content-Type"] = "multipart/form-data";
            wx.uploadFile({
                url: config.apiConfig.host + "wechat/applet/upload",
                filePath: path,
                name: 'file',
                formData: {
                    folder: folder
                },
                header: headers,
                success: res => {
                    resolve(res);
                },
                fail: res => {
                    reject(res);
                }
            });
        });
    }
};