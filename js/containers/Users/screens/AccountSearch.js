
import React, { Component } from "react";
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Text, View, StatusBar, TextInput, Button, TouchableHighlight } from "react-native";
import { accountSearch } from "../actions";

import { ViewContainer, Colors, Normalize, StyleSheet } from "../../../components";

import iDB from "../../../libs/idb-instance";



class AccountSearch extends Component {

	constructor() {
		super();

		this.onSearchAccount = this.onSearchAccount.bind(this);
		this.state = {
			searchContent: "",
			linked_accounts: ""
		}

	}

	onSearchAccount = () => {
		console.log("+++++[AccountSearch.js]::onSearchAccount - > ", this.state.searchContent);
		this.props.accountSearch(this.state.searchContent, 50);

		/* iDB.load_data("linked_accounts").then(data => {
        console.log("+++++[AccountSearch.js]::AccountSearch - db - linked_accounts - ", data); 
        this.setState({linked_accounts: data[0]});
    }); */
	}

	render() {

		const { accountsearch } = this.props;

		let windowdb = this.state.linked_accounts || "";

		return (
			<ViewContainer>
				<Text style={{marginBottom: 20}}>{ this.state.searchContent || "Hello AccountSearch"} </Text>
				<Text>{JSON.stringify(windowdb)}</Text>
				<TextInput
	    		style={{height: 40, borderColor: 'gray', borderWidth: 1}}
			    onChangeText={(text) => this.setState({searchContent: text})}
			    value={this.state.searchContent}
			  />
			  <TouchableHighlight underlayColor='red' onPress={this.onSearchAccount}>
			  	<Text style={{borderWidth: 1, color: Colors.green}}>Search</Text> 
			  </TouchableHighlight>
			  <Text>{JSON.stringify(accountsearch)}</Text>
			</ViewContainer>
		);
	}
}

const mapStateToProps = (state) => ({
	accountsearch: state.wallet.accountsearch,
});

const mapDispatchToProps = dispatch => {
	return {
		accountSearch: bindActionCreators(accountSearch, dispatch),
	};
}

export const AccountSearchScreen = connect(mapStateToProps, mapDispatchToProps)(AccountSearch);