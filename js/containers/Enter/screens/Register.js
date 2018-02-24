
import React, { Component } from "react";
import { connect } from "react-redux";
import { Colors, resetNavigationTo, SCREEN_WIDTH, SCREEN_HEIGHT } from "../../../libs";

import { ViewContainer, StyleSheet, LoadingRegisterModal, RegisterPage } from "../../../components";
import { triggerUser, accountSearch } from "../../../actions";
const {register: userRegister} = triggerUser;


class Register extends Component {

  constructor(props) {
    super(props);

    this.state = {

      isOpen: false,
    };

    this.userRegister = this.userRegister.bind(this);
    this.searchAccount = this.searchAccount.bind(this);

  }


  componentWillMount() {
    const { currentAccount, navigation } = this.props;
    console.log("=====[Register.js]::componentDiDMount - ", currentAccount);
    if(currentAccount) {
      ; //resetNavigationTo('Main', navigation);
    }

  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    console.log("=====[Register.js]::shouldComponentUpdate - currentAccount - ", nextProps.nodeStatus);
    return true;
  }

  searchAccount = (name) => {
    console.log("[Register.js]::searchAccount - entity : ", this.props.searchEntity);
    this.props.accountSearch(name);
  }

  userRegister = (username, params) => {
    
    const {username: username1, password, registrar, referrer, referrer_percent, refcode} = params;

    // 先打开模式对话框，接收消息
    this.setState({isOpen: true});

    try {

      this.props.userRegister(username, {username, password, registrar, referrer, referrer_percent, refcode});

    } catch ( e ) {
      console.error("=====[Register.js]::userRegister - error : ", e.err_no);
    }
    
  }


	render() {

		const { navigation, currentAccount, nodeStatus } = this.props;
    console.log("=====[Register.js]::render - ", currentAccount, nodeStatus);

    if(true) {
      return (
        <ViewContainer>
          {this.state.isOpen && <LoadingRegisterModal onChange={(open) => this.setState({isOpen: !!open})} navigation={navigation} />}
          <RegisterPage handle={this.userRegister} search={this.searchAccount} searchEntity={this.props.searchEntity} />
        </ViewContainer>
      );
    }
	}
}


const mapStateToProps = (state) => ({
  currentAccount: state.app.currentAccount,
  nodeStatus: state.app.nodeStatus,
  searchEntity: state.users.entitySearch,
});

export const RegisterScreen = connect(mapStateToProps, {
  userRegister,
  accountSearch,
})(Register);
