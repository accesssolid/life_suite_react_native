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
                    backgroundColor: LS_COLORS.global.lightGrey,
                    borderRadius: 28,
                    alignSelf: 'center',           
                    fontSize: 14,
                    fontFamily: LS_FONTS.PoppinsRegular,
                    paddingVertical:15,
                    paddingHorizontal:'14%',
                }}
                {...props}
                placeholderTextColor={LS_COLORS.global.placeholder}
                color={LS_COLORS.global.black}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={props.keyboardType}  
            />           
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        marginBottom: 30,
        marginHorizontal:'10%',
    }, 
})

export default CustomTextInput