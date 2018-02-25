
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Image, ListView, View, Text, ScrollView, Dimensions } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH, SCREEN_HEIGHT } from "../../../libs";
import { SearchBar, List, ListItem, Icon, Button, Input } from 'react-native-elements';

import { ViewContainer, StyleSheet, LoadingLoginModal } from "../../../components";
import { AssetItem } from "./AssetItem";
import _ from "lodash";

//import { ChainStore, FetchChain } from "assetfunjs/es";
let increment_seq = 1;

class AssetsList extends Component {

	constructor(props) {
		super(props);

		var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 === r2 });
		const balances = this.getAssetsList(props);

		this.state = {
			ds: ds,
			dataSource: balances ? ds.cloneWithRows(balances) : null,
			balances: balances,
		};

		this.renderRow 	= this.renderRow.bind(this);
		this.navTo 			= this.navTo.bind(this);

		console.log("=====[AssetList.js]::constructor - assetsList-- : ", props.assetsList, balances);

	}

	componentWillReceiveProps(nextProps) {

		//if(nextProps.assetsList) {
		//	this.setState(dataSource: this.state.ds.cloneWithRows(nextProps.assetsList));
		//}
		const balances = this.getAssetsList(nextProps);

		const dataSource = balances ? this.state.ds.cloneWithRows(balances) : this.state.dataSource;
		this.setState({dataSource, balances});

	}

	componentWillUnmount() {
		//ChainStore.unsubscribe(this.update); // update
	}

	componentWillMount() {
		// alert("ddddd");
		const { account, node } = this.props;
		//console.log("=====[AssetList.js]::componentDidMount - account-- ", account, node);
		/*
		//ChainStore.subscribe(this.update); // update
		
		if(!this.isNodeLinked()) {
			return;
		}

  	FetchChain("getAccount", account).then((res) => {
  		const accountObj = res; //ChainStore.getAccount(account);
  		const accountBalance = accountObj && accountObj.get("balances");
  		const accountHistory = accountObj && accountObj.get("history");

      console.log("=====[AssetList.js]::componentDidMount - account : getAccount is : ", //JSON.stringify(res), 
      	"\n*******\n",JSON.stringify(accountBalance), "---", JSON.stringify(accountHistory));
      if(accountBalance) {

      		let asset_types = [];
      		let balances = [];
      		accountBalance.forEach((a, asset_type) => {
      			balances.push({type: asset_type, asset: a});
      			asset_types.push(asset_type);
      		});

      		// FetchChain
      		FetchChain("getObject", asset_types).then(res => {
      			console.log("=====[AssetList.js]::componentDidMount - getObject : accountBalance is : ", asset_types, res.size, "+++++++++++");
      			this.setState({symbols: res && res.get("symbol"), dataSource: this.state.ds.cloneWithRows(balances)});
      		}).catch(err => {
      			console.error("=====[AssetList.js]::componentDidMount - getObject : accountBalance is : ", err);
      		});

					this.setState({accountBalance, accountHistory, balances});	
      }      

    }).catch(err => {
      console.error("=====[AssetList.js]::componentDidMount - account : getAccount is : err ", err);
    })

		this.setState({refresh: true}); */
	}

	isNodeLinked = () => {
    const { account: currentAccount, node: nodeStatus } = this.props;
    console.log("=====[AssetList.js]::isNodeLinked - ", currentAccount, nodeStatus.url, nodeStatus.status);
    return (!!currentAccount && !!nodeStatus.url && nodeStatus.status === 'open');
  }

	update(nextProps = null) {
		console.info("=====[AssetList.js]::update - ChainStore::subscribe : ************** nextProps ", nextProps);
		this.setState({refresh: true});
	}

	navTo(url, params) {
		const { navigation } = this.props;
		// console.log("=====[AssetList.js]::navTo - ", navigation);

		if(navigation) {
			//alert(url);
			navigation.navigate(url, params);
		}
	} 
	renderRow(rowData, sectionID, rowID) {
		const { assetsList: accountBalance } = this.props;

		return (
			<AssetItem item={rowData} index={rowID} nav={this.navTo} balances={accountBalance} />
		);
	}

	getAssetsList = (props, ds) => {
		const { assetsList: accountBalance } = props || this.props;

		if(accountBalance && accountBalance.size) {
			let balances = [];
  		accountBalance.forEach((a, asset_type) => {
  			increment_seq = increment_seq + 1;
  			balances.push({type: asset_type, asset: a, incr: increment_seq});
  		});

			console.log("=====[AssetList.js]::getAssetsList - ", balances);
  		return balances;
		}
		
		return null;

	}

	render() {

		const { onScroll = () => {}, navigation, assetsList } = this.props;

		console.log("=====[AssetList.js]::render - ", assetsList, this.state.dataSource);

		//const balances = this.getAssetsList();
		//const dataSource = balances ? this.state.ds.cloneWithRows(balances) : this.state.dataSource;

		if(!this.state.dataSource)
			return <ViewContainer><Text>No Data Balance</Text></ViewContainer>;

		return (
			<ViewContainer>
				<ScrollView>
					<List>
			      <ListView
			      	enableEmptySections
			      	ref="ListView"
			      	style={styles.container}
			        dataSource={this.state.dataSource}
			        renderRow={this.renderRow}
			      />
			    </List>
				</ScrollView>
			</ViewContainer>
		);
	}
}

const styles = StyleSheet.create({

});

export const AssetsListWrap = AssetsList;