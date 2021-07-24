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
                style={{
                    width: '100%',
                    height: 60, 
                    backgroundColor: LS_COLORS.global.lightGrey,
                    borderRadius: 28,
                    alignSelf: 'center',
                    paddingHorizontal: 20,
                    fontSize: 14,
                    fontFamily: LS_FONTS.PoppinsRegular
                }}
                {...props}
                placeholderTextColor={LS_COLORS.global.lightTextColor}
                color={LS_COLORS.global.black}
                autoCapitalize="none"
                autoCorrect={false}
            />
            {props.bottomText && <Text style={styles.bottomText}>
                {props.bottomText}
            </Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        marginBottom: 30,
        paddingHorizontal:'10%'
    },
    bottomText:{
        color: LS_COLORS.global.black,
        marginTop:5,
        marginHorizontal:'5%'
    }
})

export default CustomTextInput