# [Axios](https://axios-http.com/zh/docs/intro) 简介

## 是什么？

Axios 是一个基于**promise 网络请求库**，作用于 node.js 和浏览器中。是[同构](https://www.lullabot.com/articles/what-is-an-isomorphic-application)的。（基于 promise 的 http 客户端）

## 特性

- 同构：从浏览器创建 XMLHttpRequests，从 node.js 创建 http 请求
- 支持 promiseAPI
- 拦截器：拦截请求和响应
- 转换请求和相应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 XSRF

## 用法

# 原理

- 创建 axios，包含 defaults 和 interceptors 属性；
- 设置拦截器，向拦截器 handlers 属性中添加对象
- 调用 axios，触发 Axios.prototype.request 调用
  把请求拦截器 handlers 属性加到 chains 数组前边
  把响应拦截器 handlers 属性加到 chains 数组后边
  遍历 chains 数组，处理请求拦截，触发 dispatchRequest 函数
- 触发 xhrAdapte 函数，发送请求，状态改为 padding
  请求完成，触发 resolve，继续遍历 chains 数组，处理响应拦截
- 触发 axios().then()或 axios().catch()函数

# json-server

[json-server](https://github.com/typicode/json-server)

# 补充

- 同构应用程序是代码可以在服务器和客户端中运行的应用程序。
