import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { userRegister } from "../actions";

import { View, Text, TextInput, Button, } from "react-native";
import { ViewContainer, Colors, Normalize, StyleSheet } from "../../../components";

const mapStateToProps = state => ({
  isAuthenticated: state.enter.isAuthenticated,
  username: state.enter.username,
});

const mapDispatchToProps = dispatch => 
  bindActionCreators(
    {
      userRegister
    },
    dispatch
  );

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  menu: {
  	margin: 10,
  	padding: 10
  },
  username: {
    height: 35,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: Colors.bianca,
    marginTop: 10,
    borderRadius: 5,
  },
  password: {
    height: 35,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: Colors.bianca,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
  }
});

class Register extends Component {

  props: {
    isAuthenticated: boolean,
    userRegister: Function,
    navigation: Object,
    username: string,
  }
  state: {
    username: string,
    password: string,
  }

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  componentDiDMount() {
    const { isAuthenticated, navigation } = this.props;
    console.log("=====[Register.js]::componentDiDMount - ", isAuthenticated);
    if(isAuthenticated) {
      navigation.navigate('Login');
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    console.log("=====[Register.js]::shouldComponentUpdate - isAuthenticated - ", nextProps.isAuthenticated);
    return true;
  }

  userRegister = (e) => {
    
    const { username, password } = this.state;
    console.log("=====[Register.js]::userRegister - ", username, password);
    e.preventDefault();
    this.props.userRegister(username, password);
  }

	render() {

		const { isAuthenticated, navigation } = this.props;
    console.log("=====[Register.js]::render - ", isAuthenticated);

		return (
			<View style={styles.container} >
				<Text style={styles.welcome} >Reigster Aftrade Account</Text>
        <TextInput style={styles.username}
          placeholder="Type a Username"
          autoCapitalize='none'
          autoCorrect={false}
          autoFocus={true}
          value={this.state.username || this.props.username} 
          onChangeText={(text) => this.setState({ username: text })}
        />
        <TextInput style={styles.password}
          placeholder="Type a Password"
          autoCapitalize='none'
          autoCorrect={false}
          autoFocus={false}
          secureTextEntry={true}
          value={this.state.password}
          onChangeText={(text) => this.setState({ password: text })}
        />
				<Button style={styles.menu} title="Register" 
					onPress={(e) => this.userRegister(e)}
				/>
			</View>
		);
	}
}

export const RegisterScreen = connect(mapStateToProps, mapDispatchToProps)(Register);
