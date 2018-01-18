import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import I18n from 'react-native-i18n';
import { translate, locale } from "../../libs";

import styles from './styles';

const Translation = () => {
  return (
    <View style={styles.container}>
      <Text>Translated greeting:</Text>
      <Text>{translate('greeting', locale)}</Text>
    </View>
  );
};

export default Translation;
