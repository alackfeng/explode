
import React, { Component } from "react";
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Text, View, StatusBar, TextInput, Button, TouchableHighlight } from "react-native";
import { init, setNewWallet, deleteWallet, restore } from "../wallet.actions";

import { ViewContainer, Colors, Normalize, StyleSheet } from "../../../components";


const SLViewContainer = styled.View`
  flex: 1;
  flex-direction: column;
`;

const SLViewShow = styled(SLViewContainer).attrs()`
	flex: 1;
	flex-direction: column;
	marginTop: 20;
`;

const SLTextShow = styled.Text`
	marginBottom: 10;
`;

const SLViewSearch = styled(SLViewContainer).attrs({
})`
	flex: 1;
	flex-direction: row;
`;

const SLTextButton = styled(SLTextShow).attrs()`
	borderWidth: 1;
	color: ${Colors.green};
	fontSize: 20;
	zIndex: 1;
`;

class Wallet extends Component {

	constructor(props) {
		super(props);

		this.onInit 						= this.onInit.bind(this);
		this.onSetNewWallet 		= this.onSetNewWallet.bind(this);
		this.onDeleteWallet 		= this.onDeleteWallet.bind(this);
		this.onRestore 					= this.onRestore.bind(this);

		this.state = {
			searchContent: "",
			linked_accounts: ""
		}
	}

	componentDidMount() {
		this.onInit();
	}

	/* component call action to redux */
	onInit = () => {
		console.log("+++++[Settings.js]::onInit - > ", this.state.searchContent);
		this.props.init(this.state.searchContent);
	}

	onSetNewWallet = () => {
		console.log("+++++[Wallet.js]::onSetNewWallet - > ", this.state.searchContent);
		this.props.setNewWallet(this.state.searchContent, "123321");
	}

	onDeleteWallet = () => {
		console.log("+++++[Settings.js]::onDeleteWallet - > ", this.state.searchContent);
		this.props.deleteWallet(this.state.searchContent);
	}

	onRestore = () => {
		console.log("+++++[Settings.js]::onRestore - > ", this.state.searchContent);
		this.props.restore(this.state.searchContent);
	}

	render() {

		const { accountName } = this.props;

		return (
			<ViewContainer>
				<SLViewShow>
					<SLTextShow>SHOW: { accountName || "...wallet..."} </SLTextShow>
				</SLViewShow>
				<SLViewSearch>
					<SLTextShow>New: </SLTextShow>
					<TextInput
		    		style={{height: 35, width: 100, borderColor: 'gray', borderWidth: 1}}
				    onChangeText={(text) => this.setState({searchContent: text})}
				    value={this.state.searchContent}
				  />
				  <TouchableHighlight underlayColor='red' onPress={this.onSetNewWallet}>
				  	<SLTextButton>NEW</SLTextButton> 
				  </TouchableHighlight>
			  </SLViewSearch>
			  <SLViewSearch>
					<SLTextShow>Delete: </SLTextShow>
					<TextInput
		    		style={{height: 35, borderColor: 'gray', borderWidth: 1}}
				    onChangeText={(text) => this.setState({searchContent: text})}
				    value={this.state.searchContent}
				  />
				  <TouchableHighlight underlayColor='red' onPress={this.onDeleteWallet}>
				  	<SLTextButton>DELETE</SLTextButton> 
				  </TouchableHighlight>
			  </SLViewSearch>
			  <SLViewSearch>
					<SLTextShow>Restore: </SLTextShow>
					<TextInput
		    		style={{height: 35, borderColor: 'gray', borderWidth: 1}}
				    onChangeText={(text) => this.setState({searchContent: text})}
				    value={this.state.searchContent}
				  />
				  <TouchableHighlight underlayColor='red' onPress={this.onRestore}>
				  	<SLTextButton>RESTORE</SLTextButton> 
				  </TouchableHighlight>
			  </SLViewSearch>
			</ViewContainer>
		);
	}
}

const mapStateToProps = (state) => ({
	accountName: state.settings.currentAccount,
});

const mapDispatchToProps = dispatch => {
	return {
		init: bindActionCreators(init, dispatch),
		setNewWallet: bindActionCreators(setNewWallet, dispatch),
		deleteWallet: bindActionCreators(deleteWallet, dispatch),
		restore: bindActionCreators(restore, dispatch),
	};
}

export const WalletScreen = connect(mapStateToProps, mapDispatchToProps)(Wallet);