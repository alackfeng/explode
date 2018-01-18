
import React, { Component } from "react";
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Dimensions, Text, View, Modal, TouchableHighlight, Alert, TouchableOpacity } from "react-native";
import { init, createAccount } from "../users.actions";
import { ChainStore, FetchChain } from "assetfunjs/es";

import { ViewContainer, Colors, Normalize, StyleSheet } from "../../../components";


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const AUTOFONT = (size) => (0.2*size);
const AUTOH = (size) => (0.5*size);
const SLView = styled.View`
	margin-top: 50;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SLButton = styled.TouchableHighlight`
  height: 35;
  width: 100;
`;

const SLViewLock = styled(SLView)`
	flex: 1;
	backgroundColor: 'rgba(0, 0, 0, 0.25)'; 
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	justify-content: center;
	align-items: center;
`;

const SLTextInput = styled.TextInput`
  height: 35;
  border-color: gray;
  border-width: 2;
  background-color: ${Colors.bianca};
  border-radius: 5;
`;

const SLViewSubmit = styled(View)`
  flex: 1;
  flex-direction: row;
  margin-top: 10;
  justify-content: center;
`;

class Lock extends Component {

	constructor(props) {
		super(props);

		this.state = {
			modalVisible: false,
			password: null,
		};
	}

	setModalVisible = (visible) => {
		console.log("+++++[Lock.js]::setModalVisible - ", visible);
		this.setState({modalVisible: visible});
	}

	unLock = () => {
		console.log("+++++[Lock.js]::unLock - ", this.state.password);

	}

	render() {

		const { isLocked } = this.props;

		if(!isLocked) {
			return null;
		}

		return (
			<SLView>
				<Modal
					animationType={"slide"}
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={()=>{alert("Modal has been closed.")}}
					//onShow={()=>{Alert.alert("Modal has been Show.")}}
				>
					<TouchableOpacity style={{flex:1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} activeOpacity={0.8} onPress={()=>{this.setModalVisible(false)}}>
						<SLViewLock>
							<View style={[{backgroundColor: 'red',justifyContent: 'center',alignItems: 'center'},{width: SCREEN_WIDTH * 0.4, height: SCREEN_HEIGHT * 0.3}]}>
								<Text>Hello Lock</Text>
								<SLTextInput 
									placeholder="Type a Username"
			            autoCapitalize='none'
			            autoCorrect={false}
			            autoFocus={true}
			            value={this.state.password || ''} 
			            onChangeText={(text) => this.setState({ password: text })}
								/>
							<SLViewSubmit>
								<TouchableOpacity activeOpacity={0.5} onPress={()=>{this.unLock()}}>  
                	<Text style={{fontSize:AUTOFONT(70), color:'black', margin:AUTOH(30)}}>unLock</Text>  
            		</TouchableOpacity>
            		<TouchableOpacity activeOpacity={0.5} onPress={()=>{this.setModalVisible(false)}}>  
                	<Text style={{fontSize:AUTOFONT(70), color:'black',margin:AUTOH(30)}}>Cancel</Text>  
            		</TouchableOpacity>
            	</SLViewSubmit>
							</View>
						</SLViewLock>
					</TouchableOpacity>
				</Modal>

				<SLButton
					onPress={()=>{this.setModalVisible(true)}}
				>
					<Text>Show Lock</Text>
				</SLButton>
			</SLView>
		);
	}
}

const mapStateToProps = (state) => ({
  inited: state.users.inited,
  isLocked: state.users.isLocked,
});

const mapDispatchToProps = dispatch => {
  return {
    init: bindActionCreators(init, dispatch),
    createAccount: bindActionCreators(createAccount, dispatch),
  };
}


export const LockScreen = connect(mapStateToProps, mapDispatchToProps)(Lock);
