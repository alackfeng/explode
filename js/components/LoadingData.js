import React, { Component } from 'react';
import { Animated, View, ActivityIndicator, Text } from 'react-native';

import { Colors as colors } from "../libs/Colors";
import { loadingAnimation, SCREEN_WIDTH, SCREEN_HEIGHT } from "../libs/help";

import { ViewContainer, StyleSheet } from "../components";


const styles = StyleSheet.create({

});

export class LoadingData extends Component {
  constructor() {
    super();
    this.state = {
      animating: true,
    };
  }

  render() {

    const { message, size } = this.props;
    
    return (
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15, 
          backgroundColor: 'transparent'}}>
          <ActivityIndicator animating={this.state.animating} size={size || "large"} color={colors.salmon} />
          <Text style={{textAlign: 'center', color: 'red', marginLeft: 10}} numberOfLines={10}>{message}</Text>
        </View>
    );
  }
}
