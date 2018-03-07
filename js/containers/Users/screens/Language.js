
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, ScrollView, Dimensions, ListView, } from "react-native";
import { Colors, SCREEN_WIDTH, translate, locale, switchLanguage } from "../../../libs";
import { Icon, Button, Input, Overlay, CheckBox } from 'react-native-elements';

import { ViewContainer, StyleSheet } from "../../../components";
import { setAppLocale } from "../../../actions";

const TRACE = true;

const languageLists = [
	{
    code: 'en',
    emojiCode: ':flag-us:',
    name: 'English',
    checked: false,
  },
  {
    code: 'zh-cn',
    emojiCode: ':flag-cn:',
    name: '简体中文',
    checked: false,
  },
  {
    code: 'zh-tw',
    emojiCode: ':flag-tw:',
    name: '正體中文',
    checked: false,
  },
];


class LanguageItem extends Component {

	constructor(props) {
		super(props);

		this.onChangeChecked = this.onChangeChecked.bind(this);

	}

	onChangeChecked = () => {

		const { item, index, checked, onSwitch } = this.props;

		if(onSwitch)
			onSwitch(index);
	}

	render() {
		const { item, index, checked } = this.props;

		const title = `${item.name} - ${item.code} - ${index} - ${checked}`;
		return (
			<View style={styles.container}>
				<CheckBox
				  title={title}
				  right
				  containerStyle={styles.container}
				  iconRight
				  iconType='material'
				  checkedIcon='radio-button-checked'
				  uncheckedIcon='radio-button-unchecked'
				  checkedColor='red'
				  uncheckedColor='black'
				  checked={ checked || false}
				  onPress={this.onChangeChecked}
				/>
			</View>
		);
	}
}

class Language extends Component {

	constructor(props) {
		super(props);


		let checked = 0;
		if(props.language) {
			languageLists.map((item, index) => {
				if(item.code === props.language) {
					item.checked = true;
					checked = index;
				} else {
					item.checked = false;
				}
			});
		} else {
			console.error("[Language.js]::constructor - why not init language!!!");
		}

		this.state = {
			languageLists: languageLists,
			checked: checked,
		}
		this.onSwitchLanguage = this.onSwitchLanguage.bind(this);

	}


	componentWillUnmount() {

  }

  componentWillMount() {
    
  }

  onSwitchLanguage = (index) => {

  	const { languageLists } = this.state;

  	index = (languageLists.length > index) ? index : 0;

  	languageLists[index].checked = true;
  	languageLists[this.state.checked].checked = false;
  	this.setState({languageLists, checked: index});

  	// change locale
  	if(switchLanguage)
  		switchLanguage(languageLists[index].code); //

  	// save reducer
  	if(this.props.setAppLocale)
  		this.props.setAppLocale(languageLists[index].code);
  }


	render() {

		const { language } = this.props;
		const { languageLists } = this.state;
		if(TRACE) console.info("=====[Language.js]::render - : language locale >  ", language);


		return (
			<ViewContainer>
				{ 
					languageLists && 
					languageLists.map((item, index) => {
						return <LanguageItem item={item} index={index} checked={item.checked} onSwitch={this.onSwitchLanguage} />
					})
				}
			</ViewContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'space-around',
		borderWidth: 1,
		margin: 0,
		backgroundColor: Colors.white,
	}
})

const mapStateToProps = (state) => ({
  language: state.app.locale,
});

export const LanguageScreen = connect(mapStateToProps, {
	setAppLocale,
})(Language);
