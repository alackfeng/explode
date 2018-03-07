
import React, { Component } from "react";
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ListView, Text, Dimensions, FlatList, ScrollView } from "react-native";
import { Colors, SCREEN_WIDTH, normalize } from "../../../libs";
import { SearchBar, List, ListItem } from "react-native-elements";
import { ViewContainer, StyleSheet } from "../../../components";
import { nodeConnect, updateRpcConnectionStatus } from "../../../actions";

import { Apis } from "assetfunjs-ws";

import { nodeList } from "../../../env";
import willTransitionTo from "../../../libs/routerTransition";

import { NodeItem } from "./NodeItem";

const Header = styled.View`
  margin-top: 10;
  margin-left: 10;
  margin-right: 10;
  margin-bottom: 10;
  border-bottom-color: ${Colors.greyLight};
  border-bottom-width: 1;
  height: 20;
`;

const SearchBarWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SearchContainer = styled.View`
  width: ${SCREEN_WIDTH};
  background-color: transparent;
  flex: 1;
`;

const ListContainer = styled.View`
  margin-bottom: 90;
  background-color: white;
`;


const SLViewText = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.orange};
`;

const SLText = styled.Text`
	text-align: left;
	color: red;
	margin-top: 5;
`;

const SLListView = styled.ListView`
`;


class Node extends Component {

	props: {
		url: string,
		status: boolean
	}

	constructor(props) {
		super(props);

		let nodeList = props.nodeList;

		var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		this.state = {
			dataSource: ds.cloneWithRows(nodeList),
			statusList: [],
			query: '',
      searchStart: false,
      searchFocus: false,
      nodeList: nodeList,
      ds: ds,
		};

		this.search 	 	= this.search.bind(this);
		this.getNodes 	= this.getNodes.bind(this);
		this.renderRow	= this.renderRow.bind(this);
		this.updateConnect = this.updateConnect.bind(this);


	}

	componentWillReceiveProps(nextProps) {
		console.log("+++++[Node.js]::componentWillReceiveProps - node ...", nextProps.nodeStatus.status, nextProps.nodeStatus.url, this.state.statusList);
		if(nextProps.nodeStatus) {
			
			this.state.statusList.length && this.state.statusList.push(nextProps.nodeStatus);

			this.setState({
				statusList: this.state.statusList.length ? this.state.statusList : [nextProps.nodeStatus],
				dataSource: this.state.ds.cloneWithRows(nextProps.nodeList),
			});
		}
	}

	componentDidMount() {
		
		const { nodeStatus } = this.props;
		// call someting, example api to node
		this.setState({statusList: [nodeStatus]});
		
		if(nodeStatus.url) {
			console.log("+++++[Node.js]::nodeConnect - ", nodeStatus.url, nodeStatus.status, ", Not use nodeTransition!!!");
			return;
		}

		let nodeTransition = (res, nodeList) => {
			console.log("+++++[Node.js]::nodeConnect - call api...", res);
			const url = res;
			this.props.nodeConnect(nodeList, url);
		};

		willTransitionTo(null, null, nodeTransition);
		Apis.setRpcConnectionStatusCallback(this.updateRpcConnectionStatus.bind(this));

	}

	updateRpcConnectionStatus(status, url) {
		console.log("=====[Node.js]::updateRpcConnectionStatus - status - ", status, url);
		this.props.updateRpcConnectionStatus(status, url);
	}

	renderRow(rowData, sectionID, rowID) {

		const { nodeStatus } = this.props;

		return (
			<NodeItem item={rowData} index={rowID} updateConnect={this.updateConnect} linknode={nodeStatus} />
		);
	}

	renderNodeList() {
		return (
			<SLListView 
				dataSource={this.state.dataSource}
				renderRow={this.renderRow}
				enableEmptySections={true}
			/>
		);
	}

	search(query) {
    //const { searchUserRepos } = this.props;
    //const user = this.props.navigation.state.params.user;
    console.log("=====[Node.js]::search - query - ", query);
    if (query !== '') {
      this.setState({
        searchStart: true,
        query,
      });

      //searchUserRepos(query, user);
    }
  }

  updateConnect(connectUrl) {

  	console.log("++++++[Node.js]::updateConnect - node - ", connectUrl);

  	
  	Apis.reset(connectUrl, true); //去掉注释的内容（init_promise），内存、CPU不再高涨

  	this.props.nodeConnect(null, connectUrl);
  }

  getNodes = () => {
    const { nodeList } = this.state;
    return nodeList;
  };

  keyExtractor = (item) => {
  	return item.url;
  }


 
	render() {

		const { nodeStatus, navigation } = this.props;
		const { searchStart, searchFocus, query } = this.state;

		console.log("=====[Node.js]::render - node - ", query, nodeStatus, navigation.state.params);
		let showNodeList = nodeList.map((item, index) => {
			// console.log("=====[Node.js]::render - showNodeList - ", item, index);
			return <SLText key={index}>{index}: {item.url} - {item.location}</SLText>
		});

		let showStatusList = this.state.statusList.map((item, index) => {
			return <SLText key={index}>Connect to Node-{item.url}, status-{item.status}</SLText>;
		});

		return (
			<ViewContainer>
				<Header>
					<SearchBarWrapper>
						<SearchContainer>
							{/*<SearchBar
								lightTheme
							  onChangeText={(text) => this.setState({query: text}) }
							  onClearText={()=> this.setState({query: ''})}
							  icon={{ type: 'font-awesome', name: 'search' }}
							  placeholder='Type Here...'
							/> */}
							<Text style={{textAlign: 'center', color: 'red'}}></Text>
						</SearchContainer>
					</SearchBarWrapper>
				</Header>


				<ListContainer>
					<List>
			      <ListView
			      	enableEmptySections
			        renderRow={this.renderRow}
			        dataSource={this.state.dataSource}
			      />
			    </List>
			    <ScrollView style={{marginTop: 30}}>
			    { showStatusList }
			    </ScrollView>
				</ListContainer>
			</ViewContainer>
		);
	}
}


const mapStateToProps = (state) => ({
	nodeList: state.app.nodesApi,
	nodeStatus: state.app.nodeStatus,
});

export const NodeScreen = connect(mapStateToProps, {
	nodeConnect,
	updateRpcConnectionStatus,
})(Node);