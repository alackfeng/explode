
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Dimensions, ListView, Clipboard, CameraRoll } from "react-native";
import { Colors, SCREEN_WIDTH, translate, locale, switchLanguage } from "../../../libs";
import { Icon, Button, Input, Overlay, CheckBox } from 'react-native-elements';

import { ViewContainer, StyleSheet } from "../../../components";
import { setAppLocale } from "../../../actions";
import SplashTile from "../../../components/SplashTile";

import QRCode from 'react-native-qrcode-svg';
import RNFS from "react-native-fs";

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
   	this.svg.toDataURL((data) => {
   		//alert(RNFS.DocumentDirectoryPath);
   		RNFS.writeFile(RNFS.DocumentDirectoryPath+"/tokenpii-qrcode.png", data, 'base64')
   		  .then((success) => {
   		  	//alert("save ", RNFS.DocumentDirectoryPath, success);
   			  return CameraRoll.saveToCameraRoll(RNFS.DocumentDirectoryPath+"/tokenpii-qrcode.png", 'photo')
   		  })
   		  .then(() => {
   			  alert(translate('tips.card.saved', locale));
   		  })
   	})
  }

  _setClipboardContent = () => {
  	console.log("_setClipboardContent");

  	Clipboard.setString(this.props.currentAccount);
  	alert(translate('tips.card.copyed', locale));
  }

	render() {

		const { currentAccount } = this.props;
		if(TRACE) console.info("=====[Language.js]::render - : currentAccount >  ", currentAccount);


		const qrValue = "tokenpii://" + currentAccount;
		return (
			<ViewContainer>
        <SplashTile
          containerStyle={styles.userContainer}
          imageSrc={require('../images/background.jpg')}
          imageContainerStyle={styles.image}
          title={currentAccount ? currentAccount : translate('center.welcome', locale)}
          titleStyle={styles.title}
          featured={true} 
          height={150}
          icon={{source: require('../images/tokenpii.png')}}
          iconStyle={styles.icon} 
          iconContainerStyle={{marginTop: 50}}      
        >
        </SplashTile>

        <View style={styles.container}>
          <View style={styles.qrcodeContainer}>
            <QRCode 
              value={qrValue}
              size={180}
              logo={require("../images/tokenpii.png")}
              logoWidth= {180 * 0.2}
              logoBackgroundColor='#4871db'
              getRef={(c) => (this.svg = c)}

            />
          </View>
          <View style={styles.buttonContainer} >
            <Button
              text ={ translate('tips.scan.copy', locale) }
              buttonStyle={styles.buttonStyle}
              containerStyle={{marginVertical: 10, backgroundColor: 'transparent', flex: 1, justifyContent: 'flex-end'}}
              textStyle={{fontWeight: 'bold', fontSize: 14, color: '#2153A2'}}
              onPress={this._setClipboardContent}
            />
            <Button
              text ={ translate('tips.scan.savephoto', locale) }
              buttonStyle={styles.buttonStyle}
              containerStyle={{marginVertical: 10, backgroundColor: 'transparent', flex: 1, justifyContent: 'flex-start'}}
              textStyle={{fontWeight: 'bold', fontSize: 14, color: '#2153A2'}}
              onPress={this._saveQrToDisk}
            />
            <View style={{flex: 0.5}} />
          </View>
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
    flex: 1
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
    marginTop: 10,
  },
  buttonStyle: {
    height: 40, 
    width: 200, 
    backgroundColor: 'transparent', 
    borderWidth: 1, 
    borderColor: '#DFDFDF', 
    borderRadius: 5,
    elevation: 0,
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
    backgroundColor: 'transparent', 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    flex: 1,
    marginTop: 0,
  }
})

const mapStateToProps = (state) => ({
  language: state.app.locale,
  currentAccount: state.app.currentAccount,
});

export const CardScreen = connect(mapStateToProps, {
	setAppLocale,
})(Card);
