import React from "react"
//components
import UserInfo from "../../components/userinfo"
import UseAPI from '../../components/useapi'
import { useLocation } from "react-router-dom";
import './index.css'

export default function Main() {
    const location = useLocation();
    const userInfo = location.state.userInfo;
    return (
        <div className="main">
            <UserInfo userInfo={userInfo} />
            <UseAPI />
        </div>
    );
}