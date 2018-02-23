
"use strict";

import React, { Component } from "react";

import { StyleSheet, View } from "react-native";

import { Tile, Button, Text, Icon, Input } from "react-native-elements";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../libs";


export class AccountInput extends Component {

	render() {

		const { error, username } = this.props;

		return (
			<View style={styles.container}>
				<Input
          containerStyle={styles.inputConatiner}
          icon={
            <Icon
              name='person'
              color='white'
              size={25}
            />
          }
          iconContainerStyle={{marginLeft: 20}}
          placeholder="账号名称"
          placeholderTextColor="white"
          inputStyle={{marginLeft: 10, color: 'white'}}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardAppearance="light"
          keyboardType="email-address"
          returnKeyType="next"
          ref={ input => this.usernameInput = input }
          onSubmitEditing={this.props.onSubmitEditing.bind(this)}
          blurOnSubmit={false}
          displayError={!!error}
          errorMessage={error || ''}
          value={username || ''}
          onChangeText={(text) => this.props.onChange(text)}
        />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
	},
	inputConatiner: {
		borderRadius: 0, 
		borderBottomWidth: 1, 
		borderColor: 'white', 
		height: 50, 
		width: SCREEN_WIDTH * 0.8, 
		marginVertical: 10
	}
});



