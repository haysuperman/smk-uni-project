// 引用网络请求中间件
import { service } from "./../utils/request";
/**
 *    登陆请求
 */
export function testRequest(data) {
  return service({
    url: "/v1/queryRegister",
    method: "POST",
    data,
  });
}
