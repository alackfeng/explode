
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH } from "../../../libs";
import { Icon, Button, Input } from 'react-native-elements';

import { ViewContainer, StyleSheet, LoadingLoginModal } from "../../../components";
import { triggerUser } from "../../../actions";
const {login: userLogin} = triggerUser;

import Talks from "../../Enter/screens/Talks";
import Nested from "../../Enter/screens/Nested";
import { AssetsListWrap as AssetsList } from "./AssetsList";

class AssetsManage extends Component {

	constructor() {
		super();

	}
  render() {

    const { currentAccount } = this.props;

    return (
      <ViewContainer>
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
