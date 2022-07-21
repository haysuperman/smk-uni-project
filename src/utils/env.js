var env = {
  baseUrl: "!!!",
  RSA_PRI_KEY: "",
};
//测试地址
if (process.env.NODE_ENV === "development") {
  env.baseUrl = process.env.VUE_APP_PROXY_API;
  //正式地址
} else if (process.env.NODE_ENV === "production") {
  env.baseUrl = process.env.VUE_APP_BASE_URL;
}
env.RSA_PRI_KEY = process.env.VUE_APP_RSA_PRI_KEY;
export default env;
