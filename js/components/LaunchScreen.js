
"use strict";

import React, { Component } from "react";

import { Dimensions, StyleSheet, View, Text, Image, ImageBackground } from "react-native";

import { Tile, Button } from "react-native-elements";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../libs";
import { ViewContainer } from "../components";

import SplashTile from "./SplashTile";


const TRACE = false;

class LaunchScreen extends Component {

	render() {


		return (
			<ViewContainer>
				<SplashTile
					containerStyle={styles.container1}
					imageSrc={require('./images/launchscreen.jpg')}
					imageContainerStyle={styles.image}
					title="ASSETFUN"
					titleStyle={styles.title}
					caption={ "与区块连接中" }
					captionStyle={styles.caption}
					featured
					height={SCREEN_HEIGHT}
					width={SCREEN_WIDTH}
					view={ View }
					childrenContainerStyle={styles.children}
					icon={{source: require('./images/aftlogo.png')}}
					iconStyle={styles.icon}
				> 
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
	caption: {
		color: 'red'
	},
	children: {
		flex: 0.3,
	}
};

LaunchScreen.__cards__ = define => {
	define("Default", _ => <LaunchScreen />);
};
export default LaunchScreen;