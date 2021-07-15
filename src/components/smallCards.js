import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';
import LS_FONTS from '../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

const SmallCards = props => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={props.action}
            style={styles.mainView}>
            <View style={{ height: 92, width: 116 }}>
                <Image
                    style={styles.room}
                    source={props.imageUrl}
                />
            </View>
            <View style={{ height: 28, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.text}>{props.title1}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainView: {
        height: 120,
        width: 114,
        top: "5%",
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
        borderColor: '#ACF0F2',
        borderWidth: 1,
        marginLeft:'2%'
    },
    text: {
        textAlign: 'center',
        fontSize: 10,
        lineHeight: 16,
        fontFamily: LS_FONTS.PoppinsMedium
    },
    room: {
        height: 92, width: 112
    },
})

export default SmallCards