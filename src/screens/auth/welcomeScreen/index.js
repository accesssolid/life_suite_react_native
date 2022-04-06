import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, Text, SafeAreaView, TouchableOpacity, ImageBackground, ScrollView, Platform } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import Header from '../../../components/header';
import { loginReducer, setUserRole, setUserType } from '../../../redux/features/loginReducer';

const { width, height } = Dimensions.get("window")
import { useFocusEffect, useNavigation, CommonActions } from '@react-navigation/native';
import { changeSwitched } from '../../../redux/features/switchTo';
import { retrieveItem } from '../../../components/validators';

const WelcomeScreen = (props) => {
    const dispatch = useDispatch()
    const navigationState = props.navigation.getState()
    const navigation = useNavigation()
    console.log("navigation", navigationState)
    const next = (role, type) => {
        dispatch(setUserRole({ data: role }))
        if (type == "login") {
            props.navigation.navigate('AuthStack', { screen: "LoginScreen" })
        } else if (type == "register") {
            props.navigation.navigate('AuthStack', { screen: "SignUpScreen" })
        }
    }

    return (
        // <SafeAreaView style={globalStyles.safeAreaView}>
        <ImageBackground resizeMode={Platform.OS == "ios" ? "cover" : "stretch"} source={require("../../../assets/login/login_back.png")} style={styles.container}>
            {/* <View style={styles.logoContainer}>
                    <Image resizeMode="contain" style={styles.image} source={require('../../../assets/splash/logo.png')} />
                </View> */}
            <View style={{ flex: 1, backgroundColor: "#0008", justifyContent: "center" }}>
                <ScrollView
                    contentContainerStyle={{
                        justifyContent: "center",
                        flexGrow: 1,
                    }}
                >
                    <View
                        style={{
                            marginHorizontal: 20,
                            borderWidth: 2,
                            borderRadius: 10,
                            padding: 10,
                            minHeight: 180,
                            borderColor: LS_COLORS.global.green,
                            justifyContent: "space-evenly"
                        }}
                    >
                        <Text maxFontSizeMultiplier={1.7} style={{ color: "white", fontSize: 24, textAlign: "center", fontFamily: LS_FONTS.PoppinsSemiBold }}>Customer</Text>
                        <Text maxFontSizeMultiplier={1.7} style={{ color: "white", fontSize: 18, textAlign: "center", fontFamily: LS_FONTS.PoppinsSemiBold }}>Find the service you need</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    next(1, "login")
                                }}
                                style={{ minHeight: 45, flex: 1, backgroundColor: LS_COLORS.global.green, justifyContent: "center", borderRadius: 6 }}>
                                <Text maxFontSizeMultiplier={1.7} style={{ color: "white", fontSize: 16, textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular }}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    next(1, "register")
                                }}
                                style={{ minHeight: 45, flex: 1, backgroundColor: LS_COLORS.global.white, justifyContent: "center", borderRadius: 6, marginLeft: 10 }}>
                                <Text maxFontSizeMultiplier={1.7} style={{ color: "black", fontSize: 16, textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular }}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                        onPress={() => {
                            dispatch(setUserRole({ data: 1 }))
                            dispatch(setUserType("guest"))
                            dispatch(loginReducer({
                                "address": [

                                ],
                                "created_at": "2022-02-19T06:26:26.000000Z",
                                "dob": "1995-07-21",
                                "email": "",
                                "email_verified_at": null,
                                "first_name": "Guest",
                                "id": 78,
                                "is_accept_cdd": "1",
                                "is_accept_privatepolicy": "1",
                                "is_accept_termscondition": "1",
                                "is_same_address": "0",
                                "last_name": "",
                                "middle_name": "null",
                                "notification_prefrence": 2,
                                "otp": "",
                                "phone_number": "",
                                "prefer_name": "null",
                                "profile_image": "",
                                "rating": null,
                                "stripe_user_id": "",
                                "timezone": "Asia/Kolkata",
                                "updated_at": "2022-04-05T09:37:35.000000Z",
                                "user_role": 2,
                                "user_status": 1
                            }
                            ))
                            dispatch(changeSwitched(false))
                            props.navigation.dispatch(
                                CommonActions.reset({
                                    index: 1,
                                    routes: [
                                        { name: "MainDrawer" },
                                    ],
                                })
                            );
                            props.navigation.navigate("MainDrawer")
                        }}
                        style={{ minHeight: 45, backgroundColor: LS_COLORS.global.green, justifyContent: "center", borderRadius: 6, marginTop: 10 }}>
                        <Text maxFontSizeMultiplier={1.7} style={{ color: "white", fontSize: 16, textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular }}>Guest Login</Text>
                    </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            marginHorizontal: 20,
                            borderWidth: 2,
                            borderRadius: 10,
                            padding: 10,
                            minHeight: 180,
                            borderColor: LS_COLORS.global.green,
                            marginTop: "20%",
                            justifyContent: "space-evenly"
                        }}
                    >
                        <Text maxFontSizeMultiplier={1.7} style={{ color: "white", fontSize: 24, textAlign: "center", fontFamily: LS_FONTS.PoppinsSemiBold }}>Service Provider</Text>
                        <Text maxFontSizeMultiplier={1.7} style={{ color: "white", fontSize: 18, textAlign: "center", fontFamily: LS_FONTS.PoppinsSemiBold }}>Utilize your expertise and grow your business</Text>
                        <View maxFontSizeMultiplier={1.7} style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                            <TouchableOpacity onPress={() => {
                                next(2, "login")
                            }} style={{ minHeight: 45, flex: 1, backgroundColor: LS_COLORS.global.green, justifyContent: "center", borderRadius: 6 }}>
                                <Text maxFontSizeMultiplier={1.7} style={{ color: "white", fontSize: 16, textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular }}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    next(2, "register")
                                }}
                                style={{ minHeight: 45, flex: 1, backgroundColor: LS_COLORS.global.white, justifyContent: "center", borderRadius: 6, marginLeft: 10 }}>
                                <Text maxFontSizeMultiplier={1.7} style={{ color: "black", fontSize: 16, textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular }}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                   
                </ScrollView>
            </View>
        </ImageBackground>
        // </SafeAreaView>
    )
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'space-evenly',
        // backgroundColor: LS_COLORS.global.white,

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
