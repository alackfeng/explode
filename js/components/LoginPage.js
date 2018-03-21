
"use strict";

import React, { Component } from "react";

import { Dimensions, StyleSheet, View, Image, ImageBackground, Platform } from "react-native";

import { Tile, Button, Text, Icon, Input, Divider } from "react-native-elements";

import { SCREEN_WIDTH, SCREEN_HEIGHT, translate, locale } from "../libs";
import { ViewContainer } from "../components";

import SplashTile from "./SplashTile";
import { resetNavigationTo } from "../libs/help";

import { AccountInput } from "./utils";
import { ChainValidation } from "assetfunjs/es";


const TRACE = false;

export class LoginPage extends Component {


	constructor() {
		super();

		this.state = {
      username: '',
      password: '',

      errorName: '',
      errorPass: '',
		}

		this.onChangeUserName = this.onChangeUserName.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	checkValidUserName = (text) => {

		let account_name = text.trim();

		if(account_name === "")
			return {value: account_name, error: "账号名为空"};

		// 以字母开头并可包含数字，破折号可选，长度3-63字节。如(a-z)[-](0-9)
		if(ChainValidation.is_account_name_error(account_name))
			return {value: account_name, error: "tips.register.errorName"};

		return {value: account_name, error: null};
	}


	onChangeUserName = (text) => {

    console.log("=====[LoginPage.js]::onChangeUserName - ", text);

		const {value, error} = this.checkValidUserName(text);
    if(error) {
      this.setState({username: value, errorName: error});
    } else 
      this.setState({username: value, errorName: ''});
  }

  onChangePassword = (text) => {
    console.log("=====[LoginPage.js]::onChangePassword - ", text);

    if(!text) {
      this.setState({password: text, errorPass: "tips.register.errorPassNull"});
    } else 
      this.setState({password: text, errorPass: ''});  
  }

	onSubmit = (e) => {
		console.log("=====[LoginPage.js]::onSubmit - ", e);

		const { username, password, errorName, errorPass } = this.state;

    console.log("=====[LoginPage.js]::userLogin - ", username, password);
    if(e) e.preventDefault();

    if(!username || !password) {
      console.error("=====[LoginPage.js]::userLogin - null params: ", username, password);
      this.setState({errorPass: "tips.register.errorCheckAgain"});
      return;
    }

    if(errorName || errorPass ) {
    	this.setState({errorPass: "tips.register.errorCheckAgain"});
    	return;
    }

    try {

      this.props.handle(username, password);

    } catch ( e ) {
      console.error("=====[LoginPage.js]::userLogin - error : ", e);
    }


  }

	render() {

		return (
			<ViewContainer>
				<SplashTile
					containerStyle={styles.container}
					imageSrc={require('./images/background.jpeg')}
					imageContainerStyle={styles.image}
					title={ translate('enter.splash.signInButton', locale) }
					titleStyle={styles.title}
					featured={true}
					height={SCREEN_HEIGHT}
					width={SCREEN_WIDTH}
					view={ View }
					childrenContainerStyle={styles.children}
					//icon={{source: require('./images/aftlogo.png')}}
					//iconStyle={styles.icon}
				>
					<View style={{flex: 1, backgroundColor: 'transparent'}}>
					<AccountInput

						onChange={this.onChangeUserName}
	          username={this.state.username}
	          error={ this.state.errorName ? translate(`${this.state.errorName}`, locale) : null }

	          onChangePass={this.onChangePassword}
	          password={this.state.password}
	          errorPass={this.state.errorPass ? translate(`${this.state.errorPass}`, locale) : null}
					/>
					</View>
					<View style={{flex: 1.2, alignItems: 'flex-start', backgroundColor: 'transparent'}}>
					<View style={{flex: 1, marginTop: 0, alignItems: 'center', backgroundColor: 'transparent'}}>
	          <View style={{flex: 0.2}} />
						<Button
	            text ={ translate('enter.splash.signInButton', locale) }
	            buttonStyle={styles.button}
	            textStyle={{fontWeight: 'bold'}}
	            containerStyle={{marginTop: 20}}
	            onPress={()=> this.onSubmit()}
	          />
	          <Button
	            text ={ translate('enter.splash.registerInButton', locale) }
	            buttonStyle={styles.button2}
	            textStyle={{fontWeight: 'bold'}}
	            containerStyle={{marginTop: 0}}
	            onPress={()=>resetNavigationTo('Register', this.props.navigation)}
	          />
          </View>
          <View style={{flex: 0.8}} />
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
		...Platform.select({
			web: {
				flex: 1
			},
      ios: {
        flex: 1
      },
      android: {
        flex: 1
      },
    }),
	},
	button: {
		marginBottom: 10, 
		height: 50, 
		width: SCREEN_WIDTH * 0.8, 
		backgroundColor: 'transparent', 
		borderWidth: 1, 
		borderColor: 'white', 
		borderRadius: 5,
		elevation: 0,
	},
	button2: {
		marginBottom: 10, 
		height: 50, 
		width: SCREEN_WIDTH * 0.8, 
		backgroundColor: 'transparent', 
		borderWidth: 0, 
		borderColor: 'white', 
		borderRadius: 0,
		elevation: 0,
	}
});

