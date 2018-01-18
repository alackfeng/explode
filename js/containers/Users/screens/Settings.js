
import React, { Component } from "react";
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Text, View, StatusBar, TextInput, Button, TouchableHighlight } from "react-native";
import { init, change, currentAccount } from "../settings.actions";

import { ViewContainer, Colors, Normalize, StyleSheet } from "../../../components";


class Settings extends Component {

	constructor(props) {
		super(props);

		this.onChangeAccount = this.onChangeAccount.bind(this);
		this.state = {
			searchContent: "",
			linked_accounts: ""
		}

	}

	componentDidMount() {
		this.onInit();
	}

	onInit = () => {
		init().then(res => {
			console.log("+++++[Settings.js]::init - first - ", "ok");
		}).then(res => {
			console.log("+++++[Settings.js]::init - second - ", res);
		}).then(res => {
			console.log("+++++[Settings.js]::init - third - ", res);
		}).catch(err => {
			console.error("+++++[Settings.js]::init - error - ", err);
		});
	}

	onChangeAccount = () => {
		console.log("+++++[Settings.js]::onChangeAccount - > ", this.state.searchContent);
		this.props.changeCurrentAccount(this.state.searchContent);
	}

	render() {

		const { accountName } = this.props;

		return (
			<ViewContainer>
				<Text style={{marginBottom: 20}}>{ accountName || "Hello Settings"} </Text>
				<TextInput
	    		style={{height: 40, borderColor: 'gray', borderWidth: 1}}
			    onChangeText={(text) => this.setState({searchContent: text})}
			    value={this.state.searchContent}
			  />
			  <TouchableHighlight underlayColor='red' onPress={this.onChangeAccount}>
			  	<Text style={{borderWidth: 1, color: Colors.green}}>Change</Text> 
			  </TouchableHighlight>
			  <Text>{JSON.stringify(accountName)}</Text>
			</ViewContainer>
		);
	}
}

const mapStateToProps = (state) => ({
	accountName: state.settings.currentAccount,
});

const mapDispatchToProps = dispatch => {
	return {
		//init: bindActionCreators(init, dispatch),
		changeSettings: bindActionCreators(change, dispatch),
		changeCurrentAccount: bindActionCreators(currentAccount, dispatch),
	};
}

export const SettingsScreen = connect(mapStateToProps, mapDispatchToProps)(Settings);