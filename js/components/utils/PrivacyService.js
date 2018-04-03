

import React, { Component } from 'react';

import { StyleSheet, View, ScrollView, Platform } from 'react-native';

import { Button, Text, CheckBox, Overlay } from 'react-native-elements';

import { SCREEN_WIDTH, SCREEN_HEIGHT, translate, locale } from '../../libs';


class EmpowerTerm extends Component {


  getItem = (items) => {

    if(!items)
      return null;

    if(typeof items === 'object') {
      const keys = Object.keys(items);
      let itemsL = keys.map(key => {

        if(typeof items[key] === 'string')
          return <Text style={styles.empowerContentItem}>{ items[key] }</Text>;
        else 
          return <Text style={styles.empowerContentItem}>{ JSON.stringify(items[key]) }</Text>;;
      })
      return itemsL;
    }
    else {
      return <Text style={styles.empowerContentItem}>{ JSON.stringify(items) }</Text>;
    }
  }

  getSubTitle = () => {
    const { term } = this.props;

    if(!term || !term.subtitle) 
      return null;

    if(typeof term.subtitle === 'object') {
      const keys = Object.keys(term.subtitle);
      let subtitles = keys.map(key => {
        if(typeof term.subtitle[key] === 'object') {
          let subtitle = [];
          subtitle.push(<Text style={styles.empowerContentSubTitle}>{ term.subtitle[key].title }</Text>);
          subtitle.push(this.getItem(term.subtitle[key].items));
          return subtitle;
        }
        else {
          return <Text style={styles.empowerContentSubTitle}>{ term.subtitle[key] }</Text>;
        }
          
      })
      return subtitles;
    } else {
      return <Text style={styles.empowerContentSubTitle}>{ JSON.stringify(term.subtitle) }</Text>;
    }
    
  }

  getTitle = () => {
    const { term } = this.props;

    if(!term || !term.title)
      return null;
    return <Text style={styles.empowerContentTitle}>{ term.title }</Text>;
  }

  render() {

    // 三级组件
    return (
      <View style={{marginBottom: 10}}>
        { this.getTitle() }
        { this.getSubTitle() }        
      </View>
    );
  }
}

export class EmpowermentModel extends Component {
  onApproved = (agree) => {
    if (this.props.approved) {
      this.props.approved(agree);
    }
  }

  render() {
    const { open } = this.props;

    if (open) {

      const privacyservice = translate("privacyservice", locale);
      const content = privacyservice.content;

      return (
        <Overlay
          isVisible={!!open}
          windowBackgroundColor="transparent"
          overlayBackgroundColor="white"
          width={SCREEN_WIDTH * 0.9}
          height={SCREEN_HEIGHT * 0.9}
          containerStyle={styles.overContainerStyle}
        >
          <View style={styles.empowerTitle}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{ privacyservice.title }</Text>
          </View>
          <ScrollView style={styles.empowerContent}>
            <EmpowerTerm term={content.term0} />
            <EmpowerTerm term={content.term1} />
            <EmpowerTerm term={content.term2} />
            <EmpowerTerm term={content.term3} />
            <EmpowerTerm term={content.term4} />
          </ScrollView>
          <View style={styles.empowerButton}>
            <Button
              text={translate('tips.transaction.cancel', locale)}
              clear
              textStyle={{
 color: 'rgba(35, 81, 162, 1)', fontSize: 17, fontWeight: 'bold', marginTop: 0,
}}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.button1}
              onPress={() => this.onApproved(false)}
            />
            <Button
              text={translate('tips.transaction.confirm', locale)}
              clear
              textStyle={{
 color: 'rgba(35, 81, 162, 1)', fontSize: 17, fontWeight: 'bold', marginTop: 0,
}}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.button2}
              onPress={() => this.onApproved(true)}
            />
          </View>
        </Overlay>);
    }

    return null;
  }
}

export class PrivacyService extends Component {
  constructor() {
    super();

    this.state = {
      checked: false,
    };
  }
  render() {
    const { error, username, checked } = this.props;

    return (
      <View style={styles.container}>
        <View style={{ justifyContent: 'flex-start' }}>
          <CheckBox
            title={translate('tips.register.checkbox', locale)}
            textStyle={{
fontSize: 13, textAlign: 'left', marginLeft: 5, color: 'white',
}}
            checked={checked || false}
            iconType={Platform.OS === 'web' ? 'material' : 'font-awesome'}
            checkedIcon={Platform.OS === 'web' ? 'check' : 'check-square-o'}
            uncheckedIcon={Platform.OS === 'web' ? 'close' : 'square-o'}
            checkedColor="white"
            size={20}
            onPress={this.props.onChecked}
            containerStyle={styles.checkContainer}
          />
        </View>
        {/* <View style={{justifyContent: 'flex-end'}}>
        <Button
          raised
          text ={ translate('tips.register.serviceprivacy', locale) }
          textStyle={{fontSize: 13, color: 'rgba(145,234,255,1)'}}
          buttonStyle={styles.buttonConatiner}
        />
        </View> */}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 0.8,
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  checkContainer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    marginLeft: 0,
  },
  buttonConatiner: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderBottomWidth: 0.1,
    borderColor: 'white',
    height: 30,
    elevation: 0,
  },
  overContainerStyle: {
    zIndex: 10,
  },
  empowerTitle: {
    backgroundColor: 'transparent',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empowerContent: {
    backgroundColor: 'white',
    // height: SCREEN_HEIGHT*0.8-80
  },
  empowerContentTitle: {
    color: 'rgba(51,51,51,0.7)',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginRight: 5,
  },
  empowerContentSubTitle: {
    color: 'rgba(51,51,51,0.7)',
    fontSize: 14,
    marginTop: 10,
    marginRight: 5,
  },
  empowerContentItem: {
    color: 'rgba(51,51,51,0.7)',
    fontSize: 12,
    marginLeft: 10,
    marginTop: 10,
    marginRight: 5,
  },
  empowerButton: {
    backgroundColor: 'white',
    height: 50,
    flexDirection: 'row',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button1: {
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    borderColor: '#DFDFDF',
    borderWidth: 0.5,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    width: SCREEN_WIDTH * 0.9 * 0.5,
    height: 50,
  },
  button2: {
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    borderColor: '#DFDFDF',
    borderWidth: 0.5,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    width: SCREEN_WIDTH * 0.9 * 0.5,
    height: 50,
  },
});

