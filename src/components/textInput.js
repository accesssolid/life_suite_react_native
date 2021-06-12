import { Input, Item, Icon } from 'native-base';
import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';
import LS_FONTS from '../constants/fonts';
import { globalStyles } from '../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

function CustomInput({
    text,
    numberOfLines,
    secureTextEntry,
    placeholder,
    height,
    value,
    onChangeText,
    keyboardType,
}) {
    return (
        <Item
            regular
            style={{
                marginTop: 35,
                borderRadius: 7,
                borderColor: LS_COLORS.global.textInutBorderColor,
                paddingLeft: 16,
                maxWidth: '90%',
                alignSelf: 'center',
            }}>
            <View
                style={{
                    position:'absolute',top:-11,left:20,paddingHorizontal:5,backgroundColor:LS_COLORS.global.white
                }}>
                <Text
                    style={{
                        color: LS_COLORS.global.grey,
                        fontSize: 16,
                        fontFamily: LS_FONTS.PoppinsRegular,
                    }}>
                    {text}
                </Text>
            </View>
            <Input
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                numberOfLines={numberOfLines}
                style={{
                    color: LS_COLORS.global.grey,
                    height: 50,
                    fontFamily: LS_FONTS.PoppinsMedium,
                    fontSize: 16,
                }}
            />
        </Item>
    );
}
export default CustomInput;