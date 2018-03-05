
"use strict";

import React, { Component } from "react";

import { StyleSheet, View } from "react-native";

import { Button, Text, CheckBox } from "react-native-elements";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../libs";


export class PrivacyService extends Component {

  constructor() {
    super();

    this.state = {
      checked: false,
    }
  }
	render() {

		const { error, username, checked } = this.props;

		return (
			<View style={styles.container}>
				<CheckBox
          title='我已阅读并同意'
          textStyle={{fontWeight: ''}}
          checked={checked || false}
          iconType='material'
          checkedIcon='check'
          uncheckedIcon='close'
          uncheckedColor='red'
          onPress={this.props.onChecked}
          containerStyle={styles.checkContainer}
        />
        <Button 
          raised
          text ='服务和隐私条款' 
          textStyle={{fontSize: 15, color: 'rgba(145,234,255,1)'}}
          buttonStyle={styles.buttonConatiner}
        />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
    flexDirection: 'row',   
    width: SCREEN_WIDTH * 0.8,
    justifyContent: 'space-between',
    alignItems: 'center',

	},
  checkContainer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
	buttonConatiner: {
    backgroundColor: 'transparent',
		borderRadius: 0, 
		borderBottomWidth: 0.1, 
		borderColor: 'white', 
    elevation: 0,
	}
});



