
import React, { Component } from "react";
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ListView } from "react-native";
import { nodeConnect, updateRpcConnectionStatus } from "../actions";
import { Apis } from "assetfunjs-ws";

import { ViewContainer, Colors, Normalize, StyleSheet } from "../../../components";
import { nodeList } from "../../../env";

import { AccountSearchScreen } from "./AccountSearch";
import { SettingsScreen } from "./Settings";
import { WalletScreen } from "./Wallet";
import { RegisterScreen } from "../../Users";

const SLViewText = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.orange};
`;

const SLText = styled.Text`
	text-align: left;
	color: ${Colors.iceberg};
	margin-top: 10;
`;

const SLListView = styled.ListView`
`;


class Node extends Component {

	props: {
		url: string,
		status: boolean
	}

	constructor(props) {
		super(props);

		var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		this.state = {
			dataSource: ds.cloneWithRows(nodeList),
			statusList: []
		};
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.status) {
			
			this.state.statusList.length && this.state.statusList.push(nextProps.status);

			this.setState({
				statusList: this.state.statusList.length ? this.state.statusList : [nextProps.status]
			});
		}
	}

	componentDidMount() {
		
		this.props.nodeConnect(nodeList);
		Apis.setRpcConnectionStatusCallback(this.updateRpcConnectionStatus.bind(this));

	}

	updateRpcConnectionStatus(status) {
		console.log("=====[Node.js]::updateRpcConnectionStatus - status - ", status);
		this.props.updateRpcConnectionStatus(status);
	}

	renderRow = (row) => {
		return <SLText>{row.url} - {row.location}</SLText>
	}

	renderNodeList() {
		return (
			<SLListView 
				dataSource={this.state.dataSource}
				renderRow={this.renderRow}
				enableEmptySections={true}
			/>
		);
	}

	render() {

		const { url, status, } = this.props;

		console.log("=====[Node.js]::render - node - ", url, status);
		let showNodeList = nodeList.map((item, index) => {
			// console.log("=====[Node.js]::render - showNodeList - ", item, index);
			return <SLText key={index}>{index}: {item.url} - {item.location}</SLText>
		});

		let showStatusList = this.state.statusList.map((item, index) => {
			return <SLText key={index}>Connect to Node-{url}, status-{item}</SLText>;
		});

		return (
			<ViewContainer>
				
				<SLViewText>
					{ this.renderNodeList() }
					{ showStatusList }
				</SLViewText>
				<RegisterScreen />
			</ViewContainer>
		);
	}
}


const mapStateToProps = (state) => ({
	url: state.wallet.url,
	status: state.wallet.status,
});

const mapDispatchToProps = dispatch => {
	return {
		nodeConnect: bindActionCreators(nodeConnect, dispatch),
		updateRpcConnectionStatus: bindActionCreators(updateRpcConnectionStatus, dispatch),
	};
}

export const NodeScreen = connect(mapStateToProps, mapDispatchToProps)(Node);