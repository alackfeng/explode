
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH } from "../../../libs";
import { Icon, Button, Input } from 'react-native-elements';

import { ViewContainer, StyleSheet, LoadingLoginModal, Header, HeaderAccount, HeaderSearchBar } from "../../../components";
import { triggerUser } from "../../../actions";
const {login: userLogin} = triggerUser;


import { AssetsListWrap as AssetsList } from "./AssetsList";

import { ChainStore, FetchChain } from "assetfunjs/es";


class AssetsManage extends Component {

	constructor() {
		super();

    this.state = {
      accountBalance: null,
      balances: null,
    }

    this.onSearchAssets = this.onSearchAssets.bind(this);

    this.update     = this.update.bind(this);
	}

  componentWillUnmount() {
    ChainStore.unsubscribe(this.update); // update
  }

  componentWillMount() {
    
    this.fetchAssetlist();

    ChainStore.subscribe(this.update); // update

  }

  fetchAssetlist = () => {
    const { currentAccount: account, nodeStatus: node } = this.props;

    console.log("=====[AssetsManage.js]::fetchAssetlist - account----------------------------------- ", account, node);


    if(!this.isNodeLinked()) {
      return;
    }


    FetchChain("getAccount", account).then((res) => {
      const accountObj = res; //ChainStore.getAccount(account);
      const accountBalance = accountObj && accountObj.get("balances");

      if(this.state.accountBalanceX === accountBalance) {

      }

      console.log("=====[AssetsManage.js]::fetchAssetlist - account : getAccount Balances is : ", this.state.accountBalanceX === accountBalance, JSON.stringify(accountBalance));
      if(accountBalance) {

          let asset_types = [];
          let balances = [];
          accountBalance.forEach((a, asset_type) => {
            balances.push({type: asset_type, asset: a});
            asset_types.push(asset_type);
          });

          // FetchChain
          FetchChain("getAsset", asset_types).then(res => {
            
            console.info("=====[AssetsManage.js]::fetchAssetlist - getAsset : accountBalance is : ", res);
            this.setState({accountBalance, balances});  
          }).catch(err => {
            console.error("=====[AssetsManage.js]::fetchAssetlist - getAsset : accountBalance is : ", err);
          });
      }      

      }).catch(err => {
        console.error("=====[AssetsManage.js]::fetchAssetlist - account : getAccount is : err ", err);
      })

  }

  update(nextProps = null) {
    console.info("=====[AssetsManage.js]::update - ChainStore::subscribe : ************** nextProps ", nextProps);

    this.fetchAssetlist();
  }

  isNodeLinked = () => {
    const { currentAccount, nodeStatus } = this.props;
    console.log("=====[AssetsManage.js]::isNodeLinked - ", currentAccount, nodeStatus.url, nodeStatus.status);
    return (!!currentAccount && !!nodeStatus.url && nodeStatus.status === 'open');
  }

  onSearchAssets(content) {
    alert("onSearchAssets:  " + content);
  }

  render() {

    const { currentAccount, nodeStatus } = this.props;

    const isLinked = this.isNodeLinked();
    console.log("=====[AssetsManage.js]::render - ", currentAccount, nodeStatus.url, nodeStatus.status, isLinked);

    if(!isLinked) {
      console.log("=====[AssetsManage.js]::render - ", currentAccount, nodeStatus.url, nodeStatus.status);
      return (<ViewContainer><Text>还没有通证，请刷新试试？</Text></ViewContainer>);
    } else {
      return (
      <ViewContainer>
        <HeaderSearchBar onSearch={this.onSearchAssets}/>
        <HeaderAccount />
        <AssetsList navigation={this.props.navigation} account={currentAccount} node={nodeStatus} assetsList={this.state.accountBalance} />
      </ViewContainer>
      );
    }

    
  }
}


const mapStateToProps = (state) => ({
  currentAccount: state.app.currentAccount,
  nodeStatus: state.app.nodeStatus,
});

export const AssetsManageScreen = connect(mapStateToProps, {

})(AssetsManage);
