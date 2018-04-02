
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Colors, resetNavigationTo, SCREEN_WIDTH, translate, locale } from '../../../libs';
import { Icon, Button, Input, Overlay } from 'react-native-elements';

import { ViewContainer, StyleSheet, LoadingLoginModal, Header, TableHistory, LoadingData } from '../../../components';

import { ChainStore, FetchChain } from 'assetfunjs/es';

const TRACE = false;

class History extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountHistory: null,
      accountId: null,
      isRefreshing: false,
    };

    this.update = this.update.bind(this);
    this._onRefreshHistory = this._onRefreshHistory.bind(this);
  }

  componentWillUnmount() {
    ChainStore.unsubscribe(this.update); // update
  }

  componentWillMount() {
    ChainStore.subscribe(this.update); // update

    this.fetchHistoryList();
  }

  update(nextProps = null) {
    if (TRACE) console.info('=====[History.js]::update - ChainStore::subscribe : ************** nextProps ', nextProps);

    this.fetchHistoryList();
  }

  fetchHistoryList(force = false) {
    const { currentAccount } = this.props;

    // 开始刷新
    if (force) {
      this.setState({ isRefreshing: true });
    }

    if (currentAccount) {
      FetchChain('getAccount', currentAccount).then((ret) => {
        if (TRACE) console.log('=====[History.js]::fetchHistoryList - : FetchChain:getAccount is : ', JSON.stringify(ret));
        const accountObj = ret; // ChainStore.getAccount(currentAccount);
        const accountHistory = accountObj && accountObj.get ? accountObj.get('history') : null;

        this.setState({
        	accountId: accountObj.get('id'),
        	accountHistory: accountHistory || this.state.accountHistory,
        	isRefreshing: false, // accountHistory ? false : this.state.isRefreshing,
        });
        // alert(this.state.isRefreshing);
      }).catch((err) => {
        console.error('=====[History.js]::fetchHistoryList - : FetchChain:getAccount is : err ', err);
        this.fetchHistoryList();
        this.setState({ isRefreshing: false });
      });
    }
  }

	isNodeLinked = () => {
	  const { currentAccount, nodeStatus } = this.props;
	  if (TRACE) console.log('=====[History.js]::isNodeLinked - ', currentAccount, nodeStatus.url, nodeStatus.status);
	  return (!!currentAccount && !!nodeStatus.url && nodeStatus.status === 'open');
	}

  // 下拉刷新功能
	_onRefreshHistory = () => {
	  // 节点未连接，提示用户
	  if (!this.isNodeLinked()) {
	    this.setState({ isRefreshing: false });
	    alert(translate('tips.comm.nodelose', locale));
	    return;
	  }
	  // alert("refresh")
	  ChainStore.unsubscribe(this.update); // update
	  ChainStore.clearCache();
	  ChainStore.subscribe(this.update); // update

	  this.fetchHistoryList(true);
	}


	render() {
	  const { currentAccount } = this.props;
	  const { accountHistory, accountId, isRefreshing } = this.state;
	  if (!TRACE) console.info('=====[History.js]::render - : render >  ', currentAccount, accountHistory);

	  const isValid = !!accountHistory;

	  return (
  <ViewContainer>
    {!isValid && <Overlay
      isVisible={!isValid}
      windowBackgroundColor="transparent"
      overlayBackgroundColor="transparent"
      width="auto"
      height="auto"
    >
      <LoadingData message={translate('comm.loadingdata', locale)} size="large" />
    </Overlay>}
    {accountHistory && <TableHistory history={accountHistory} account={accountId} onRefresh={this._onRefreshHistory} isRefreshing={isRefreshing} />}
  </ViewContainer>
	  );
	}
}

const mapStateToProps = state => ({
  currentAccount: state.app.currentAccount,
  nodeStatus: state.app.nodeStatus,
});

export const HistoryScreen = connect(mapStateToProps, {

})(History);
