class Axios {
  constructor(config) {
    this.defaults = config;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    };
  }
  request(config) {
    //  处理config.method，统一设置为小写
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = "get";
    }
    // 成功的值为合并后的配置
    let promise = Promise.resolve(config);
    // 拦截器中间件，第一个用来发送请求的函数，第二个用来占位
    let chains = [dispatchRequest, undefined];
    // 处理拦截,请求拦截为栈，响应拦截为队列
    this.interceptors.request.handlers.forEach((item) => {
      chains.unshift(item.fulfilled, item.rejected);
    });
    this.interceptors.response.handlers.forEach((item) => {
      chains.push(item.fulfilled, item.rejected);
    });
    // 处理chains
    while (chains.length) {
      promise = promise.then(chains.shift(), chains.shift());
    }
    return promise;
  }
  get(config) {
    return this.request(config);
  }
  post(config) {
    return this.request(config);
  }
}
// 拦截器类
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }
  use(fulfilled, rejected) {
    this.handlers.push({ fulfilled, rejected });
  }
}
// xhr适配器
function xhrAdapter(config) {
  // 发送ajax
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    //初始化
    xhr.open(config.method, config.url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
          let val = {
            config: config,
            code: 200,
            // 转换json数据
            data: JSON.parse(xhr.response),
            header: xhr.getAllResponseHeaders(),
            request: xhr,
            status: xhr.status,
            statusText: xhr.statusText,
          };
          resolve(val);
        } else {
          console.log("请求失败");
          reject(new Error("请求失败"));
        }
      }
    };
    // 取消请求
    if (config.cancelToken) {
      config.cancelToken.promise.then((resolve) => {
        xhr.abort();
        console.log("请求取消");
        reject(new Error("请求已被取消"));
      });
    }
  });
}
//
function dispatchRequest(config) {
  return xhrAdapter(config).then(
    (res) => {
      // 响应结果转换
      return res;
    },
    (err) => {
      throw err;
    }
  );
}
function createInstance(defaultConfig) {
  let context = new Axios(defaultConfig);
  let instance = Axios.prototype.request.bind(context);
  // Axios原型的属性绑定给instance
  Object.keys(Axios.prototype).forEach((key) => {
    instance[key] = Axios.prototype[key];
  });
  // context的属性绑定给instance
  Object.keys(context).forEach((key) => {
    instance[key] = context.prototype[key];
  });
  // 绑定取消请求的函数
  instance.CancelToken = function (excutor) {
    let resolvePromise;
    // 为实例对象添加属性
    this.promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    excutor(function () {
      resolvePromise();
    });
  };
  return instance;
}
