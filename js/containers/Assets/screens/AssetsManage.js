
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

import Talks from "../../Enter/screens/Talks";
import Nested from "../../Enter/screens/Nested";
import { AssetsListWrap as AssetsList } from "./AssetsList";

class AssetsManage extends Component {

	constructor() {
		super();

    this.onSearchAssets = this.onSearchAssets.bind(this);
	}

  isNodeLinked = () => {
    const { currentAccount, nodeStatus } = this.props;
    console.log("=====[AssetsManage.js]::isNodeLinked - ", currentAccount, nodeStatus.url, nodeStatus.status);
    return (!!currentAccount && !!nodeStatus.url && !!nodeStatus.status);
  }

  onSearchAssets(content) {
    alert("onSearchAssets:  " + content);
  }

  render() {

    const { currentAccount, nodeStatus } = this.props;

    if(!this.isNodeLinked())
      return <ViewContainer><Text>No Data</Text></ViewContainer>;

    return (
      <ViewContainer>
        <HeaderSearchBar onSearch={this.onSearchAssets}/>
        <HeaderAccount />
        <Header node/>
        <AssetsList navigation={this.props.navigation} account={currentAccount} />
      </ViewContainer>
    );
  }
}


const mapStateToProps = (state) => ({
  currentAccount: state.app.currentAccount,
  nodeStatus: state.app.nodeStatus,
});

export const AssetsManageScreen = connect(mapStateToProps, {

})(AssetsManage);
