
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ActivityIndicator, ScrollView, Modal as RNModal, Platform } from "react-native";
import Modal from "react-native-modal";
import { Colors, resetNavigationTo, SCREEN_WIDTH, SCREEN_HEIGHT, translate, locale } from "../libs";

import { Button, Divider } from "react-native-elements";

import { ViewContainer, StyleSheet } from "../components";
import { triggerUser, TRIGGER_USERS_LOGIN, USERS_LOGIN} from "../actions";
const {reset: resetLogin} = triggerUser;

const modalTop = SCREEN_HEIGHT / 2;
const modalLeft = SCREEN_WIDTH / 2;


const TRACE = false;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
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
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    width: SCREEN_WIDTH * 0.8, 
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    position: 'absolute',
    height: SCREEN_HEIGHT*0.3,
    width: SCREEN_WIDTH*0.8,
    top: modalTop,
    marginTop: -SCREEN_HEIGHT*0.3*0.5,
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

  componentWillReceiveProps(nextProps) {
    console.log("=====[LoadingLogin.js]::componentWillReceiveProps - props > : ", nextProps);

    this.onConfirm(nextProps);

  }

  isExistLogin = (props) => {

    const { entityLogin: entity } = props || this.props;

    const notify = entity.transaction.length && entity.transaction.filter(item => item.type === 'USERS_LOGIN_SUCCESS'); 
    console.log("=====[LoadingLogin.js]::isExistLogin - notifcation event : ", notify);
    
    if(notify.length) {
      
      return true;
    } else {
      
      return false;
    }
  }

  onConfirm = (props) => {
    const { navigation } = props || this.props;

    // 账号已经存在，直接转到登录
    if(this.isExistLogin(props)) {
      resetNavigationTo('Main', navigation);

      // 退出对话框
      this.onCancel(props);
    } else {
      
      //resetNavigationTo('Main', navigation);
    }
    
  }

  onCancel = () => {
    const propS = this.props;
    propS.resetLogin(TRIGGER_USERS_LOGIN);
    propS.onChange(false);
  }

  showLoginStatus = () => {
    const { entityLogin: entity } = this.props;

    let entityReq = null;
    let entityOk = null;
    let entityErr = null;
    let entityEvt = null;
    let entityObj = entity.transaction.length && entity.transaction.map((item, index) => {
      console.log("=====[LoadingLogin.js]::showLoginStatus - entity : ", item, index);
      if(item.type === USERS_LOGIN.FAILURE) entityErr  = 'tips.login.err'; //item.error;
      if(item.type === USERS_LOGIN.REQUEST) entityReq  = 'tips.login.req'; //item.response;
      if(item.type === USERS_LOGIN.SUCCESS) entityOk   = 'tips.login.ok';
      if(item.type === USERS_LOGIN.EVENT)   entityEvt  = 'tips.login.evt'; //item.error;

    });

    console.log("=====[LoadingLogin.js]::showLoginStatus - entity : ", entityObj, entityReq, entityOk, entityErr);

    return { ok: entityOk, err: entityErr, req: entityReq, evt: entityEvt };

  }


  render() {

    const { onChange, entityLogin: entity, navigation } = this.props;
    console.log("=====[LoadingLogin.js]::render - entity : ", entity);

    const { ok, err, req, evt } = this.showLoginStatus(); 
    const showAni = !!!err;
    const tip = err || evt || ok || req ;
    const showBtn = !!err;

    const ModalWarp = Platform.OS === 'web' ? RNModal : Modal;

    return (
    <View style={styles.container}>
      <ModalWarp 
        style={[styles.modalContent, {backgroundColor: !showBtn ? 'transparent' : 'rgba(255, 255, 255, 1)'}]}
        visible={true}
        isVisible={true}
        transparent={true}
      >
        
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>          
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 0}}>
            {showAni && <ActivityIndicator animating={showAni} size={"large"} color={'white'} />}
            {showBtn && <Text style={{textAlign: 'center', fontSize: 16, color: 'rgba(3,3,3,1)'}}>{translate(tip, locale)}</Text>}
          </View>

          {TRACE && <TransactionDetails entity={entity} />}
        </View>
        {showBtn && <View style={{flexDirection: 'row', flex: 0.5}}>
          <Button
            text="取  消"
            clear
            textStyle={{color: 'rgba(35, 81, 162, 1)', fontSize: 18, fontWeight: 'bold', marginTop: 10}}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            onPress={this.onCancel}
          />
        </View> }
        
      </ModalWarp>
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


