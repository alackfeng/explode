
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

var QRCode = require('qrcode-react');


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
  	Clipboard.setString(this.props.currentAccount);
  	alert(this.props.currentAccount);
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
						logoWidth= {250 * 0.2}
					/>
					<View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
						<View style={{width: 100}}><Text onPress={this._setClipboardContent} style={{textAlign: 'center', color: 'blue', fontSize: 18}}>
          		复制
        		</Text></View>

        		<View style={{width: 100}}><Text onPress={this._setClipboardContent} style={{textAlign: 'center', color: 'blue', fontSize: 18}}>
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
