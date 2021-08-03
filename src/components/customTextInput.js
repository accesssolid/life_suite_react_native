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
                    paddingVertical: 15,
                    paddingHorizontal: '14%',
                }}
                // {...props}
                ref={props.inputRef}
                placeholderTextColor={LS_COLORS.global.placeholder}
                color={LS_COLORS.global.black}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder={props.placeholder}
                keyboardType={props.keyboardType}
                returnKeyLabel={props.returnKeyLabel}
                onSubmitEditing={props.onSubmitEditing}
                returnKeyType={props.returnKeyType}
                maxLength={props.maxLength}
                onChangeText={props.onChangeText}
                secureTextEntry={props.secureTextEntry}
            />
            {
                props.inlineImageLeft && <TouchableOpacity activeOpacity={0.7} onPress={props.onLeftPress} style={{ aspectRatio: 1, position: 'absolute', right: '5%', height:'100%', alignItems:'center', justifyContent:'center' }}>
                    {props.inlineImageLeft}
                </TouchableOpacity>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        marginBottom: 30,
        marginHorizontal: '10%',
        flexDirection: 'row',
        alignItems: 'center'
    },
})

export default CustomTextInput