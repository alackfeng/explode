
"use strict";

import React, { Component } from "react";

import { Dimensions, StyleSheet, View, Image, ImageBackground } from "react-native";

import { Tile, Button, Text, Icon, Input } from "react-native-elements";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../libs";
import { ViewContainer } from "../components";

import SplashTile from "./SplashTile";
import { resetNavigationTo } from "../libs/help";

import { AccountPasswordInput, PrivacyService } from "./utils";

const TRACE = false;

export class RegisterPage extends Component {


	constructor() {
		super();

		this.state = {
      username: '',
      password: '',
      confirmPass: '',

      errorName: '',
      errorPass: '',
      errorConfirm: '',

      checkedPrivacy: false,
		}

		this.onChangeUserName = this.onChangeUserName.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.onChangeConfirmPass = this.onChangeConfirmPass.bind(this);
		this.onCheckedPrivacy = this.onCheckedPrivacy.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

	}

	onChangeUserName = (text) => {

    console.log("=====[RegisterPage.js]::onChangeUserName - ", text);

    if(!text || text.length <= 5) {
      this.setState({username: text, errorName: "包含字母和数字"});
    } else 
      this.setState({username: text, errorName: ''});
  }

  onChangePassword = (text) => {
    console.log("=====[RegisterPage.js]::onChangePassword - ", text);

    if(!text || text.length <= 5) {
      this.setState({password: text, errorPass: "小于等于13位"});
    } else 
      this.setState({password: text, errorPass: ''});  
  }

  onChangeConfirmPass = (text) => {
    console.log("=====[RegisterPage.js]::onChangeConfirmPass - ", text);

    if(!text || text !== this.state.password) {
      this.setState({confirmPass: text, errorConfirm: "密码不相同"});
    } else 
      this.setState({confirmPass: text, errorConfirm: ''});  
  }

  onCheckedPrivacy = () => {
  	this.setState({checkedPrivacy: !this.state.checkedPrivacy});  
  }

 	onSubmit = (text) => {
		console.log("=====[RegisterPage.js]::onSubmit - ", text);
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
					featured
					height={SCREEN_HEIGHT}
					width={SCREEN_WIDTH}
					view={ View }
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
		borderRadius: 5
	},
	tip: {
		color: 'white',
		textAlign: 'center',
	}
});

