
import React, { Component } from "react";
import PropTypes from 'prop-types';
import { View, Text } from "react-native";
import Modal from "react-native-modal";
import { Colors, resetNavigationTo, SCREEN_WIDTH, SCREEN_HEIGHT } from "../libs";

import { Button } from "react-native-elements";

import { ViewContainer, StyleSheet } from "../components";

const modalTop = SCREEN_HEIGHT / 2;
const modalLeft = SCREEN_WIDTH / 2;

const styles = StyleSheet.create({
  container: {
  	position: 'absolute',
  	zIndex: 10,
  	backgroundColor: 'rgba(0, 0, 0, 0.1)',
  	height: SCREEN_HEIGHT,
  	width: SCREEN_WIDTH
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContent: {
    backgroundColor: "white",
    position: 'absolute',
    height: SCREEN_HEIGHT*0.5,
    width: SCREEN_WIDTH*0.8,
    top: modalTop,
    marginTop: -SCREEN_HEIGHT*0.5*0.5,
    left: modalLeft,
    marginLeft: -SCREEN_WIDTH*0.8*0.5,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  }
});



class TransactionConfirm extends Component {


  props: {
    onChange: PropTypes.func.isRequired,
  }

	constructor() {
		super();

		this.state = {
			isLoading: true
		};

    this.onCancel = this.onCancel.bind(this);
	}

  onConfirm = () => {
    alert('this.props.onChange(true)');
  }

  onCancel = () => {
    this.props.onChange(false);
  }

	render() {

    const { onChange } = this.props;

		return (
		<View style={styles.container}>
			{this.state.isLoading && (
			<Modal 
				style={styles.modalContent}
				isVisible={true}
				transparent
			>
				<View style={{flex: 1}}>
          <Text style={{textAlign: 'center'}}>I am the modal content!</Text>    
        </View>
				<View style={{flexDirection: 'row'}}>
          <Button
		        text="Confirm"
		        clear
		        textStyle={{color: 'rgba(78, 116, 289, 1)'}}
		        containerStyle={styles.button}
		        onPress={this.onConfirm}
		      /> 
	        <Button
		        text="Cancel"
		        clear
		        textStyle={{color: 'rgba(78, 116, 289, 1)'}}
		        containerStyle={styles.button}
		        onPress={this.onCancel}
		      />
		    </View> 
	      
      </Modal>)}
    </View>
		);
	}
}

export const TransactionConfirmModal = TransactionConfirm;