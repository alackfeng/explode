
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import { Colors, resetNavigationTo, SCREEN_WIDTH, SCREEN_HEIGHT } from "../libs";

import { Icon, Button, Input } from 'react-native-elements';

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
    <Text style={{textAlign: 'center'}}>{JSON.stringify(trans.error)}</Text>
    {/*<Text style={{textAlign: 'center'}}>{JSON.stringify(trans.response)}</Text>*/}
  </View>
);

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

  onConfirm = () => {
    
    this.props.sendUnLock(this.state.username, {
      username: this.state.username,
      password: this.state.password,
      unlock: true,
    });
  }

  onCancel = () => {
    
    this.props.sendUnLock(this.state.username, {
      unlock: false,
    });
  }

  showRegStatus = () => {
    const { entityUnLock: entity } = this.props;

    const isLogin = (entity && entity.isUnLock) || false;
    let status  = isLogin?"登录中":"登录完成";

    status = (entity && entity.transaction.length && entity.transaction[0].type === 'USERS_REGISTER_FAILURE') ? "登录错误啦！！！" : status;
    return status;
  }

  render() {

    const { onChange, entityUnLock: entity, navigation } = this.props;
    console.log("=====[LoadingLogin.js]::render - entity : ", entity);

    const isUnLock = (entity && entity.isUnLock) || false;
    if(!isUnLock)
      return null;

    return (
    <View style={styles.container}>
      <Modal 
        style={styles.modalContent}
        isVisible={true}
        transparent
      >
        
        <View style={{flex: 1}}>
          <Text style={{textAlign: 'center'}}>I am the modal content!</Text>
          <ActivityIndicator animating={isUnLock} />
          <Text>{this.showRegStatus()}</Text>
          {/*isUnLock &&*/ <RegInfo info={entity.raw}/>}

          {entity.transaction.length > 0 && <Transaction trans={entity.transaction[0]} />}
          <View style={{backgroundColor: 'yellow', borderWidth: 1, borderColor: 'yellow'}}/>
          {entity.transaction.length>1 && entity.transaction[1] && <Transaction trans={entity.transaction[1]} />}
        </View>
        
        <View style={{backgroundColor: 'rgba(46, 50, 72, 1)', alignItems: 'center'}}>
          <View style={styles.overlay}>
            <Input
              containerStyle={{borderWidth: 1, borderColor: 'white', borderLeftWidth: 0, height: 50, backgroundColor: 'white'}}
              icon={
                <Icon
                  name='person'
                  color='black'
                  size={25}
                />
              }
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
              containerStyle={{borderWidth: 1, borderColor: 'white', borderLeftWidth: 0, height: 50, backgroundColor: 'white'}}
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
              keyboardType="email-address"
              returnKeyType="next"
              ref={ input => this.emailInput = input }
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
            buttonStyle={{height: 50, width: 100, backgroundColor: 'blue', borderWidth: 1, borderColor: 'white', borderRadius: 15}}
            containerStyle={{marginVertical: 10}}
            textStyle={{fontWeight: 'bold'}}
            onPress={this.onConfirm}
          />
          <Button
            text ='锁'
            buttonStyle={{height: 50, width: 100, backgroundColor: 'blue', borderWidth: 1, borderColor: 'white', borderRadius: 15}}
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
});

export const UnLockModal = connect(mapStateToProps, {
  sendUnLock,
})(UnLock);


