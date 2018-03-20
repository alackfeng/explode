
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Image, ListView, View, Text, ScrollView, Dimensions } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH, SCREEN_HEIGHT } from "../../../libs";
import { SearchBar, List, ListItem, Icon, Button, Input } from 'react-native-elements';

import { ViewContainer, StyleSheet, LoadingLoginModal, LoadingData } from "../../../components";
import { AssetItem } from "./AssetItem";
import _ from "lodash";

//import { ChainStore, FetchChain } from "assetfunjs/es";
let increment_seq = 1;
const TRACE = false;

class AssetsList extends Component {

	constructor(props) {
		super(props);

		var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 === r2 });
		const balances = this.getAssetsList(props);

		this.state = {
			ds: ds,
			dataSource: balances ? ds.cloneWithRows(balances) : null,
			db: balances,
		};

		this.renderRow 	= this.renderRow.bind(this);
		this.navTo 			= this.navTo.bind(this);

		if(TRACE) console.log("=====[AssetList.js]::constructor - assetsList-- : ", props.assetsList, balances);

	}

	componentWillReceiveProps(nextProps) {

		//if(nextProps.assetsList) {
		//	this.setState(dataSource: this.state.ds.cloneWithRows(nextProps.assetsList));
		//}
		const balances = this.getAssetsList(nextProps);

		const dataSource = balances && this.state.dataSource ? this.state.dataSource.cloneWithRows(balances) : this.state.dataSource;
		this.setState({dataSource, balances, db: balances});

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
		const { navigation, sendUnLock, isUnLock, account: currentAccount } = this.props;
		// console.log("=====[AssetList.js]::navTo - ", navigation);

    // 先解锁再
    if(!this.props.isUnLock) {
      // 先解锁，再发交易
      this.props.sendUnLock(currentAccount, {
        type: 'open'
      });
      
      return;
    }

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
			
			let balances = this.state && this.state.db ? this.state.db.slice(0) : [];

  		accountBalance.forEach((a, asset_type) => {
  			const balance = balances.filter(item => (item.type === asset_type && item.asset === a));
  			if(balance && balance.length) {
  				//balances.set({type: asset_type, asset: a});
  			} else {
  				balances.push({type: asset_type, asset: a});
  			}
  			if(TRACE) console.log("======================: ", balance.length);
  		});

			if(TRACE) console.log("=====[AssetList.js]::getAssetsList - ", balances);
  		return balances;
		}
		
		return null;

	}

	render() {

		const { onScroll = () => {}, navigation, assetsList } = this.props;

		//const balances = this.getAssetsList();
		//const dataSource = balances ? this.state.dataSource.cloneWithRows(balances.slice(0)) : this.state.dataSource;
		
		if(TRACE) console.log("=====[AssetList.js]::render - ", assetsList, this.state.dataSource, this.state.ds, this.state.balances);

		// 没有资产时，显示空
		if(!this.state.dataSource)
			return (<ViewContainer>
				<AssetItem item={false} index={0} />
			</ViewContainer>);

		return (
			<ViewContainer>
				<ScrollView>
			      <ListView
			      	enableEmptySections
			      	ref="ListView"
			      	style={styles.container}
			        dataSource={this.state.dataSource}
			        renderRow={this.renderRow}
			      />
				</ScrollView>
			</ViewContainer>
		);
	}
}

const styles = StyleSheet.create({

});

export const AssetsListWrap = AssetsList;
