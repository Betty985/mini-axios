let config = {
  method: "GET",
  url: "",
};

function xhrAdapter(props) {
  Object.assign(config, props);
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
