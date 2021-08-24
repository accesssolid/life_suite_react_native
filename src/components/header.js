import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Touchable, TouchableOpacity } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import LS_FONTS from '../constants/fonts';

const Header = (props) => {
    const dispatch = useDispatch()

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.leftView}
                onPress={props.action}
                activeOpacity={0.7}>
                <Image
                    style={{ height: '80%', width: '80%', resizeMode: 'contain' }}
                    source={props.imageUrl}
                />
            </TouchableOpacity>
            <View style={styles.middleView}>
                <Text style={styles.title}>{props.title}</Text>
            </View>
            <TouchableOpacity style={styles.rightView}
                onPress={props.action1}
                activeOpacity={0.7}>
                <Image
                    style={{ height: 25, width: 25, resizeMode: 'contain' }}
                    source={props.imageUrl1}
                />
            </TouchableOpacity>
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 15,
        justifyContent: 'space-between',
        zIndex: 500,
    },
    leftView: {
        left: 20,
        aspectRatio:1,
        alignItems: 'center',
        height: 30,
        alignItems:'center',
        justifyContent:'center'
    },
    middleView: {
        alignItems: 'center',
        justifyContent:'center'
    },
    rightView: {
        right: 20,
        alignItems: 'center',
    },
    title: {
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.darkBlack,
        fontSize: 16,
        textTransform: 'uppercase'
    }
})
