
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { Colors, resetNavigationTo, SCREEN_WIDTH, SCREEN_HEIGHT } from "../libs";

import { Button, Divider } from "react-native-elements";

import { ViewContainer, StyleSheet } from "../components";
import { triggerUser, TRIGGER_USERS_LOGIN } from "../actions";
const {reset: resetLogin} = triggerUser;

const modalTop = SCREEN_HEIGHT / 2;
const modalLeft = SCREEN_WIDTH / 2;

const TRACE = false;

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

class TransactionDetails extends Component {


  transDetails() {
    const { entity } = this.props;
    if(!entity.transaction || !entity.transaction.length) {
      //console.log("=====[LoadingLogin.js]::transDetails - ", entity.transaction);
      return {};
    }

    let rows = entity.transaction.map((item, index) => {
      return <View key={index}><Text style={{backgroundColor: index%2 !== 0 ? 'red': 'yellow'}}>{JSON.stringify(item)}</Text></View>;
    });

    return {details: rows};
  }

  transRaw() {
    const { status, entity } = this.props;
    if(!entity || !entity.raw || entity.raw.type !== TRIGGER_USERS_LOGIN) {
      return {};
    }
    return {type: entity.raw.type, name: entity.raw.username, referrer: entity.raw.referrer};
  }

  render() {

    const { status, entity } = this.props;

    const { details } = this.transDetails();
    const {type, name, referrer} = this.transRaw();

    //console.log("=====[LoadingLogin.js]::transDetails - rows : ", details);

    return (
      <ScrollView style={{backgroundColor: 'lightblue'}}>
        <Text style={{backgroundColor: 'gray'}}>{type}: {name} - {referrer}</Text>
        <Divider style={{ backgroundColor: 'blue' }} />
        {details}
      </ScrollView>
    );
  }
}

class LoadingLogin extends Component {


  props: {
    onChange: PropTypes.func.isRequired,
    entityLogin: PropTypes.any,
  }

  constructor() {
    super();


    this.onCancel   = this.onCancel.bind(this);
    this.onConfirm  = this.onConfirm.bind(this);
  }

  isExistLogin = () => {

    const { entityLogin: entity } = this.props;

    const notify = entity.transaction.length && entity.transaction.filter(item => item.type === 'USERS_LOGIN_SUCCESS'); 
    console.log("=====[LoadingLogin.js]::isExistLogin - notifcation event : ", notify);
    
    if(notify.length) {
      
      return true;
    } else {
      
      return false;
    }
  }

  onConfirm = () => {
    const { navigation } = this.props;

    // 账号已经存在，直接转到登录
    if(this.isExistLogin()) {
      resetNavigationTo('Main', navigation);
    } else {
      
      //resetNavigationTo('Main', navigation);
    }
    
    // 退出对话框
    this.onCancel();
  }

  onCancel = () => {
    this.props.resetLogin(TRIGGER_USERS_LOGIN);
    this.props.onChange(false);
  }

  showRegStatus = () => {
    const { entityLogin: entity } = this.props;

    const isLogin = (entity && entity.isLogin) || false;
    let status  = isLogin?"登录中":"登录完成";

    status = (entity.transaction.length && entity.transaction[0].type === 'USERS_LOGIN_FAILURE') ? "登录错误啦！！！" : status;
    return status;
  }

  showLoginStatus = () => {
    const { entityLogin: entity } = this.props;

    let isLogin = (entity && entity.isLogin) || false;
    let tip  = !isLogin?"登录中":"登录完成";
  
    tip = (entity.transaction.length && entity.transaction[0].type === 'USERS_LOGIN_FAILURE') ? "登录错误啦！！！" : tip;
    tip = (entity.transaction.length && entity.transaction[0].type === 'USERS_LOGIN_EVENT') ? "事件通知啦！！！" : tip;

    const success = entity.transaction.length && entity.transaction.filter(item => item.type === 'USERS_LOGIN_SUCCESS'); 
    console.log("=====[LoadingRegister.js]::showLoginStatus - success : ", success);
    if(success.length) {
      tip = "登录完成";
      isLogin = true;
    }
    
    //? "注册完成" : tip;

    return {status: isLogin, tip};
  }


  render() {

    const { onChange, entityLogin: entity, navigation } = this.props;
    console.log("=====[LoadingLogin.js]::render - entity : ", entity);

    const {status, tip} = this.showLoginStatus();

    return (
    <View style={styles.container}>
      <Modal 
        style={styles.modalContent}
        isVisible={true}
        transparent
      >
        
        <View style={{flex: 1}}>
          <Text style={{textAlign: 'center', fontSize: 25}}>登录流程</Text>
          
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
            <ActivityIndicator animating={!!!status} />
            <Text>{tip}</Text>
            <Divider style={{ backgroundColor: 'blue' }} />
          </View>

          {TRACE && <TransactionDetails entity={entity} />}
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
  entityLogin: state.users.entityLogin,
});

export const LoadingLoginModal = connect(mapStateToProps, {
  resetLogin,
})(LoadingLogin);


