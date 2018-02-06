
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ActivityIndicator, Keyboard } from "react-native";
import Modal from "react-native-modal";
import { Colors, resetNavigationTo, SCREEN_WIDTH, SCREEN_HEIGHT } from "../libs";

import { Icon, Button, Input, Divider } from 'react-native-elements';

import { ViewContainer, StyleSheet } from "../components";
import { triggerUser, USERS_UNLOCK } from "../actions";
const {unlock: sendUnLock} = triggerUser;

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
    }

    this.onCancel   = this.onCancel.bind(this);
    this.onConfirm  = this.onConfirm.bind(this);
  }

  onConfirm() {
    
    const username = this.state.username || this.props.currentAccount;

    this.props.sendUnLock(username, {
      username: username,
      password: this.state.password,
      type: 'unlock',
    });
  }

  onCancel() {

    const username = this.state.username || this.props.currentAccount;
    
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
      if(item.type === USERS_UNLOCK.FAILURE) entityErr  = item.error;
      if(item.type === USERS_UNLOCK.REQUEST) entityReq  = item.response;
      if(item.type === USERS_UNLOCK.SUCCESS) entityOk   = '解锁处理中';

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

    return (
    <View style={styles.container}>
      <Modal 
        style={styles.modalContent}
        isVisible={true}
        transparent
      >
        
        <View style={{height: 100, backgroundColor: 'white', marginBottom: 10, alignItems: 'center'}}>
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>解锁账号</Text>
          <Divider style={{ backgroundColor: 'rgba(35,82,164,1)', width: SCREEN_WIDTH*0.5 }} />
          <View><Text>{ ok || err || req }</Text></View>
        </View>
        
        <View style={{backgroundColor: 'rgba(255, 255, 255, 1)', alignItems: 'center'}}>
          <View style={styles.overlay}>
            <Input
              containerStyle={{borderWidth: 0, borderColor: 'rgba(223,223,223,1)', borderBottomWidth: 2, height: 50, backgroundColor: 'white'}}
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
              containerStyle={{borderWidth: 0, borderColor: 'rgba(223,223,223,1)', borderBottomWidth: 2, height: 50, backgroundColor: 'white'}}
              icon={
                <Icon
                  name='person'
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
        <View style={{flexDirection: 'row'}}>
          <Button
            text ='解锁'
            buttonStyle={{height: 50, width: 100, backgroundColor: 'blue', borderWidth: 1, borderColor: 'white', borderRadius: 5}}
            containerStyle={{marginVertical: 10}}
            textStyle={{fontWeight: 'bold'}}
            onPress={this.onConfirm}
          />
          <Button
            text ='取消'
            buttonStyle={{height: 50, width: 100, backgroundColor: 'blue', borderWidth: 1, borderColor: 'white', borderRadius: 5}}
            containerStyle={{marginVertical: 10}}
            textStyle={{fontWeight: 'bold'}}
            onPress={this.onCancel}
          />
        </View> 
        
      </Modal>
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


