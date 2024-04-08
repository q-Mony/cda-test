// utils.js
const https_url = process.env.REACT_APP_API_URL;
const kya_https_url = process.env.REACT_APP_KYA_API_URL;
const online_https_url = process.env.REACT_APP_ONLINE_API_URL;
const online_kya_https_url = process.env.REACT_APP_ONLINE_KYA_API_URL;
const node_mode = process.env.NODE_ENV;
class StaticUtils {
  
  static https_url = node_mode === "production" ? online_https_url : https_url;
  static kya_https_url = node_mode === "production" ? online_kya_https_url : kya_https_url;

  // 获取环境变量的值
}

export default StaticUtils;
