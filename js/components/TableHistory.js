
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Dimensions, ListView } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH, Utils } from "../libs";
import { Icon, Button, Input, List, ListItem } from 'react-native-elements';

import { ViewContainer, StyleSheet, AccountOBJ, AssetOBJ } from "../components";

import { ChainStore, FetchChain, ChainTypes } from "assetfunjs/es";
const { operations } = ChainTypes;
const ops = Object.keys(operations);


const TRACE = false;

class TransItem extends Component {
	
	constructor(props) {
		super(props);

		this.blockTimeLast = this.blockTimeLast.bind(this);

	}


  blockTimeLast = (height) => {
  	const { globalObject, dynGlobalObject } = this.props;

  	const blockTime = Utils.calc_block_time(height, globalObject, dynGlobalObject);
  	if(TRACE) console.log("[TransItem.js]::blockTimeLast - block time : ", blockTime);

  	if(blockTime) {
  		let timePassed = Math.round( (new Date().getTime() - new Date(blockTime).getTime()) / 1000 );
  		if(timePassed < 60 * 60) {
  			timePassed = Number(timePassed / 60).toFixed(2) + '秒前'; // < 1 hour
  		} else if (timePassed < 60 * 60 * 24) {
  			timePassed = Number(timePassed / 60 / 60).toFixed(2) + '时前'; // < 1 day
  		} else if( timePassed < 60 * 60 * 24 * 12) {
  			timePassed = Number(timePassed / 60 / 60 / 24).toFixed(2) + '天前'; // < 1 year
  		} else { 
  			timePassed = Number(timePassed / 60 / 60 / 24 / 12).toFixed(2) + '年前'; // < 
  		}
  		return timePassed;
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
				column = (<View style={[styles.body, {backgroundColor: index%2?'white':'rgba(40,65,89,0.1)'}]}>
			    	<Text style={[styles.column, {color: index%2?'rgba(229,109,57,1)':'rgba(15,187,134,1)'}]}>{transType ? "转出" : "转入"}</Text>
			    	<AssetOBJ amount={op[1].amount.amount} asset={op[1].amount.asset_id} />
			    	<AccountOBJ account={transType ? op[1].to : op[1].from} />
			    	<Text style={styles.column}>{this.blockTimeLast(item.block_num)}</Text>
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


	render() {

		const { history } = this.props;
		const { globalObject, dynGlobalObject }  = this.state;


		const isValid = !!(history && globalObject && dynGlobalObject);
		if(TRACE) console.info("=====[TableHistory.js]::render - : render >  ", isValid, history, globalObject, dynGlobalObject);

		return (
			<ViewContainer>
				{isValid && <ScrollView style={styles.container}>
		      <ListView
		      	enableEmptySections
		      	ref="ListView"
		      	style={styles.container1}
		        dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(history.toJS())	}
		        renderRow={this.renderRow}
		        //renderHeader={this.renderHeader}
		        removeClippedSubviews={false}
		      />
		    </ScrollView>}
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
		textAlign:'center',

	}
});

export const TableHistory = TableHistoryWrap;