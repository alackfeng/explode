
import React, { Component } from "react";
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Text, View, StatusBar, TextInput, TouchableHighlight, ActivityIndicator, ScrollView, Dimensions } from "react-native";
import { triggerUser } from "../../../actions";

const {init: usersInit, register: userRegister, login: userLogin} = triggerUser;

import { ChainStore, FetchChain } from "assetfunjs/es";

import { ViewContainer, Normalize, StyleSheet } from "../../../components";
import { Colors } from "../../../libs/Colors";
//import { LockScreen } from "./Lock";

import { Icon, Button, Input } from 'react-native-elements';
import { resetNavigationTo } from "../../../libs/help";

const SCREEN_WIDTH = Dimensions.get('window').width;


import { NodeScreen } from "./Node";

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

const SLViewIndicator = styled(SLView)`
  justify-content: center;
  align-items: center;
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
    isRegister: boolean,
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
      currentAccount: null,
    };
  }


  componentWillMount() {
    const { isAuthenticated, navigation } = this.props;
    console.log("=====[Register.js]::componentDiDMount - ", isAuthenticated);
    if(isAuthenticated) {
      navigation.navigate('Login');
    }



  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    console.log("=====[Register.js]::shouldComponentUpdate - isAuthenticated - ", nextProps.status);
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

    const account_ = ChainStore.getAccount(this.state.username);
    console.log("=====[Register.js]::componentWillMount - account_ - ", this.state.username, JSON.stringify(account_));
    if(account_) {
      this.setState({
        currentAccount: account_,
      });
    }

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

      this.props.userRegister(username, {username, password, registrar, referrer, referrer_percent, refcode});
      /*.then((res) => {

        console.log("=====[Register.js]::userRegister - createAccount return : ok ", res);
        FetchChain("getAccount", res).then((ret) => {
          console.log("=====[Register.js]::userRegister - createAccount : getAccount is : ", ret);
        }).catch(err => {
          console.error("=====[Register.js]::userRegister - createAccount : getAccount is : err ", err);
        })
      }).catch( err => {

        console.log("=====[Register.js]::userRegister - createAccount return : error - ", err);
      });*/

    } catch ( e ) {
      console.error("=====[Register.js]::userRegister - error : ", e.err_no);
    }
    
  }

	render() {

		const { isRegister, isAuthenticated, navigation, currentAccount } = this.props;
    console.log("=====[Register.js]::render - ", isRegister);

		return (
			<ScrollView contentContainerStyle={styles.container}>
        <View style={styles.contentView} >
          <View style={{backgroundColor: 'white', width: SCREEN_WIDTH, alignItems: 'center'}}>
            <Text style={{color: 'white', fontSize: 30, marginVertical: 10, fontWeight: '300', marginTop: 10}}>登录</Text>
            <Text style={styles.welcome} >Welcome to Aftrade Register</Text>
            <View style={[styles.overlay, { marginBottom: 30, marginTop: 1 }]}>
            <Input
              containerStyle={{borderRadius: 40, borderWidth: 1, borderColor: 'rgba(110, 120, 170, 1)', height: 50, width: SCREEN_WIDTH - 50, marginVertical: 10}}
              icon={
                <Icon
                  name='person'
                  color='rgba(110, 120, 170, 1)'
                  size={25}
                />
              }
              iconContainerStyle={{marginLeft: 20}}
              placeholder="Username"
              placeholderTextColor="rgba(110, 120, 170, 1)"
              inputStyle={{marginLeft: 10, color: 'white'}}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance="light"
              keyboardType="email-address"
              returnKeyType="next"
              ref={ input => this.email2Input = input }
              onSubmitEditing={() => {
                this.password2Input.focus();
              }}
              blurOnSubmit={false}
            />
            <Input
              containerStyle={{borderRadius: 40, borderWidth: 1, borderColor: 'rgba(110, 120, 170, 1)', height: 50, width: SCREEN_WIDTH - 50, marginVertical: 10}}
              icon={
                <Icon
                  name='lock'
                  color='rgba(110, 120, 170, 1)'
                  size={25}
                />
              }
              iconContainerStyle={{marginLeft: 20}}
              placeholder="Password"
              placeholderTextColor="rgba(110, 120, 170, 1)"
              inputStyle={{marginLeft: 10, color: 'white'}}
              autoCapitalize="none"
              keyboardAppearance="light"
              secureTextEntry={true}
              autoCorrect={false}
              keyboardType="default"
              returnKeyType="next"
              ref={ input => this.password2Input = input }
              onSubmitEditing={() => {
                this.confirmPassword2Input.focus();
              }}
              blurOnSubmit={false}
            />
            <Input
              containerStyle={{borderRadius: 40, borderWidth: 1, borderColor: 'rgba(110, 120, 170, 1)', height: 50, width: SCREEN_WIDTH - 50, marginTop: 10, marginBottom: 30}}
              icon={
                <Icon
                  name='lock'
                  color='rgba(110, 120, 170, 1)'
                  size={25}
                />
              }
              iconContainerStyle={{marginLeft: 20}}
              placeholder="Confirm Password"
              placeholderTextColor="rgba(110, 120, 170, 1)"
              inputStyle={{marginLeft: 10, color: 'white'}}
              autoCapitalize="none"
              keyboardAppearance="light"
              secureTextEntry={true}
              autoCorrect={false}
              keyboardType="default"
              returnKeyType="done"
              ref={ input => this.confirmPassword2Input = input }
              blurOnSubmit={true}
            />
            </View>
            <View style={{flexDirection: 'row'}}>
              <Button
                text ='注  册'
                buttonStyle={{height: 50, width: 200, backgroundColor: 'black', borderWidth: 2, borderColor: 'white', borderRadius: 30}}
                containerStyle={{marginVertical: 10}}
                textStyle={{fontWeight: 'bold'}}
                onPress={() => resetNavigationTo('Register', navigation)}
              />
              <Button
                text="登  录"
                clear
                textStyle={{color: 'rgba(78, 116, 289, 1)'}}
                containerStyle={{marginTop: 20,marginVertical:20}}
                onPress={() => resetNavigationTo('Login', navigation)}
              />
            </View>
          </View>
        </View>
      </ScrollView>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
    backgroundColor: '#F5FCFF',
    height: '100%',
  },
  contentView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  triangleLeft: {
    position: 'absolute',
    left: -20,
    bottom: 0,
    width: 0,
    height: 0,
    borderRightWidth: 20,
    borderRightColor: 'white',
    borderBottomWidth: 25,
    borderBottomColor: 'transparent',
    borderTopWidth: 25,
    borderTopColor: 'transparent'
  },
  triangleRight: {
    position: 'absolute',
    right: -20,
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderLeftColor: 'white',
    borderBottomWidth: 25,
    borderBottomColor: 'transparent',
    borderTopWidth: 25,
    borderTopColor: 'transparent'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  menu: {
    margin: 10,
    padding: 10
  }
}); 


const mapStateToProps = (state) => ({
  isRegister: state.users.isRegister,
  currentAccount: state.app.currentAccount,
  status: state.app.nodeStatus.status,
});

export const RegisterScreen = connect(mapStateToProps, {
  usersInit,
  userRegister,
  userLogin,
})(Register);
