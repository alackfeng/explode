
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { Colors, resetNavigationTo, SCREEN_WIDTH } from "../libs";
import { Icon, Button, Input } from 'react-native-elements';

import { ViewContainer, StyleSheet, } from "../components";

import { ChainStore, FetchChain } from "assetfunjs/es";


const TRACE = false;

class TableHistoryWrap extends Component {

	render() {

		const { history } = this.props;
		if(TRACE) console.info("=====[TableHistory.js]::render - : render >  ", history);

		return (
			<ViewContainer>
				<Text>{JSON.stringify(history)}</Text>
			</ViewContainer>
		);
	}

}

export const TableHistory = TableHistoryWrap;