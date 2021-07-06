import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native'

/* Constants */
import LS_COLORS from '../../constants/colors';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Methods */
import { getJsonData } from '../../asyncStorage/async';
import { retrieveItem,showToast } from '../../components/validators';

const Splash = (props) => {
    const dispatch = useDispatch()
    const isAuthorized = useSelector(state => state.authenticate.isAuthorized)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = () => {
        setTimeout(() => {
            retrieveItem('user').then((data) => {
                if (data) {
                     props.navigation.navigate("LoginScreen")
                 } 
                 else {
                    props.navigation.navigate('WelcomeScreen') 
                 }
             })
        }, 2000);
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image resizeMode="contain" style={styles.image} source={require('../../assets/splash/logo.png')} />
            </View>
        </View>
    )
}

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: LS_COLORS.global.white
    },
    logoContainer: {
        width: '80%',
        height: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: '100%',
        height: '100%'
    }
})
