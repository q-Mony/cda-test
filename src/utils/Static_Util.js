// utils.js
const myEnvVar = process.env.NODE_ENV;
let https_url = "http://192.168.31.210:8080";
// 判断环境变量的值
if (myEnvVar === "production") {
  https_url = "https://api.b18a.xyz";
} else if (myEnvVar === "development") {
  console.log("开发模式");
  https_url = "http://192.168.100.55:32775"
} else {
  console.log("未知模式");
}
class StaticUtils {
  static https_url = https_url;
  // 获取环境变量的值
}

export default StaticUtils;
