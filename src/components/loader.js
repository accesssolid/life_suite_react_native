import React from 'react'
import {View,ActivityIndicator} from 'react-native'
import LS_COLORS from '../constants/colors'


export default function Loader(){
    return(
        <View style={{position:"absolute",backgroundColor:"#fff6",justifyContent:"center",height:'100%',width:'100%',alignItems:"center",zIndex:13213123}}>
            <ActivityIndicator color={LS_COLORS.global.green} size={"large"} style={{zIndex:1232131233333333,elevation:2132133333333333}}/>
        </View>
    )
} 