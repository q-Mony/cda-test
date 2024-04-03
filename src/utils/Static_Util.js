// utils.js
const isDebug = process.env.isDebug;

let https_url = "http://192.168.31.210:8080";
// 判断环境变量的值
if (!isDebug) {
  https_url = "https://api.b18a.xyz";
} else {
  https_url = "http://192.168.100.55:32775"
}
class StaticUtils {
  static https_url = https_url;
  // 获取环境变量的值
}

export default StaticUtils;
