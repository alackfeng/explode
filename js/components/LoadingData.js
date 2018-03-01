import React, { Component } from 'react';
import { Animated, View, ActivityIndicator, Text } from 'react-native';

import { Colors as colors } from "../libs/Colors";
import { loadingAnimation } from "../libs/help";

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

    const { message } = this.props;
    
    return (
      <ViewContainer>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
          <ActivityIndicator animating={this.state.animating} size="large" color={colors.salmon} />
          <Text style={{textAlign: 'center', color: 'red', marginLeft: 10}} numberOfLines={10}>{message}</Text>
        </View>
      </ViewContainer>
    );
  }
}
