
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Text, View, StatusBar, TextInput, TouchableHighlight, ActivityIndicator, ScrollView, Dimensions } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH } from "../../../libs";
import { Icon, Button, Input, Overlay } from 'react-native-elements';

import { ViewContainer, StyleSheet, LoadingRegisterModal } from "../../../components";
import { triggerUser } from "../../../actions";
const {register: userRegister} = triggerUser;

import { ChainStore, FetchChain } from "assetfunjs/es";

import Modal from "react-native-modal";


//import { LockScreen } from "./Lock";
//import { NodeScreen } from "./Node";

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
    userRegister: Function,
    navigation: Object,
    nodeStatus: Object,
    currentAccount: string,
  }
  state: {
    username: string,
    password: string,
    confirmPass: string,
  }

  constructor(props) {
    super(props);

    this.state = {
      username: 'feng',
      password: '1',
      confirmPass: '1',

      refcode: 'fengtest1',
      referrer: 'fengtest1',
      registrar: 'fengtest1',
      referrer_percent: 0,

      errorName: '',
      errorPass: '',
      errorConfirm: '',

      isOpen: false,
    };
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



  userRegister = (e) => {
    
    const { username, password, confirmPass } = this.state;
    console.log("=====[Register.js]::userRegister - ", username, password);

    e.preventDefault();

    if(!username || !password || password !== confirmPass) {
      console.error("=====[Register.js]::userRegister - password not equal to confirmPass", username, password);
      return;
    }

    const refcode = this.state.refcode;
    const referrer = this.state.registrar;
    const registrar = null; //this.state.registrar;
    const referrer_percent = this.state.referrer_percent;

    // 先打开模式对话框，接收消息
    this.setState({isOpen: true});

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

  onChangeUserName = (text) => {

    console.log("=====[Register.js]::onChangeUserName - ", text);

    if(!text || text.length <= 5) {
      this.setState({username: text, errorName: "包含字母和数字"});
    } else 
      this.setState({username: text, errorName: ''});
  }

  onChangePassword = (text) => {
    console.log("=====[Register.js]::onChangePassword - ", text);

    if(!text || text.length <= 5) {
      this.setState({password: text, errorPass: "小于等于13位"});
    } else 
      this.setState({password: text, errorPass: ''});  
  }

  onChangeConfirmPass = (text) => {
    console.log("=====[Register.js]::onChangeConfirmPass - ", text);

    if(!text || text !== this.state.password) {
      this.setState({confirmPass: text, errorConfirm: "密码不相同"});
    } else 
      this.setState({confirmPass: text, errorConfirm: ''});  
  }

	render() {

		const { navigation, currentAccount, nodeStatus } = this.props;
    console.log("=====[Register.js]::render - ", currentAccount, nodeStatus);

    const isLoading = false;
    const loadingProps = isLoading ? {size: 'large'} : {};

		return (
			<ScrollView contentContainerStyle={styles.container}>
        {this.state.isOpen && <LoadingRegisterModal onChange={(open) => this.setState({isOpen: !!open})} navigation={navigation} />}
        <View style={styles.contentView} >
          <View style={{backgroundColor: 'white', width: SCREEN_WIDTH, alignItems: 'center'}}>
            <Text style={{color: 'black', fontSize: 30, marginVertical: 10, fontWeight: '300', marginTop: 10}}>登录</Text>
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
              inputStyle={{marginLeft: 10, color: 'black'}}
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
              displayError={!!this.state.errorName}
              errorMessage={this.state.errorName}
              value={this.state.username}
              onChangeText={this.onChangeUserName}
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
              inputStyle={{marginLeft: 10, color: 'black'}}
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
              displayError={!!this.state.errorPass}
              errorMessage={this.state.errorPass}
              value={this.state.password}
              onChangeText={this.onChangePassword}
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
              inputStyle={{marginLeft: 10, color: 'black'}}
              autoCapitalize="none"
              keyboardAppearance="light"
              secureTextEntry={true}
              autoCorrect={false}
              keyboardType="default"
              returnKeyType="done"
              ref={ input => this.confirmPassword2Input = input }
              blurOnSubmit={true}
              displayError={!!this.state.errorConfirm}
              errorMessage={this.state.errorConfirm}
              value={this.state.confirmPass}
              onChangeText={this.onChangeConfirmPass}
            />
            </View>
            <View style={{flexDirection: 'row'}}>
              <Button
                text ='注  册'
                buttonStyle={{height: 50, width: 200, backgroundColor: 'black', borderWidth: 2, borderColor: 'white', borderRadius: 30}}
                containerStyle={{marginVertical: 10}}
                textStyle={{fontWeight: 'bold'}}
                onPress={this.userRegister}
                loading={isLoading}
                loadingProps={loadingProps}
              />
              <Button
                text="   跳转到登录"
                clear
                textStyle={{color: 'rgba(78, 116, 289, 1)'}}
                containerStyle={{marginTop: 20,marginVertical:20}}
                onPress={() => resetNavigationTo('Login', navigation)}
              />
            </View>
          </View>
          {nodeStatus && <View><Text>{nodeStatus.url} > {nodeStatus.status} </Text></View>}
        </View>
        {/*isLoading && (
        <Modal 
          isVisible={this.state.isLoading} 
          width={300} 
          height={300}
          transparent={false}
        >
          <Text>Hello from Modal!</Text>
          <Button
            text="Cancel"
            clear
            textStyle={{color: 'rgba(78, 116, 289, 1)'}}
            containerStyle={{marginTop: 20,marginVertical:20}}
            onPress={() => this.setState({isLoading: false})}
          />
        </Modal>)*/}
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
    backgroundColor: 'white',
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
  regStatus: state.users.regStatus,
  currentAccount: state.app.currentAccount,
  nodeStatus: state.app.nodeStatus,
});

export const RegisterScreen = connect(mapStateToProps, {
  userRegister,
})(Register);
