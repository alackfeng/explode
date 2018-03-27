import React, {
    Component,
} from 'react'
import {
    View,
    StyleSheet,
    Alert,
} from 'react-native'

import Barcode from 'react-native-smart-barcode'
import TimerEnhance from 'react-native-smart-timer-enhance'

class BarcodeScan extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            viewAppear: true,
        };
    }

    render() {

        return (
            <View style={{flex: 1, backgroundColor: 'black',}}>
                {this.state.viewAppear ? <Barcode style={{flex: 1, }}
                                                  ref={ component => this._barCode = component }
                                                  onBarCodeRead={this._onBarCodeRead}/> : null}
            </View>
        )
    }

    componentDidMount() {
        let viewAppearCallBack = (event) => {
            this.setTimeout( () => {
                this.setState({
                    viewAppear: true,
                })
            }, 255)

        }
        this._listeners = [
            //this.props.navigation.addListener('didfocus', viewAppearCallBack)
        ]

    }

    componentWillUnmount () {
        this._listeners && this._listeners.forEach(listener => listener.remove());
    }

    _onBarCodeRead = (e) => {
        console.log(`e.nativeEvent.data.type = ${e.nativeEvent.data.type}, e.nativeEvent.data.code = ${e.nativeEvent.data.code}`)
        this._stopScan()
        

        // 回调事件
        const { navigation } = this.props;
        if(navigation && navigation.state.params && navigation.state.params.handleScan) {
            let res = e.nativeEvent.data.code;
            let pos = res.indexOf("tokenpii://");
            if(0 === pos) {
                navigation.state.params.handleScan({
                    toAccount: res.substr(11)}, 
                    (bExit) => {
                        if(bExit) navigation.goBack(); 
                    }
                );
            }
            else {
                Alert.alert(e.nativeEvent.data.type, 'unkown support proto', [
                    {text: 'OK', onPress: () => this._startScan()},
                ])
            }
        } else {
            Alert.alert(e.nativeEvent.data.type, e.nativeEvent.data.code, [
                {text: 'OK', onPress: () => this._startScan()},
            ])
        }
        
    }

    _startScan = (e) => {
        this._barCode.startScan()
    }

    _stopScan = (e) => {
        this._barCode.stopScan()
    }

}

export const ScanScreen = TimerEnhance(BarcodeScan)