import React, { Component } from "react";
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ListView, Text, Dimensions, FlatList, View } from "react-native";
import { Colors, SCREEN_WIDTH, normalize } from "../libs";
import { SearchBar, List, ListItem } from "react-native-elements";
import { ViewContainer, StyleSheet } from "../components";


type Props = {
  children?: React.Element<*>,
};

const ViewHeader = styled.View`
  margin-top: 20;
  margin-left: 10;
  margin-right: 10;
  margin-bottom: 10;
  border-bottom-color: ${Colors.black};
  border-bottom-width: 1;
  height: 50;
`;

const AccountText = styled.Text`
	font-size: 20;
`;

class HeaderLink extends Component {

	constructor(props) {
		super(props);

		this.renderHeader = this.renderHeader.bind(this);

	}
	renderHeader() {
    return <View style={styles.header}>
    	<Text style={styles.headerTitle}>类型</Text>
    	<Text style={styles.headerTitle}>数量</Text>
    	<Text style={styles.headerTitle}>对方账号</Text>
    	<Text style={styles.headerTitle}>时间</Text>
    </View>;
  }

	render() {

		const { nodeStatus, account, node } = this.props;

		console.log("=====[Header.js]::render - ", nodeStatus);
		if(!nodeStatus)
			return null;

		return (
			<ViewHeader>
				{account && <AccountText> 当前帐号：{account}</AccountText> }
				{node && <Text>Block Link Node -: {nodeStatus.url} {nodeStatus.status} </Text>}
				{this.renderHeader()}
			</ViewHeader>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		backgroundColor:'white', 
		height:50, 
		flexDirection: 'row', 
		alignItems: 'center', 
		justifyContent: 'space-around',
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0,0,0,0.1)',
		marginBottom: 10,
	},
	headerTitle: {
		color: 'rgba(102,102,102,1)', 
		fontSize:20, 
		textAlign:'center'
	},
});

const mapStateToProps = (state) => ({
	nodeStatus: state.app.nodeStatus,
});

export const Header = connect(mapStateToProps, {

})(HeaderLink);

