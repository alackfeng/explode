
"use strict";

import React, { Component } from "react";

import { Dimensions, StyleSheet, View, Text, Image, ImageBackground, ActivityIndicator } from "react-native";

import { Tile, Button } from "react-native-elements";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../libs";
import { ViewContainer } from "../components";
import { loadingAnimation } from "../libs/help";
import { Colors as colors } from "../libs/Colors";


import SplashTile from "./SplashTile";


const TRACE = false;

class LaunchScreen extends Component {

  constructor() {
    super();
    this.state = {
      animating: true,
    };
  }

  componentDidMount() {
    //loadingAnimation(this.state.fadeAnimValue).start();
  }

	render() {


		return (
			<ViewContainer>
				<SplashTile
					containerStyle={styles.container}
					imageSrc={require('./images/launchscreen.jpg')}
					imageContainerStyle={styles.image}
					title="ASSETFUN"
					titleStyle={styles.title}
					featured={true}
					height={SCREEN_HEIGHT}
					width={SCREEN_WIDTH}
					view={ View }
					childrenContainerStyle={styles.children}
					icon={{source: require('./images/aftlogo.png')}}
					iconStyle={styles.icon}
				> 
          <Text style={styles.centering}>与区块连接中</Text>
					<ActivityIndicator
            style={[styles.centering, {height: 80}]}
            animating={this.state.animating}
            size="large"
            color={colors.salmon}
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
		backgroundColor: 'transparent',
	},
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
};

LaunchScreen.__cards__ = define => {
	define("Default", _ => <LaunchScreen />);
};
export default LaunchScreen;
