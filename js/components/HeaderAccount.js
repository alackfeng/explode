import React, { Component } from "react";
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ListView, Text, Dimensions, FlatList } from "react-native";
import { Colors, SCREEN_WIDTH, SCREEN_HEIGHT, normalize } from "../libs";
import { SearchBar, List, ListItem, Tile } from "react-native-elements";
import { ViewContainer, StyleSheet } from "../components";


type Props = {
  children?: React.Element<*>,
};

const ViewHeader = styled.View`
  margin-top: 0;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 0;
  border-bottom-color: ${Colors.white};
  border-bottom-width: 1;
  height: 120;
`;

class Account extends Component {

	render() {

		const { currentAccount: account } = this.props;

		console.log("=====[HeaderAccount.js]::render - ", account);
		if(!account)
			return null;

		return (
			<ViewHeader>
				<Tile
					imageSrc={require('./images/account-background.jpg')}
					imageContainerStyle={styles.image}
					title={account}
					titleStyle={styles.title}
					featured
				/>
			</ViewHeader>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: 'rgba(251, 249, 240, 1)',
	},
	image: {
		width: SCREEN_WIDTH,
		height: 120,
	},
	title: {
		color: 'white',
	},
	caption: {
		color: 'white'
	}
};

const mapStateToProps = (state) => ({
	currentAccount: state.app.currentAccount,
});

export const HeaderAccount = connect(mapStateToProps, {

})(Account);

