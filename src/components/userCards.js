import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';
import LS_FONTS from '../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

const UserCards = props => {
    return (
        <View
            activeOpacity={0.7}
            onPress={props.action}
            style={styles.mainView}>
            <View style={{ flex: 1, borderTopLeftRadius: 10, borderTopEndRadius: 10, overflow: 'hidden' }}>
                <Image
                    resizeMode="cover"
                    style={styles.room}
                    source={props.imageUrl}
                />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                <Text style={styles.text}>{props.title1}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        // height: 194,
        aspectRatio: 1,
        width: '85%',
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

export default UserCards