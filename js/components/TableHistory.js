
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Dimensions, ListView } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH } from "../libs";
import { Icon, Button, Input, List, ListItem } from 'react-native-elements';

import { ViewContainer, StyleSheet, } from "../components";

import { ChainStore, FetchChain, ChainTypes } from "assetfunjs/es";
const { operations } = ChainTypes;
const ops = Object.keys(operations);


const TRACE = false;

class TransItem extends Component {
	
	render() {
 
		const { item } = this.props;
		console.log("[TableHistory.js]::TransItem - render . ", item);
		const op = item.op;

		let column = null;

		switch(ops[op[0]]) {
			case 'transfer':
				column = (<View style={styles.body}>
			    	<Text style={styles.column}>{op[1].from}</Text>
			    	<Text style={styles.column}>{op[1].amount.amount/100000000}</Text>
			    	<Text style={styles.column}>{op[1].to}</Text>
			    	<Text style={styles.column}>{item.block_num}</Text>
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
		}

		this.renderRow = this.renderRow.bind(this);

	}

	
	renderHeader() {
    return <View style={styles.header}>
    	<Text style={{color: 'white', fontSize:20, textAlign:'center'}}>类型</Text>
    	<Text style={{color: 'gray', fontSize:20, textAlign:'center'}}>数量</Text>
    	<Text style={{color: 'yellow', fontSize:20, textAlign:'center'}}>对方账号</Text>
    	<Text style={{color: 'white', fontSize:20, textAlign:'center'}}>区块高度</Text>
    </View>;
  }

	renderRow(rowData, sectionID, rowID) {
		const { history } = this.props;

		return (
			<TransItem item={rowData} index={rowID} />
		);
	}


	render() {

		const { history } = this.props;
		if(TRACE) console.info("=====[TableHistory.js]::render - : render >  ", history);

		const isValid = !!history;

		return (
			<ViewContainer>

				{isValid && <ScrollView>
		      <ListView
		      	enableEmptySections
		      	ref="ListView"
		      	style={styles.container}
		        dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(history.toJS())	}
		        renderRow={this.renderRow}
		        renderHeader={this.renderHeader}
		      />
		    </ScrollView>}
			</ViewContainer>
		);
	}

}

const styles = StyleSheet.create({
	header: {
		backgroundColor:'red', 
		height:50, 
		flexDirection: 'row', 
		alignItems: 'center', 
		justifyContent: 'space-around'
	},
	body: {
		backgroundColor:'white', 
		height:50, 
		flexDirection: 'row', 
		alignItems: 'center', 
		justifyContent: 'space-around',
		borderBottomWidth: 1,
		borderBottomColor: 'red',
	},
	column: {
		color: 'rgba(40,65,89,1)', 
		fontSize:20, 
		textAlign:'center',

	}
});

export const TableHistory = TableHistoryWrap;