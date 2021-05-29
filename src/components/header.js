import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import LS_FONTS from '../constants/fonts';

const Header = (props) => {
    const dispatch = useDispatch()

    return (
        <View style={styles.container}>
            <View style={styles.leftView}>

            </View>
            <View style={styles.middleView}>
                <Text style={styles.title}>{props.title}</Text>
            </View>
            <View style={styles.rightView}>

            </View>
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical:11,
        paddingHorizontal:20
    },
    leftView: {
        flex: 0.5,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    middleView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    rightView: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.black,
        fontSize: 16,
        textTransform:'uppercase'
    }
})
