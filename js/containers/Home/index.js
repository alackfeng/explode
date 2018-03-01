import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
} from 'react-native';

import styles from './styles';
import Random from './components/Random';
import { LoadingScreen } from "../../components";

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        ASSETFUN
      </Text>
      <Text style={[styles.instructions, {fontSize: 50}]}>
        为了您的健康少玩手机，多看书，骚年，LOL
      </Text>
    </View>
  );
};

Home.contextTypes = {
  store: PropTypes.object,
};

export default Home;
