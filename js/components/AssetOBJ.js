


import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Dimensions, ListView } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH, Utils } from "../libs";
import { Icon, Button, Input, List, ListItem } from 'react-native-elements';

import { ViewContainer, StyleSheet, } from "../components";

import { ChainStore, FetchChain, ChainTypes } from "assetfunjs/es";

const TRACE = false;

export class AssetOBJ extends Component {

	constructor(props) {
		super(props);

		this.state = {
			assetName: null,
      precision: -1,
		}

		this.update = this.update.bind(this);
	}

  componentWillUnmount() {
    //ChainStore.unsubscribe(this.update); // update
  }

  componentWillMount() {
    
    this.fetchAssets();
    //ChainStore.subscribe(this.update); // update

  }

  update(nextProps = null) {
    if(TRACE) console.info("=====[AssetOBJ.js]::update - ChainStore::subscribe : ************** nextProps ", nextProps);

    //this.fetchAssets();
  }

	fetchAssets = () => {
    const { asset } = this.props;

    if(TRACE) console.log("=====[AssetOBJ.js]::fetchAssets - asset---: ", asset);

    let updateAsset = (assetObj) => {

      if(TRACE) console.log("=====[AssetOBJ.js]::fetchAssets - asset : AssetOBJ is : ", JSON.stringify(assetObj));
      if(assetObj) {

          this.setState({assetName: assetObj.get("symbol"), precision: Utils.get_asset_precision(assetObj)});
      }
    }

    const assetObj = ChainStore.getAsset(asset);
    if(assetObj) {
      if(TRACE) console.log("=====[AssetOBJ.js]::fetchAssets - asset : getAsset is : ", JSON.stringify(assetObj));
      updateAsset(assetObj);
      return;
    }

    FetchChain("getAsset", asset).then((res) => {
      const assetObj = res; //ChainStore.getAccount(account);
      
      updateAsset(assetObj);

    }).catch(err => {
      if(TRACE) console.error("=====[AccountOBJ.js]::fetchAssets - asset : fetchAssets is : err ", err);
      this.fetchAssets(); // try again
    })

  }

	render() {

		const { asset, amount } = this.props;
    const { assetName, precision } = this.state;

    const isValid = (precision !== -1 && !!assetName);

    if(TRACE) console.log("[AssetOBJ.js]::render - ", isValid, asset, amount, assetName, precision);

		return (
			<View style={styles.container} >
				<Text style={styles.column}>{ isValid ? `${amount/precision} ${assetName || asset}` : 'NaN'}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  },
	column: {
		color: 'rgba(40,65,89,1)', 
		fontSize:15, 
		textAlign:'right',

	}
});