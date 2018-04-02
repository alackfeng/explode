import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, ScrollView, Dimensions, Keyboard } from 'react-native';

import { Icon, Button, List, ListItem, Avatar } from 'react-native-elements';
import { ViewContainer, StyleSheet, AccountOBJ, AssetOBJ } from '../components';

import { Colors, resetNavigationTo, SCREEN_WIDTH, translate, locale } from '../libs';

const TimeAge = props => (
  <View style={styles.timeage}><Text style={styles.column}>{props.time}</Text></View>
);

export class TransferOP extends Component {
  render() {
    const { type, oper, time } = this.props;
    // console.log("[TransferOP.js]::render - >>>>>>>>>>>>> ", type, oper, time);

    const transfer_in_out = type ? require('./images/transferout.png') : require('./images/transferin.png');
    return (
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar
            source={transfer_in_out}
            onPress={() => console.log('Works!')}
            avatarStyle={styles.avatorStyle}
            containerStyle={{ backgroundColor: 'white', justifyContent: 'center' }}
            width={20}
            height={16.4}
          />
        </View>
        <View style={styles.itemContainer}>
          <AccountOBJ account={type ? oper[1].to : oper[1].from} />
          <TimeAge time={time} />
        </View>
        <View style={styles.assetContainer}>
          <AssetOBJ amount={oper[1].amount.amount} asset={oper[1].amount.asset_id} type={type} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 0,
    marginRight: 0,
    backgroundColor: 'white',
    borderWidth: 0.3,
    borderColor: '#DFDFDF',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    alignItems: 'center',
  },
  avatarContainer: {
    flex: 0.4,
    backgroundColor: 'white',
    height: 16.4,
    width: 20,
    marginLeft: 10,
    marginTop: 0,
    justifyContent: 'center',
  },
  avatorStyle: {
    backgroundColor: 'transparent',
    height: 16.4,
    width: 20,
  },
  itemContainer: {
    flex: 2.5,
    alignItems: 'flex-start',
    marginLeft: 5,
    height: 40,
  },
  assetContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 10,
    height: 40,
  },
  timeage: {
    justifyContent: 'flex-end',
    flex: 1,
    marginRight: 10,
  },
  column: {
    color: '#AEB4C0',
    fontSize: 12,
    textAlign: 'left',
  },
});
