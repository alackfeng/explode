
import React, { Component } from "react";
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ListView, Text, Dimensions, FlatList } from "react-native";
import { Colors, SCREEN_WIDTH, normalize } from "../../../libs";
import { ViewContainer, StyleSheet } from "../../../components";
import { SearchBar, List, ListItem } from "react-native-elements";
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
	color: ${Colors.iceberg};
	margin-top: 10;
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
      nodeList: nodeList
		};

		this.search 	 	= this.search.bind(this);
		this.getNodes 	= this.getNodes.bind(this);
		this.renderRow	= this.renderRow.bind(this);
		this.updateConnect = this.updateConnect.bind(this);


	}

	componentWillReceiveProps(nextProps) {
		console.log("+++++[Node.js]::componentWillReceiveProps - node ...", nextProps.status, nextProps.url, this.state.statusList);
		if(nextProps.status) {
			
			this.state.statusList.length && this.state.statusList.push(nextProps.status);

			this.setState({
				statusList: this.state.statusList.length ? this.state.statusList : [nextProps.status]
			});
		}
	}

	componentDidMount() {
		
		const { url, status } = this.props;
		// call someting, example api to node
		this.setState({statusList: []});
		
		if(url && status === 'open') {
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

	updateRpcConnectionStatus(status) {
		console.log("=====[Node.js]::updateRpcConnectionStatus - status - ", status);
		this.props.updateRpcConnectionStatus(status);
	}

	renderRow(rowData, sectionID, rowID) {


		return (
			<NodeItem item={rowData} index={rowID} updateConnect={this.updateConnect} />
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

  	Apis.reset(connectUrl, true).init_promise
  	.then(()=> {
  		console.log("++++++[Node.js]::updateConnect - apis::reset - ", this);

  	});

  	this.props.nodeConnect(null, connectUrl);
  	this.props.updateRpcConnectionStatus('reset', connectUrl);
  	//if(this.props.updateRpcConnectionStatus)
  	//	this.props.updateRpcConnectionStatus('open');
  }

  getNodes = () => {
    const { nodeList } = this.state;
    return nodeList;
  };

  keyExtractor = (item) => {
  	return item.url;
  }


 
	render() {

		const { url, status, navigation } = this.props;
		const { searchStart, searchFocus, query } = this.state;

		console.log("=====[Node.js]::render - node - ", query, url, status, navigation.state.params);
		let showNodeList = nodeList.map((item, index) => {
			// console.log("=====[Node.js]::render - showNodeList - ", item, index);
			return <SLText key={index}>{index}: {item.url} - {item.location}</SLText>
		});

		let showStatusList = this.state.statusList.map((item, index) => {
			return <SLText key={index}>Connect to Node-{url}, status-{item}</SLText>;
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
							<Text style={{textAlign: 'center'}}>区块节点信息：</Text>
						</SearchContainer>
					</SearchBarWrapper>
				</Header>


				<ListContainer>
					<List>
			      <ListView
			        renderRow={this.renderRow}
			        dataSource={this.state.dataSource}
			      />
			    </List>
			    { showStatusList }
				</ListContainer>
			</ViewContainer>
		);
	}
}


const mapStateToProps = (state) => ({
	nodeList: state.app.nodesApi,
	url: state.app.nodeStatus.url,
	status: state.app.nodeStatus.status,
});

export const NodeScreen = connect(mapStateToProps, {
	nodeConnect,
	updateRpcConnectionStatus,
})(Node);