
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
import { triggerUser, TRIGGER_USERS_REGISTER } from "../actions";
const {reset: resetRegister} = triggerUser;

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
    <Text style={{textAlign: 'center'}}>{JSON.stringify(trans.response)}</Text>
  </View>
);

class LoadingRegister extends Component {


  props: {
    onChange: PropTypes.func.isRequired,
    entityReg: PropTypes.any,
  }

	constructor() {
		super();


    this.onCancel   = this.onCancel.bind(this);
    this.onConfirm  = this.onConfirm.bind(this);
	}

  onConfirm = () => {
    const { navigation } = this.props;

    //alert('this.props.onChange(true)');
    resetNavigationTo('Main', navigation);

    // 退出对话框
    this.onCancel();
  }

  onCancel = () => {
    this.props.resetRegister(TRIGGER_USERS_REGISTER);
    this.props.onChange(false);
  }

  showRegStatus = () => {
    const { entityReg } = this.props;

    const isRegister = (entityReg && entityReg.isRegister) || false;
    let status  = isRegister?"注册中":"注册完成";

    status = (entityReg.transaction.length && entityReg.transaction[0].type === 'USERS_REGISTER_FAILURE') ? "注册错误啦！！！" : status;
    return status;
  }

	render() {

    const { onChange, entityReg, navigation } = this.props;
    console.log("=====[LoadingRegister.js]::render - entity : ", entityReg);

    const isRegister = (entityReg && entityReg.isRegister) || false;

		return (
		<View style={styles.container}>
			<Modal 
				style={styles.modalContent}
				isVisible={true}
				transparent
			>
				
        <View style={{flex: 1}}>
          <Text style={{textAlign: 'center'}}>I am the modal content!</Text>
          <ActivityIndicator animating={isRegister} />
          <Text>{this.showRegStatus()}</Text>
          {/*isRegister &&*/ <RegInfo info={entityReg.raw}/>}

          {entityReg.transaction.length && <Transaction trans={entityReg.transaction[0]} />}
          <View style={{backgroundColor: 'yellow', borderWidth: 1, borderColor: 'yellow'}}/>
          {entityReg.transaction.length>1 && entityReg.transaction[1] && <Transaction trans={entityReg.transaction[1]} />}
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
  entityReg: state.users.entityReg,
});

export const LoadingRegisterModal = connect(mapStateToProps, {
  resetRegister,
})(LoadingRegister);


