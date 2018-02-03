import React, { Component } from "react";
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ListView, Text, Dimensions, FlatList } from "react-native";
import { Colors, SCREEN_WIDTH, normalize } from "../libs";
import { SearchBar, List, ListItem } from "react-native-elements";
import { ViewContainer, StyleSheet } from "../components";


type Props = {
  children?: React.Element<*>,
};

const ViewHeader = styled.View`
  margin-top: 10;
  margin-left: 10;
  margin-right: 10;
  margin-bottom: 10;
  border-bottom-color: ${Colors.black};
  border-bottom-width: 1;
  height: 20;
`;

class HeaderLink extends Component {

	render() {

		const { nodeStatus, account, node } = this.props;

		console.log("=====[Header.js]::render - ", nodeStatus);
		if(!nodeStatus)
			return null;

		return (
			<ViewHeader>
				{account && <Text> 当前帐号：{account}</Text> }
				{node && <Text>Block Link Node -: {nodeStatus.url} {nodeStatus.status} </Text>}
			</ViewHeader>
		);
	}
}

const mapStateToProps = (state) => ({
	nodeStatus: state.app.nodeStatus,
});

export const Header = connect(mapStateToProps, {

})(HeaderLink);

