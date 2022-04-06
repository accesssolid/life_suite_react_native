import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image,Modal, TouchableOpacity, Pressable } from 'react-native'
// import Modal from 'react-native-modal';
import { getInfoDescription } from '../utils';
import LS_COLORS from "../constants/colors";
import LS_FONTS from "../constants/fonts";
import { useDispatch, useSelector } from 'react-redux';
import { updateSignupModal } from '../redux/features/signupModal';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { logoutAll } from '../redux/features/loginReducer';
const SignUpModal = () => {
    const dispatch = useDispatch()
    const isVisible = useSelector(state => state.signupModal?.open)
    const navigation = useNavigation()

    useEffect(() => {

    }, [])

    return (
        <Modal
            onBackButtonPress={() => dispatch(updateSignupModal(false))}
            onBackdropPress={() => dispatch(updateSignupModal(false))}
            hasBackdrop={true}
            visible={isVisible}
            transparent={true}
            // animationType="slide"
            >
            <View style={{flex:1,backgroundColor:"#0005",justifyContent:"center"}}>
            <View style={styles.container}>
                <Text maxFontSizeMultiplier={1.5} style={styles.title}></Text>
                <Image source={require('../assets/splash/logo.png')} resizeMode="contain" style={{ height: 100, width: 200, alignSelf: "center" }} />
                <Text maxFontSizeMultiplier={1.5} style={{ color: "black", fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 16, textAlign: "center" }}>To use this feature you need to sign up</Text>
                <TouchableOpacity onPress={() => {
                    dispatch(updateSignupModal(false))
                    // navigation.navigate('WelcomeScreen1')
                    // navigation.dispatch(
                    //     CommonActions.reset({
                    //         index: 1,
                    //         routes: [
                    //             { name: "AuthStack" },
                    //         ],
                    //     })
                    // );
                    navigation.reset({
                        index: 1,
                        routes: [{name: 'AuthStack'}],
                      });
                    //   console.log("Navigations",navigation.getState())
                   navigation.push("AuthStack",{screen:"SignUpScreen"})
                    // setTimeout(()=>{
                    //     navigation.navigate('WelcomeScreen')
                    // },200)
                    // dispatch(logoutAll())
                }} style={{ backgroundColor: LS_COLORS.global.green, padding: 10, borderRadius: 5, margin: 10 }} >
                    <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, color: "white", textAlign: "center" }}>Sign up</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => {
                    dispatch(updateSignupModal(false))
                }} style={{ position: 'absolute', top: '3%', right: '3%' }}>
                    <Image source={require('../assets/cancel.png')} resizeMode="contain" style={{ height: 25, width: 25 }} />
                </TouchableOpacity>
            </View>
            </View>
        </Modal>
    )
}

export default SignUpModal;

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        width: '95%',
        alignSelf: 'center',
        padding: '4%',
        backgroundColor: LS_COLORS.global.white,
        borderRadius: 10,
        paddingVertical: 10,
        overflow: 'hidden',
    },
    title: {
        fontFamily: LS_FONTS.PoppinsBold,
        fontSize: 16,
        letterSpacing: 0.32,
        color: LS_COLORS.global.darkBlack,
        textTransform: 'uppercase',
        textAlign: "center"
    },
    desc: {
        marginTop: 25,
        fontFamily: LS_FONTS.PoppinsRegular,
        fontSize: 12,
        letterSpacing: 0.24,
        color: LS_COLORS.global.textInputText,
        textAlign: 'left'
    }
})