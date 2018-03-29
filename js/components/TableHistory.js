
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Dimensions, ListView, RefreshControl } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH, Utils, translate, locale } from "../libs";
import { Icon, Button, Input, List, ListItem } from 'react-native-elements';

import { ViewContainer, StyleSheet, AccountOBJ, AssetOBJ, TransferOP } from "../components";

import { ChainStore, FetchChain, ChainTypes } from "assetfunjs/es";
const { operations } = ChainTypes;
const ops = Object.keys(operations);


const TRACE = false;

const OperType = (props) => (
	<View style={styles.opertype}><Text style={[styles.column, {color: props.color}]}>{props.type ? "转出" : "转入"}</Text></View>
);

const TimeAge = (props) => (
	<View style={styles.timeage}><Text style={styles.column}>{props.time}</Text></View>
);

class TransItem extends Component {
	
	constructor(props) {
		super(props);

		this.blockTimeLast = this.blockTimeLast.bind(this);

	}


  blockTimeLast = (height) => {
  	const { globalObject, dynGlobalObject } = this.props;

  	const blockTime = Utils.calc_block_time(height, globalObject, dynGlobalObject);

  	if(blockTime) {
  		let timePassed = Math.round( (new Date().getTime() - new Date(blockTime).getTime()) / 1000 );
  		
  		if(TRACE) console.log("[TransItem.js]::blockTimeLast - block time : ", timePassed, blockTime, new Date(), new Date(blockTime));
  		if(timePassed < 60 * 60) {
  			timePassed = Math.ceil(timePassed / 60).toFixed(1) + '分前'; // < 1 hour
  		} else if (timePassed < 60 * 60 * 24) {
  			timePassed = Math.ceil(timePassed / 60 / 60).toFixed(1) + '时前'; // < 1 day
  		} else if( timePassed < 60 * 60 * 24 * 30 * 12) {
  			timePassed = Math.ceil(timePassed / 60 / 60 / 24).toFixed(1) + '天前'; // < 1 year
  		} else { 
  			timePassed = Math.ceil(timePassed / 60 / 60 / 24 / 30 / 12).toFixed(1) + '年前'; // < 
  		}
  		return new Date(blockTime).toLocaleString();
  	}
  	return 'NaN';
  }

	render() {
 
		const { item, index, account, globalObject, dynGlobalObject } = this.props;
		if(TRACE) console.log("[TableHistory.js]::TransItem - render . ", item, account, globalObject, dynGlobalObject);
		const op = item.op;

		let column = null;

		// account object id 相比较
		const transType = op[1].from === account ? true : false;

		switch(ops[op[0]]) {
			case 'transfer':
				column = <TransferOP type={transType} oper={op} time={this.blockTimeLast(item.block_num)} />;
			break;
			case 'transfer1':
				column = (<View style={[styles.body, {backgroundColor: index%2?'white':'rgba(40,65,89,0.1)'}]}>
			    	<OperType type={transType} color={index%2?'rgba(229,109,57,1)':'rgba(15,187,134,1)'} />
			    	<AssetOBJ amount={op[1].amount.amount} asset={op[1].amount.asset_id} />
			    	<AccountOBJ account={transType ? op[1].to : op[1].from} />
			    	<TimeAge time={this.blockTimeLast(item.block_num)} />
			    </View>);
			break;
			default:
			break;
		}

		return column;
	}
}

class TableHistoryWrap extends Component {

	constructor(props) {
		super(props);


		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		this.state = {

			dataSource: !!props.history ? ds.cloneWithRows(props.history) : null,
			globalObject: null,
			dynGlobalObject: null,
		}

		this.renderRow = this.renderRow.bind(this);
		this.update = this.update.bind(this);
		this._onRefresh = this._onRefresh.bind(this);

	}

	componentWillUnmount() {
    ChainStore.unsubscribe(this.update); // update
  }

  componentWillMount() {
    
    this.fetchObjects();
    ChainStore.subscribe(this.update); // update

  }

  update(nextProps = null) {
    if(TRACE) console.info("=====[TableHistory.js]::update - ChainStore::subscribe : ************** nextProps ", nextProps);

    this.fetchObjects();
  }

  fetchObjects = () => {

    if(TRACE) console.log("=====[TableHistory.js]::fetchObjects - fetchObjects---: ", "[\"2.0.0\", \"2.0.1\"]");

    FetchChain("getObject", ["2.0.0", "2.1.0"]).then((res) => {
      
      if(TRACE) console.log("=====[TableHistory.js]::fetchObjects - : globalObject is : ", JSON.stringify(res.toJS()));
      if(res.size === 2) {
      		const global_ = res;
          this.setState({globalObject: global_.get(0), dynGlobalObject: global_.get(1)});
      }      

    }).catch(err => {
      console.error("=====[TableHistory.js]::fetchObjects  : globalObject is : err ", err);
    })

  }

	// 转移到上层，分开处理，goto Header.js
	renderHeader() {
    return <View style={styles.header}>
    	<Text style={styles.headerTitle}>类型</Text>
    	<Text style={styles.headerTitle}>数量</Text>
    	<Text style={styles.headerTitle}>对方账号</Text>
    	<Text style={styles.headerTitle}>时间</Text>
    </View>;
  }

	renderRow(rowData, sectionID, rowID) {
		const { history, account,  } = this.props;
		const { globalObject, dynGlobalObject } = this.state;
		if(TRACE) console.log("[TableHistory.js]::renderRow - params: ", globalObject, dynGlobalObject, history)

		return (
			<TransItem item={rowData} index={rowID} account={account} globalObject={globalObject} dynGlobalObject={dynGlobalObject} />
		);
	}

	_onRefresh = () => {
		this.props.onRefresh();
	}

	render() {

		const { history } = this.props;
		const { globalObject, dynGlobalObject }  = this.state;


		const isValid = !!(history && globalObject && dynGlobalObject);
		if(TRACE) console.info("=====[TableHistory.js]::render - : render >  ", isValid, history, globalObject, dynGlobalObject);

		return (
			<ViewContainer>
				{isValid &&
		      <ListView
		      	enableEmptySections
		      	ref="ListView"
		      	style={styles.container1}
		        dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(history.toJS())	}
		        renderRow={this.renderRow}
		        //renderHeader={this.renderHeader}
		        removeClippedSubviews={false}
		        refreshControl = {
		        	<RefreshControl
								refreshing={this.props.isRefreshing}
								onRefresh={this._onRefresh}
								tintColor="#ff0000"
								title={ translate('comm.loadingdata', locale) }
								titleColor="gray"
								colors={['#ff0000', '#00ff00', '#0000ff']}
								progressBackgroundColor="#ffff00"
		        	/>
		        }
		      />
		    }
			</ViewContainer>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		marginTop: 0,
	},
	header: {
		backgroundColor:'white', 
		height:50, 
		flexDirection: 'row', 
		alignItems: 'center', 
		justifyContent: 'space-around',
		borderBottomWidth: 0.5,
		borderTopWidth: 0,
		borderBottomColor: 'rgba(40,65,89,1)',
		borderTopColor: 'rgba(40,65,89,1)',
	},
	headerTitle: {
		color: 'rgba(102,102,102,1)', 
		fontSize:20, 
		textAlign:'center'
	},
	body: {
		backgroundColor:'white', 
		height:50, 
		flexDirection: 'row', 
		alignItems: 'center', 
		justifyContent: 'space-around',
		borderBottomWidth: 0,
		borderBottomColor: 'rgba(40,65,89,1)',
	},
	column: {
		color: 'rgba(40,65,89,1)', 
		fontSize:15, 
		textAlign:'right',
	},
	opertype: {
		flex: 0.5,
		marginRight: 10,
	},
	timeage: {
		justifyContent: 'flex-end',
		flex: 1,
		marginRight: 10,
	}
});

export const TableHistory = TableHistoryWrap;