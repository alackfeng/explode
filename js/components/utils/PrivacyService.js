

import React, { Component } from 'react';

import { StyleSheet, View, ScrollView, Platform } from 'react-native';

import { Button, Text, CheckBox, Overlay } from 'react-native-elements';

import { SCREEN_WIDTH, SCREEN_HEIGHT, translate, locale } from '../../libs';


export class EmpowermentModel extends Component {
  onApproved = (agree) => {
    if (this.props.approved) {
      this.props.approved(agree);
    }
  }

  render() {
    const { open } = this.props;

    if (open) {
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
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>TokenPii服务协议</Text>
          </View>
          <ScrollView style={styles.empowerContent}>
            <Text>一、 关于本协议的确认与接纳

1. 您理解本协议及有关协议适用于imToken及imToken上融识所自主开发和拥有的去中心化应用（简称“DApp”）（排除第三方开发的DApp）。
2. 您下载imToken软件并创建或导入钱包，即视为您已经充分阅读并接受本协议全部条款，本协议立即生效，对双方具有约束力。
3. 本协议可由融识随时更新，经修改的协议一经在imToken上公布，立即自动生效，恕不再另行通知。在融识公布修改协议条款后，如果您不接受修改后的条款，请立即停止使用imToken，您继续使用imToken将被视为接受修改后的协议。
4. 如果您未满18周岁，或者是无民事行为能力人或限制民事行为能力人，请在父母或监护人指导下使用imToken。
二、 定义

1. imToken：指由融识基于以太坊单链系统（及将来陆续支持的其他区块链系统）开发的区块链钱包，包括其他为方便用户使用区块链系统而开发的辅助工具。
2. 用户：
2. 用户：

（1）用户必须是具备完全民事行为能力的自然人；
（2）若您为18周岁以下的未成年人使用imToken服务，需要在您父母或监护人的指导下使用imToken。无民事行为能力人使用imToken或限制民事行为能力人超过其民事权利或行为能力范围从事交易的，造成的一切后果，imToken有权要求您及您的父母或监护人负责。
3. 能力测评问卷：指在您使用imToken之前（及在将来的使用过程中），需通过能力测评问卷以证明您了解区块链科技和知识，具备合理使用和管理去中心化钱包的基本能力。
4. 创建或导入钱包：指您使用imToken，确认履行本协议并创建或导入钱包的过程。
5. 钱包密码：指您在创建imToken钱包过程中，软件操作界面提示您填写的密码，该密码用于加密保护私钥。作为去中心化的应用，钱包密码不存储在您的这台移动设备或融识的服务器，一旦丢失你需要借助明文私钥或助记词重置新密码。
6. 信息提示：imToken软件操作界面涉及的信息提示内容，建议用户按照相关步骤进行操作。
7. 特定用户：指按照中国法律法规及政策规定必须要配合融识履行个人信息披露义务的用户。
8. 私钥：由256位随机字符构成，是用户拥有并使用数字代币的核心。
9. 公钥：由私钥借助密码学原理单向推导生成，并用以生
            </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    // height: SCREEN_HEIGHT*0.8-80
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

