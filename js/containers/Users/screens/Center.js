
import React, { Component } from "react";
import styled from "styled-components/native";
import { connect } from "react-redux";

import { Dimensions, View, ScrollView, Image, TouchableHighlight, ListView } from "react-native";
import { Button, Text, Card, ButtonGroup, Tile, Col, Row, Icon, List, ListItem, Avatar, Badge } from "react-native-elements";

import { ViewContainer, StyleSheet } from "../../../components";
import { Colors } from "../../../libs/Colors";
import { resetNavigationTo, SCREEN_WIDTH, SCREEN_HEIGHT } from "../../../libs/help";

import { ChainStore, FetchChain } from "assetfunjs/es";
import { appUserQuit } from "../../../actions";

const CustBadge = (props) => {

	return <Badge value={props.index} textStyle={{ color: 'orange' }} />
}

const listMenu = [
	{
		title: 'Nodes',
		icon: 'public',
		subtitle: '接入点设置',
		nav: {
			title: 'Nodes',
			user: 'me',
		}
	},
	{
		title: 'History',
		icon: 'receipt',
		subtitle: '交易记录',
		nav: true,
	},
];

class Center extends Component {

	constructor() {
		super();

		this.state = {
			currentAccount: null,
		};

		this.onPressItem 	= this.onPressItem.bind(this);
		this.onPressQuit	= this.onPressQuit.bind(this);
		
	}

	componentDidMount() {

		const { currentAccount } = this.props;
		// 验证账号是否登录呢？？？
		
		/*if(currentAccount) {
      FetchChain("getAccount", currentAccount).then((ret) => {
      	const assetObj = ChainStore.getObject("1.3.0", true);
        console.log("=====[Center.js]::componentDidMount - : getAccount is : ", JSON.stringify(ret.get("balances")), JSON.stringify(assetObj), JSON.stringify(ret));
        this.setState({currentAccount: ret});

      }).catch(err => {
        console.error("=====[Center.js]::componentDidMount - : getAccount is : err ", err);
      })

      FetchChain("getObject", "1.3.0").then((ret) => {
        console.log("=====[Center.js]::componentDidMount - : getObject is : ", JSON.stringify(ret));

      }).catch(err => {
        console.error("=====[Center.js]::componentDidMount - : getObject is : err ", err);
      })
		}*/
	}


	onPressItem(item, navigation) {
		console.log("=====[Center.js]::list item - : ", item);
		if(item.nav && navigation && navigation.navigate) {
			console.log("=====[Center.js]::list item to navigation : ", item.title, item.nav);
			if(item.nav === true) 
				navigation.navigate(item.title);
			else 
				navigation.navigate(item.title, item.nav);
		}
	}

	onPressQuit() {
		const { navigation, currentAccount } = this.props;
		console.log("=====[Center.js]::onPressQuit -  - >:", currentAccount);
		if(currentAccount) {
			this.props.appUserQuit(currentAccount);
		}
		resetNavigationTo('Login', navigation);
	}

	render() {

		const { navigation, currentAccount } = this.props;

		console.log("=====[Center.js]::render - navigation - >:", this.state.currentAccount);

    	return (
    	<ViewContainer>
    		<View style={styles.userContainer} >
    			<Icon color="white" name="invert-colors" size={62} />
    			<Text style={styles.heading}>{currentAccount ? currentAccount : "Welcome?"}</Text>
    		</View>
    		<ScrollView contentContainerStyle={styles.listContainer} >
    			<List>
    				{listMenu.map((l, i) => (

						<ListItem
							leftIcon={{ name: l.icon, style: {color: 'rgba(35,82,164,1)'} }}
							key={i}
							title={l.subtitle}
							titleStyle={{color: 'rgba(40,65,89,1)'}}
              onPress={() => this.onPressItem(l, navigation)}
						/>
    				))}
    			</List>
    		</ScrollView>
    		<View style={styles.logoutContainer}>
    			<Button
            text="退  出"
            textStyle={{color: 'rgba(229,109,57,1)'}}
            buttonStyle={{height: 50, width: SCREEN_WIDTH, backgroundColor: 'rgba(255,255,255,0.3)', borderWidth: 2, borderColor: 'white', borderRadius: 0, zIndex: 10}}
            containerStyle={{marginTop: 20,marginVertical:20}}
            onPress={this.onPressQuit}
          />
    		</View>
    	</ViewContainer>
		);
	}

}

const styles = StyleSheet.create({
	listContainer: {
		//flexGrow: 2,
		//justifyContent: 'center',
		//alignItems: 'center',
		backgroundColor: 'white',
		//height: 300,
	},
	userContainer: {
		//flex: 1,
		//flex: 1,
		backgroundColor: 'rgba(35,82,164,1)',
		height: 100,
		marginTop: 30,
	},
	logoutContainer: {
		//flex: 1,
		height: 50,
		backgroundColor: 'white',
		marginBottom: 50,
	},

	heading: {
		color: 'white',
		marginTop: 10,
		fontSize: 22,
		textAlign: 'center',
	},
});

const mapStateToProps = (state) => ({
  currentAccount: state.app.currentAccount,
});

export const CenterScreen = connect(mapStateToProps, {
	appUserQuit,
})(Center);






