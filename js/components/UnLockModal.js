
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ActivityIndicator, Keyboard, Modal as RNModal, Platform } from "react-native";
import Modal from "react-native-modal";
import { Colors as colors, resetNavigationTo, SCREEN_WIDTH, SCREEN_HEIGHT, translate, locale } from "../libs";

import { Icon, Button, Input, Divider } from 'react-native-elements';

import { ViewContainer, StyleSheet } from "../components";
import { triggerUser, USERS_UNLOCK } from "../actions";
const {unlock: sendUnLock} = triggerUser;

const modalTop = SCREEN_HEIGHT / 3;
const modalLeft = SCREEN_WIDTH / 2;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH
  },
  button1: {
    backgroundColor: "transparent",
    padding: 0,
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
    borderColor: "#DFDFDF",
    borderWidth: 0.5,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    width: SCREEN_WIDTH * 0.4, 
    height: 60,
  },
  button2: {
    backgroundColor: "transparent",
    padding: 0,
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
    borderColor: "#DFDFDF",
    borderWidth: 0.5,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    width: SCREEN_WIDTH * 0.4, 
    height: 60,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    position: 'absolute',
    height: SCREEN_HEIGHT*0.3,
    width: SCREEN_WIDTH*0.8,
    top: modalTop,
    marginTop: -SCREEN_HEIGHT*0.5*0.5,
    left: modalLeft,
    marginLeft: -SCREEN_WIDTH*0.8*0.5,
    borderRadius: 4,
    borderColor: "white",
    borderWidth: 0,
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  inputContainer: {
    borderWidth: 1, 
    borderColor: 'rgba(223,223,223,1)', 
    height: 40, 
    backgroundColor: 'rgba(223,223,223,0.2)',
    width: SCREEN_WIDTH*0.8 - 40,
  },
  buttonStyle: {
    height: 50, 
    width: 100, 
    backgroundColor: 'blue', 
    borderWidth: 1, 
    borderColor: 'white', 
    borderRadius: 5
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});


class UnLock extends Component {


  props: {
    onChange: PropTypes.func.isRequired,
    entityLogin: PropTypes.any,
  }

  constructor(props) {
    super(props);

    this.state = {
      username: props.currentAccount || '',
      password: '',
      animating: false,
    }

    this.onCancel   = this.onCancel.bind(this);
    this.onConfirm  = this.onConfirm.bind(this);
    this.onClose    = this.onClose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log("=====[UnLockModal.js]::componentWillReceiveProps - props > : ", nextProps);

    // 检测是否解锁成功，后关闭
    if(this.state.animating) {
      this.onClose(nextProps);
    }


  }

  onClose(nextProps) {
    const { entityUnLock: entity, currentAccount, sendUnLock } = nextProps || this.props;

    const isUnLock = (entity && entity.isUnLock) || false;
    //alert(isUnLock);
    if(isUnLock) {
    
      this.setState({animating: false});
      //alert(currentAccount)
      if(sendUnLock)
        sendUnLock(currentAccount, {
          type: 'close',
        }); 
      return;
    }
  }

  onConfirm() {

    const { entityUnLock: entity } = this.props;

    
    const username = this.props.currentAccount;

    this.setState({animating: true});

    const isUnLock = (entity && entity.isUnLock) || false;
    if(isUnLock) {
      this.onCancel();
      return;
    }

    // 延迟加载
    var _This = this;
    setTimeout(() => {
      _This.props.sendUnLock(username, {
        username: username,
        password: _This.state.password,
        type: 'unlock',
      });

      // clear password
      this.setState({password: '', animating: true});
    }, 500);

    
  }

  onCancel() {
    const propS = this.props;
    const username = propS.currentAccount;
    
    this.setState({animating: false});

    propS.sendUnLock(username, {
      type: 'close',
    }); 
  }

  showMessage() {
    const { entityUnLock: entity } = this.props;
    console.log("=====[UnLockModal.js]::showMessage - entity : ", entity);

    let show_msg = JSON.stringify(entity);

    let entityReq = null;
    let entityOk = null;
    let entityErr = null;
    let entityObj = entity.transaction.length && entity.transaction.map((item, index) => {
      console.log("=====[UnLockModal.js]::showMessage - entity : ", item, index);
      if(item.type === USERS_UNLOCK.FAILURE) entityErr  = translate('tips.unlock.error', locale); //item.error;
      if(item.type === USERS_UNLOCK.REQUEST) entityReq  = translate('tips.unlock.continue', locale); //item.response;
      if(item.type === USERS_UNLOCK.SUCCESS) entityOk   = translate('tips.unlock.success', locale);
      if(item.type === USERS_UNLOCK.EVENT)   entityErr  = translate('tips.unlock.erroraccount', locale); //item.error;

    });

    console.log("=====[UnLockModal.js]::showMessage - entity : ", entityObj, entityReq, entityOk, entityErr);

    return { ok: entityOk, err: entityErr, req: entityReq };
  }

  render() {

    const { onChange, entityUnLock: entity, navigation, isOpen, currentAccount } = this.props;

    console.log("=====[UnLockModal.js]::render - entity : ", isOpen, entity);
    // 锁定账号不需要打开 {"type":"TRIGGER_USERS_UNLOCK","username":"feng1","extra":{"username":"feng1","type":"lock"},"requiredFields":[]}

    //alert(JSON.stringify(entity.raw));
    //const isUnLock = (entity && entity.raw && entity.raw.extra.type === 'lock') || false;
    if(!isOpen)
      return null;

    const { ok, err, req } = this.showMessage(); 
    const showAni = !!!err;
    const tip = err || ok || req ;
    const showBtn = !!err;

    const ModalWarp = Platform.OS === 'web' ? RNModal : Modal;


    return (
    <View style={styles.container}>
      <ModalWarp 
        style={styles.modalContent}
        visible={true}
        isVisible={true}
        transparent={false}
      >
        
        <View style={{backgroundColor: 'white', marginTop: 20, marginBottom: 10, alignItems: 'center', flex: 1}}>
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 17, color: '#030303'}}>解锁账号</Text>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 0}}>

            {showBtn && <Text style={{textAlign: 'center', fontSize: 16, color: 'red'}}>{tip}</Text>}
          </View>
        </View>
        
        <View style={{backgroundColor: 'rgba(255, 255, 255, 1)', alignItems: 'center', flex: 1}}>
          <View style={styles.overlay}>
            <Input
              containerStyle={styles.inputContainer}
              inputStyle={{marginLeft: 20, fontSize: 13,}}
              placeholder={ translate('tips.unlock.inputpass', locale) }
              placeholderTextColor="#999999"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance="light"
              keyboardType="default"
              secureTextEntry={true}
              returnKeyType="done"
              ref={ input => this.passwordInput = input }
              onChangeText={ text => this.setState({password: text})}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              blurOnSubmit={false}
              value={this.state.password}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row', flex: 1, marginBottom: 0}}>
          <Button
            text= { translate('tips.transaction.cancel', locale) }
            clear
            textStyle={{color: 'rgba(35, 81, 162, 1)', fontSize: 17, fontWeight: 'bold', marginTop: 0}}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button1}
            onPress={this.onCancel}
          />
          <Button
            text={!!ok ? translate('tips.unlock.unlock', locale) : translate('tips.unlock.unlock', locale)}
            clear
            textStyle={{color: 'rgba(35, 81, 162, 1)', fontSize: 17, fontWeight: 'bold', marginTop: 0}}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button2}
            onPress={this.onConfirm}
          />
        </View> 
        
      </ModalWarp>
    </View>
    );
  }
}

const mapStateToProps = (state) => ({
  entityUnLock: state.users.entityUnLock,
  currentAccount: state.app.currentAccount,
  isOpen: state.users.entityUnLock.isOpen,
});

export const UnLockModal = connect(mapStateToProps, {
  sendUnLock,
})(UnLock);


