
import React, { Component } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { ListItem, Button } from "react-native-elements";

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
			symbol: null,
		};

	}

	componentWillMount() {
		const { item } = this.props;

		const balanceObject = ChainStore.getObject(item.asset);
		const asset_type = balanceObject.get("asset_type");
		const asset = ChainStore.getAsset(asset_type);

		console.log("=====[AssetItem.js]::componentWillMount - balanceObject > ", JSON.stringify(balanceObject), asset_type, JSON.stringify(asset));
		this.setState({balanceObject, asset, symbol: asset && asset.get("symbol")});
	}

	onPressNavTo() {
		const { item, index, nav } = this.props;

		console.log("=====[AssetItem.js]::onPressNavTo - press > ", item, index);
		if(nav)
			this.props.nav('Transfer', {item: item, index: index});

	}

	rightTitle = () => {
		return <Button 
			buttonStyle={{backgroundColor: 'transparent'}} 
			textStyle={{fontWeight: 'bold', color: 'rgba(35,82,164,0.7)'}} 
			text="转帐" 
			onPress={this.onPressNavTo} 
		/>;
	}

	render() {

		const { item, index } = this.props;
		const { balanceObject, asset, symbol } = this.state;
		console.log("=====[AssetItem.js]::render - node item > ", item, index, symbol);

		const subTitle = `${balanceObject.get("balance")/100000000} ${symbol}`;

		return (
			<AssetItemWrap>
				<ListItem
					//hideChevron
					key={index}
					//roundAvatar
					title={item.type}
					subtitle={subTitle}
					icon={{ name: item.icon }}
					rightIcon={{ name: 'trending-up'}}
					rightTitle={'转账'}
					rightTitleStyle={{color: 'rgba(35,82,164,1)'}}
					onPressRightIcon={this.onPressNavTo}
					avatar={require('../images/aft-account.png')}
					avatarStyle={{backgroundColor: 'blue'}}
					//badge={{ element: <CustBadge index={rowID}/> }}
					onPress={() => this.onPressNavTo()}
				/>
			</AssetItemWrap>
		);
	}
}

export const AssetItem = Asset;

