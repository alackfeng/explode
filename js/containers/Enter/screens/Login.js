
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ViewContainer, StyleSheet, LoadingLoginModal, LoginPage } from '../../../components';
import { triggerUser } from '../../../actions';

const { login: userLogin } = triggerUser;


class Login extends Component {
  constructor() {
    super();

    this.state = {

      isOpen: false,
    };

    this.userLogin = this.userLogin.bind(this);
  }


  userLogin = (username, password) => {
    // 先打开模式对话框，接收消息
    this.setState({ isOpen: true });

    try {
      // 延迟加载
      const _This = this;
      setTimeout(() => {
        _This.props.userLogin(username, password);
      }, 500);
    }
    catch (e) {
      console.error('=====[Login.js]::userLogin - error : ', e);
    }
  }

  render() {
    const { navigation, nodeStatus } = this.props;
    console.info('=====[Login.js]::render - login status : ');

    if (true) {
      return (
        <ViewContainer>
          {this.state.isOpen && <LoadingLoginModal onChange={open => this.setState({ isOpen: !!open })} navigation={navigation} />}
          <LoginPage navigation={navigation} handle={this.userLogin} />
        </ViewContainer>
      );
    }
  }
}


const mapStateToProps = state => ({
  currentAccount: state.app.currentAccount,
  nodeStatus: state.app.nodeStatus,
});

export const LoginScreen = connect(mapStateToProps, {
  userLogin,
})(Login);

