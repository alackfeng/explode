
import React, { Component } from 'react';
import styled from 'styled-components/native';
import { connect } from 'react-redux';

import { Dimensions, View, ScrollView, Image, TouchableHighlight, ListView, Linking, Alert } from 'react-native';
import { Button, Text, Card, ButtonGroup, Tile, Col, Row, Icon, List, ListItem, Avatar, Badge } from 'react-native-elements';

import { ViewContainer, StyleSheet } from '../../../components';
import { Colors } from '../../../libs/Colors';
import { resetNavigationTo, SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../libs/help';
import { translate, locale } from '../../../libs';

import { ChainStore, FetchChain } from 'assetfunjs/es';
import { appUserQuit, triggerUser } from '../../../actions';

const { unlock: sendUnLock } = triggerUser;

import SplashTile from '../../../components/SplashTile';
import { VersionInfo } from './Version';


const TRACE = false;

const listMenu = [
  {
    title: 'Nodes',
    icon: 'public',
    subtitle: 'center.subnav.nodesetting',
    nav: {
      title: 'center.nodes',
    },
  },
  /* {
		title: 'History',
		icon: 'receipt',
		subtitle: 'center.subnav.transrecords',
		nav: true,
	}, */
  {
    title: 'Card',
    icon: 'language',
    subtitle: 'center.subnav.card',
    nav: true,
  },

  // {
  //	title: 'Language',
  //	icon: 'language',
  //	subtitle: 'center.subnav.language',
  //	nav: true,
  // }
];


class Center extends Component {
  constructor(props) {
    super(props);

    this.onPressItem 	= this.onPressItem.bind(this);
    this.onPressQuit	= this.onPressQuit.bind(this);
  }

  onPressItem(item, navigation) {
    if (TRACE) console.log('=====[Center.js]::onPressItem - list item - : ', item);

    if (item.nav && navigation && navigation.navigate) {
      if (TRACE) console.log('=====[Center.js]::onPressItem - list item to navigation : ', item.title, item.nav);

      if (item.nav === true) {
        navigation.navigate(item.title);
      }
      else {
        navigation.navigate(item.title, item.nav);
      }
    }
  }

  onPressQuit() {
    const { navigation, currentAccount } = this.props;

    if (TRACE) console.log('=====[Center.js]::onPressQuit -  - >:', currentAccount);
    if (currentAccount) {
      // 退出时去掉内存锁
      this.props.sendUnLock(currentAccount, {
	      username: currentAccount,
	      type: 'lock',
	    });

	    this.props.appUserQuit(currentAccount);
    }

    if (navigation && navigation.navigate) {
      resetNavigationTo('Splash', navigation);
    }
  }

  render() {
    const { navigation, currentAccount } = this.props;

    if (TRACE) console.log('=====[Center.js]::render - navigation - >:', currentAccount);

    	return (
      <ViewContainer>
        <SplashTile
          containerStyle={styles.userContainer}
          imageSrc={require('../images/background.jpg')}
          imageContainerStyle={styles.image}
          title={currentAccount || translate('center.welcome', locale)}
          titleStyle={styles.title}
          featured
          height={150}
          icon={{ source: require('../images/tokenfun.png') }}
          iconStyle={styles.icon}
          iconContainerStyle={{ marginTop: 50 }}
        />

        <View style={styles.listContainer} >
          <List>
            {listMenu.map((l, i) => (
              <ListItem
                wrapperStyle={{ border: 0 }}
                containerStyle={{ borderWidth: 0, borderColor: '#DFDFDF', borderBottomWidth: 0.5 }}
                leftIcon={{ name: l.icon, style: { color: Colors.menuBlue } }}
                key={i}
                title={translate(l.subtitle, locale)}
                titleStyle={{ color: Colors.titleGray }}
                onPress={() => this.onPressItem(l, navigation)}
              />
    				))}
            <VersionInfo />
          </List>
        </View>
        <View style={styles.logoutContainer}>
          <Button
            text={translate('center.quit', locale)}
            textStyle={{ color: Colors.quitGray }}
            buttonStyle={styles.buttonStyle}
            containerStyle={{ marginTop: 0, height: 100 }}
            onPress={this.onPressQuit}
          />
        </View>
      </ViewContainer>
    );
  }
}

const styles = StyleSheet.create({
  userContainer: {
    backgroundColor: Colors.menuBlue,
    height: 150,
    marginTop: 0,
  },
  listContainer: {
    // flex: 1,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  logoutContainer: {
    // flex: 1,
    height: 100,
    backgroundColor: 'transparent',
    marginBottom: 30,
  },

  heading: {
    color: 'white',
    marginTop: 10,
    fontSize: 22,
    textAlign: 'center',
  },
  buttonStyle: {
    marginBottom: 0,
    height: 50,
    width: SCREEN_WIDTH,
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderBottomColor: Colors.borderGray,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGray,
    borderRadius: 0,
    elevation: 0,
    zIndex: 10,
  },
  image: {
    width: SCREEN_WIDTH,
    height: 150,
  },
  icon: {
    width: 60,
    height: 60,
  },
  title: {
    color: 'white',
    marginTop: 10,
  },

});

const mapStateToProps = state => ({
  currentAccount: state.app.currentAccount,
});

export const CenterScreen = connect(mapStateToProps, {
  appUserQuit,
  sendUnLock,
})(Center);

