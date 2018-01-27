
import React, { Component } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { ListItem } from "react-native-elements";

import { ChainStore, FetchChain } from "assetfunjs/es";


const AssetItemWrap = styled.View`
	background-color: white;
`;

class Asset extends Component {

	constructor() {
		super();

		this.onPressNavTo = this.onPressNavTo.bind(this);

		this.state = {
			balanceObject: null,
			asset: null,
		};

	}

	componentWillMount() {
		const { item } = this.props;

		const balanceObject = ChainStore.getObject(item.asset);
		const asset_type = balanceObject.get("asset_type");
		const asset = ChainStore.getAsset(asset_type);

		console.log("=====[AssetItem.js]::componentWillMount - balanceObject > ", JSON.stringify(balanceObject), asset_type, JSON.stringify(asset));
		this.setState({balanceObject, asset});
	}

	onPressNavTo() {
		const { item, index, nav } = this.props;

		console.log("=====[AssetItem.js]::onPressNavTo - press > ", item, index);
		if(nav)
			this.props.nav('Transfer');

	}

	render() {

		const { item, index } = this.props;
		const { balanceObject, asset } = this.state;
		console.log("=====[NodeItem.js]::render - node item > ", item, index);

		const subTitle = `资产类型:${item.type} 余额${balanceObject.get("balance")/100000000}AFT>拥有者<${balanceObject.get("owner")}>`;

		return (
			<AssetItemWrap>
				<ListItem
					//hideChevron
					key={index}
					//roundAvatar
					title={item.type}
					subtitle={subTitle}
					icon={{ name: item.icon }}
					rightIcon={{ name: 'cloud-upload'}}
					onPressRightIcon={this.onPressNavTo}
					//avatar={{uri:rowData.avatar_url}}
					//badge={{ element: <CustBadge index={rowID}/> }}
					//onPress={() => this.onPressItem(rowData)}
				/>
			</AssetItemWrap>
		);
	}
}

export const AssetItem = Asset;

