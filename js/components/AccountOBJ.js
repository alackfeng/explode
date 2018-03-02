


import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Dimensions, ListView } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH } from "../libs";
import { Icon, Button, Input, List, ListItem } from 'react-native-elements';

import { ViewContainer, StyleSheet, } from "../components";

import { ChainStore, FetchChain, ChainTypes } from "assetfunjs/es";

const TRACE = false;

export class AccountOBJ extends Component {

	constructor(props) {
		super(props);

		this.state = {
			accountName: null,
		}

		this.update = this.update.bind(this);
	}

  componentWillUnmount() {
    //ChainStore.unsubscribe(this.update); // update
  }

  componentWillMount() {
    
    this.fetchAccounts();
    //ChainStore.subscribe(this.update); // update

  }

  update(nextProps = null) {
    if(TRACE) console.info("=====[AccountOBJ.js]::update - ChainStore::subscribe : ************** nextProps ", nextProps);

    this.fetchAccounts();
  }

	fetchAccounts = () => {
    const { account } = this.props;

    if(TRACE) console.log("=====[AccountOBJ.js]::fetchAccounts - account---: ", account);
    
    let updateAccount = (accountObj) => {

      if(TRACE) console.log("=====[AccountOBJ.js]::fetchAccounts - account : getAccount is : ", JSON.stringify(accountObj));
      if(accountObj) {

          this.setState({accountName: accountObj.get("name")});
      } 
    }

    const accountObj = ChainStore.getAccount(account);
    if(accountObj) {
      if(TRACE) console.log("=====[AccountOBJ.js]::fetchAccounts - account : getAccount is : ", JSON.stringify(accountObj));
      updateAccount(accountObj);
      return;
    }

    FetchChain("getAccount", account).then((res) => {
      const accountObj = ChainStore.getAccount(account); //res; //ChainStore.getAccount(account);
      
      updateAccount(accountObj);      

    }).catch(err => {
      if(TRACE) console.error("=====[AccountOBJ.js]::fetchAccounts - account : getAccount is : err ", err);
      this.fetchAccounts(); // try Again
    })

  }

	render() {

		const { account } = this.props;
    const { accountName } = this.state;

    const isValid = (!!accountName);

		return (
			<View>
				<Text style={styles.column}>{isValid ? accountName || account : 'NaN'}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({

	column: {
		color: 'rgba(40,65,89,1)', 
		fontSize:20, 
		textAlign:'center',

	}
});