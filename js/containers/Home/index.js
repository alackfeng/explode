import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
} from 'react-native';

import styles from './styles';
import { TokenFun } from './components/TokenFun';
import { LoadingScreen, ViewContainer } from '../../components';

const Home = () => {
  return (
    <ViewContainer>
      <TokenFun />
    </ViewContainer>
  );
};

Home.contextTypes = {
  store: PropTypes.object,
};

export default Home;
