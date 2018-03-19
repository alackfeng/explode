
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ActivityIndicator, Keyboard, Modal as RNModal, Platform } from "react-native";
import Modal from "react-native-modal";
import { Colors as colors, resetNavigationTo, SCREEN_WIDTH, SCREEN_HEIGHT } from "../libs";

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
  button: {
    backgroundColor: "transparent",
    padding: 0,
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
    borderColor: "#DFDFDF",
    borderWidth: 0.5,
    width: SCREEN_WIDTH * 0.3, 
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    position: 'absolute',
    height: SCREEN_HEIGHT*0.5,
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
    borderWidth: 0, 
    borderColor: 'rgba(223,223,223,1)', 
    borderBottomWidth: 2, 
    height: 50, 
    backgroundColor: 'white',
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
  }

  onConfirm() {

    const { entityUnLock: entity } = this.props;

    
    const username = this.state.username || this.props.currentAccount;

    this.setState({animating: true});

    const isUnLock = (entity && entity.isUnLock) || false;
    if(isUnLock) {
      this.onCancel();
      return;
    }

    this.props.sendUnLock(username, {
      username: username,
      password: this.state.password,
      type: 'unlock',
    });
  }

  onCancel() {

    const username = this.state.username || this.props.currentAccount;
    
    this.setState({animating: false});

    this.props.sendUnLock(username, {
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
      if(item.type === USERS_UNLOCK.FAILURE) entityErr  = '解锁失败！'; //item.error;
      if(item.type === USERS_UNLOCK.REQUEST) entityReq  = '解锁处理中'; //item.response;
      if(item.type === USERS_UNLOCK.SUCCESS) entityOk   = '恭喜您，解锁成功！开启交易之旅';
      if(item.type === USERS_UNLOCK.EVENT)   entityErr  = '解锁失败！账号丢了'; //item.error;

    });

    console.log("=====[UnLockModal.js]::showMessage - entity : ", entityObj, entityReq, entityOk, entityErr);

    return { ok: entityOk, err: entityErr, req: entityReq };
  }

  render() {

    const { onChange, entityUnLock: entity, navigation, isOpen, currentAccount } = this.props;

    

    const isUnLock = (entity && entity.isUnLock) || false;
    if(!isOpen)
      return null;

    const { ok, err, req } = this.showMessage(); 
    let animating = !!(req || err || ok);
    if(animating) {
      animating = (err || ok) ? false : true;
    } else {
      animating = this.state.animating || false;
    }

    const ModalWarp = Platform.OS === 'web' ? RNModal : Modal;


    return (
    <View style={styles.container}>
      <ModalWarp 
        style={styles.modalContent}
        visible={true}
        isVisible={true}
        transparent={false}
      >
        
        <View style={{backgroundColor: 'white', marginTop: 20, marginBottom: 10, alignItems: 'center', flex: 0.5}}>
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>解锁账号</Text>
          <Divider style={{ backgroundColor: 'rgba(35,82,164,1)', width: SCREEN_WIDTH*0.5, marginBottom: 20 }} />
          <View style={{flexDirection: 'column'}}>
            <Text style={{color: err?'red': 'blue'}}>{ ok || err || req }</Text>

          </View>
        </View>
        
        <View style={{backgroundColor: 'rgba(255, 255, 255, 1)', alignItems: 'center', flex: 1}}>
          <View style={styles.overlay}>
            <Input
              containerStyle={styles.inputContainer}
              icon={
                <Icon
                  name='person'
                  color='black'
                  size={25}
                />
              }
              editable={false}
              placeholder="Current Account"
              placeholderTextColor="black"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance="light"
              keyboardType="email-address"
              returnKeyType="next"
              ref={ input => this.emailInput = input }
              onChangeText={ text => this.setState({username: text})}
              onSubmitEditing={() => {
                this.passwordInput.focus();
              }}
              blurOnSubmit={false}
              value={this.state.username || currentAccount}
            />
          </View>
          <View style={styles.overlay}>
            <Input
              containerStyle={styles.inputContainer}
              icon={
                <Icon
                  name='lock'
                  color='black'
                  size={25}
                />
              }
              placeholder="Password"
              placeholderTextColor="black"
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
        <View style={{flexDirection: 'row', flex: 0.5, marginBottom: 20}}>
          <Button
            text="取  消"
            clear
            textStyle={{color: 'rgba(35, 81, 162, 1)', fontSize: 18, fontWeight: 'bold', marginTop: 10}}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            onPress={this.onCancel}
          />
          <Button
            text={!!ok ? '确  认' : '解  锁'}
            clear
            textStyle={{color: 'rgba(35, 81, 162, 1)', fontSize: 18, fontWeight: 'bold', marginTop: 10}}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
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


