
"use strict";

import React, { Component } from "react";

import { Dimensions, StyleSheet, View, Text, Image, ImageBackground } from "react-native";

import { Tile, Button } from "react-native-elements";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../libs";
import { ViewContainer } from "../components";

import SplashTile from "./SplashTile";
import { resetNavigationTo } from "../libs/help";

const TRACE = false;

export class SplashScreen extends Component {

  props: {
    navigation: Object,
  }

	onPressloginAndReg = (login) => {

    resetNavigationTo(login ? 'Login' : 'Register', this.props.navigation);
  }

	render() {

		return (
			<ViewContainer>
				<SplashTile
					containerStyle={styles.container1}
					imageSrc={require('./images/launchscreen.jpg')}
					imageContainerStyle={styles.image}
					title="ASSETFUN"
					titleStyle={styles.title}
					featured
					height={SCREEN_HEIGHT}
					width={SCREEN_WIDTH}
					view={ View }
					childrenContainerStyle={styles.children}
					icon={{source: require('./images/aftlogo.png')}}
					iconStyle={styles.icon}
				>
					<Button
            text ='登  录'
            buttonStyle={styles.button}
            textStyle={{fontWeight: 'bold'}}
            containerStyle={{marginLeft: 0}}
            onPress={this.onPressloginAndReg}
          />
          <Button
            text ='注  册'
            buttonStyle={styles.button}
            textStyle={{fontWeight: 'bold'}}
            containerStyle={{marginLeft: 0}}
            onPress={this.onPressloginAndReg}
          />  
				</SplashTile>
			</ViewContainer>
		);
	}
};

const styles = {
	container: {
		flex: 1,
		backgroundColor: 'white',
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
		flex: 0.3,
	},
	button: {
		marginBottom: 10, 
		height: 50, 
		width: SCREEN_WIDTH * 0.8, 
		backgroundColor: 'transparent', 
		borderWidth: 1, 
		borderColor: 'white', 
		borderRadius: 5
	}
};


