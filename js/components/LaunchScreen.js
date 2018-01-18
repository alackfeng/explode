
"use strict";

import React, { Component } from "react";

import { Dimensions, StyleSheet, View, Image } from "react-native";

const WIN_WIDTH = Dimensions.get("window").width,
	WIN_HEIGHT = Dimensions.get("window").height;

class LaunchScreen extends Component {
	render() {
		return (
			<View style={[styles.container, this.props.style]}>
				<Image source={require("./img/launchscreen.png")} style={styles.image} />
			</View>
		);
	}
};

const styles = {
	container: {
		flex: 1,
		backgroundColor: 'rgba(251, 249, 240, 1)'
	},
	image: {
		position: 'absolute',
		left: 0,
		top: 0,
		width: WIN_WIDTH,
		height: WIN_HEIGHT,
		resizeMode: 'cover'
	}
};

LaunchScreen.__cards__ = define => {
	define("Default", _ => <LaunchScreen />);
};
export default LaunchScreen;