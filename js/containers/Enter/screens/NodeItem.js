
import React, { Component } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { ListItem } from "react-native-elements";

const NodeWrap = styled.View`
	background-color: yellow;
`;

class NodeInfo extends Component {

	constructor() {
		super();

		this.onPressUpConnect = this.onPressUpConnect.bind(this);

	}

	onPressUpConnect() {
		const { item, index, updateConnect } = this.props;

		console.log("=====[NodeItem.js]::onPressUpConnect - press > ", item, index);
		if(updateConnect)
			this.props.updateConnect(item.url);

	}

	render() {

		const { item, index, linknode } = this.props;
		// console.log("=====[NodeItem.js]::render - node item > ", item, index);
		let status = linknode.url === item.url ? linknode.status : item.status;

		const subTitle = `${item.url} - <${status} : ${item.latency}>`;

		return (
			<NodeWrap>
				<ListItem
					//hideChevron
					key={index}
					//roundAvatar
					title={item.location}
					subtitle={subTitle}
					icon={{ name: item.icon }}
					rightIcon={{ name: 'cloud-upload'}}
					onPressRightIcon={this.onPressUpConnect}
					//avatar={{uri:rowData.avatar_url}}
					//badge={{ element: <CustBadge index={rowID}/> }}
					//onPress={() => this.onPressItem(rowData)}
				/>
			</NodeWrap>
		);
	}
}

export const NodeItem = NodeInfo;

