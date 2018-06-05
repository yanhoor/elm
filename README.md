# 前言

>这是一个界面和功能基本仿照饿了么PC端页面的demo，使用这里提供的[API接口](https://github.com/bailicangdu/node-elm/blob/master/API.md)
本人学习前端时间并不长，前期只是找到一些简单的demo进行学习，渐渐觉得这样只能学会单一的技能，对于以后编写一个需要综合运用各种技术的项目没有太大帮助，
所以开始寻找一个能够让我学会完整技术栈的大型项目，如框架、Ajax、webpack、ES6、动画等，而一个界面优美、页面交互复杂、数据庞大的电商项目是一个不错
的选择。刚开始可能对于其中的某些技能还是不熟悉甚至是刚开始接触，但希望能通过这个项目逐渐深入，最后掌握并熟悉这些常用技术。偶然间在Github上搜索到这
个API，并且发现还有对应的前后端和后台数据的管理系统，更加利于研究学习。其作者的前端项目是移动平台的，于是我想完全参照其API和饿了么去开发PC端的项目。
>由于对性能方面还不够了解，因此本项目目前仍在添加功能阶段，之后再进行性能及其他的优化。


## 技术栈
Vue2 + vuex + vue-cli + vue-router + ES6 + axios + flex + sass


## 项目运行

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

# 目录结构

```
elm
├── build
├── config
├── src
│   ├── assets
│   ├── components
│   │   ├── common
│   │   └── directives
│   ├── config
│   ├── router
│   ├── service
│   ├── style
│   └── views
└── static
```

# 目标功能
- [x] 定位功能 -- 完成
- [x] 选择城市 -- 完成
- [x] 搜索地址 -- 完成
- [x] 展示所选地址附近商家列表 -- 完成
- [x] 搜索美食，餐馆 -- 完成
- [x] 根据距离、销量、评分、特色菜、配送方式等进行排序和筛选 -- 完成
- [x] 餐馆食品列表页、商家信息 -- 完成
- [x] 购物车功能 -- 完成
- [x] 登录账号、修改密码 -- 完成
- [ ] 个人中心 -- 未完全完成
- [x] 下单 -- 完成
- [x] 订单列表 -- 完成
- [ ] 订单详情 -- 未完成
- [x] 添加、删除、修改收货地址 -- 完成
- [x] 账户信息 -- 完成
- [ ] 上传头像  -- 未完成
