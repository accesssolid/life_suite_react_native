import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';
import LS_FONTS from '../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';


const CustomTextInput = props => {
    return (
        <View style={styles.screen}>
            <TextInput
                style={{ width: 313, height: 60, backgroundColor: LS_COLORS.global.lightGrey, borderRadius: 28, alignSelf: 'center', paddingHorizontal: 20, fontSize: 14, lineHeight: 21, fontFamily: LS_FONTS.PoppinsRegular }}
                {...props}
                placeholderTextColor={LS_COLORS.global.lightTextColor}
                color={LS_COLORS.global.lightTextColor}
                autoCapitalize="none"
                autoCorrect={false}
            />
        </View>

    )
}

const styles = StyleSheet.create({
    screen: {
        marginBottom: 30
    },

})

export default CustomTextInput