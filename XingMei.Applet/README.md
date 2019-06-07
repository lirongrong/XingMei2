## 微信小程序开发规范
宋飞  2019/04/29  v1.0版本

### 页面框架


```java
pages
|
|--index：首页模块
|   |----index(首页)
|   |----login(登录授权页)
|   |----start(启动页)
|--product：产品模块
|   |----list(列表页)
|   |----detail(详情页)
|   |----search(搜索页)
|--address：地址模块
|   |----list(列表页)
|   |----edit(编辑页)
|--order: 订单模块
|   |----list(列表页)
|   |----detail(详情页)
|   |----pay(支付页)
|--my: 个人中心模块
|   |----index(我的页面)
|   |----edit(编辑页)
|   |----score(积分页面)
|   |----scoreExcharge(积分兑换页面)
|   |----money(金额页面)
|   |----moneyRecharge(金额充值页面)
|   |----moneyWithdraw(金额提现页面)
|   |----checkin(签到页面)
|
```

### 代码标准
>> 注释遵循 [JsDoc](http://usejsdoc.org/) 的注释规范，每个方法注释全，尤其公共方法
```命名遵循驼峰命名法：
1.变量为名词，数组前加 arr
2.方法为动词或动名词
3.事件命名以事件动词开头，如绑定产品点击事件(bindtap)则tapProduct:function(){}
4.Js页面内容的顺序(依据修改频次)依次为：data(能不用写在这里就不需要写)、onLoad、onShow、自定义事件(事件先后以页面从上到下的顺序为准)、自定义辅助方法、其他微信事件
```
