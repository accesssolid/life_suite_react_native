import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';
import LS_FONTS from '../constants/fonts';
import { globalStyles } from '../../../utils';
import Entypo from 'react-native-vector-icons/Entypo'
/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import TextInputMask from 'react-native-text-input-mask';


const CustomTextInput1 = props => {
    return (
        <>
            {props.title && <Text maxFontSizeMultiplier={1.7} style={styles.title}>{props.title}{props.required && '*'}</Text>}
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
                    maxFontSizeMultiplier={1.6}
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
    const [isSecure,setIsSecure]=React.useState(false)
    React.useEffect(()=>{
        if(props.secureTextEntry){
            setIsSecure(true)
        }
    },[props])
    if (props.mask) {
        return (
            <View style={{ position: "relative", borderWidth: 1, marginBottom: 30, marginHorizontal: 10, borderColor: LS_COLORS.global.lightTextColor, borderRadius: 7, ...props.containerStyle }}>
                <View style={{ ...styles.screen, ...{ marginHorizontal: 10, marginBottom: 0 }, ...props.customContainerStyle }}>
                    <TextInputMask
                        style={{
                            width: '100%',
                            backgroundColor: LS_COLORS.global.white,
                            paddingVertical: 10,
                            marginTop:10,
                            alignSelf: 'center',
                            fontSize: 14,
                            height:60,
                            fontFamily: LS_FONTS.PoppinsRegular,
                            paddingVertical: 10,
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
                        onChangeText={props.onChangeText}
                        numberOfLines={props.numberOfLines}
                        mask={props.mask}
                        secureTextEntry={isSecure}
                        maxFontSizeMultiplier={1.7}
                    />
                </View>
                {props.title && <Text  maxFontSizeMultiplier={1.4} style={[styles.title, { fontSize: 12, color: LS_COLORS.global.lightTextColor, marginHorizontal: 10, position: "absolute", top: -10, backgroundColor: "white" }, props.titleStyle]}>{props.title}{props.required && '*'}</Text>}
                {props.icon}
                {props.secureTextEntry&&
                    <Entypo onPress={()=>setIsSecure(!isSecure)} name={!isSecure ? "eye" : 'eye-with-line'} size={18} />
                }
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
                        alignSelf: 'center',
                        fontSize: 14,
                        fontFamily: LS_FONTS.PoppinsRegular,
                        paddingVertical: 10,
                        marginTop:10,
                        minHeight:60,
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
                    secureTextEntry={isSecure}
                    editable={props.editable}
                    maxFontSizeMultiplier={1.7}
                    multiline={props.multiline}
                    numberOfLines={props.numberOfLines}
                    {...props.TextInputProps}
                />
            </View>
            {props.title && <Text maxFontSizeMultiplier={1.7} style={[styles.title, { fontSize: 12, color: LS_COLORS.global.lightTextColor, marginHorizontal: 10, position: "absolute", top: -10, backgroundColor: "white" }]}>{props.title}{props.required && '*'}</Text>}
            {props.icon}
                {props.secureTextEntry&&
                    <Entypo onPress={()=>setIsSecure(!isSecure)} name={isSecure ? "eye" : 'eye-with-line'} size={18} />
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
    title: {
        fontFamily: LS_FONTS.PoppinsMedium,
        marginHorizontal: '10%',
        marginBottom: 5,
        color: LS_COLORS.global.black
    }
})

export default CustomTextInput1