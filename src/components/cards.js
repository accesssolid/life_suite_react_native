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
            style={{ ...styles.mainView, ...props.customContainerStyle }}>
            <View style={{ flex: 1, borderTopLeftRadius: 10, borderTopEndRadius: 10, overflow: 'hidden' }}>
                <Image
                    resizeMode="cover"
                    style={styles.room}
                    source={props.imageUrl}
                />
            </View>
            <View style={{ justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, flexDirection: 'row', }}>
                <Text style={styles.text}>{props.title1}</Text>
                {props.showLeft && <TouchableOpacity onPress ={props.favorite} activeOpacity={0.7} style={{ height: 15, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' ,right:2}}>
                    <Image source={require('../assets/heartGreen.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                </TouchableOpacity>}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainView: {
        // height: 194,
        aspectRatio: 1,
        width: '47.5%',
        elevation: 5,
        shadowColor: '#00000029',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        borderRadius: 10,
        backgroundColor: LS_COLORS.global.white,
        marginBottom: 20
    },
    text: {
        textAlign: 'center',
        fontSize: 12,
        lineHeight: 16,
        fontFamily: LS_FONTS.PoppinsMedium,
        left:4
    },
    room: {
        width: '100%',
        height: '100%',
    },
})

export default Cards