
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Image, ListView, View, Text, ScrollView, Dimensions } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH } from "../../../libs";
import { SearchBar, List, ListItem, Icon, Button, Input } from 'react-native-elements';

import { ViewContainer, StyleSheet, LoadingLoginModal } from "../../../components";
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { AssetItem } from "./AssetItem";

import { ChainStore, FetchChain } from "assetfunjs/es";


const Header = styled.View`
	background-color: red;
`;

const ListContainer = styled.View`
`;

class AssetsList extends Component {

	constructor() {
		super();

		let assetsList = [
        'Simplicity Matters',
        'Hammock Driven Development',
        'Value of Values',
        'Are We There Yet?',
        'The Language of the System',
        'Design, Composition, and Performance',
        'Clojure core.async',
        'The Functional Database',
        'Deconstructing the Database',
        'Hammock Driven Development',
        'Value of Values'
      ];

		var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

		this.state = {
			ds: ds,
			dataSource: null, //ds.cloneWithRows(assetsList),
			accountBalance: null,
			accountHistory: null,
		};

		this.renderRow 	= this.renderRow.bind(this);
		this.navTo 			= this.navTo.bind(this);

	}

	componentWillMount() {
		// alert("ddddd");
		const { account } = this.props;
		console.log("=====[AssetList.js]::componentDidMount - account ", account);

  	FetchChain("getAccount", account).then((res) => {
  		const accountObj = res; //ChainStore.getAccount(account);
  		const accountBalance = accountObj && accountObj.get("balances");
  		const accountHistory = accountObj && accountObj.get("history");

      console.log("=====[AssetList.js]::componentDidMount - account : getAccount is : ", //JSON.stringify(res), 
      	"\n*******\n",JSON.stringify(accountBalance), "---", JSON.stringify(accountHistory));
      if(accountBalance) {
      		let balances = [];
      		accountBalance.forEach((a, asset_type) => {
      			balances.push({type: asset_type, asset: a});
      		});
					this.setState({accountBalance, accountHistory, dataSource: this.state.ds.cloneWithRows(balances)});	
      }      

    }).catch(err => {
      console.error("=====[AssetList.js]::componentDidMount - account : getAccount is : err ", err);
    })

		this.setState({refresh: true});
	}

	navTo(url) {
		const { navigation } = this.props;
		// console.log("=====[AssetList.js]::navTo - ", navigation);

		if(navigation) {
			//alert(url);
			navigation.navigate(url);
		}
	} 
	renderRow(rowData, sectionID, rowID) {
		const { accountBalance, accountHistory } = this.state;

		return (
			<AssetItem item={rowData} index={rowID} nav={this.navTo} balances={accountBalance} />
		);
	}

	render() {

		const { onScroll = () => {}, navigation  } = this.props;

		console.log("=====[AssetList.js]::render - ", "navigation");

		if(!this.state.dataSource)
			return null;

		return (
			<ViewContainer>
				<Header>
					<Text>hello AssetList </Text>
				</Header>

				<ListContainer>
					<List>
			      <ListView
			      	ref="ListView"
			      	style={styles.container}
			        dataSource={this.state.dataSource}
			        renderRow={this.renderRow}
			      />
			    </List>
				</ListContainer>
			</ViewContainer>
		);
	}
}

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({

});

export const AssetsListWrap = AssetsList;