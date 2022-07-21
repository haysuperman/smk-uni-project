import env from "../utils/env";

export function service(options = {}) {
  options.url = `${env.baseUrl}${options.url}`;
  // 判断本地是否存在token，如果存在则带上请求头
  // if (getToken()) {
  // 	options.header = {
  // 		'content-type': 'application/json',
  // 		'Authorization': `${getToken()}`	// 这里是token(可自行修改)
  // 	};
  // }
  return new Promise((resolved, rejected) => {
    options.success = (res) => {
      resolved(res.data);
    };
    options.fail = (err) => {
      // 请求失败弹窗
      uni.showToast({
        icon: "none",
        duration: 3000,
        title: "服务器错误,请稍后再试",
      });
      rejected(err);
    };
    uni.request(options);
  });
}
