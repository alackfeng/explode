

import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';

import { Tile, Button, Text, Icon } from 'react-native-elements';

import { SCREEN_WIDTH, SCREEN_HEIGHT, translate, locale } from '../../libs';
import Input from '../../components/RNWInput';


export class AccountPasswordInput extends Component {
  render() {
    const {
      confirmed, username, password, confirmPass, error, errorPass, errorConfirm,
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.overlay}>
          <Input
            containerStyle={styles.inputConatiner}
            leftText={translate('tips.register.inputname', locale)}
            leftTextContainerStyle={{color: 'white'}}
            inputStyle={{ marginLeft: 10, color: 'white', fontSize: 15 }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardAppearance="light"
            keyboardType="email-address"
            returnKeyType="next"
            ref={input => this.usernameInput = input}
            onSubmitEditing={() => this.passwordInput.focus()}
            blurOnSubmit={false}
            displayError={!!error}
            errorMessage={error || ''}
            value={username || ''}
            onChangeText={text => this.props.onChange(text)}
            selectionColor="white"
          />
        </View>
        <View style={styles.overlay}>
          <Input
            containerStyle={styles.inputConatiner}
            leftText={translate('tips.register.inputpass', locale)}
            leftTextContainerStyle={{color: 'white'}}
            inputStyle={{ marginLeft: 10, color: 'white', fontSize: 15 }}
            autoCapitalize="none"
            keyboardAppearance="light"
            secureTextEntry
            autoCorrect={false}
            keyboardType="default"
            returnKeyType={confirmed ? 'next' : 'done'}
            ref={input => this.passwordInput = input}
            onSubmitEditing={confirmed ? () => this.confirmPasswordInput.focus() : null}
            blurOnSubmit={!confirmed}
            displayError={!!errorPass}
            errorMessage={errorPass || ''}
            value={password || ''}
            onChangeText={text => this.props.onChangePass(text)}
            selectionColor="white"
          />
        </View>
        {confirmed &&
        <View style={styles.overlay}>
          <Input
            containerStyle={styles.inputConatiner}
            leftText={translate('tips.register.inputconf', locale)}
            leftTextContainerStyle={{color: 'white'}}
            inputStyle={{ marginLeft: 10, color: 'white', fontSize: 15 }}
            autoCapitalize="none"
            keyboardAppearance="light"
            secureTextEntry
            autoCorrect={false}
            keyboardType="default"
            returnKeyType="done"
            ref={input => this.confirmPasswordInput = input}
            blurOnSubmit
            displayError={!!errorConfirm}
            errorMessage={errorConfirm || ''}
            value={confirmPass || ''}
            onChangeText={text => this.props.onChangeConfirm(text)}
            selectionColor="white"
          />
        </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  inputConatiner: {
    borderRadius: 0,
    borderBottomWidth: 1,
    borderColor: 'white',
    height: 50,
    width: SCREEN_WIDTH * 0.8,
    marginVertical: 0,
  },
});

