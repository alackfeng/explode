import React from 'react';
import PropTypes from 'prop-types';
import RNVIcon from 'react-native-vector-icons/MaterialIcons';

import styles from './styles';

export const Icon = ({ name, size, color, style }) => {
  return (
    <RNVIcon
      name={name}
      size={size || 24}
      color={color || '#000'}
      style={[styles.icon, style]}
    />
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.any,
};
