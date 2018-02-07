
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Dimensions, Keyboard } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH } from "../../../libs";
import { Icon, Button, Input, List, ListItem } from 'react-native-elements';

import { ViewContainer, StyleSheet, TransactionConfirmModal } from "../../../components";
import { triggerTrans, triggerUser } from "../../../actions";
const {handle: sendTransfer} = triggerTrans;
const {unlock: sendUnLock} = triggerUser;

import { ChainStore, FetchChain } from "assetfunjs/es";


class Transfer extends Component {

	constructor() {
		super();

    this.state = {
      fromUser: '',
      toUser: 'feng41',
      amount: '1',
      asset_type: '',
      memoText: '',

      balanceObject: null,
      asset: null,
      item: null,
      index: null,
    };

    this.onPressTransfer  = this.onPressTransfer.bind(this);

	}

  componentWillMount() {
    const { navigation, currentAccount } = this.props;
    if(navigation && navigation.state.params) {
      const { item, index } = navigation.state.params;

      const balanceObject = ChainStore.getObject(item.asset);
      const asset_type = balanceObject.get("asset_type");
      const asset = ChainStore.getObject(asset_type);

      this.setState({fromUser: currentAccount, item, index, balanceObject, asset, asset_type: asset&&asset.get("symbol")})
    }
    

  }

  onPressTransfer() {
    const { fromUser, toUser, amount, asset_type, memoText } = this.state;

    console.log("=====[Transfer.js]::onPressTransfer - param > ", fromUser, toUser, amount);
    

    // 检验有效性
    if(!fromUser || !toUser || !amount || !asset_type) {
      return;
    }

 
    // 先解锁再
    if(!this.props.isUnLock) {
      // 先解锁，再发交易
      this.props.sendUnLock(this.props.currentAccount, {
        type: 'open'
      });
      
      return;
    }

    this.props.sendTransfer(fromUser, 'transfer', {
      from_account: fromUser, 
      to_account: toUser, 
      amount: amount * 100000000, 
      asset: asset_type,
      memo: memoText,
      propose_account: null,
      fee_asset_id: "1.3.0",
      // encrypt_memo: false,
    });

  }

  render() {

    const { currentAccount, navigation } = this.props;
    const { item, index } = this.state;
    const { balanceObject, asset, asset_type } = this.state;
    const subTitle = `${balanceObject.get("balance")/100000000} ${asset_type}`;

    console.log("=====[Transfer.js]::render - navigation : ", navigation);

    return (
      <ViewContainer>
        <View style={styles.titleContainer}>
          <ListItem
            containerStyle={{height: 100}}
            hideChevron
            key={1}
            //roundAvatar
            title={item.type}
            subtitle={subTitle}
            icon={{ name: item.icon }}
            avatar={require('../../Assets/images/aft-account.png')}
            avatarStyle={{backgroundColor: 'blue'}}
            //badge={{ element: <CustBadge index={rowID}/> }}
            //onPress={() => this.onPressItem(rowData)}
          />
        </View>



        <View style={{backgroundColor: 'white', width: SCREEN_WIDTH, alignItems: 'center'}}>
          <View style={styles.overlay}>
            <Input
              containerStyle={{marginTop: 10, borderWidth: 1, borderColor: 'rgba(223,223,223,1)', height: 50, width: SCREEN_WIDTH - 56, backgroundColor: 'white'}}
              icon={
                <Icon
                  name='person'
                  color='black'
                  size={25}
                />
              }
              placeholder="From"
              placeholderTextColor="black"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance="light"
              keyboardType="default"
              returnKeyType="next"
              editable={false}
              ref={ input => this.fromuserInput = input }
              onChangeText={ text => this.setState({fromUser: text})}
              onSubmitEditing={() => {
                this.touserInput.focus();
              }}
              blurOnSubmit={false}
              value={this.state.fromUser}
            />
          </View>
          <View style={styles.overlay}>
            <Input
              containerStyle={{marginTop: 10, borderWidth: 1, borderColor: 'rgba(223,223,223,1)', height: 50, width: SCREEN_WIDTH - 56, backgroundColor: 'white'}}
              icon={
                <Icon
                  name='person'
                  color='black'
                  size={25}
                />
              }
              placeholder="To"
              placeholderTextColor="black"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance="light"
              keyboardType="default"
              returnKeyType="next"
              ref={ input => this.touserInput = input }
              onChangeText={ text => this.setState({toUser: text})}
              onSubmitEditing={() => {
                this.amountInput.focus();
              }}
              blurOnSubmit={false}
              value={this.state.toUser}
            />
          </View>
          <View style={styles.overlay}>
            <Input
              containerStyle={{marginTop: 10, borderWidth: 1, borderColor: 'rgba(223,223,223,1)', height: 50, width: SCREEN_WIDTH - 56, backgroundColor: 'white'}}
              icon={
                <Icon
                  name='person'
                  color='black'
                  size={25}
                />
              }
              placeholder="Amount"
              placeholderTextColor="black"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance="light"
              keyboardType="default"
              returnKeyType="next"
              ref={ input => this.amountInput = input }
              onChangeText={ text => this.setState({amount: text})}
              onSubmitEditing={() => {
                this.memoInput.focus();
              }}
              blurOnSubmit={false}
              value={this.state.amount}
            />
          </View>
          <View style={styles.overlay}>
            <Input
              containerStyle={{marginTop: 10, borderWidth: 1, borderColor: 'rgba(223,223,223,1)', height: 150, width: SCREEN_WIDTH - 56, backgroundColor: 'white'}}
              icon={
                <Icon
                  name='person'
                  color='black'
                  size={25}
                />
              }
              inputStyle={{height: 130, textAlign: 'justify'}}
              placeholder="Memo"
              placeholderTextColor="black"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance="light"
              keyboardType="default"
              returnKeyType="done"
              ref={ input => this.memoInput = input }
              onChangeText={ text => this.setState({memoText: text})}
              onSubmitEditing={() => {
                //this.commitInput.focus();
                Keyboard.dismiss()
              }}
              blurOnSubmit={false}
              value={this.state.memoText}
            />
          </View>
        </View>
        <View style={{height: 100, flexDirection: 'row'}}>
          <Button
            text ='转账'
            ref={ input => this.commitInput = input }
            buttonStyle={{height: 50, width: 200, backgroundColor: 'rgba(35,82,164,1)', borderWidth: 1, borderColor: 'white', borderRadius: 5}}
            containerStyle={{marginVertical: 10}}
            textStyle={{fontWeight: 'bold'}}
            onPress={this.onPressTransfer}
          />
        </View>

      </ViewContainer>
    );
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    height: 100,
  }
});

const mapStateToProps = (state) => ({
  currentAccount: state.app.currentAccount,
  nodeStatus: state.app.nodeStatus,
  isUnLock: state.users.entityUnLock.isUnLock
});

export const TransferScreen = connect(mapStateToProps, {
  sendTransfer,
  sendUnLock,
})(Transfer);
