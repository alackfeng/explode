
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text, ActivityIndicator, ScrollView, Modal as RNModal, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { Colors as colors, resetNavigationTo, SCREEN_WIDTH, SCREEN_HEIGHT, translate, locale } from '../libs';

import { Button, Divider } from 'react-native-elements';

import { ViewContainer, StyleSheet } from '../components';
import { triggerTrans, TRIGGER_TRANSACTION_COMMON, TRIGGER_SECOND_CONFIRM, TRIGGER_SECOND_CONFIRM_YES, TRIGGER_SECOND_CONFIRM_NO, TRANSACTION_COMMON } from '../actions';

const { confirm: secondConfirm, close: transClose } = triggerTrans;

import { ChainTypes } from 'assetfunjs/es';

const { operations } = ChainTypes;
const ops = Object.keys(operations);

const modalTop = SCREEN_HEIGHT / 2;
const modalLeft = SCREEN_WIDTH / 2;

const advisable_message = {
  'subject_profile_creator_vote_min': 'Voting is below minimum line',
  'Insufficient_Balance': 'Insufficient Balance',
  'Vote_is_unavailable_for_this_subject': 'Voting closed',
  'Vote_is_closed_for_this_subject': 'Voting closed',
  'everyone_can_vote': 'You have reached the limit of 5 betting times. Please select another prediction',
  'insufficient_balance': 'Insufficient Balance',
  'default': 'Assetfun is coming with little donkey lol...',
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
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
    width: SCREEN_WIDTH * 0.72 * 0.5,
    height: 60,
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
    width: SCREEN_WIDTH * 0.72 * 0.5,
    height: 60,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    position: 'absolute',
    height: SCREEN_HEIGHT * 0.42,
    width: SCREEN_WIDTH * 0.72,
    top: modalTop,
    marginTop: -SCREEN_HEIGHT * 0.42 * 0.5,
    left: modalLeft,
    marginLeft: -SCREEN_WIDTH * 0.72 * 0.5,
    borderRadius: 4,
    borderColor: 'white',
    borderWidth: 0,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  detailsContainer: {
    backgroundColor: 'transparent',
    marginTop: 20,
    height: SCREEN_HEIGHT * 0.5,
    width: SCREEN_WIDTH * 0.72,
  },
});


class TransactionItem extends Component {
  render() {
    const { index, title, content } = this.props;
    return (
      <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
        <View style={{
 marginLeft: 30, height: 30, alignItems: 'flex-start', justifyContent: 'center', flex: 1,
}}
        >
          <Text style={{ textAlign: 'center', fontSize: 14, color: '#0303030' }}>{title}</Text>
        </View>
        <View style={{
 marginLeft: 5, height: 30, alignItems: 'flex-start', justifyContent: 'center', flex: 3,
}}
        >
          <Text style={{ fontSize: 14, color: '#666666' }} numberOfLines={1}>{content || translate('tips.transaction.kong', locale)}</Text>
        </View>
      </View>
    );
  }
}

class TransactionDetail extends Component {
  transDetails() {
    const { status, entity } = this.props;

    const generateSuccess = entity.transaction.length && entity.transaction.filter(item => item.type === TRANSACTION_COMMON.SUCCESS);

    if (entity.raw && generateSuccess.length && generateSuccess[0].response.transaction) {
      console.log('=====[TransactionConfirmModal.js]::transDetails - ', entity.raw);

      let fee = { amount: '0', asset: 'AFT' };
      const op = generateSuccess[0].response.transaction.operations[0];
      switch (ops[op[0]]) {
        case 'transfer':
          fee = { amount: op[1].fee.amount, asset: op[1].fee.asset_id === '1.3.0' ? 'AFT' : 'AFT' };
          break;
        default:
          break;
      }

      return { details: entity.raw, fee };
    }
    return {};
  }

  render() {
    const { status, entity } = this.props;

    const { details, fee } = this.transDetails();

    const rows = [];

    if (details) {
      switch (ops.filter(item => item === 'transfer')[0]) {
        case 'transfer':
          rows.push(<TransactionItem key={0} index={0} title={translate('tips.transaction.wherefrom', locale)} content={details.parameters.from_account} />);
          rows.push(<TransactionItem key={1} index={1} title={translate('tips.transaction.sendto', locale)} content={details.parameters.to_account} />);
          rows.push(<TransactionItem key={2} index={2} title={translate('tips.transaction.sendamount', locale)} content={`${details.parameters.amount / 100000000} ${details.parameters.asset}`} />);
          rows.push(<TransactionItem key={3} index={3} title={translate('tips.transaction.fee', locale)} content={`${fee.amount / 100000000} ${fee.asset}`} />);
          if (details.parameters.memo) {
            rows.push(<TransactionItem key={4} index={4} title={translate('tips.transaction.memo', locale)} content={details.parameters.memo.toString()} />);
          }
          break;
        default:
          rows.push(<TransactionItem key={0} index={0} title={translate('tips.transaction.unkownkey', locale)} content={translate('tips.transaction.unkownvalue', locale)} />);
          break;
      }
    }

    // /console.log("=====[TransactionConfirmModal.js]::transDetails - rows : ", rows);

    return (
      <ScrollView style={styles.detailsContainer}>
        {rows}
      </ScrollView>
    );
  }
}


class TransactionConfirm extends Component {
  props: {
    entityLogin: PropTypes.any,
  }

  constructor() {
    super();


    this.onCancel = this.onCancel.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log('=====[TransactionConfirmModal.js]::componentWillReceiveProps - props > : ', nextProps);
  }

  onConfirm = () => {
    const { entityTrans: entity } = this.props;

    // 防止二次触发,已请求后不再触发
    const broadcastSuccess = entity.transaction.length && entity.transaction.filter(item => item.type === TRANSACTION_COMMON.REQUEST);
    if (broadcastSuccess.length && broadcastSuccess[0].method === 'broadcast') {
      this.onCancel();
      return;
    }

    // 有错误不再广播，直接关闭
    const tranFailure = entity.transaction.length && entity.transaction.filter(item => item.type === TRANSACTION_COMMON.FAILURE);
    if (tranFailure.length) {
      this.onCancel();
      return;
    }

    // 正在处理中，不要再点击，要限制一下
    this.props.secondConfirm(TRIGGER_SECOND_CONFIRM_YES);
  }

  onCancel = () => {
    const { entityTrans: entity } = this.props;

    if (entity && entity.isOpen) // 打开触发关闭
    {
      this.props.secondConfirm(TRIGGER_SECOND_CONFIRM_NO);
    }
    // } else {
    this.props.transClose('closure'); // 直接关闭
    // }
  }

  showTranStatus = () => {
    const { entityTrans: entity } = this.props;

    let status = false;
    let tip = null;

    // stack first
    const entityObj = entity.transaction.length && entity.transaction[0];
    console.log('[TransactionConfirmModal.js]::showTranStatus - entityObj: ', entityObj);
    switch (entityObj.type) {
      case TRIGGER_TRANSACTION_COMMON:
      case TRANSACTION_COMMON.REQUEST:
        {
          tip = (entityObj.method !== 'broadcast') ? translate('tips.transaction.transgenerate0', locale) : translate('tips.transaction.transbroadcast', locale);
          status = entityObj.method === 'broadcast';
        }
        break;
      case TRANSACTION_COMMON.SUCCESS:
        tip = (entityObj.method !== 'broadcast') ? translate('tips.transaction.transgenerate', locale) : translate('tips.transaction.transconfirmed', locale);
        break;
      case TRANSACTION_COMMON.FAILURE:
        {
          const message = entityObj.error && entityObj.error.message || entityObj.error;
          console.warn('[TransactionConfirmModal.js]::showTranStatus - TRANSACTION_COMMON.FAILURE: ', JSON.stringify(message));
          let find_key = null;
          Object.keys(advisable_message).forEach((key) => {
            if (key) {
              key = key.trim().replace(/_/g, ' ');
              if (new RegExp(key, 'i').test(message)) {
                find_key = `advisable_message.${key.trim().replace(/ /g, '_')}`;
              }
            }
          });
          find_key = find_key || 'advisable_message.default';

          tip = (entityObj.method !== 'broadcast')
            ? (translate('tips.transaction.transgenertateerror', locale) + JSON.stringify(message))
            : (translate('tips.transaction.transbroadcasterror', locale) + translate(find_key, locale));
        }
        break;
      case TRIGGER_SECOND_CONFIRM:
        {
          tip = (entityObj.event === TRIGGER_SECOND_CONFIRM_YES) ? translate('tips.transaction.transbroadcast', locale) : translate('tips.transaction.transcancel', locale);
          status = (entityObj.event === TRIGGER_SECOND_CONFIRM_YES);
        }
        break;
      default:
        break;
    }

    // tip = (entity.transaction.length && entity.transaction[0].type === 'USERS_REGISTER_FAILURE') ? "登录错误啦！！！" : status;
    return { status, tip };
  }

  render() {
    const { entityTrans: entity, navigation } = this.props;
    console.log('=====[TransactionConfirmModal.js]::render - entity : ', entity);

    const isOpen = entity && entity.isOpen || false;
    if (!isOpen) {
      return null;
    }

    const { status, tip } = this.showTranStatus();
    const ModalWarp = Platform.OS === 'web' ? RNModal : Modal;

    return (
      <View style={styles.container}>
        <ModalWarp
          style={styles.modalContent}
          visible
          isVisible
          transparent={false}
        >

          <View style={{ flex: 1, marginTop: 0 }}>
            <View style={{
flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15,
}}
            >
              {status && <ActivityIndicator animating={status} size="small" color={colors.salmon} />}
              <Text
                style={{
textAlign: 'center', color: '#030303', marginLeft: 10, fontWeight: 'bold',
}}
                numberOfLines={10}
              >{tip}
              </Text>
            </View>

            <TransactionDetail entity={entity} />
          </View>

          <View style={{ flexDirection: 'row', marginBottom: 0 }}>
            <Button
              text={translate('tips.transaction.cancel', locale)}
              clear
              textStyle={{
 color: 'rgba(35, 81, 162, 1)', fontSize: 17, fontWeight: 'bold', marginTop: 0,
}}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.button1}
              onPress={this.onCancel}
            />
            <Button
              text={translate('tips.transaction.confirm', locale)}
              clear
              textStyle={{
 color: 'rgba(35, 81, 162, 1)', fontSize: 17, fontWeight: 'bold', marginTop: 0,
}}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.button2}
              onPress={this.onConfirm}
            />

          </View>

        </ModalWarp>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  entityTrans: state.comm.trans,
});

export const TransactionConfirmModal = connect(mapStateToProps, {
  secondConfirm,
  transClose,
})(TransactionConfirm);

