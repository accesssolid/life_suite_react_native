import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';
import LS_FONTS from '../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import TextInputMask from 'react-native-text-input-mask';


const CustomTextInput1 = props => {
    return (
        <>
            {props.title && <Text style={styles.title}>{props.title}{props.required && '*'}</Text>}
            <View style={{ ...styles.screen, ...props.customContainerStyle }}>
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
                        ...props.customInputStyle
                    }}
                    value={props.value}
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
                    editable={props.editable}
                    multiline={props.multiline}
                    numberOfLines={props.numberOfLines}
                />
                {
                    props.inlineImageLeft && <TouchableOpacity activeOpacity={0.7} onPress={props.onLeftPress} style={{ aspectRatio: 1, position: 'absolute', right: '5%', height: '100%', alignItems: 'center', justifyContent: 'center', ...props.customImageStyles }}>
                        {props.inlineImageLeft}
                    </TouchableOpacity>
                }
            </View>
        </>
    )
}

export function CustomTextInput(props) {
    if (props.mask) {
        return (
            <View style={{ position: "relative", borderWidth: 1, marginBottom: 30, marginHorizontal: 10, borderColor: LS_COLORS.global.lightTextColor, borderRadius: 7, ...props.containerStyle }}>
                <View style={{ ...styles.screen, ...{ marginHorizontal: 10, marginBottom: 0 }, ...props.customContainerStyle }}>
                    <TextInputMask
                        style={{
                            width: '100%',
                            backgroundColor: LS_COLORS.global.white,
                            borderRadius: 28,
                            alignSelf: 'center',
                            fontSize: 14,
                            fontFamily: LS_FONTS.PoppinsRegular,
                            paddingVertical: 15,
                            ...props.customInputStyle
                        }}
                        value={props.value}
                        ref={props.inputRef}
                        placeholderTextColor={LS_COLORS.global.placeholder}
                        color={LS_COLORS.global.black}
                        autoCapitalize="none"
                        autoCorrect={false}
                        // placeholder={props.placeholder}
                        keyboardType={props.keyboardType}
                        returnKeyLabel={props.returnKeyLabel}
                        onSubmitEditing={props.onSubmitEditing}
                        returnKeyType={props.returnKeyType}
                        onChangeText={props.onChangeText}
  
                        numberOfLines={props.numberOfLines}
                        mask={props.mask}
                    />
                </View>
                {props.title && <Text style={[styles.title, { fontSize: 12, color: LS_COLORS.global.lightTextColor, marginHorizontal: 10, position: "absolute", top: -10, backgroundColor: "white" }]}>{props.title}{props.required && '*'}</Text>}
            </View>
        )
    }
    return (
        <View style={{ position: "relative", borderWidth: 1, marginBottom: 30, marginHorizontal: 10, borderColor: LS_COLORS.global.lightTextColor, borderRadius: 7, ...props.containerStyle }}>
            <View style={{ ...styles.screen, ...{ marginHorizontal: 10, marginBottom: 0 }, ...props.customContainerStyle }}>
                <TextInput
                    style={{
                        width: '100%',
                        backgroundColor: LS_COLORS.global.white,
                        borderRadius: 28,
                        alignSelf: 'center',
                        fontSize: 14,
                        fontFamily: LS_FONTS.PoppinsRegular,
                        paddingVertical: 15,
                        ...props.customInputStyle
                    }}
                    value={props.value}
                    ref={props.inputRef}
                    placeholderTextColor={LS_COLORS.global.placeholder}
                    color={LS_COLORS.global.black}
                    autoCapitalize="none"
                    autoCorrect={false}
                    // placeholder={props.placeholder}
                    keyboardType={props.keyboardType}
                    returnKeyLabel={props.returnKeyLabel}
                    onSubmitEditing={props.onSubmitEditing}
                    returnKeyType={props.returnKeyType}
                    maxLength={props.maxLength}
                    onChangeText={props.onChangeText}
                    secureTextEntry={props.secureTextEntry}
                    editable={props.editable}
                    multiline={props.multiline}
                    numberOfLines={props.numberOfLines}
                />
            </View>
            {props.title && <Text style={[styles.title, { fontSize: 12, color: LS_COLORS.global.lightTextColor, marginHorizontal: 10, position: "absolute", top: -10, backgroundColor: "white" }]}>{props.title}{props.required && '*'}</Text>}
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
    title: {
        fontFamily: LS_FONTS.PoppinsMedium,
        marginHorizontal: '10%',
        marginBottom: 5,
        color: LS_COLORS.global.black
    }
})

export default CustomTextInput1