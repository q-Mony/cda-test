import { fetchData, postData } from "../../utils/auth_access_util";
import "./index.css";
import React, { useState, useEffect } from "react";
import { AutoComplete, Button, Modal, message } from "antd";
import { CloseSquareFilled } from "@ant-design/icons";
import { Navigate } from "react-router-dom";
export default function Organization() {
  const [organizationData, setOrganizationData] = useState([]);
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
      fetchOrganizationData();
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
    setAdd(value);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (add) {
      handleAddOrganization();
    } else {
      handleDelOrganization();
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
  const fetchOrganizationData = async () => {
    try {
      const params = {
        tgId: "永远不存在",
      };
      const endpoint = "/user/tg/get_id";
      const data = await fetchData(endpoint, params);
      if (data && data.errorCode === 0) {
        const result_list = data.orgs.map((item) => ({ value: item }));
        setOrganizationData(result_list);
      } else {
        console.log("Failed to fetch data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  async function handleAddOrganization() {
    const data = {
      user_name: userName,
      org: inputValue,
    };
    const response = await postData("/org/add", data);
    if (response && response.errorCode === 0) {
      success(response.data);
    } else {
      error(response.errorMessage);
    }
    fetchOrganizationData();
    SetInputValue("");
  }
  async function handleDelOrganization() {
    const data = {
      user_name: userName,
      org: inputValue,
    };
    const response = await postData("/org/delete", data);
    if (response && response.errorCode === 0) {
      success(response.data);
    } else {
      error(response.errorMessage);
    }
    fetchOrganizationData();
    SetInputValue("");
  }

  return (
    <div className="home">
      {contextHolder}
      <h3>目前已存在的Organization({organizationData.length})</h3>
      <AutoComplete
        className="myAutoComplete"
        options={organizationData}
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
        {organizationData.map((item, index) => (
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
          添加Organization
        </Button>
        <Button
          className="changeBtn"
          danger
          onClick={() => {
            showModal(false);
          }}
        >
          删除Organization
        </Button>
      </div>

      <Modal
        title={add ? "添加Organization" : "删除Organization"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>{inputValue}</p>
      </Modal>
    </div>
  );
}
