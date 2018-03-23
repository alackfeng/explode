import React, {
    Component,
} from 'react'
import {
    View,
    StyleSheet,
    Alert,
    Text
} from 'react-native'

//import Barcode from 'react-native-smart-barcode'
//import TimerEnhance from 'react-native-smart-timer-enhance'

class BarcodeScan extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            viewAppear: false,
        };
    }


    render() {

        return (
            <View style={{flex: 1, backgroundColor: 'black',}}>
                <Text>hello Scan </Text>
            </View>
        )
    }


}

export const ScanScreen = BarcodeScan;