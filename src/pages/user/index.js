import { fetchData, postParamsData } from "../../utils/auth_access_util";
import "./index.css";
import React, { useState, useEffect } from "react";
import {
  AutoComplete,
  Button,
  Modal,
  message,
  Checkbox,
  Form,
  Input,
} from "antd";
import { CloseSquareFilled } from "@ant-design/icons";
import { Navigate } from "react-router-dom";
import StaticUtils from "../../utils/Static_Util";


export default function KYAUser() {
  const [organizationData, setOrganizationData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [inputValue, SetInputValue] = useState("");
  const userName = localStorage.getItem("userName");
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  // 如果没有合法进入，则重定向回首页
  // if (userName == null) {
  //   return <Navigate to="/" replace />;
  // } else {
  //   // eslint-disable-next-line react-hooks/rules-of-hooks
  //   useEffect(() => {}, []);
  // }

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
  const onFinish = (values) => {
    console.log("Success:", values.email);
    console.log("Success:", values.password);
    console.log("Success:", values.username);  
    console.log("Success:",values.company)
    handleAddOrganization(values);
    // onReset()
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onReset = () => {
    form.resetFields();
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


    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onChange = (data) => {
    SetInputValue(data);
  };

  async function handleAddOrganization(values) {
    const data = {
      e: values.email,
      p: values.password,
      m: values.username,
      em:values.company
    };
    const response = await postParamsData(`${StaticUtils.kya_https_url}/api/kyt/internalAddUser`, data);
    if (response && response.errorCode === "0000") {
      success(response.message);
      onReset()
    } else {
      error(response.errorMessage);
    }
    SetInputValue("");
  }

  return (
    <div className="user-home">
      {contextHolder}
      <h1>KYA 添加企业账号</h1>
      <h5>Username 和 Company无特殊需求默认请填写一致</h5>
      <Form
       form={form}
        name="basic"
        style={{
          width: "100%",
          display: "Flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Company"
          name="company"
          rules={[
            {
              required: true,
              message: "Please input company name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "100%", height: "50px" }}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}
