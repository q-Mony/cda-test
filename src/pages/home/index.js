import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

import {
  handleJSAPIAccess,
  handleUserAuth,
} from "../../utils/auth_access_util";
import "./index.css";

export default function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, SetSuccessMsg] = useState("Loading");

  useEffect(() => {
    // 鉴权处理
    handleJSAPIAccess((isSuccess) => {
      console.log("handleJSAPIAccess OK: ", isSuccess);

      if (isSuccess) {
        // 免登处理
        handleUserAuth((userInfo) => {
          localStorage.setItem("userName", userInfo.en_name);
          // 导航到Main页面
          navigate("/main", { state: { userInfo }, replace: true });
          setIsLoading(false); // 停止加载状态
        });
      } else {
        SetSuccessMsg("该应用对你不可见，你没有访问权限");
      }
    });
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="home">
        {/* 加载中提示 */}
        <Spin tip={successMsg} size="large">
          <div className="content" />
        </Spin>
      </div>
    );
  }

  return null; // 当加载完成后返回 null，组件内容将不再渲染
}
