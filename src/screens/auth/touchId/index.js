import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, TouchableOpacity } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import Header from '../../../components/header';

const TouchId = (props) => {
    const dispatch = useDispatch()

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <>
                <View style={styles.container}>
                    <View style={styles.logoContainer}>
                        {/* <Image resizeMode="contain" style={styles.image} source={require('../../../assets/fingerPrint.png')} /> */}
                    </View>
                    <View>
                        <Text maxFontSizeMultiplier={1.7} style={styles.text}>Login with Touch ID</Text>
                        <Text maxFontSizeMultiplier={1.7} style={styles.text1}>Please put your finger on the</Text>
                        <Text maxFontSizeMultiplier={1.7} style={styles.text1}>home button as login</Text>
                    </View>
                    <View style={styles.login}>
                        <TouchableOpacity >
                            <Text maxFontSizeMultiplier={1.7} style={styles.text1}>Login with Password</Text>

                        </TouchableOpacity>
                    </View>
                </View>

            </>
        </SafeAreaView>
    )
}

export default TouchId;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: LS_COLORS.global.white,

    },
    logoContainer: {
        width: '80%',
        height: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        bottom:'3%'
    },
    image: {
        width: 92,
        height:102
    },
    textContainer: {
        backgroundColor: LS_COLORS.global.green,
        height: 50,
        width: 262,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25
    },
    text: {
        color: LS_COLORS.global.green,
        fontFamily: LS_FONTS.PoppinsSemiBold,
        fontSize: 22,
        lineHeight: 40,
        textAlign: 'center'
    },
    text1: {
        color: LS_COLORS.global.green,
        fontFamily: LS_FONTS.PoppinsMedium,
        fontSize: 14,
        lineHeight: 18,
        textAlign: 'center'
    },
    login: {
        position: 'absolute',
        bottom: "5%"
    }
})
