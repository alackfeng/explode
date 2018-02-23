
"use strict";

import React, { Component } from "react";

import { Dimensions, StyleSheet, View, Image, ImageBackground, Platform } from "react-native";

import { Tile, Button, Text, Icon, Input } from "react-native-elements";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../libs";
import { ViewContainer } from "../components";

import SplashTile from "./SplashTile";
import { resetNavigationTo } from "../libs/help";

import { AccountPasswordInput } from "./utils";

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

	onChangeUserName = (text) => {

    console.log("=====[LoginPage.js]::onChangeUserName - ", text);

    if(!text || text.length <= 5) {
      this.setState({username: text, errorName: "包含字母和数字"});
    } else 
      this.setState({username: text, errorName: ''});
  }

  onChangePassword = (text) => {
    console.log("=====[LoginPage.js]::onChangePassword - ", text);

    if(!text || text.length <= 5) {
      this.setState({password: text, errorPass: "小于等于13位"});
    } else 
      this.setState({password: text, errorPass: ''});  
  }

	onSubmit = (text) => {
		console.log("=====[LoginPage.js]::onSubmit - ", text);
  }

	render() {

		return (
			<ViewContainer>
				<SplashTile
					containerStyle={styles.container}
					imageSrc={require('./images/launchscreen.jpg')}
					imageContainerStyle={styles.image}
					title="登录"
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

	          onChangePass={this.onChangePassword}
	          password={this.state.password}
	          errorPass={this.state.errorPass}
					/>
					<Button
            text ='登  录'
            buttonStyle={styles.button}
            textStyle={{fontWeight: 'bold'}}
            containerStyle={{marginTop: 0}}
            onPress={this.onSubmit}
          />
          <Button
            text ='注  册'
            buttonStyle={styles.button2}
            textStyle={{fontWeight: 'bold'}}
            containerStyle={{marginTop: 0}}
            onPress={()=>resetNavigationTo('Register', this.props.navigation)}
          />  
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
		...Platform.select({
			web: {
				flex: 0.5
			},
      ios: {
        flex: 0.5
      },
      android: {
        flex: 0.55
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
		borderRadius: 5
	},
	button2: {
		marginBottom: 10, 
		height: 50, 
		width: SCREEN_WIDTH * 0.8, 
		backgroundColor: 'transparent', 
		borderWidth: 0, 
		borderColor: 'white', 
		borderRadius: 0
	}
});

