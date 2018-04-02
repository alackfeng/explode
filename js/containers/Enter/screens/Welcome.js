import React, { Component } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';

import { ViewContainer, StyleSheet } from '../../../components';
import { Colors as colors, normalize, translate, locale } from '../../../libs';


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.coolGray,
  },
  welcomeMessage: {
    color: colors.white,
    paddingBottom: 20,
    fontSize: normalize(24),
  },
  menu: {
    web: {
      margin: 20,
      paddingBottom: 0,
      backgroundColor: '#5f9ea0',
    },
    margin: 0,
    paddingBottom: 20,
    backgroundColor: '#5f9ea0',
  },
  indicator: {
    color: '#000',
  },
});

class Welcome extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <ViewContainer>
        <View style={styles.container}>
          <Text style={styles.welcomeMessage} >{translate('comm.welcome', locale)}</Text>
          <ActivityIndicator animating color="red" />
          <View style={styles.menu}>
            <Button
              title="Enter to Main Page"
              onPress={() => navigation.navigate('Main')}
            />
          </View>
        </View>
      </ViewContainer>
    );
  }
}

export const WelcomeScreen = Welcome;
