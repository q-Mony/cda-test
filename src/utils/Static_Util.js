// utils.js
const https_url = process.env.REACT_APP_API_URL;
const kya_https_url = process.env.REACT_APP_KYA_API_URL;

class StaticUtils {
  static https_url = https_url;
  static kya_https_url = kya_https_url;
  // 获取环境变量的值
}

export default StaticUtils;
