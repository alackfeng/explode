
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Dimensions, Keyboard } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH, translate, locale } from "../../../libs";
import { Icon, Button, List, ListItem, Avatar } from 'react-native-elements';

import { ViewContainer, StyleSheet, TransactionConfirmModal } from "../../../components";
import { triggerTrans, triggerUser, accountSearch } from "../../../actions";
const {handle: sendTransfer} = triggerTrans;
const {unlock: sendUnLock} = triggerUser;

import { ChainStore, FetchChain } from "assetfunjs/es";
import Input from "../../../components/RNWInput";
import { Utils } from "../../../libs/Utils";

const MEMO_LIMIT = 120;

const TRACE = false;

class Transfer extends Component {

	constructor() {
		super();

    this.state = {
      fromUser: '',
      toUser: '',
      amount: '',
      asset_type: '',
      memoText: '',

      balanceObject: null,
      asset: null,
      item: null,
      index: null,
      asset_name: null,

      searchEntity: [],

      errorName: '',
    };

    this.onPressTransfer  = this.onPressTransfer.bind(this);
    this.searchAccount = this.searchAccount.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onChangeMemo = this.onChangeMemo.bind(this);
    this.findAccount = this.findAccount.bind(this);

    this.update = this.update.bind(this);
    this.updateAsset = this.updateAsset.bind(this);

	}

  componentWillUnmount() {
    ChainStore.unsubscribe(this.update); // update
  }

  componentWillMount() {
    
    ChainStore.subscribe(this.update); // update

    this.updateAsset();

  }

  update(nextProps = null) {
    if(TRACE) console.info("=====[Transfer.js]::update - ChainStore::subscribe : ************** nextProps ", nextProps);

    this.updateAsset();
  }


  updateAsset = (props) => {

    const { navigation, currentAccount } = props || this.props;
    if(navigation && navigation.state.params) {
      const { item, index } = navigation.state.params;

      const balanceObject = ChainStore.getObject(item.asset);
      const asset_type = balanceObject.get("asset_type");
      const asset = ChainStore.getObject(asset_type);

      this.setState({fromUser: currentAccount, item, index, balanceObject, asset, 
        asset_type: asset&&asset.get("symbol"), asset_name: asset && asset.getIn(['options', 'description'])})
    }
  }

  componentWillReceiveProps(nextProps) {
    
    // 增强用户是否存在查找
    if(this.state.errorName) {
      console.log("[Transfer.js]::componentWillReceiveProps - response searchAccount, so try to find it, account > ", this.state.toUser);
      const {value, error} = this.findAccount(this.state.toUser, nextProps);
      if(!error)
        this.setState({toUser: value, errorName: error});
    };
  }

  checkFininsh = () => {
    const { fromUser, toUser, amount, asset_type, memoText } = this.state;

    // 检验有效性
    if(!fromUser || !toUser || !amount || !asset_type) {
      alert("请重新检查!!!!");
      return false;
    }

    if(!this.props.currentAccount) {
      alert("获得当前用户失败，请重新进入！");
      return false;
    }

    return true;
  }

  onPressTransfer() {
    const { fromUser, toUser, amount, asset_type, memoText } = this.state;

    console.log("=====[Transfer.js]::onPressTransfer - param > ", fromUser, toUser, amount);
    

    // 检验有效性
    if(!this.checkFininsh()) {
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

    const memoText_ = memoText.trim();

    const precision = 100000000;
    const amount_ = Utils.replace( amount );
    let multi_factor = amount_.split(".")[1] ? amount_.split(".")[1].length : 0;
    let trans_amount = multi_factor === 0 ? (Number(amount_) * precision) : (Number(amount_.replace(".", ""))*precision/Math.pow(10, multi_factor));
    console.log("=====[Transfer.js]::onPressTransfer - multi_factor: ", multi_factor, " precision: ", precision, " trans_amount: ", trans_amount);


    this.props.sendTransfer(fromUser, 'transfer', {
      from_account: fromUser, 
      to_account: toUser, 
      amount: parseInt(trans_amount, 10), 
      asset: asset_type,
      memo: memoText_ ? new Buffer(memoText_, "utf-8") : memoText_,
      propose_account: null,
      fee_asset_id: "1.3.0",
      // encrypt_memo: false,
    });

    // 清空填入数据，
    this.setState({toUser: '', amount: '', memoText: ''});

  }

  searchAccount = (name) => {
    console.log("[Transfer.js]::searchAccount - entity : ", this.props.searchEntity);
    this.props.accountSearch(name);
  }

  findAccount = (account_name, props) => {
    const { searchEntity } = props || this.props;
    let account = searchEntity.searchAccounts.filter(a => a[0] === account_name);
    console.log("[Transfer.js]::findAccount - searchEntity : ", account.length, searchEntity);
    if(0 === account.length)
      return {value: account_name, error: "账号名未存在区块链上"};

    return {value: account_name, error: null};
  }

  checkValidUserName = (text) => {

    let account_name = text.trim();

    if(account_name === "")
      return {value: account_name, error: "账号名为空"};

    //搜索账号是否已经注册过了，
    if(this.searchAccount)
      this.searchAccount(account_name);
    
    return this.findAccount(account_name);
  }

  onChangeUserName = (text) => {

    console.log("=====[Transfer.js]::onChangeUserName - ", text);

    const {value, error} = this.checkValidUserName(text);
    if(error) {
      this.setState({toUser: value, errorName: error});
    } else 
      this.setState({toUser: value, errorName: ''});
  }

  checkValidAmount = (text) => {

    // 验证是否金额数字，并且小数点后8位
    if(text && ! /^(\d+,?)+(\.[0-9]{0,8})?$/.test(text))
      return {ret: false, valid_amount: this.state.amount};

    let amount = Utils.formatAmount(text);
    
    return Utils.checkValidAmount(amount, 0, 90000000, 8);
  }

  onChangeAmount = (text) => {

    console.log("=====[Transfer.js]::onChangeAmount - ", text);

    const {ret, valid_amount} = this.checkValidAmount(text);
    if(!ret) {
      this.setState({amount: valid_amount, errorAmount: ''});
    } else 
      this.setState({amount: valid_amount, errorAmount: ''});
  }

  onChangeMemo = (text) => {
    
    let memo = text;//.trim();

    if(memo.length <= MEMO_LIMIT) {
      this.setState({memoText: memo});
    } else {
      //this.setState({memoText: this.state.memoText})
    }
  }



  render() {

    const { currentAccount, navigation } = this.props;
    const { item, index, asset_name, errorName } = this.state;
    const { balanceObject, asset, asset_type } = this.state;
    const subTitle = `${balanceObject.get("balance")/100000000} ${asset_type}`;

    console.log("=====[Transfer.js]::render - navigation : ", navigation);

    const assetName = asset_name && (JSON.parse(asset_name).main || JSON.parse(asset_name).main.short_name) || item.type;

    return (
      <ViewContainer>
        <View style={styles.titleContainer}>
          <View style={styles.avatarContainer}>
            <Avatar
              large
              source={require('../../../components/images/assetlogo.jpg')}
              onPress={() => console.log("Works!")}
              avatarStyle={styles.avatorStyle}
            />
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.itemStyle}>{assetName}</Text>
            <Text style={styles.itemsubsStyle}>{subTitle}</Text>
          </View>
        </View>


        <ScrollView>
        <View style={styles.bodyContainer}>
          <View style={styles.overlay}>
            <Input
              containerStyle={[styles.inputContainer, {backgroundColor: '#F8F9FC', borderWidth: 0, borderColor: 'transparent'}]}
              leftText={ translate('tips.transfer.from', locale) }
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
              inputStyle={styles.textStyle}
            />
          </View>
          <View style={styles.overlay}>
            <Input
              containerStyle={styles.inputContainer}
              leftText={ translate('tips.transfer.to', locale) }
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance="light"
              keyboardType="default"
              returnKeyType="next"
              ref={ input => this.touserInput = input }
              onChangeText={ this.onChangeUserName }
              onSubmitEditing={() => {
                this.amountInput.focus();
              }}
              blurOnSubmit={false}
              value={this.state.toUser}
              displayError={!!errorName}
              errorMessage={errorName || ''}
              inputStyle={styles.textStyle}
            />
          </View>
          <View style={styles.overlay}>
            <Input
              containerStyle={styles.inputContainer}
              leftText={ translate('tips.transfer.amount', locale) }
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance="light"
              keyboardType="default"
              returnKeyType="next"
              ref={ input => this.amountInput = input }
              onChangeText={ this.onChangeAmount }
              onSubmitEditing={() => {
                this.memoInput.focus();
              }}
              blurOnSubmit={false}
              value={this.state.amount}
              inputStyle={styles.textStyle}
            />
          </View>
          <View style={styles.overlay}>
            <Input
              containerStyle={[styles.inputContainer, {height: 110, flexDirection: 'column'}]}
              leftText={ translate('tips.transfer.memo', locale) }
              leftContainerStyle={{textAlign: 'left', width: SCREEN_WIDTH, height: 30}}
              inputStyle={{height: 70, textAlign: 'justify', marginLeft: 10, marginRight: 10, width: SCREEN_WIDTH-20}}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance="light"
              keyboardType="default"
              returnKeyType="done"
              ref={ input => this.memoInput = input }
              onChangeText={ this.onChangeMemo }
              onSubmitEditing={() => {
                //this.commitInput.focus();
                Keyboard.dismiss()
              }}
              blurOnSubmit={false}
              value={this.state.memoText}
              multiline={true}
              numberOfLines={5}
            />
          </View>
        </View>
        <View style={styles.warningContainer}>
          <Icon name='warning' color='red' />
          <Text style={{textAlign: 'left', color: 'red', fontSize: 14, marginRight: 5, width: SCREEN_WIDTH-60}}>{ translate('tips.transfer.warning', locale) }</Text>
        </View>
        <View style={{height: 100, flexDirection: 'row'}}>
          <Button
            text ={ translate('tips.transfer.commit', locale) }
            ref={ input => this.commitInput = input }
            buttonStyle={styles.buttonStyle}
            containerStyle={{marginVertical: 10}}
            textStyle={{fontWeight: 'bold', fontSize: 16}}
            onPress={this.onPressTransfer}
          />
        </View>
        </ScrollView>
      </ViewContainer>
    );
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    height: 100,
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 0,
    marginRight: 0,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: '#DFDFDF',
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  avatarContainer: {
    backgroundColor: 'transparent',
    height: 80,
    width: 100,
    marginLeft: 20,
    marginTop: 10,
    justifyContent: 'center',
  },
  avatorStyle: {
    backgroundColor: 'red', 
    height: 80, 
    width: 100
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 20,
  },
  itemStyle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#284159',
    marginBottom: 2.5,
  },
  itemsubsStyle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#AEB4C0',
    marginTop: 2.5,
  },
  bodyContainer: {
    backgroundColor: 'white', 
    width: SCREEN_WIDTH, 
    alignItems: 'center'
  },
  inputContainer: {
    marginLeft: 0, 
    marginRight: 0,
    borderWidth: 0, 
    borderBottomWidth: 0.5,
    borderBottomColor: '#DFDFDF', 
    height: 50, 
    width: SCREEN_WIDTH, 
    backgroundColor: 'white',
  },
  textStyle: {
    textAlign: 'right', 
    marginRight: 0, 
    color: '#666666'
  },
  warningContainer: {
    marginTop: 20, 
    marginLeft: 20, 
    marginRight: 20, 
    marginBottom: 20,
    flexDirection: 'row', 
    backgroundColor: 'transparent', 
    width: SCREEN_WIDTH*0.9
  },
  buttonStyle: {
    height: 50, 
    width: SCREEN_WIDTH*0.8, 
    backgroundColor: 'rgba(35,82,164,1)', 
    borderWidth: 1, 
    borderColor: 'white', 
    borderRadius: 5
  }
});

const mapStateToProps = (state) => ({
  currentAccount: state.app.currentAccount,
  nodeStatus: state.app.nodeStatus,
  isUnLock: state.users.entityUnLock.isUnLock,
  searchEntity: state.users.entitySearch,
});

export const TransferScreen = connect(mapStateToProps, {
  sendTransfer,
  sendUnLock,
  accountSearch,
})(Transfer);
