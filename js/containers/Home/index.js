import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
} from 'react-native';

import styles from './styles';
import { TokenPii } from './components/TokenPii';
import { LoadingScreen, ViewContainer } from "../../components";

const Home = () => {
  return (
    <ViewContainer>
      <TokenPii />
    </ViewContainer>
  );
};

Home.contextTypes = {
  store: PropTypes.object,
};

export default Home;
