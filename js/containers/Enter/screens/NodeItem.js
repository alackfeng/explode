
import React, { Component } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { ListItem } from "react-native-elements";
import { ViewContainer, StyleSheet } from "../../../components";
import { Colors, SCREEN_WIDTH, normalize, translate, locale } from "../../../libs";

const NodeWrap = styled.View`
	background-color: transparent;
	border-bottom-color: #DFDFDF;
  border-top-width: 0;
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

		const subTitle = `${status}:${item.latency}ms`;
		const rightTitle = (status !== 'open') ? ' ' : translate('tips.comm.linked', locale);

		return (
			<NodeWrap>
				<ListItem
					hideChevron
					key={index}
					containerStyle={{borderBottomColor: '#DFDFDF', backgroundColor: 'white'}}
					titleWrapStyle={styles.titleWrapStyle}
					title={translate(item.location, locale) || 'NaN'}
					titleStyle={styles.title}
					subtitle={subTitle}
					subtitleStyle={styles.subtitle}
					subtitleContainerStyle={{marginLeft: 10,}}
					rightTitle={rightTitle || ''}
					rightTitleStyle={{color: status!=='open'?'#04C488':'#7BFFDD', fontSize: 12, fontWeight: 'bold'}}
					leftIcon={{ name: status==='open'?'radio-button-checked':'radio-button-unchecked', color: status==='open'?'#2352A4':'' }}
					leftIconOnPress={this.onPressUpConnect}
				/>
			</NodeWrap>
		);
	}
}

const styles = StyleSheet.create({
	title: {
		color:'#284159',
		fontSize: 14,
		fontWeight: 'bold',
	},
	subtitle: {
		color: Colors.headerGray,
		fontSize: 12,
	},
	titleWrapStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	}
});

export const NodeItem = NodeInfo;

