
"use strict";

import React, { Component } from "react";

import { StyleSheet, View, Platform } from "react-native";

import { Button, Text, CheckBox } from "react-native-elements";

import { SCREEN_WIDTH, SCREEN_HEIGHT, translate, locale } from "../../libs";


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
				<View style={{justifyContent: 'flex-start'}}>
        <CheckBox
          title={ translate('tips.register.checkbox', locale) }
          textStyle={{fontSize: 13, textAlign: 'left', marginLeft: 5}}
          checked={checked || false}
          iconType={Platform.OS === 'web' ? 'material' : 'font-awesome'}
          checkedIcon={Platform.OS === 'web' ? 'check' : 'check-square-o'} 
          uncheckedIcon={Platform.OS === 'web' ? 'close' : 'square-o'} 
          //uncheckedColor='red'
          size={20}
          onPress={this.props.onChecked}
          containerStyle={styles.checkContainer}
        />
        </View>
        {/*<View style={{justifyContent: 'flex-end'}}>
        <Button 
          raised
          text ={ translate('tips.register.serviceprivacy', locale) }
          textStyle={{fontSize: 13, color: 'rgba(145,234,255,1)'}}
          buttonStyle={styles.buttonConatiner}
        />
        </View>*/}
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
    marginLeft: 0,
  },
	buttonConatiner: {
    backgroundColor: 'transparent',
		borderRadius: 0, 
		borderBottomWidth: 0.1,
		borderColor: 'white', 
    height: 30,
    elevation: 0,
	}
});



