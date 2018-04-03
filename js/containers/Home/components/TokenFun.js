import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { ViewContainer } from '../../../components';
import { Colors, SCREEN_WIDTH, SCREEN_HEIGTH, normalize, translate, locale } from '../../../libs';

export class TokenFun extends Component {
  render() {
    return (
      <ViewContainer>
        <ScrollView>
          <View style={styles.titleContainer}>
            <Image
              style={styles.titleImage}
              source={require('../images/tokenfun.jpg')}
            />
          </View>

          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>{ translate('home.summary.producttitle', locale) }</Text>
            <Text style={styles.featuresSubTitle}>{ translate('home.summary.productsubs', locale) }</Text>
            <Image
              style={styles.featuresImage}
              source={require('../images/iphone-features-left.png')}
            />
          </View>
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>{ translate('home.summary.safifytitle', locale) }</Text>
            <Text style={styles.featuresSubTitle}>{ translate('home.summary.safifysubs', locale) }</Text>
            <Image
              style={styles.featuresImage}
              source={require('../images/iphone-features-right.png')}
            />
          </View>
          <View style={styles.features1Container}>
            <Text style={styles.featuresTitle}>{ translate('home.summary.assettitle', locale) }</Text>
            <Text style={styles.featuresSubTitle}>{ translate('home.summary.assetsubs', locale) }</Text>
          </View>
        </ScrollView>
      </ViewContainer>
    );
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: '#419bf9',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleImage: {
    width: SCREEN_WIDTH,
    height: 150,
  },
  titleSummary: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  featuresContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  featuresTitle: {
    color: '#284159',
    fontSize: 14,
  },
  featuresSubTitle: {
    color: '#666666',
    fontSize: 12,
    marginTop: 5,
  },
  featuresImage: {
    width: 180,
    height: 114,
    marginTop: 50,
    marginBottom: 30,
  },
  features1Container: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 50,
  },

});
