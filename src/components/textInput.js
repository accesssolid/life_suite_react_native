import { Input, Item, Icon } from 'native-base';
import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';
import LS_FONTS from '../constants/fonts';

function CustomInput({
    text,
    numberOfLines,
    secureTextEntry,
    placeholder,
    value,
    onChangeText,
    keyboardType,
    action,
    imageUrl,
    width,
    returnKeyType,
    inpuRef,
    onSubmitEditing,
    maxLength,
    editable,
    required,
    multiline,
    customContainerStyles,
    customInputStyles,
    bottomText,
    blurOnSubmit
}) {
    return (
        <Item
            regular
            style={{
                marginTop: text && text.trim() !== '' ? 35 : 0,
                borderRadius: 7,
                borderColor: LS_COLORS.global.textInutBorderColor,
                paddingLeft: 16,
                width: width,
                maxWidth: '90%',
                alignSelf: 'center',
                ...customContainerStyles
            }}>
            <View style={{ position: 'absolute', top: -11, left: 20, paddingHorizontal: 5, backgroundColor: LS_COLORS.global.white }}>
                <Text style={{ color: LS_COLORS.global.grey, fontSize: 16, fontFamily: LS_FONTS.PoppinsRegular, }}>
                    {text}{required == true && '*'}
                </Text>
            </View>
            <Input
                ref={inpuRef}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                numberOfLines={numberOfLines}
                style={{
                    color: LS_COLORS.global.black,
                    height: 50,
                    fontFamily: LS_FONTS.PoppinsMedium,
                    fontSize: 16,
                    ...customInputStyles
                }}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
                maxLength={maxLength}
                editable={editable}
                multiline={multiline}
                blurOnSubmit={blurOnSubmit}
                
            />

            <TouchableOpacity onPress={action} style={{ right: 10 }}>
                <Image
                    style={{
                        height: 22,
                        width: 22,
                        resizeMode: 'contain',
                    }}
                    source={imageUrl}
                />
            </TouchableOpacity>
            {bottomText && <Text style={{ paddingRight:10, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.black, fontSize:12 }}>{bottomText}</Text>}
        </Item>
    );
}

export default CustomInput;