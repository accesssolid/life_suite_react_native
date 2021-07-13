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
import { setUserRole } from '../../../redux/features/loginReducer';

const WelcomeScreen = (props) => {
    const dispatch = useDispatch()

    const next = (role) => {
        dispatch(setUserRole({ data: role }))
        props.navigation.navigate('AuthStack')
    }

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image resizeMode="contain" style={styles.image} source={require('../../../assets/splash/logo.png')} />
                </View>
                <View style={{ top: "13%" }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => next(1)}
                        style={styles.textContainer}>
                        <Text style={styles.text}>Login as User</Text>
                    </TouchableOpacity>
                </View>
                <View >
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => next(2)}
                        style={styles.textContainer}>
                        <Text style={styles.text}>Login as Service Provider</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: LS_COLORS.global.white,

    },
    logoContainer: {
        width: '80%',
        height: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        top: '18%'
    },
    image: {
        width: '80%',
        height: '80%'
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
        color: LS_COLORS.global.white,
        fontFamily: LS_FONTS.PoppinsRegular,
        fontSize: 16,
        lineHeight: 40
    }
})
