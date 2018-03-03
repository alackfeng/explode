
"use strict";

import React, { Component } from "react";

import { Dimensions, StyleSheet, View, Image, ImageBackground, ScrollView } from "react-native";

import { Tile, Button, Text, Icon, Input } from "react-native-elements";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../libs";
import { ViewContainer } from "../components";

import SplashTile from "./SplashTile";
import { resetNavigationTo } from "../libs/help";

import { AccountPasswordInput, PrivacyService } from "./utils";

import { ChainValidation } from "assetfunjs/es";

const TRACE = false;

export class RegisterPage extends Component {


	constructor() {
		super();

		this.state = {
      username: '',
      password: '',
      confirmPass: '',

      refcode: 'fengtest1',
      referrer: 'fengtest1',
      registrar: 'fengtest1',
      referrer_percent: 0,

      errorName: '',
      errorPass: '',
      errorConfirm: '',

      checkedPrivacy: false,
      errorChecked: false,

      searchEntity: [],
		}

		this.onChangeUserName = this.onChangeUserName.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.onChangeConfirmPass = this.onChangeConfirmPass.bind(this);
		this.onCheckedPrivacy = this.onCheckedPrivacy.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

	}

	checkValidUserName = (text) => {

		let account_name = text.toLowerCase();
		account_name = account_name.match(/[a-z0-9\.-]+/);
		account_name = account_name ? account_name[0].trim() : null;

		if(account_name === "")
			return {value: account_name, error: "账号名为空"};

		// 以字母开头并可包含数字，破折号可选，长度3-63字节。如(a-z)[-](0-9)
		if(ChainValidation.is_account_name_error(account_name))
			return {value: account_name, error: "账号名以字母开头并可包含数字"};

		//搜索账号是否已经注册过了，
		if(this.props.search)
			this.props.search(account_name);
		
		let account = this.props.searchEntity.searchAccounts.filter(a => a[0] === account_name);
		console.log("[RegisterPage.js]::checkValidUserName - searchEntity : ", account.length, this.props.searchEntity);
		if(account.length)
			return {value: account_name, error: "账号名已被注册"};

		return {value: account_name, error: null};
	}

	checkValidPassword = (text) => {

		let password = text ? text.trim() : null;

		var regex = new RegExp('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,63}');
		if(!regex.test(password)) {
			return {value: password, error: "密码中必须包含大小写字母&数字&特称字符，至少8个字符，最多63个字符"};
		}

		return {value: password, error: null};
	}

	onChangeUserName = (text) => {

    console.log("=====[RegisterPage.js]::onChangeUserName - ", text);

    const {value, error} = this.checkValidUserName(text);
    if(error) {
      this.setState({username: value, errorName: error});
    } else 
      this.setState({username: value, errorName: ''});
  }

  onChangePassword = (text) => {
    console.log("=====[RegisterPage.js]::onChangePassword - ", text);

    const {value, error} = this.checkValidPassword(text);
    if(error) {
      this.setState({password: value, errorPass: error});
    } else 
      this.setState({password: value, errorPass: ''});  
  }

  onChangeConfirmPass = (text) => {
    console.log("=====[RegisterPage.js]::onChangeConfirmPass - ", text);

    if(!text || text !== this.state.password) {
      this.setState({confirmPass: text, errorConfirm: "密码不相同"});
    } else 
      this.setState({confirmPass: text, errorConfirm: ''});  
  }

  onCheckedPrivacy = () => {
  	this.setState({checkedPrivacy: !this.state.checkedPrivacy, errorChecked: this.state.checkedPrivacy});  
  }

 	onSubmit = (e) => {
		const { username, password, confirmPass, checkedPrivacy, errorName, errorPass, errorConfirm } = this.state;
    console.log("=====[RegisterPage.js]::userRegister - ", username, password);

    e.preventDefault();

    
    if(!username || !password || password !== confirmPass) {
      console.error("=====[RegisterPage.js]::userRegister - password not equal to confirmPass", username, password);
      this.setState({errorConfirm: "请重新检查!!!"});
      return;
    }

    if(errorName || errorPass || errorConfirm /*|| !checkedPrivacy */ ) {
    	this.setState({errorConfirm: "请重新检查!!!!"});
    	return;
    }

    if(!checkedPrivacy) {
    	this.setState({errorChecked: "请阅读并同意服务和隐私条款"});
    	return;
    }

    const refcode = this.state.refcode;
    const referrer = this.state.registrar;
    const registrar = null; //this.state.registrar;
    const referrer_percent = this.state.referrer_percent;

    try {

    	if(this.props.handle)
      	this.props.handle(username, {username, password, registrar, referrer, referrer_percent, refcode});
      else
      	throw Error("userRegister function not defined!!!");

    } catch ( e ) {
      console.error("=====[RegisterPage.js]::userRegister - error : ", e.message || e.err_no);
    }
  }


	render() {

		return (
			<ViewContainer>
				<SplashTile
					containerStyle={styles.container}
					imageSrc={require('./images/launchscreen.jpg')}
					imageContainerStyle={styles.image}
					title="注册"
					titleStyle={styles.title}
					featured={true}
					height={SCREEN_HEIGHT}
					width={SCREEN_WIDTH}
					view={ ScrollView }
					childrenContainerStyle={styles.children}
					//icon={{source: require('./images/aftlogo.png')}}
					//iconStyle={styles.icon}
				>
					<AccountPasswordInput
						onChange={this.onChangeUserName}
	          username={this.state.username}
	          error={this.state.errorName}

						confirmed
						
	          onChangePass={this.onChangePassword}
	          onChangeConfirm={this.onChangeConfirmPass}
	          password={this.state.password}
	          confirmPass={this.state.confirmPass}
	          errorPass={this.state.errorPass}
	          errorConfirm={this.state.errorConfirm}
					/>
					<PrivacyService 
						checked={this.state.checkedPrivacy}
						onChecked={this.onCheckedPrivacy}
						errorChecked={this.state.errorChecked}
					/>
					<Button
            text ='注  册'
            buttonStyle={styles.button}
            textStyle={{fontWeight: 'bold'}}
            containerStyle={{marginTop: 0, height: 50}}
            onPress={this.onSubmit}
          />
          <View style={styles.tips}>
          	<Text style={styles.tip}>密码用于取得和交易您的资产，非常重要</Text>
          	<Text style={styles.tip}>assetfun是去中心化的软件，无法帮您储存密码</Text>
          	<Text style={styles.tip}>一旦丢失密码，将无法找回，请知悉</Text>
          </View>
				</SplashTile>
			</ViewContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	image: {
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT-50,
	},
	icon: {
		width: 100,
		height: 73,
	},
	title: {
		color: 'white',
	},
	children: {
		flex: 0.9,
	},
	button: {
		marginBottom: 0, 
		height: 50, 
		width: SCREEN_WIDTH * 0.8, 
		backgroundColor: 'transparent', 
		borderWidth: 1, 
		borderColor: 'white', 
		borderRadius: 5,
		elevation: 0,
	},
	tip: {
		color: 'white',
		textAlign: 'center',
	}
});

