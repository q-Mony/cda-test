import './index.css';
import logo from '../../logo.svg'

function UserInfo(props) {

    let userInfo = props.userInfo
    if (!userInfo) {
        userInfo = {} 
    }

    return (
        <div className='userinfo'>
            <img className='avatar' src= {userInfo.avatar_url || logo} alt='' /> 
            <span className='name'>{ userInfo.name && userInfo.name.length > 0 ? 'Welcome to  use cda Server' : ''}</span>
        </div>
    );
}

export default UserInfo;
