
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text, ScrollView, Dimensions, ListView, Clipboard, CameraRoll, Linking, Alert, Platform } from 'react-native';
import { Colors, SCREEN_WIDTH, translate, locale, switchLanguage } from '../../../libs';
import { Icon, Button, Input, Overlay, CheckBox, ListItem } from 'react-native-elements';

import { ViewContainer, StyleSheet } from '../../../components';
import { setAppLocale } from '../../../actions';
import SplashTile from '../../../components/SplashTile';
import { update as UpdateVer } from '../../../env';

const TRACE = true;

export class VersionInfo extends Component {
  constructor(props) {
    super(props);


    let version = Platform.OS === 'web' ? UpdateVer.version.web :
      (Platform.OS === 'android' ? UpdateVer.version.android : UpdateVer.version.ios);

    const buildVersion = version.split('-')[1];
    version = version.split('-')[0];

    this.state = {
      buildVersion: version || '1.0',
      buildBuildVersion: buildVersion || '1',
      buildShortcutUrl: '',
      buildUpdateDescription: '',
      downloadURL: '',
      needUpdate: false,
    };

    this.check = this.check.bind(this);
  }

  componentDidMount() {
    // update
    this.fetchAppVersion(true);
  }

  fetchAppVersion = (quiet = false) => {
    if (TRACE) console.log('=====[Center.js]::VersionInfo::check - fetch .');

    if (Platform.OS === 'web') {
      return;
    }

    const bodyString = Platform.OS === 'android'
      ? `_api_key=${UpdateVer.androidKey.api}&appKey=${UpdateVer.androidKey.app}`
      : `_api_key=${UpdateVer.iosKey.api}&appKey=${UpdateVer.iosKey.app}`;

    const _This = this;

    fetch(UpdateVer.url || 'https://www.pgyer.com/apiv2/app/check', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body: bodyString,
    }).then((res) => {
      return res.json();
    }).then((json) => {


      if (json.data) {
        const strToNum = ver => (ver.split('.')[0] * 10000 + ver.split('.')[1] * 1);

        const version = strToNum(json.data.buildVersion);
        const localVersion = strToNum(_This.state.buildVersion);

        if (version > localVersion
          || (version === localVersion && Number(json.data.buildBuildVersion) > Number(_This.state.buildBuildVersion))) {
          _This.setState({ needUpdate: true });
        }
        else {
          return;
        }


        if (quiet) {
          return;
        }
        // this.setState(json.data);
        const url = json.data.buildShortcutUrl;
        Linking.canOpenURL(json.data.buildShortcutUrl)
          .then((supported) => {
            if (!supported) {
              console.log(`Can't handle url: ${url}`);
              Alert.alert(
                translate('tips.comm.tip', locale),
                `Can't handle url: ${url}`,
                [
                  { text: 'OK', onPress: () => {} },
                ]
              );
            }
            else {
              Alert.alert(
                translate('tips.comm.tip', locale),
                json.data.buildUpdateDescription || `Open?: ${url}`,
                [
                  { text: translate('tips.comm.cancel', locale), onPress: () => {} },
                  {
                    text: translate('tips.comm.confirm', locale),
                    onPress: () => {
                      Linking.openURL(url);
                    },
                  },
                ]
              );
            }
          }).catch((err) => {
            console.log('An error occurred', err);
            Alert.alert(
              translate('tips.comm.tip', locale),
              `An error occurred: ${err}`,
              [
                { text: translate('tips.comm.confirm', locale), onPress: () => {} },
              ]
            );
          });
      }
    }).catch((err) => {
      alert(err);
    });
  }

  check(item, navigation) {
    if (TRACE) console.log('=====[Center.js]::VersionInfo::check - list item - : ', item);

    this.fetchAppVersion();
  }

  render() {
    const { navigation } = this.props;
    const { needUpdate } = this.state;

    const l = {
      title: 'Scan',
      icon: 'public',
      subtitle: 'center.subnav.vers',
      nav: true,
    };

    const version = `${this.state.buildVersion}.${this.state.buildBuildVersion}`;

    return (
      <ListItem
        wrapperStyle={{ border: 0 }}
        containerStyle={{ borderWidth: 0, borderColor: '#DFDFDF', borderBottomWidth: 0.5 }}
        leftIcon={{ name: l.icon, style: { color: Colors.menuBlue } }}
        // key={i}
        title={translate(l.subtitle, locale)}
        titleStyle={{ color: Colors.titleGray }}
        onPress={() => this.check(l, navigation)}
        rightTitle={version || '1.0.0'}
        rightIcon={{ name: needUpdate ? 'update' : 'chevron-right', style: { color: needUpdate ? 'red' : '#bdc6cf' } }}
      />
    );
  }
}


class Version extends Component {
  render() {
    const { currentAccount } = this.props;
    if (TRACE) console.info('=====[Version.js]::render - : currentAccount >  ', currentAccount);

    return (
      <ViewContainer>
        <View>
          <Text>Version</Text>
        </View>
      </ViewContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    margin: 20,
    backgroundColor: 'transparent',
    flex: 1,
  },
});

const mapStateToProps = state => ({
  currentAccount: state.app.currentAccount,
});

export const VersionScreen = connect(mapStateToProps, {
})(Version);
