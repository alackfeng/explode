
import React, { Component } from "react";
import styled from "styled-components/native";
import { connect } from "react-redux";

import { Dimensions, View, ScrollView, Image, TouchableHighlight, ListView } from "react-native";
import { Text, Card, ButtonGroup, Tile, Col, Row, Icon, List, ListItem, Avatar, Badge } from "react-native-elements";

import { ViewContainer, StyleSheet } from "../../../components";
import { Colors } from "../../../libs/Colors";

import { ChainStore, FetchChain } from "assetfunjs/es";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const CustBadge = (props) => {

	return <Badge value={props.index} textStyle={{ color: 'orange' }} />
}

const listMenu = [
	{
		title: 'Settings',
		icon: 'av-timer',
		subtitle: '设置属性',
		nav: {
			title: 'Settings',
			user: 'me',
		}
	},
	{
		title: 'Nodes',
		icon: 'flight-takeoff',
		subtitle: '节点信息',
		nav: {
			title: 'Nodes',
			user: 'me',
		}
	},
	{
		title: 'Main',
		icon: 'fingerprint',
		subtitle: 'CEO',
		nav: false,
	},
];

const listMenu2 = [
	{
		name: 'Amy Farha',
		avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
		subtitle: 'Vice President',
		callback: function (id) { alert("menu1", id)}
	},
	{
		name: 'Chris Jackson',
		avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
		subtitle: 'Vice Chairman',
		callback: function (id) { alert("menu2", id)}
	},
	{
		name: 'Amanda Martin',
		avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
		subtitle: 'CEO',
		callback: function (id) { alert("menu3", id)}
	},
];

const log = () => console.log('this is an example method');

class Center extends Component {

	constructor() {
		super();

		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
		});

		this.state = {
			selectedIndex: 0,
			value: 0.5,
			dataSource: ds.cloneWithRows(listMenu2),

			currentAccount: null,
		};

		this.updateIndex 	= this.updateIndex.bind(this);
		this.renderRow 		= this.renderRow.bind(this);
		this.onPressItem 	= this.onPressItem.bind(this);
		
	}

	componentDidMount() {

		const { currentAccount } = this.props;

		if(0 && currentAccount) {
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

		}
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

	updateIndex(selectedIndex) {
		this.setState({ selectedIndex });
	}

	renderRow(rowData, sectionID, rowID) {
		//console.log("ssssssss -  ssss ", sectionID, this);
		return (
			<ListItem
				key={rowID}
				roundAvatar
				title={rowData.name}
				subtitle={rowData.subtitle}
				icon={{ name: rowData.icon }}
				//avatar={{uri:rowData.avatar_url}}
				badge={{ element: <CustBadge index={rowID}/> }}
				onPress={() => this.onPressItem(rowData)}
			/>
		);
	}

	render() {

		const { navigation, currentAccount } = this.props;
		const buttons = ['Button1', 'Button2'];
		const { selectedIndex } = this.state;

		console.log("=====[Center.js]::render - navigation - >:", this.state.currentAccount);

    	return (
    	<ViewContainer>
    		<View style={styles.userContainer} >
    			<Icon color="white" name="invert-colors" size={62} />
    			<Text style={styles.heading}>{currentAccount ? currentAccount : "Welcome?"}</Text>
    		</View>
    		<ScrollView contentContainerStyle={styles.container} >
    			<List>
    				{listMenu.map((l, i) => (

						<ListItem
							leftIcon={{ name: l.icon, style: {color: 'blue'} }}
							key={i}
							title={l.title}
							titleStyle={{color: 'red'}}
							subtitle={l.subtitle}
			                rightTitle='11:00am'
			                rightTitleStyle={{color: 'green'}}
			                onPress={() => this.onPressItem(l, navigation)}
						/>
    				))}
    			</List>
				<List>
					<ListView
					renderRow={this.renderRow}
					dataSource={this.state.dataSource}
					/>
				</List>
    		</ScrollView>
    	</ViewContainer>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		//justifyContent: 'center',
		//alignItems: 'center',
		backgroundColor: 'red',
	},
	userContainer: {
		//flex: 1,
		//backgroundColor: '#F5FCFF',
		height: 100,
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

})(Center);






