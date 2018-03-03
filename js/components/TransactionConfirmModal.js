
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ActivityIndicator, ScrollView, Modal as RNModal, Platform } from "react-native";
import Modal from "react-native-modal";
import { Colors as colors, resetNavigationTo, SCREEN_WIDTH, SCREEN_HEIGHT, translate, locale } from "../libs";

import { Button, Divider } from "react-native-elements";

import { ViewContainer, StyleSheet } from "../components";
import { triggerTrans, TRIGGER_TRANSACTION_COMMON, TRIGGER_SECOND_CONFIRM, TRIGGER_SECOND_CONFIRM_YES, TRIGGER_SECOND_CONFIRM_NO, TRANSACTION_COMMON } from "../actions";
const {confirm: secondConfirm, close: transClose } = triggerTrans;

import { ChainTypes } from "assetfunjs/es";
const { operations } = ChainTypes;
const ops = Object.keys(operations);

const modalTop = SCREEN_HEIGHT / 2;
const modalLeft = SCREEN_WIDTH / 2;

const advisable_message = {
  "subject_profile_creator_vote_min": "Voting is below minimum line",
  "Insufficient_Balance": "Insufficient Balance",
  "Vote_is_unavailable_for_this_subject": "Voting closed",
  "Vote_is_closed_for_this_subject": "Voting closed",
  "everyone_can_vote": "You have reached the limit of 5 betting times. Please select another prediction",
  "insufficient_balance": "Insufficient Balance",
  "default": "Assetfun is coming with little donkey lol..."
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContent: {
    backgroundColor: "white",
    position: 'absolute',
    height: SCREEN_HEIGHT*0.5,
    width: SCREEN_WIDTH*0.8,
    top: modalTop,
    marginTop: -SCREEN_HEIGHT*0.5*0.5,
    left: modalLeft,
    marginLeft: -SCREEN_WIDTH*0.8*0.5,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  },
  detailsContainer: {
    backgroundColor: 'transparent', 
    marginTop: 30, 
    height: SCREEN_HEIGHT*0.5, 
    width: SCREEN_WIDTH*0.8
  },
});



class TransactionItem extends Component {
  render() {
    const { index, title, content } = this.props;
    return (
    <View style={{flexDirection: 'row', backgroundColor: index%2 ? 'red' : 'lightblue'}}>
      <View style={{marginLeft: 30, height: 30, alignItems: 'flex-start', justifyContent: 'center', flex: 1}}><Text style={{textAlign: 'center'}}>{title}</Text></View>
      <View style={{marginLeft: 5, height: 30, alignItems: 'flex-start', justifyContent: 'center', flex: 3}}><Text style={{}}>{content}</Text></View>
    </View>
    );
  }
}

class TransactionDetail extends Component {


  transDetails() {
    const { status, entity } = this.props;
    if(entity.raw) {
      console.log("=====[TransactionConfirmModal.js]::transDetails - ", entity.raw);
      return { details: entity.raw}
    }
    return {};
  }

  render() {

    const { status, entity } = this.props;

    const { details } = this.transDetails();

    let rows = [];

    if(details) {
      switch (ops.filter(item => item === "transfer")[0]) {
        case "transfer":
          rows.push(<TransactionItem key={0} index={0} title={"来自于"} content={details.parameters.from_account} />);
          rows.push(<TransactionItem key={1} index={1} title={"发往"} content={details.parameters.to_account} />);
          rows.push(<TransactionItem key={2} index={2} title={"金额"} content={`${details.parameters.amount/100000000} ${details.parameters.asset}`} />);
          rows.push(<TransactionItem key={3} index={3} title={"备注"} content={details.parameters.memo.toString()} />);
          break;
        default: 
          rows.push(<TransactionItem key={0} index={0} title={"请查阅"} content={"未有相关操作！！！"} />)
          break;
      }
    }

    ///console.log("=====[TransactionConfirmModal.js]::transDetails - rows : ", rows);

    return (
      <ScrollView style={styles.detailsContainer}>
        {rows}
      </ScrollView>
    );
  }
}


class TransactionConfirm extends Component {


  props: {
    entityLogin: PropTypes.any,
  }

  constructor() {
    super();


    this.onCancel   = this.onCancel.bind(this);
    this.onConfirm  = this.onConfirm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log("=====[TransactionConfirmModal.js]::componentWillReceiveProps - props > : ", nextProps);

  }

  onConfirm = () => {
    const { entityTrans: entity } = this.props;

    // 防止二次触发,已请求后不再触发
    let broadcastSuccess = entity.transaction.length && entity.transaction.filter(item => item.type === TRANSACTION_COMMON.REQUEST);
    if(broadcastSuccess.length && broadcastSuccess[0].method === 'broadcast') {
      this.onCancel();
      return;
    }

    // 有错误不再广播，直接关闭
    let tranFailure = entity.transaction.length && entity.transaction.filter(item => item.type === TRANSACTION_COMMON.FAILURE);
    if(tranFailure.length) {
      this.onCancel();
      return;
    }

    // 正在处理中，不要再点击，要限制一下
    this.props.secondConfirm(TRIGGER_SECOND_CONFIRM_YES);

  }

  onCancel = () => {

    const { entityTrans: entity } = this.props;

    if(entity && entity.isOpen) //打开触发关闭
      this.props.secondConfirm(TRIGGER_SECOND_CONFIRM_NO);
    //} else {
      this.props.transClose('closure'); //直接关闭
    //}
  }

  showTranStatus = () => {
    const { entityTrans: entity } = this.props;

    let status = false;
    let tip  = null;

    // stack first
    let entityObj = entity.transaction.length && entity.transaction[0];
    console.log("[TransactionConfirmModal.js]::showTranStatus - entityObj: ", entityObj);
    switch(entityObj.type) {
      case TRIGGER_TRANSACTION_COMMON:
      case TRANSACTION_COMMON.REQUEST:
        {
          tip = (entityObj.method !== 'broadcast') ? "交易请求打包中" : "交易广播中";
          status = (entityObj.method !== 'broadcast') ? false : true;
        }
        break;
      case TRANSACTION_COMMON.SUCCESS:
        tip = (entityObj.method !== 'broadcast') ? "交易已生成并打包，可广播." : "交易广播成功";
        break;
      case TRANSACTION_COMMON.FAILURE: 
        {

          let message = entityObj.error && entityObj.error.message || entityObj.error;
          console.warn("[TransactionConfirmModal.js]::showTranStatus - TRANSACTION_COMMON.FAILURE: ", JSON.stringify(message));
          let find_key = null;
          Object.keys(advisable_message).forEach((key) => {
            if(key) {
              key = key.trim().replace(/_/g, " ");
              if(new RegExp(key, 'i').test(message)) {
                find_key = "advisable_message." + key.trim().replace(/ /g, "_");
              }
            }
          });
          find_key = find_key ? find_key : "advisable_message.default";

          tip = (entityObj.method !== 'broadcast') 
          ? ("交易生成出错啦！请检测。" + JSON.stringify(message)) 
          : ("广播失败：" + translate(find_key, locale));
        }
        break;
      case TRIGGER_SECOND_CONFIRM: 
        {
          tip = (entityObj.event === TRIGGER_SECOND_CONFIRM_YES) ? "交易广播中" : "取消交易";
          status = (entityObj.event === TRIGGER_SECOND_CONFIRM_YES) ? true: false;
        }
      break;
      default:
      break;
    }

    //tip = (entity.transaction.length && entity.transaction[0].type === 'USERS_REGISTER_FAILURE') ? "登录错误啦！！！" : status;
    return {status, tip};
  }

  render() {

    const { entityTrans: entity, navigation } = this.props;
    console.log("=====[TransactionConfirmModal.js]::render - entity : ", entity);

    const isOpen = entity && entity.isOpen || false;
    if(!isOpen) {
      return null;
    }

    const {status, tip} = this.showTranStatus();
    const ModalWarp = Platform.OS === 'web' ? RNModal : Modal;

    return (
    <View style={styles.container}>
      <ModalWarp 
        style={styles.modalContent}
        visible={true}
        isVisible={true}
        transparent={false}
      >
        
        <View style={{flex: 1, marginTop: 15}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{textAlign: 'center', fontSize: 25}}>交易二次确认</Text>
            <Divider style={{ backgroundColor: 'blue', height: 2, marginTop: 1, width: SCREEN_WIDTH*0.4 }} />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
            {status && <ActivityIndicator animating={status} size="large" color={colors.salmon} />}
            <Text style={{textAlign: 'center', color: 'red', marginLeft: 10}} numberOfLines={10}>{tip}</Text>
          </View>

          <TransactionDetail entity={entity} />
        </View>
        
        <View style={{flexDirection: 'row'}}>
          <Button
            text="确认"
            clear
            textStyle={{color: 'rgba(78, 116, 289, 1)'}}
            containerStyle={styles.button}
            onPress={this.onConfirm}
          /> 
          <Button
            text="取消"
            clear
            textStyle={{color: 'rgba(78, 116, 289, 1)'}}
            containerStyle={styles.button}
            onPress={this.onCancel}
          />
        </View> 
        
      </ModalWarp>
    </View>
    );
  }
}

const mapStateToProps = (state) => ({
  entityTrans: state.comm.trans,
});

export const TransactionConfirmModal = connect(mapStateToProps, {
  secondConfirm,
  transClose,
})(TransactionConfirm);

