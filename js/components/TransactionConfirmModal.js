
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import { Colors, resetNavigationTo, SCREEN_WIDTH, SCREEN_HEIGHT } from "../libs";

import { Button } from "react-native-elements";

import { ViewContainer, StyleSheet } from "../components";
import { triggerTrans, TRIGGER_SECOND_CONFIRM_YES, TRIGGER_SECOND_CONFIRM_NO } from "../actions";
const {confirm: secondConfirm } = triggerTrans;

const modalTop = SCREEN_HEIGHT / 2;
const modalLeft = SCREEN_WIDTH / 2;

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
  }
});



const RegInfo = ({ info }: Props) => (
  <View style={{backgroundColor: 'red'}}>
    <Text style={{textAlign: 'center'}}>{info.type}</Text>
    <Text style={{textAlign: 'center'}}>{info.username}</Text>
    <Text style={{textAlign: 'center'}}>{info.regInfo && info.regInfo.password}</Text>
  </View>
);

const Transaction = ({ trans }: Props) => (
  <View style={{backgroundColor: 'lightblue'}}>
    <Text style={{textAlign: 'center'}}>{trans.type}</Text>
    <Text style={{textAlign: 'center'}}>{trans.username}</Text>
    <Text style={{textAlign: 'center'}}>{trans.method}</Text>
    <Text style={{textAlign: 'center'}}>{trans.error && JSON.stringify(trans.error)}</Text>
    <Text style={{textAlign: 'center'}}>{trans.parameters && trans.parameters.transaction && JSON.stringify(trans.parameters.transaction.operations[0])}</Text>
    <Text style={{textAlign: 'center'}}>{trans.response && JSON.stringify(trans.response.type)}</Text>
  </View>
);

class TransactionConfirm extends Component {


  props: {
    onChange: PropTypes.func.isRequired,
    entityLogin: PropTypes.any,
  }

  constructor() {
    super();


    this.onCancel   = this.onCancel.bind(this);
    this.onConfirm  = this.onConfirm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log("=====[TransactionConfirmModal.js]::componentWillReceiveProps - props > : ", nextProps);
    const { entityTrans: entity } = nextProps;
    if(entity && !entity.isOpen) {
      // 觖发关闭状态
      if(nextProps.onChange)
        nextProps.onChange(false);
    }
  }

  onConfirm = () => {
    const { navigation } = this.props;

    // 正在处理中，不要再点击，要限制一下
    this.props.secondConfirm(TRIGGER_SECOND_CONFIRM_YES);

  }

  onCancel = () => {

    const { entityTrans: entity } = this.props;

    if(entity && entity.isOpen) { //打开触发关闭
      this.props.secondConfirm(TRIGGER_SECOND_CONFIRM_NO);
    } else {
      this.props.onChange(false); //直接关闭
    }
}

  showRegStatus = () => {
    const { entityTrans: entity } = this.props;

    const isOpen = (entity && entity.isOpen) || false;
    let status  = isOpen?"登录中":"登录完成";

    status = (entity.transaction.length && entity.transaction[0].type === 'USERS_REGISTER_FAILURE') ? "登录错误啦！！！" : status;
    return status;
  }

  render() {

    const { onChange, entityTrans: entity, navigation } = this.props;
    console.log("=====[TransactionConfirmModal.js]::render - entity : ", entity);

    const isOpen = (entity && entity.isOpen) || false;

    return (
    <View style={styles.container}>
      <Modal 
        style={styles.modalContent}
        isVisible={true}
        transparent
      >
        
        <View style={{flex: 1}}>
          <Text style={{textAlign: 'center'}}>I am the modal content!</Text>
          <ActivityIndicator animating={isOpen} />
          <Text>{this.showRegStatus()}</Text>
          {/*isOpen &&*/ <RegInfo info={entity.raw}/>}

          {entity.transaction.length > 0 && <Transaction trans={entity.transaction[0]} />}
          <View style={{backgroundColor: 'yellow', borderWidth: 1, borderColor: 'yellow'}}/>
          {entity.transaction.length>1 && entity.transaction[1] && <Transaction trans={entity.transaction[1]} />}
        </View>
        
        <View style={{flexDirection: 'row'}}>
          <Button
            text="Confirm"
            clear
            textStyle={{color: 'rgba(78, 116, 289, 1)'}}
            containerStyle={styles.button}
            onPress={this.onConfirm}
          /> 
          <Button
            text="Cancel"
            clear
            textStyle={{color: 'rgba(78, 116, 289, 1)'}}
            containerStyle={styles.button}
            onPress={this.onCancel}
          />
        </View> 
        
      </Modal>
    </View>
    );
  }
}

const mapStateToProps = (state) => ({
  entityTrans: state.comm.trans,
});

export const TransactionConfirmModal = connect(mapStateToProps, {
  secondConfirm,
})(TransactionConfirm);

