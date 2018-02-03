
"use strict";

import React, { Component } from "react";

import { Dimensions, StyleSheet, View, Text, Image, ImageBackground } from "react-native";

import { Tile } from "react-native-elements";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../libs";
import { ViewContainer } from "../components";

class LaunchScreen extends Component {
	render() {
		return (
			<ViewContainer>
				<Tile
					imageSrc={require('./img/launchscreen.png')}
					imageContainerStyle={styles.image}
					title="ASSETFUN"
					titleStyle={styles.title}
					caption="与区块连接中"
					captionStyle={styles.caption}
					featured
				>
				</Tile>
			</ViewContainer>
		);
	}
};

const styles = {
	container: {
		flex: 1,
		backgroundColor: 'rgba(251, 249, 240, 1)',
	},
	image: {
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
	},
	title: {
		color: 'rgba(0,0,255,0.7)',
	},
	caption: {
		color: 'rgba(0,0,255,0.3)'
	}
};

LaunchScreen.__cards__ = define => {
	define("Default", _ => <LaunchScreen />);
};
export default LaunchScreen;