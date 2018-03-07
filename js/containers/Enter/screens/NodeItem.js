
import React, { Component } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { ListItem } from "react-native-elements";
import { ViewContainer, StyleSheet } from "../../../components";
import { Colors, SCREEN_WIDTH, normalize, translate, locale } from "../../../libs";

const NodeWrap = styled.View`
	background-color: transparent;
	border-bottom-color: ${Colors.titleGray};
  border-bottom-width: 1;
`;

class NodeInfo extends Component {

	constructor() {
		super();

		this.onPressUpConnect = this.onPressUpConnect.bind(this);

	}

	onPressUpConnect() {
		const { item, index, updateConnect, linknode } = this.props;

		console.log("=====[NodeItem.js]::onPressUpConnect - press > ", item, index);

		let status = linknode.url === item.url ? linknode.status : item.status;

		if(status !== 'open' && updateConnect) {
			this.props.updateConnect(item.url);
		}

	}

	render() {

		const { item, index, linknode } = this.props;
		// console.log("=====[NodeItem.js]::render - node item > ", item, index);
		let status = linknode.url === item.url ? linknode.status : item.status;

		const subTitle = `${item.url} - < ${status} : ${item.latency}ms >`;

		return (
			<NodeWrap>
				<ListItem
					//hideChevron
					key={index}
					//roundAvatar
					title={translate(item.location, locale) || 'NaN'}
					titleStyle={styles.title}
					subtitle={subTitle}
					subtitleStyle={styles.subtitle}
					icon={{ name: item.icon }}
					rightIcon={{ name: 'cloud-upload', color: 'blue'}}
					onPressRightIcon={this.onPressUpConnect}
					//avatar={{uri:rowData.avatar_url}}
					//badge={{ element: <CustBadge index={rowID}/> }}
					//onPress={() => this.onPressItem(rowData)}
				/>
			</NodeWrap>
		);
	}
}

const styles = StyleSheet.create({
	title: {
		color: Colors.menuBlue,
		fontSize: 20,
		fontWeight: 'bold',
	},
	subtitle: {
		color: Colors.headerGray,
	}
});

export const NodeItem = NodeInfo;

