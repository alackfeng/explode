import React, { Component } from "react";
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ListView, Text, Dimensions, FlatList } from "react-native";
import { Colors, SCREEN_WIDTH, normalize } from "../libs";
import { SearchBar, Button } from "react-native-elements";
import { ViewContainer, StyleSheet } from "../components";


type Props = {
  children?: React.Element<*>,
};

const ViewHeader = styled.View`
  background-color: blue;
  border-top-width: 1;
  border-top-color: rgba(239,239,239,1);
`;

const ViewButton = styled.View`
	height: 50;
	width: 50;
	background-color: white;
	justify-content: flex-end;
	align-items: stretch;
`;

class HDSearchBar extends Component {

	constructor(props) {
		super(props);

		this.state = {
			searchContent: null,
		}
	}

	onSearch() {
		console.log("=====[HeaderSearchBar.js]::onSearch - ", this.state.searchContent);
		if(this.state.searchContent) {
			this.props.onSearch(this.state.searchContent);
		}
	}

	render() {

		console.log("=====[HeaderSearchBar.js]::render - ", this.state.searchContent);

		return (
			<ViewHeader>
				<SearchBar 
					containerStyle={styles.searchContainer}
					inputStyle={styles.inputStyle}
					showLoading
					showLoadingIcon={false}
					clearIcon
					platform="android"
					onChangeText={(text)=>this.setState({searchContent: text})}
					onClearText={()=>this.setState({searchContent: null})}
					onCancel={()=>this.setState({searchContent: null})}
					onFocus={() => console.log("focus")}
					onBlur={() => this.onSearch()}
					placeholder='Type Asset name'
				/>
				{/*<ViewButton>
					<Button text="+" 
						buttonStyle={{height: 20, width: 20, backgroundColor: 'black', borderWidth: 0, borderColor: 'white', borderRadius: 0}}
					/>
				</ViewButton>*/}
			</ViewHeader>
		);
	}
}

const styles = StyleSheet.create({
	searchContainer: {
		borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
    borderTopColor: '#FFF',
    backgroundColor: 'white',
	},
	inputStyle: {
		backgroundColor: 'rgba(239,239,239,1)',
	}
});

const mapStateToProps = (state) => ({
	nodeStatus: state.app.nodeStatus,
});

export const HeaderSearchBar = connect(mapStateToProps, {

})(HDSearchBar);

