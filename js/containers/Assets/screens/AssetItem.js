
import React, { Component } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { ListItem, Button, Divider } from "react-native-elements";
import { Colors, SCREEN_WIDTH, normalize, translate, locale } from "../../../libs";

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
		const asset_type = balanceObject ? balanceObject.get("asset_type") : null;
		const asset = asset_type ? ChainStore.getAsset(asset_type) : null;

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
			text= { translate('tips.transfer.commit', locale) }
			onPress={this.onPressNavTo} 
		/>;
	}

	render() {

		const { item, index } = this.props;
		const { balanceObject, asset, asset_name, symbol } = this.state;
		if(TRACE) console.log("=====[AssetItem.js]::render - node item > ", item, index, symbol);


		// 兼容不同的description
		let getAssetName = (asset_name) => {
			try {
				return JSON.parse(asset_name).short_name || JSON.parse(asset_name).main;
			} catch(e) {
				return null;
			}
		}


		const subTitle = (!item || !balanceObject) ? "0 AFT" : `${balanceObject.get("balance")/100000000} ${symbol}`;
		const assetName = (!item || !balanceObject) ? "1.3.0" : asset_name && (getAssetName(asset_name)) || item.type;


		return (
			<AssetItemWrap>
				<ListItem
					containerStyle={{height: 80, flex: 1,border: 0 }}
					wrapperStyle={{height: 60, flex: 1, border: 0}}
					titleWrapStyle={{flex: 2, justifyContent: 'center'}}
					titleContainerStyle={{height: 25, justifyContent: 'center'}}
					subtitleContainerStyle={{height: 25, justifyContent: 'center'}}
					hideChevron
					key={index}
					avatarOverlayContainerStyle={{borderRadius: 5}}
					title={assetName}
					titleStyle={{fontSize: 18, color: '#284159', fontWeight: 'bold', textAlignVertical: 'center'}}
					subtitle={subTitle}
					subtitleStyle={{fontSize: 12, color: '#AEB4C0', textAlignVertical: 'center'}}
					rightIcon={{ name: 'trending-up'}}
					rightTitle={ translate('tips.transfer.commit', locale) }
					rightTitleStyle={{color: '#2352A4', fontSize: 14}}
					avatar={require('../images/assetlogo.jpg')}
					avatarStyle={{backgroundColor: 'blue', height: 60, width: 100, borderRadius: 5}}
					avatarContainerStyle={{height: 60, width: 100}}
					onPress={() => this.onPressNavTo()}
				/>
				<Divider style={{ backgroundColor: '#DFDFDF', marginLeft: 15, marginRight: 10 }} />
			</AssetItemWrap>
		);
	}
}

export const AssetItem = Asset;

