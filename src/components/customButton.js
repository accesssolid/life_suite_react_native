import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';
import LS_FONTS from '../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

const CustomButton = props => {
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={props.action}>
            <View style={{...styles.screen, ...props.customStyles}}>
                <Text maxFontSizeMultiplier={1.6} style={{...styles.text, ...props.customTextStyles}} {...props.textProps}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    screen: {
        minHeight: 50,
        width: 311,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 28,
        alignSelf: 'center'
    },
    text: {
        color: LS_COLORS.global.white,
        fontSize: 16,
        lineHeight: 25,
        fontFamily: LS_FONTS.PoppinsSemiBold
    }
})

export default CustomButton