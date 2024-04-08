import "./index.css";
import logo from "../../logo.svg";
import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
function UserInfo(props) {
  let userInfo = props.userInfo;
  if (!userInfo) {
    userInfo = {};
  }
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(false);
  const [clickCount, setClickCount] = React.useState(0);

  const toggleVisibility = () => {
    // 每次点击增加点击次数
    setClickCount(clickCount + 1);
    // 在10秒内重置点击次数
    setTimeout(() => {
      setClickCount(0);
    }, 10000);

    // 如果点击次数达到5次，则执行相应操作
    if (clickCount === 4) {
      // 在这里执行您想要的操作
      setIsVisible(!isVisible);
    }
  };

  return (
    <div className="userinfo-body">
      <div className="userinfo">
        <img
          className="avatar"
          src={userInfo.avatar_url || logo}
          alt=""
          onClick={toggleVisibility}
        />
        <span className="name">
          {userInfo.name && userInfo.name.length > 0
            ? "Welcome to  use cda Server"
            : ""}
        </span>
      </div>
      <Button
        type="primary"
        className="item-button"
        style={{
          visibility: isVisible ? "visible" : "hidden",
          display: isVisible ? "inline-block" : "none",
        }}
        onClick={() => {
            navigate(`/kyauser`)
        }}
      >
        KYA 添加企业账号
      </Button>
    </div>
  );
}

export default UserInfo;
