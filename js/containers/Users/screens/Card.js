
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Dimensions, ListView, Clipboard } from "react-native";
import { Colors, SCREEN_WIDTH, translate, locale, switchLanguage } from "../../../libs";
import { Icon, Button, Input, Overlay, CheckBox } from 'react-native-elements';

import { ViewContainer, StyleSheet } from "../../../components";
import { setAppLocale } from "../../../actions";

import QRCode from 'react-native-qrcode-svg';

const TRACE = true;


class Card extends Component {

	constructor(props) {
		super(props);

	}


	componentWillUnmount() {

  }

  componentWillMount() {
    
  }

  _setClipboardContent = () => {
  	console.log("_setClipboardContent");

  	Clipboard.setString(this.props.currentAccount);
  	alert(this.props.currentAccount);
  }

  _fetchAppVersion = () => {

  	console.log("fetch...........")
  	fetch('https://www.pgyer.com/apiv2/app/check', {
  		headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/x-www-form-urlencoded',
	      '_api_key': '701b536596f0d86383bd090ed60bb0f9',
	      'appKey': '580c635ffdae131c926066ad5b868edb',
	    },
	    method: "POST",
	    body: '_api_key=701b536596f0d86383bd090ed60bb0f9&appKey=580c635ffdae131c926066ad5b868edb', //JSON.stringify({_api_key: '701b536596f0d86383bd090ed60bb0f9'})
  	}).then(res => {
  		return res.json()
  	}).then(json => {
  		  		alert(JSON.stringify(json))
  	}).catch(err => {
  		alert(err)
  	})
  }


	render() {

		const { currentAccount } = this.props;
		if(TRACE) console.info("=====[Language.js]::render - : currentAccount >  ", currentAccount);


		const qrValue = currentAccount + "@tokenpii.org";
		return (
			<ViewContainer>
				<Text>Hello Cards</Text>
				<View style={{backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', flex: 1}}>
					<QRCode 
						value={qrValue}
						size={250}
						logo={require("../images/aftlogo.png")}
					/>
					<View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
						<View style={{width: 100}}><Text onPress={this._setClipboardContent} style={{textAlign: 'center', color: 'blue', fontSize: 18}}>
          		复制
        		</Text></View>

        		<View style={{width: 100}}><Text onPress={this._fetchAppVersion} style={{textAlign: 'center', color: 'blue', fontSize: 18}}>
          		分享
        		</Text></View>
        	</View>
				</View>
			</ViewContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'space-around',
		borderWidth: 1,
		margin: 0,
		backgroundColor: Colors.white,
	}
})

const mapStateToProps = (state) => ({
  language: state.app.locale,
  currentAccount: state.app.currentAccount,
});

export const CardScreen = connect(mapStateToProps, {
	setAppLocale,
})(Card);
