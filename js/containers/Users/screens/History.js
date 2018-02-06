
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH } from "../../../libs";
import { Icon, Button, Input } from 'react-native-elements';

import { ViewContainer, StyleSheet, LoadingLoginModal, Header, TableHistory } from "../../../components";

import { ChainStore, FetchChain } from "assetfunjs/es";

const TRACE = false;

class History extends Component {

	constructor(props) {
		super(props);

		this.state = {
			accountHistory: null,
		}

	}
	componentDidMount() {

		const { currentAccount } = this.props;

		if(currentAccount) {
      /*FetchChain("getAccount", currentAccount).then((ret) => {
        if(TRACE) console.log("=====[History.js]::componentDidMount - : FetchChain:getAccount is : ", JSON.stringify(ret.get("balances")), JSON.stringify(ret));
        const accountObj = ret;
        const accountHistory = accountObj && accountObj.get ? ret.get("history") : null;

        this.setState({accountHistory});

      }).catch(err => {
        console.error("=====[History.js]::componentDidMount - : FetchChain:getAccount is : err ", err);
      })*/
		}
	}

	render() {

		const { currentAccount } = this.props;
		const { accountHistory } = this.state;
		if(TRACE) console.info("=====[History.js]::render - : render >  ", currentAccount, accountHistory);

		return (
			<ViewContainer>
				<Header account={currentAccount} />
				<Text>hi History, {currentAccount}</Text>
				<TableHistory history={accountHistory} />
			</ViewContainer>
		);
	}
}

const mapStateToProps = (state) => ({
  currentAccount: state.app.currentAccount,
});

export const HistoryScreen = connect(mapStateToProps, {

})(History);
