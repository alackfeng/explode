
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH } from "../../../libs";
import { Icon, Button, Input } from 'react-native-elements';

import { ViewContainer, StyleSheet, TransactionConfirmModal } from "../../../components";
import { triggerTrans } from "../../../actions";
const {handle: sendTransfer} = triggerTrans;

class Transfer extends Component {

	constructor() {
		super();

    this.state = {
      fromUser: 'feng1',
      toUser: 'feng4',
      amount: '10',
      asset_type: 'AFT',

      isOpen: false,
    };

    this.onPressTransfer  = this.onPressTransfer.bind(this);

	}

  onPressTransfer() {
    const { fromUser, toUser, amount, asset_type } = this.state;

    console.log("=====[Transfer.js]::onPressTransfer - param > ", fromUser, toUser, amount);
    
    // 先打开模式对话框，接收消息
    this.setState({isOpen: true});

    this.props.sendTransfer(fromUser, 'transfer', {
      from_account: fromUser, 
      to_account: toUser, 
      amount: amount * 100000000, 
      asset: asset_type,
      memo: "send you",
      propose_account: null,
      fee_asset_id: "1.3.0",
      // encrypt_memo: false,
    });

  }

  render() {

    const { currentAccount, navigation } = this.props;

    return (
      <ViewContainer>
        {this.state.isOpen && <TransactionConfirmModal onChange={(open) => this.setState({isOpen: !!open})} navigation={navigation} />}
        <Text>Hello Transfer</Text>
        <View style={{backgroundColor: 'rgba(46, 50, 72, 1)', width: SCREEN_WIDTH, alignItems: 'center'}}>
          <View style={styles.overlay}>
            <Input
              containerStyle={{borderWidth: 1, borderColor: 'white', borderLeftWidth: 0, height: 50, width: SCREEN_WIDTH - 80, backgroundColor: 'white'}}
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
              keyboardType="email-address"
              returnKeyType="next"
              ref={ input => this.emailInput = input }
              onChangeText={ text => this.setState({fromUser: text})}
              onSubmitEditing={() => {
                this.passwordInput.focus();
              }}
              blurOnSubmit={false}
              value={this.state.fromUser}
            />
          </View>
          <View style={styles.overlay}>
            <Input
              containerStyle={{borderWidth: 1, borderColor: 'white', borderLeftWidth: 0, height: 50, width: SCREEN_WIDTH - 80, backgroundColor: 'white'}}
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
              keyboardType="email-address"
              returnKeyType="next"
              ref={ input => this.emailInput = input }
              onChangeText={ text => this.setState({toUser: text})}
              onSubmitEditing={() => {
                this.passwordInput.focus();
              }}
              blurOnSubmit={false}
              value={this.state.toUser}
            />
          </View>
          <View style={styles.overlay}>
            <Input
              containerStyle={{borderWidth: 1, borderColor: 'white', borderLeftWidth: 0, height: 50, width: SCREEN_WIDTH - 80, backgroundColor: 'white'}}
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
              keyboardType="email-address"
              returnKeyType="next"
              ref={ input => this.emailInput = input }
              onChangeText={ text => this.setState({amount: text})}
              onSubmitEditing={() => {
                this.passwordInput.focus();
              }}
              blurOnSubmit={false}
              value={this.state.amount}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Button
            text ='转账'
            buttonStyle={{height: 50, width: 200, backgroundColor: 'blue', borderWidth: 1, borderColor: 'white', borderRadius: 15}}
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

});

const mapStateToProps = (state) => ({
  currentAccount: state.app.currentAccount,
  nodeStatus: state.app.nodeStatus,
});

export const TransferScreen = connect(mapStateToProps, {
  sendTransfer,
})(Transfer);
