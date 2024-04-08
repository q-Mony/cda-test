import { fetchData, postData } from "../../utils/auth_access_util";
import "./index.css";
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AutoComplete, Button, Modal, message } from "antd";
import { CloseSquareFilled } from "@ant-design/icons";
import StaticUtils from "../../utils/Static_Util";
export default function Networks() {
  const [networkData, setNetworkData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [inputValue, SetInputValue] = useState("");
  const userName = localStorage.getItem("userName");
  const [messageApi, contextHolder] = message.useMessage();

  // 如果没有合法进入，则重定向回首页
  if (userName == null) {
    return <Navigate to="/" replace />;
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      fetchNetworkData();
    }, []);
  }

  const success = (value) => {
    messageApi.open({
      type: "success",
      content: value,
    });
  };
  const error = (value) => {
    messageApi.open({
      type: "error",
      content: value,
    });
  };

  const showModal = (value) => {
    if (inputValue.trim() === "") {
      error("不能为空");
      return;
    }
    setAdd(value);
    setIsModalOpen(true);
  };

  const handleOk = () => {

    if (add) {
      handleAddNetwork();
    } else {
      handleDelNetwork();
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onChange = (data) => {
    SetInputValue(data);
  };

  // 定义函数用于获取组织数据并更新组件状态
  const fetchNetworkData = async () => {
    try {
      const params = {
        tgId: "永远不存在",
      };
      const endpoint = `${StaticUtils.https_url}/address/config`;
      const data = await fetchData(endpoint, params);
      if (data && data.errorCode === 0) {
        const result_list = data.networks.map((item) => ({ value: item }));
        setNetworkData(result_list);
      } else {
        console.log("Failed to fetch data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  async function handleAddNetwork() {
    const data = {
      user_name: userName,
      network: inputValue.trim(),
    };
    const response = await postData(`${StaticUtils.https_url}/network/add`, data);
    if (response && response.errorCode === 0) {
      success(response.data);
    } else {
      error(response.errorMessage);
    }
    fetchNetworkData();
    SetInputValue("");
  }
  async function handleDelNetwork() {
    const data = {
      user_name: userName,
      network: inputValue.trim(),
    };
    const response = await postData(`${StaticUtils.https_url}/network/delete`, data);
    if (response && response.errorCode === 0) {
      success(response.data);
    } else {
      error(response.errorMessage);
    }
    fetchNetworkData();
    SetInputValue("");
  }

  return (
    <div className="home">
      {contextHolder}
      <h3>目前已存在的Network({networkData.length})</h3>
      <AutoComplete
        className="myAutoComplete"
        options={networkData}
        placeholder="输入并查询是否存在"
        value={inputValue}
        filterOption={(inputValue, option) =>
          option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        allowClear={{
          clearIcon: <CloseSquareFilled />,
        }}
        onChange={onChange}
      />
      <div className="body">
        {networkData.map((item, index) => (
          <div key={index} className="list-item">
            {item.value}
          </div>
        ))}
      </div>
      <div className="change-Org">
        <Button
          className="changeBtn"
          type="primary"
          onClick={() => {
            showModal(true);
          }}
        >
          添加Network
        </Button>
        <Button
          className="changeBtn"
          danger
          onClick={() => {
            showModal(false);
          }}
        >
          删除Network
        </Button>
      </div>

      <Modal
        title={add ? "添加Network" : "删除Network"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>{inputValue}</p>
      </Modal>
    </div>
  );
}
