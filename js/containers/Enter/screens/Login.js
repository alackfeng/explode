
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH } from "../../../libs";
import { Icon, Button, Input } from 'react-native-elements';

import { ViewContainer, StyleSheet, LoadingLoginModal } from "../../../components";
import { triggerUser } from "../../../actions";
const {login: userLogin} = triggerUser;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
    backgroundColor: '#F5FCFF',
    height: '100%',
  },
  contentView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  triangleLeft: {
    position: 'absolute',
    left: -20,
    bottom: 0,
    width: 0,
    height: 0,
    borderRightWidth: 20,
    borderRightColor: 'white',
    borderBottomWidth: 25,
    borderBottomColor: 'transparent',
    borderTopWidth: 25,
    borderTopColor: 'transparent'
  },
  triangleRight: {
    position: 'absolute',
    right: -20,
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderLeftColor: 'white',
    borderBottomWidth: 25,
    borderBottomColor: 'transparent',
    borderTopWidth: 25,
    borderTopColor: 'transparent'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  menu: {
  	margin: 10,
  	padding: 10
  }
}); 

class Login extends Component {


  state: {
    username: string,
    password: string,
  }
  constructor( ) {
    super();

    this.state = {
      username: 'feng1',
      password: '1',

      isOpen: false,
    };

    this.userLogin  = this.userLogin.bind(this);
  }


  userLogin = (e) => {

    const { username, password } = this.state;
    console.log("=====[Login.js]::userLogin - ", username, password);
    e.preventDefault();

    // 先打开模式对话框，接收消息
    this.setState({isOpen: true});

    try {

      this.props.userLogin(username, password);

    } catch ( e ) {
      console.error("=====[Login.js]::userLogin - error : ", e);
    }
  }

	render() {

		const { navigation, nodeStatus } = this.props;
    console.info("=====[Login.js]::render - login status : ");

		return (
      <ScrollView contentContainerStyle={styles.container}>
        {this.state.isOpen && <LoadingLoginModal onChange={(open) => this.setState({isOpen: !!open})} navigation={navigation} />}
        <View style={styles.contentView} >
          <View style={{backgroundColor: 'rgba(46, 50, 72, 1)', width: SCREEN_WIDTH, alignItems: 'center'}}>
            <Text style={{color: 'white', fontSize: 30, marginVertical: 10, fontWeight: '300', marginTop: 10}}>登录</Text>
    				<Text style={styles.welcome} >Welcome to Aftrade Enter</Text>
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
                placeholder="Username"
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
            <View style={[styles.overlay, { marginBottom: 30, marginTop: 1 }]}>
              <Input
                containerStyle={{borderWidth: 1, borderColor: 'white', borderLeftWidth: 0, height: 50, width: SCREEN_WIDTH - 80, backgroundColor: 'white'}}
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
                keyboardAppearance="light"
                secureTextEntry={true}
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="done"
                ref={ input => this.passwordInput = input }
                onChangeText={ text => this.setState({password: text})}
                blurOnSubmit={true}
                value={this.state.password}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <Button
                text ='登  录'
                buttonStyle={{height: 50, width: 200, backgroundColor: 'black', borderWidth: 2, borderColor: 'white', borderRadius: 30}}
                containerStyle={{marginVertical: 10}}
                textStyle={{fontWeight: 'bold'}}
                onPress={this.userLogin} // onPress={() => resetNavigationTo('Main', navigation)} //
              />
              <Button
                text="     跳转到注册"
                clear
                textStyle={{color: 'rgba(78, 116, 289, 1)'}}
                containerStyle={{marginTop: 20,marginVertical:20}}
                onPress={() => resetNavigationTo('Register', navigation)}
              />
            </View>
            {nodeStatus && <View style={{backgroundColor: 'red'}}><Text>{nodeStatus.url} > {nodeStatus.status} </Text></View>}
          </View>
        </View>
      </ScrollView>
		);
	}
}


const mapStateToProps = (state) => ({
  currentAccount: state.app.currentAccount,
  nodeStatus: state.app.nodeStatus,
});

export const LoginScreen = connect(mapStateToProps, {
  userLogin,
})(Login);


