import axios from "axios";
import clientConfig from "../config/client_config.js";
import Cookies from "js-cookie";
import StaticUtils from "./Static_Util.js";

const LJ_TOKEN_KEY = "lk_token";
const isDebug = process.env.REACT_APP_DEBUG;
/// ---------------- JSAPI鉴权 部分 -------------------------

export async function handleJSAPIAccess(complete) {
  console.log("\n----------[接入方网页JSAPI鉴权处理 BEGIN]----------");
  const url = encodeURIComponent(window.location.href.split("#")[0]);
  console.log("接入方前端[JSAPI鉴权处理]第① 步: 请求JSAPI鉴权参数");
  // 向接入方服务端发起请求，获取鉴权参数（appId、timestamp、nonceStr、signature）
  const res = await axios.get(
    `${getOrigin(clientConfig.apiPort)}${
      clientConfig.getSignParametersPath
    }?url=${url}`,
    { withCredentials: true }
  );
  if (!res.data) {
    console.error(`${clientConfig.get_auth_parameters} fail`);
    complete(false);
    return;
  }

  const data = res.data.data;
  console.log("接入方前端[JSAPI鉴权处理]第② 步: 获得鉴权参数");
  if (!data) {
    console.error("获取参数失败");
    complete(false);
    return;
  }
  console.log(
    "接入方前端[JSAPI鉴权处理]第③ 步: 通过window.h5sdk.config进行鉴权"
  );
  configJSAPIAccess(data, complete);
}

//config JSAPI鉴权
function configJSAPIAccess(data, complete) {
  //配置要使用的jsapi列表
  let jsApiList = [
    "tt.getSystemInfo",
    "tt.showActionSheet",
    "tt.previewImage",
    "tt.showToast",
  ];

  // 调用config接口进行鉴权
  window.h5sdk.config({
    appId: data.app_id,
    timestamp: data.timestamp,
    nonceStr: data.noncestr,
    signature: data.signature,
    jsApiList: jsApiList,
    //成功回调
    onSuccess: (res) => {
      console.log(`鉴权成功: ${JSON.stringify(res)}`);
      window.tt.showToast({
        title: "跳转中请稍候。。。",
        icon: "success",
        duration: 1000,
      });
      complete(true);
      console.log("\n----------[接入方网页鉴权处理 END]----------");
    },
    //失败回调
    onFail: (err) => {
      window.tt.showToast({
        title: "鉴权失败,您没有该应用访问权限",
        icon: "error",
        duration: 2000,
      });
      complete(false);
      console.error(`鉴权失败原因: ${JSON.stringify(err)}`);
    },
  });
}

/// ---------------- 应用免登 部分 -------------------------
//处理用户免登逻辑
export async function handleUserAuth(complete) {
  console.log("\n----------[接入方网页免登处理 BEGIN]----------");
  let lj_tokenString = Cookies.get(LJ_TOKEN_KEY) || "";
  if (lj_tokenString.length > 0) {
    console.log("接入方前端[免登处理]第① 步: 用户已登录，请求后端验证...");
    requestUserAccessToken("", complete);
  } else {
    if (!window.h5sdk) {
      console.log("invalid h5sdk");
      complete();
      return;
    }
    console.log(
      "接入方前端[免登处理]第① 步: 依据App ID调用JSAPI tt.requestAuthCode 请求免登授权码"
    );
    //依据App ID调用JSAPI tt.requestAuthCode 请求登录预授权码code
    window.h5sdk.ready(() => {
      console.log("window.h5sdk.ready");
      window.tt.requestAuthCode({
        appId: clientConfig.appId,
        success: (info) => {
          const code = info.code;
          if (code.length <= 0) {
            console.error("auth code为空");
            complete();
          } else {
            requestUserAccessToken(code, complete);
          }
        },
        fail: (error) => {
          complete();
          console.error("window.tt.requestAuthCode", error);
        },
      });
    });
  }
}

function requestUserAccessToken(code, complete) {
  // 获取user_access_token信息
  console.log(
    "接入方前端[免登处理]第② 步: 去接入方服务端获取user_access_token信息"
  );
  axios
    .get(
      `${getOrigin(clientConfig.apiPort)}${
        clientConfig.getUserAccessTokenPath
      }?code=${code}`,
      { withCredentials: true } //调用时设置 请求带上cookie
    )
    .then(function (response) {
      // ignore_security_alert
      if (!response.data) {
        console.error(`${clientConfig.getUsee} response is null`);
        complete();
        return;
      }
      const data = response.data.data;
      if (data) {
        console.log("接入方前端[免登处理]第③ 步: 获取user_access_token信息");
        complete(data);
        localStorage.setItem(LJ_TOKEN_KEY, data.access_token);
        console.log("----------[接入网页方免登处理 END]----------\n");
      } else {
        console.error(
          "接入方前端[免登处理]第③ 步: 未获取user_access_token信息"
        );
        complete();
        console.log("----------[接入网页方免登处理 END]----------\n");
      }
    })
    .catch(function (error) {
      console.log(`${clientConfig.getSignParametersPath} error:`, error);
      complete();
      console.log("----------[接入网页方免登处理 END]----------\n");
    });
}

function getOrigin(apiPort) {
  let hostname = window.location.hostname;

  console.log(+"模式"+isDebug);
  // 判断环境变量的值
  if (!isDebug) {
    return isDebug+`https://${hostname}`;
  }
  return isDebug+`http://${hostname}:${apiPort}`;
}

// 定义一个函数用于发起 GET 请求
export async function fetchData(endpoint, params) {
  try {
    const paramString = new URLSearchParams(params).toString();
    const urlWithParams = `${endpoint}?${paramString}`;
    // 发起 GET 请求并等待响应
    const response = await axios.get(urlWithParams);
    // 返回响应数据
    return response.data;
  } catch (error) {
    // 捕获错误并打印错误信息
    console.error("Error:", error);
    // 返回 null 或其他适当的错误处理
    return null;
  }
}

export async function postData(endpoint, data) {
  try {
    const url = `${endpoint}`;
    // 发起 POST 请求并等待响应
    const response = await axios.post(url, data);
    // 返回响应数据
    return response.data;
  } catch (error) {
    // 捕获错误并打印错误信息
    console.error("Error:", error);
    // 返回 null 或其他适当的错误处理
    return null;
  }
}

export async function postParamsData(endpoint, data) {
  try {
    // 构建 FormData 对象
    const formData = new FormData();
    // 将数据添加到 FormData
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    // 发起 POST 请求并等待响应
    const response = await axios.post(endpoint, formData);
    // 返回响应数据
    return response.data;
  } catch (error) {
    // 捕获错误并打印错误信息
    console.error("Error:", error);
    // 返回 null 或其他适当的错误处理
    return null;
  }
}
