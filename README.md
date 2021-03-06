# 前言

>这是一个界面和功能基本仿照饿了么PC端页面的demo，使用这里提供的[API接口](https://github.com/bailicangdu/node-elm/blob/master/API.md)。
编写这个项目初衷是为了让自己学会并掌握一个完整的技术栈，如框架、Ajax、webpack、ES6、动画等，而一个界面优美、页面交互复杂、数据庞大的电商项目是一个不错
的选择。刚开始可能对于其中的某些技能还是不熟悉甚至是刚开始接触，但希望能通过这个项目逐渐深入，最后掌握并熟悉这些常用技术。偶然间在Github上搜索到这
个API，并且发现还有对应的前后端和后台数据的管理系统，更加利于研究学习。其作者的前端项目是移动平台的，于是我想完全参照其API和饿了么去开发PC端的项目。


## 技术栈
Vue2 + vuex + vue-cli + vue-router + iView + ES6/7 + axios + flex + sass


## 项目运行

``` bash
# 安装依赖
npm install

# 运行：localhost:8080
npm run dev

```

# 目录结构

```
elm
├── build                                       //webpack配置文件
├── config                                      //项目打包路径
├── src
│   ├── App.vue                                 //页面入口文件
│   ├── components                              //组件
│   │   ├── common                              //公共组件
│   │   │   ├── dropBalls.vue                   //菜品加入购物车时的小球动画
│   │   │   ├── food.vue                        //菜品组件
│   │   │   ├── footer.vue                      //页脚组件
│   │   │   ├── mixin.js                        //组件混合（含图片地址处理、顶栏用户名操作、菜品数量加减操作）
│   │   │   ├── restaurant.vue                  //商铺列表单个商铺组件
│   │   │   └── topbar.vue                      //顶部组件
│   │   └── directives                          //指令
│   │       ├── img.js                          //图片占位图
│   │       └── time.js                         //‘×××分钟前’形式更新时间指令
│   ├── config                                  //基本配置
│   │   └── axios.js                            //获取数据
│   ├── main.js                                 // 程序入口文件，加载各种公共组件
│   ├── router
│   │   └── index.js                            //路由配置
│   ├── service
│   │   └── getData.js                          //获取数据的统一调配文件，对接口进行统一管理
│   ├── style
│   │   └── mixin.scss                          //样式配置文件
│   └── views
│       ├── changepassword.vue                  //更改密码页面
│       ├── checkout.vue                        //确认订单页面
│       ├── home.vue                            //用户定位页面
│       ├── list.vue                            //商铺列表页面
│       ├── login.vue                           //登录页面
│       ├── profile.vue                         //个人中心页面
│       └──restaurant.vue                       //商铺详情页面
└── style.css                                   //全局样式文件
```

# 目标功能
- [x] 定位功能 -- 完成
- [x] 选择城市 -- 完成
- [x] 搜索地址 -- 完成
- [x] 展示所选地址附近商家列表 -- 完成
- [x] 搜索美食，餐馆 -- 完成
- [x] 根据距离、销量、评分、特色菜、配送方式等对菜品进行排序和筛选 -- 完成
- [x] 餐馆食品列表页、商家信息 -- 完成
- [x] 购物车功能 -- 完成
- [x] 登录账号、修改密码 -- 完成
- [ ] 个人中心 -- 未完全完成
- [x] 下单 -- 完成
- [x] 订单列表 -- 完成
- [x] 订单详情 -- 未完成
- [x] 添加、删除、修改收货地址 -- 完成
- [x] 账户信息 -- 完成
- [x] 侧栏操作中心 -- 完成
- [ ] 我的收藏 -- 未完成
