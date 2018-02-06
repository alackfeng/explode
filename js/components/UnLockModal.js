
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import { Colors, resetNavigationTo, SCREEN_WIDTH, SCREEN_HEIGHT } from "../libs";

import { Icon, Button, Input, Divider } from 'react-native-elements';

import { ViewContainer, StyleSheet } from "../components";
import { triggerUser } from "../actions";
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

      isClose: false,
    }

    this.onCancel   = this.onCancel.bind(this);
    this.onConfirm  = this.onConfirm.bind(this);
  }

  onConfirm() {
    
    this.props.sendUnLock(this.state.username, {
      username: this.state.username,
      password: this.state.password,
      unlock: true,
    });
  }

  onCancel() {
    
    this.setState({isClose: true}); 
    ///this.props.sendUnLock(this.state.username, {
    //  unlock: false,
    //}); 
  }

  render() {

    const { onChange, entityUnLock: entity, navigation, isOpen } = this.props;
    const { isClose } = this.state;

    console.log("=====[LoadingLogin.js]::render - entity : ", entity);

    const isUnLock = (entity && entity.isUnLock) || false;
    if(isOpen && isClose)
      return null;

    return (
    <View style={styles.container}>
      <Modal 
        style={styles.modalContent}
        isVisible={true}
        transparent
      >
        
        <View style={{height: 30, backgroundColor: 'white', marginBottom: 10, alignItems: 'center'}}>
          <Text style={{textAlign: 'center', fontWeight: 10, fontSize: 20}}>解锁账号</Text>
          <Divider style={{ backgroundColor: 'rgba(35,82,164,1)', width: SCREEN_WIDTH*0.5 }} />
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
              value={this.state.username}
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
              returnKeyType="next"
              ref={ input => this.passwordInput = input }
              onChangeText={ text => this.setState({password: text})}
              onSubmitEditing={() => {
                this.passwordInput.focus();
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


