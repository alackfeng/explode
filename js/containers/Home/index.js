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
        Welcome to React Native, OK
      </Text>
      <Text style={styles.instructions}>
        To get started, edit index.*.js
      </Text>
      <Random />
      <LoadingScreen />
    </View>
  );
};

Home.contextTypes = {
  store: PropTypes.object,
};

export default Home;
