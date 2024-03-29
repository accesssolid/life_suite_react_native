import { Input, Item, Icon } from 'native-base';
import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, TextInput } from 'react-native'

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
    blurOnSubmit, icon,
    TextInputProps
}) {
    return (
        <View

            style={{
                marginTop: text && text.trim() !== '' ? 35 : 0,
                borderRadius: 7,
                borderWidth:1.2,
                borderColor: "#E5E5E5",
                paddingLeft: 16,
                backgroundColor: "white",
            
                width: width,
                width: '90%',
                alignSelf: 'center',
                ...customContainerStyles
            }}>
            <View style={{ position: 'absolute', top: -11, left: 20, paddingHorizontal: 5, backgroundColor: LS_COLORS.global.white }}>
                <Text maxFontSizeMultiplier={1.3} style={{ color: LS_COLORS.global.grey, fontSize: 16, fontFamily: LS_FONTS.PoppinsRegular, }}>
                    {text}{required == true && '*'}
                </Text>
            </View>
            <TextInput
                ref={inpuRef}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                numberOfLines={numberOfLines}
                style={{
                    color: LS_COLORS.global.black,
                    height: 60,
                    marginLeft:15,
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
                maxFontSizeMultiplier={1.5}
                {...TextInputProps}
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
            {bottomText && <Text maxFontSizeMultiplier={1.5} style={{ paddingRight: 10, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.black, fontSize: 12 }}>{bottomText}</Text>}
            {icon}
        </View>
    );
}

export default CustomInput;