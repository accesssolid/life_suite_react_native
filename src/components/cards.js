import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';
import LS_FONTS from '../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

const Cards = props => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={props.action}
            style={styles.mainView}>
            <View style={{ height: 126 }}>
                <Image
                    resizeMode="cover"
                    style={styles.room}
                    source={props.imageUrl}
                />
            </View>
            <View style={{ height: 68, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.text}>{props.title1}</Text>
                <Text style={styles.text}>{props.title2}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainView: {
        height: 194,
        width: '47.5%',
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
        overflow:'hidden'
    },
    text: {
        textAlign: 'center',
        fontSize: 12,
        lineHeight: 16,
        fontFamily: LS_FONTS.PoppinsMedium
    },
    room: {
        width: '100%',
        height: '100%',
    },
})

export default Cards