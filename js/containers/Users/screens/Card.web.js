
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text, ScrollView, Dimensions, ListView, Clipboard, CameraRoll } from 'react-native';
import { Colors, SCREEN_WIDTH, translate, locale, switchLanguage } from '../../../libs';
import { Icon, Button, Input, Overlay, CheckBox } from 'react-native-elements';

import { ViewContainer, StyleSheet } from '../../../components';
import { setAppLocale } from '../../../actions';
import SplashTile from '../../../components/SplashTile';
import Toast, {DURATION} from 'react-native-easy-toast';

const QRCode = require('qrcode-react');



const TRACE = true;


class Card extends Component {
  constructor(props) {
    super(props);

    this._saveQrToDisk = this._saveQrToDisk.bind(this);
  }


  componentWillUnmount() {

  }

  componentWillMount() {

  }

  _saveQrToDisk() {
    this.refs.toast.show('not implement!');
   	// alert('not implement!!!');
  }
  
  _setClipboardContent = () => {
  	Clipboard.setString(this.props.currentAccount);
    this.refs.toast.show(translate('tips.card.copyed', locale));
  }


  render() {
    const { currentAccount } = this.props;
    if (TRACE) console.info('=====[Language.js]::render - : currentAccount >  ', currentAccount);


    const qrValue = `${currentAccount}@tokenfun.org`;
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

        <View style={styles.container}>
          <View style={styles.qrcodeContainer}>
            <QRCode
              value={qrValue}
              size={180}
              logo={require('../images/tokenfun.png')}
              logoWidth={180 * 0.2}
              logoBackgroundColor="red"
              getRef={c => (this.svg = c)}
            />
          </View>
          <View style={{ marginTop: 20 }} ><Button
            text={translate('tips.scan.copy', locale)}
            ref={input => this.commitInput = input}
            buttonStyle={styles.buttonStyle}
            containerStyle={{ marginVertical: 10 }}
            textStyle={{ fontWeight: 'bold', fontSize: 16, color: '#2153A2' }}
            onPress={this._setClipboardContent}
          />
            <Button
              text={translate('tips.scan.savephoto', locale)}
              ref={input => this.commitInput = input}
              buttonStyle={styles.buttonStyle}
              containerStyle={{ marginVertical: 10 }}
              textStyle={{ fontWeight: 'bold', fontSize: 16, color: '#2153A2' }}
              onPress={this._saveQrToDisk}
            />
          </View>
        </View>
        <Toast ref="toast"/>
      </ViewContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    margin: 40,
    backgroundColor: 'transparent',
  },
  userContainer: {
    backgroundColor: Colors.menuBlue,
    height: 120,
    marginTop: 0,
  },
  image: {
    width: SCREEN_WIDTH,
    height: 120,
  },
  icon: {
    width: 50,
    height: 50,
  },
  title: {
    color: 'white',
    marginTop: 5,
  },
  buttonStyle: {
    height: 40,
    width: 200,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DFDFDF',
    borderRadius: 5,
  },
  qrcodeContainer: {
  	backgroundColor: 'white',
  	justifyContent: 'center',
  	alignItems: 'center',
  	flex: 1,
  	width: 200,
  	height: 200,
  },
  buttonContainer: {
  	backgroundColor: 'white',
  	justifyContent: 'center',
  	alignItems: 'center',
  	flex: 1,
  },
});

const mapStateToProps = state => ({
  language: state.app.locale,
  currentAccount: state.app.currentAccount,
});

export const CardScreen = connect(mapStateToProps, {
  setAppLocale,
})(Card);
