
import React, { Component } from "react";
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Text, View, StatusBar, TextInput, Button, TouchableHighlight } from "react-native";
import { triggerUser } from "../../../actions";

const {init: usersInit, register: userRegister, login: userLogin} = triggerUser;

import { ChainStore, FetchChain } from "assetfunjs/es";

import { ViewContainer, Colors, Normalize, StyleSheet } from "../../../components";
//import { LockScreen } from "./Lock";

const SLView = styled.View`
  flex: 1;
  flex-direction: column;
`;

const SLText = styled.Text`
  font-size: 20;
  text-align: center;
  color: ${Colors.green};
`;

const SLButton = styled.TouchableHighlight`
  height: 35;
  width: 100;
`;

const SLTextInput = styled.TextInput`
  height: 35;
  border-color: gray;
  border-width: 2;
  background-color: ${Colors.bianca};
  border-radius: 5;
`;

const SLViewText  = styled(SLView)``;
const SLTextTitle = styled(SLText)``;

const SLViewUserInput = styled(SLView)`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  margin-top: 20;
`;

const SLTextTitleName = styled(SLText)`
  color: ${Colors.yellow};
`;
const SLTextUserName = styled(SLTextInput)``;

const SLTextTitlePasswd = styled(SLText)`
  color: ${Colors.bianca};
`;
const SLTextUserPaswd = styled(SLTextInput)``;


const SLViewSubmit = styled(SLView)`
  flex: 1;
  flex-direction: row;
  margin-top: 10;
  justify-content: center;
`;

const SLButtonSubmit = styled(SLButton)``;

const SLTextSubmit = styled(SLText)`
  color: ${Colors.white};
  border-width: 1;
  border-radius: 5;
  background-color: ${Colors.timberwolf};
`;


class Register extends Component {

  props: {
    isAuthenticated: boolean,
    userRegister: Function,
    navigation: Object,
    username: string,
  }
  state: {
    username: string,
    password: string,
  }

  constructor(props) {
    super(props);

    this.state = {
      username: 'fengtest',
      password: 'fengtest',
      registrar: 'fengtest1',
    };
  }

  componentDiDMount() {
    const { isAuthenticated, navigation } = this.props;
    console.log("=====[Register.js]::componentDiDMount - ", isAuthenticated);
    if(isAuthenticated) {
      navigation.navigate('Login');
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    console.log("=====[Register.js]::shouldComponentUpdate - isAuthenticated - ", nextProps.isAuthenticated);
    return true;
  }

  userLogin = (e) => {

    const { username, password } = this.state;
    console.log("=====[Register.js]::userLogin - ", username, password);
    e.preventDefault();

    const refcode = this.state.refcode;
    const referrer = this.state.registrar;

    const { store, dispatch } = this.props;
    console.log("=====[Register.js]::userLogin - dispatch is exist > ", store, dispatch);

    try {

      this.props.userLogin(username, password); /*.then((res) => {

        console.log("=====[Register.js]::userLogin - createAccount return : ok ", res);
        FetchChain("getAccount", res).then((ret) => {
          console.log("=====[Register.js]::userLogin - createAccount : getAccount is : ", ret);
        }).catch(err => {
          console.error("=====[Register.js]::userLogin - createAccount : getAccount is : err ", err);
        })
      }).catch( err => {

        console.log("=====[Register.js]::userLogin - createAccount return : error - ", err);
      }); */

    } catch ( e ) {
      console.error("=====[Register.js]::userLogin - error : ", e);
    }
  }

  userRegister = (e) => {
    
    const { username, password } = this.state;
    console.log("=====[Register.js]::userRegister - ", username, password);
    e.preventDefault();

    const refcode = this.state.refcode;
    const referrer = this.state.registrar;
    const registrar = this.state.registrar;
    const referrer_percent = 0;

    try {

      this.props.userRegister(username, {username, password, registrar, referrer, referrer_percent, refcode}).then((res) => {

        console.log("=====[Register.js]::userRegister - createAccount return : ok ", res);
        FetchChain("getAccount", res).then((ret) => {
          console.log("=====[Register.js]::userRegister - createAccount : getAccount is : ", ret);
        }).catch(err => {
          console.error("=====[Register.js]::userRegister - createAccount : getAccount is : err ", err);
        })
      }).catch( err => {

        console.log("=====[Register.js]::userRegister - createAccount return : error - ", err);
      });

    } catch ( e ) {
      console.error("=====[Register.js]::userRegister - error : ", e);
    }
    
  }

	render() {

		const { isAuthenticated, navigation, currentAccount } = this.props;
    console.log("=====[Register.js]::render - ", isAuthenticated);

		return (
			<ViewContainer>
				<SLViewText>
          <SLTextTitle>Reigster Aftrade Account : {currentAccount}</SLTextTitle>
        </SLViewText>
        <SLViewUserInput>
          <SLTextTitleName>用户名：</SLTextTitleName>
          <SLTextUserName
            placeholder="Type a Username"
            autoCapitalize='none'
            autoCorrect={false}
            autoFocus={true}
            value={this.state.username || this.props.username} 
            onChangeText={(text) => this.setState({ username: text })}
          />
        </SLViewUserInput>
        <SLViewUserInput>
          <SLTextTitlePasswd>密      码：</SLTextTitlePasswd>
          <SLTextUserPaswd
            placeholder="Type a Password"
            autoCapitalize='none'
            autoCorrect={false}
            autoFocus={false}
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={(text) => this.setState({ password: text })}
          />
        </SLViewUserInput>
        <SLViewSubmit>
  				<SLButtonSubmit onPress={(e) => this.userRegister(e)} >
            <SLTextSubmit>REG</SLTextSubmit>
          </SLButtonSubmit>
          <Text style={{}}>       </Text>
          <SLButtonSubmit onPress={(e) => this.userLogin(e)} >
            <SLTextSubmit>LOG</SLTextSubmit>
          </SLButtonSubmit>
        </SLViewSubmit>
         {/*(<LockScreen />*/}
			</ViewContainer>
		);
	}
}

const mapStateToProps = (state) => ({
  inited: state.users.inited,
  currentAccount: state.users.currentAccount,
});

export const RegisterScreen = connect(mapStateToProps, {
  usersInit,
  userRegister,
  userLogin,
})(Register);
