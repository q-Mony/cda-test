import { Button } from "antd";
import "./index.css";
import { useNavigate } from "react-router-dom";

export default function UseAPI() {
  const dataList = [
    { name: "Network 相关设置界面", link: "networks" },
    { name: "Organization 相关设置界面", link: "organization" },
  ];
  const navigate = useNavigate();
  const handleClick = (value) => {
    // 使用 navigate() 进行编程式导航到目标页面
    navigate(`/${value}`);
  };

  return (
    <div className="mybody">
      {dataList.map((item, index) => (
        <Button
          type="primary"
          className="item-button"
          onClick={() => handleClick(item.link)}
          key={index}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
}
