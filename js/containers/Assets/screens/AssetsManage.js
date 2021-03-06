
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text, ScrollView, Dimensions, Alert } from 'react-native';
import { Colors, resetNavigationTo, SCREEN_WIDTH, translate, locale } from '../../../libs';
import { Icon, Button, Input } from 'react-native-elements';

import { ViewContainer, StyleSheet, LoadingLoginModal, Header, HeaderAccount, HeaderSearchBar, LoadingData } from '../../../components';
import { triggerUser } from '../../../actions';
import Toast, {DURATION} from 'react-native-easy-toast';


const { login: userLogin, unlock: sendUnLock } = triggerUser;


import { AssetsListWrap as AssetsList } from './AssetsList';

import { ChainStore, FetchChain } from 'assetfunjs/es';

const TRACE = false;

class AssetsManage extends Component {
  constructor() {
    super();

    this.state = {
      accountBalance: null,
      balances: null,
      isRefreshing: false,
    };

    this.onSearchAssets = this.onSearchAssets.bind(this);

    this.update = this.update.bind(this);
    this._onRefreshAssets = this._onRefreshAssets.bind(this);
  }

  componentWillUnmount() {
    ChainStore.unsubscribe(this.update); // update
  }

  componentWillMount() {
    this.fetchAssetlist();

    ChainStore.subscribe(this.update); // update
  }

  update(nextProps = null) {
    if (TRACE) console.info('=====[AssetsManage.js]::update - ChainStore::subscribe : ************** nextProps ', nextProps);

    this.fetchAssetlist();
  }

  fetchAssetlist = (force = false) => {
    const { currentAccount: account, nodeStatus: node } = this.props;

    if (TRACE) console.log('=====[AssetsManage.js]::fetchAssetlist - account----------------------------------- ', account, node);


    // test if(!this.isNodeLinked()) {
    //   return;
    // }
    // 开始刷新
    if (force) {
      this.setState({ isRefreshing: true });
    }

    FetchChain('getAccount', account).then((res) => {
      const accountObj = res; // ChainStore.getAccount(account);
      const accountBalance = accountObj && accountObj.get('balances');

      if (this.state.accountBalanceX === accountBalance) {

      }

      if (TRACE) console.log('=====[AssetsManage.js]::fetchAssetlist - account : getAccount Balances is : ', this.state.accountBalanceX === accountBalance, JSON.stringify(accountBalance));
      if (accountBalance) {
        const asset_types = [];
        const balances = [];
        accountBalance.forEach((a, asset_type) => {
          balances.push({ type: asset_type, asset: a });
          asset_types.push(asset_type);
        });

        // FetchChain
        FetchChain('getAsset', asset_types).then((res) => {
          if (TRACE) console.info('=====[AssetsManage.js]::fetchAssetlist - getAsset : accountBalance is : ', res);
          this.setState({ accountBalance, balances, isRefreshing: false });
        }).catch((err) => {
          console.error('=====[AssetsManage.js]::fetchAssetlist - getAsset : accountBalance is : ', err);
          this.setState({ isRefreshing: false });
        });
      }
    }).catch((err) => {
      console.error('=====[AssetsManage.js]::fetchAssetlist - account : getAccount is : err ', err);
      this.setState({ isRefreshing: false });
      this.fetchAssetlist(); // timeout again
    });
  }

  isNodeLinked = () => {
    const { currentAccount, nodeStatus } = this.props;
    if (TRACE) console.log('=====[AssetsManage.js]::isNodeLinked - ', currentAccount, nodeStatus.url, nodeStatus.status);
    return (!!currentAccount && !!nodeStatus.url && nodeStatus.status === 'open');
  }

  onSearchAssets(content) {

    Alert.alert(' ', 'Not implement', [{ text: 'OK', onPress: () => {} },]);
  }

  // 下拉刷新功能
  _onRefreshAssets = () => {
    // 节点未连接，提示用户
    if (!this.isNodeLinked()) {
      this.setState({ isRefreshing: false });

      this.refs.toast.show(translate('tips.comm.nodelose', locale));
      // Alert.alert(' ', translate('tips.comm.nodelose', locale), [{ text: 'OK', onPress: () => {} },]);
      return;
    }

    ChainStore.unsubscribe(this.update); // update
    ChainStore.clearCache();
    ChainStore.subscribe(this.update); // update

    this.fetchAssetlist(true);
  }

  render() {
    const { currentAccount, nodeStatus, isUnLock } = this.props;
    const { accountBalance, isRefreshing } = this.state;

    const isLinked = this.isNodeLinked();
    if (TRACE) console.log('=====[AssetsManage.js]::render - ', currentAccount, nodeStatus.url, nodeStatus.status, isLinked);
    console.log('=====[AssetsManage.js]::render - accountBalance: > ', JSON.stringify(accountBalance));

    if (0 && !isLinked) {
      console.log('=====[AssetsManage.js]::render - ', currentAccount, nodeStatus.url, nodeStatus.status);
      return <LoadingData message={translate('tips.comm.nodelose', locale)} />;
    }
    else {
      return (
        <ViewContainer>
          <Toast ref="toast" position='top' positionValue={100} />
          <HeaderSearchBar onSearch={this.onSearchAssets} />
          {accountBalance
          ? <AssetsList
            navigation={this.props.navigation}
            account={currentAccount}
            node={nodeStatus}
            assetsList={accountBalance}
            sendUnLock={this.props.sendUnLock}
            isUnLock={isUnLock}
            onRefresh={this._onRefreshAssets}
            isRefreshing={isRefreshing}
          />
          : <LoadingData message={translate('comm.loadingdata', locale)} />
          }
          
        </ViewContainer>
      );
    }
  }
}


const mapStateToProps = state => ({
  currentAccount: state.app.currentAccount,
  nodeStatus: state.app.nodeStatus,
  isUnLock: state.users.entityUnLock.isUnLock,
});

export const AssetsManageScreen = connect(mapStateToProps, {
  sendUnLock,
})(AssetsManage);
