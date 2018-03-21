
"use strict";

import React, { Component } from "react";

import { Dimensions, StyleSheet, View, Image, ImageBackground, ScrollView } from "react-native";

import { Tile, Button, Text, Icon, Input } from "react-native-elements";

import { SCREEN_WIDTH, SCREEN_HEIGHT, translate, locale } from "../libs";
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
			return {value: account_name, error: "tips.register.errorName"};

		//搜索账号是否已经注册过了，
		if(this.props.search)
			this.props.search(account_name);
		
		let account = this.props.searchEntity.searchAccounts.filter(a => a[0] === account_name);
		console.log("[RegisterPage.js]::checkValidUserName - searchEntity : ", account.length, this.props.searchEntity);
		if(account.length)
			return {value: account_name, error: "tips.register.errorSamename"};

		return {value: account_name, error: null};
	}

	checkValidPassword = (text) => {

		let password = text ? text.trim() : null;

		var regex  =  new RegExp('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*_+=`|(){}:;<>,.?/\\[\\]-]).{8,63}');
		if(!regex.test(password)) {
			return {value: password, error: "tips.register.errorPassword"};
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
      this.setState({confirmPass: text, errorConfirm: "tips.register.errorConfirm"});
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
      this.setState({errorConfirm: "tips.register.errorCheckAgain"});
      return;
    }

    if(errorName || errorPass || errorConfirm /*|| !checkedPrivacy */ ) {
    	this.setState({errorConfirm: "tips.register.errorCheckAgain"});
    	return;
    }

    if(!checkedPrivacy) {
    	this.setState({errorChecked: "tips.register.errorChecked"});
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
					containerStyle={styles.container1}
					overlayContainerStyle={{backgroundColor: 'transparent'}}
					imageSrc={require('./images/background.jpeg')}
					imageContainerStyle={styles.image}
					title={ translate('enter.splash.registerInButton', locale) }
					titleStyle={styles.title}
					featured={true}
					height={SCREEN_HEIGHT}
					width={SCREEN_WIDTH}
					view={ ScrollView }
					childrenContainerStyle={styles.children}
					//icon={{source: require('./images/aftlogo.png')}}
					//iconStyle={styles.icon}
				>
					<View style={{flex: 1.5, backgroundColor: 'transparent'}}>
						<AccountPasswordInput
							onChange={this.onChangeUserName}
		          username={this.state.username}
		          error={ this.state.errorName ? translate(`${this.state.errorName}`, locale) : null }

							confirmed
							
		          onChangePass={this.onChangePassword}
		          onChangeConfirm={this.onChangeConfirmPass}
		          password={this.state.password}
		          confirmPass={this.state.confirmPass}
		          errorPass={ this.state.errorPass ? translate(`${this.state.errorPass}`, locale) : null }
		          errorConfirm={ this.state.errorConfirm ? translate(`${this.state.errorConfirm}`, locale) : null }
						/>
						<PrivacyService 
							checked={this.state.checkedPrivacy}
							onChecked={this.onCheckedPrivacy}
							errorChecked={this.state.errorChecked}
						/>
					</View>
					<View style={{flex: 1, backgroundColor: 'transparent', marginTop: 0}}>
						
						<Button
	            text ={ translate('enter.splash.registerInButton', locale) }
	            buttonStyle={styles.button}
	            textStyle={{fontWeight: 'bold'}}
	            containerStyle={{marginTop: 0, height: 50, backgroundColor: 'transparent'}}
	            onPress={this.onSubmit}
	          />
	          <Button
	            text ={ translate('tips.register.accountlogin', locale) }
	            buttonStyle={{justifyContent: 'flex-start'}}
	            textStyle={{fontWeight: 'bold', textAlign: 'right', fontSize: 12, color: 'rgba(145,234,255,1)', backgroundColor: 'transparent'}}
	            containerStyle={{marginTop: 0, alignItems: 'flex-end', justifyContent: 'flex-start', backgroundColor: 'transparent'}}
	            onPress={()=>resetNavigationTo('Login', this.props.navigation)}
	          />
	          <View style={{flex: 0.5}} />
	        </View>
          <View style={{flex: 1, backgroundColor: 'transparent', marginTop: 0, width: SCREEN_WIDTH * 0.8, }}>
          	<Text style={styles.tip}>{ translate('tips.register.import1', locale) }</Text>
          	<Text style={styles.tip}>{ translate('tips.register.import2', locale) }</Text>
          	<Text style={styles.tip}>{ translate('tips.register.import3', locale) }</Text>
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
		height: SCREEN_HEIGHT,
	},
	icon: {
		width: 100,
		height: 73,
	},
	title: {
		color: 'white',
	},
	children: {
		flex: 1,
		alignItems: 'flex-start',
		justifyContent: 'center',
		backgroundColor: 'transparent',
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
		textAlign: 'left',
	}
});

