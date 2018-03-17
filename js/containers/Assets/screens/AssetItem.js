
import React, { Component } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { ListItem, Button } from "react-native-elements";

import { ChainStore, FetchChain } from "assetfunjs/es";


const AssetItemWrap = styled.View`
	background-color: white;
`;

const TRACE = false;

class Asset extends Component {

	constructor() {
		super();

		this.onPressNavTo = this.onPressNavTo.bind(this);

		this.state = {
			balanceObject: null,
			asset: null,
			symbol: null,
			asset_name: null,
		};

		this.updateAsset = this.updateAsset.bind(this);

	}

	componentWillReceiveProps(nextProps) {

		this.updateAsset(nextProps);
	}

	componentWillMount() {
		
		this.updateAsset();
	}

	updateAsset = (props) => {

		const { item } = props || this.props;

		if(!item)
			return; 

		const balanceObject = ChainStore.getObject(item.asset);
		const asset_type = balanceObject.get("asset_type");
		const asset = ChainStore.getAsset(asset_type);

		if(TRACE) console.log("=====[AssetItem.js]::updateAsset - balanceObject > ", JSON.stringify(balanceObject), asset_type, JSON.stringify(asset));
		this.setState({balanceObject, asset, symbol: asset && asset.get("symbol"), asset_name: asset && asset.getIn(['options', 'description'])});
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
		const { balanceObject, asset, asset_name, symbol } = this.state;
		if(TRACE) console.log("=====[AssetItem.js]::render - node item > ", item, index, symbol);


		const subTitle = !item ? "0 AFT" : `${balanceObject.get("balance")/100000000} ${symbol}`;
		const assetName = !item ? "1.3.0" : asset_name && (JSON.parse(asset_name).main || JSON.parse(asset_name).main.short_name) || item.type;


		return (
			<AssetItemWrap>
				<ListItem
					containerStyle={{height: 80, flex: 1, borderBottomColor: '#DFDFDF', }}
					wrapperStyle={{height: 60, flex: 1}}
					titleWrapStyle={{flex: 1, justifyContent: 'center'}}
					titleContainerStyle={{height: 25, justifyContent: 'center'}}
					subtitleContainerStyle={{height: 25, justifyContent: 'center'}}
					hideChevron
					key={index}
					//roundAvatar
					title={assetName}
					titleStyle={{fontSize: 18, color: '#284159', fontWeight: 'bold', textAlignVertical: 'center'}}
					subtitle={subTitle}
					subtitleStyle={{fontSize: 12, color: '#AEB4C0', textAlignVertical: 'center'}}
					rightIcon={{ name: 'trending-up'}}
					rightTitle={'转账'}
					rightTitleStyle={{color: '#2352A4', fontSize: 14}}
					avatar={require('../images/assetlogo.jpg')}
					avatarStyle={{backgroundColor: 'blue', height: 60, width: 100}}
					avatarContainerStyle={{height: 60, width: 100}}
					onPress={() => this.onPressNavTo()}
				/>
			</AssetItemWrap>
		);
	}
}

export const AssetItem = Asset;

