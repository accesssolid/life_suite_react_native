import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';
import LS_FONTS from '../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

const MediumCards = props => {
    return (
        <TouchableOpacity 
        activeOpacity = {0.7}
        onPress = {props.action}
        style={styles.mainView}>
            <View style ={{height:126}}>
            <Image
                style={styles.room}
                source={props.imageUrl}
            />
            </View>
            <View style={{height:68,justifyContent:'center',alignItems:'center'}}>
                <Text maxFontSizeMultiplier={1.5} style={styles.text}>{props.title1}</Text>
                <Text maxFontSizeMultiplier={1.5} style={styles.text}>{props.title2}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainView: {
        height: 194,
        width: 159,
        top: "8%",
        elevation: 200,
        shadowColor: '#00000029',
        backgroundColor: 'white',
        shadowColor: '#00000029',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        borderRadius: 10,
        borderColor:'#ACF0F2',
        borderWidth:1,
    },
    text: {
        textAlign: 'center',
        fontSize: 12,
        lineHeight: 16,
        fontFamily: LS_FONTS.PoppinsMedium
    },
    room: {
        width: 157,
        height: 126,
        borderTopLeftRadius: 10,
        borderTopRightRadius:10
    },
})

export default MediumCards