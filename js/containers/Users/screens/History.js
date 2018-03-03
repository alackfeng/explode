
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH } from "../../../libs";
import { Icon, Button, Input, Overlay } from 'react-native-elements';

import { ViewContainer, StyleSheet, LoadingLoginModal, Header, TableHistory, LoadingData } from "../../../components";

import { ChainStore, FetchChain } from "assetfunjs/es";

const TRACE = false;

class History extends Component {

	constructor(props) {
		super(props);

		this.state = {
			accountHistory: null,
			accountId: null,
		}

		this.update = this.update.bind(this);

	}

	componentWillUnmount() {
    ChainStore.unsubscribe(this.update); // update
  }

  componentWillMount() {
    
    ChainStore.subscribe(this.update); // update

    this.fetchHistoryList();

  }

  update(nextProps = null) {
    if(TRACE) console.info("=====[History.js]::update - ChainStore::subscribe : ************** nextProps ", nextProps);

    this.fetchHistoryList();
  }

	fetchHistoryList() {

		const { currentAccount } = this.props;

		if(currentAccount) {
      FetchChain("getAccount", currentAccount).then((ret) => {
        if(TRACE) console.log("=====[History.js]::componentDidMount - : FetchChain:getAccount is : ", JSON.stringify(ret.get("balances")), JSON.stringify(ret));
        const accountObj = ret; //ChainStore.getAccount(currentAccount);
        const accountHistory = accountObj && accountObj.get ? accountObj.get("history") : null;

        this.setState({accountId: accountObj.get("id"), accountHistory});

      }).catch(err => {
        console.error("=====[History.js]::componentDidMount - : FetchChain:getAccount is : err ", err);
        this.fetchHistoryList();
      })
		}
	}

	render() {

		const { currentAccount } = this.props;
		const { accountHistory, accountId } = this.state;
		if(!TRACE) console.info("=====[History.js]::render - : render >  ", currentAccount, accountHistory);

		const isValid = !!accountHistory;

		return (
			<ViewContainer>
				<Header account={false} />
				{!isValid && <Overlay
				  isVisible={ !isValid }
				  windowBackgroundColor='transparent'
				  overlayBackgroundColor='transparent'
				  width='auto'
				  height='auto'
				>
				  <LoadingData message={"数据加载中..."} size="large" />
				</Overlay>}
				{accountHistory && <TableHistory history={accountHistory} account={accountId} />}
			</ViewContainer>
		);
	}
}

const mapStateToProps = (state) => ({
  currentAccount: state.app.currentAccount,
});

export const HistoryScreen = connect(mapStateToProps, {

})(History);
