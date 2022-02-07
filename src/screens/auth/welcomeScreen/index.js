import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, Text, SafeAreaView, TouchableOpacity, ImageBackground, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import Header from '../../../components/header';
import { setUserRole } from '../../../redux/features/loginReducer';

const { width, height } = Dimensions.get("window")

const WelcomeScreen = (props) => {
    const dispatch = useDispatch()

    const next = (role,type) => {
        dispatch(setUserRole({ data: role }))
        if(type=="login"){
            props.navigation.navigate('AuthStack',{screen:"LoginScreen"})
        }else if(type=="register"){
            props.navigation.navigate('AuthStack',{screen:"SignUpScreen"})
        }
       
    }

    return (
        // <SafeAreaView style={globalStyles.safeAreaView}>
        <ImageBackground source={require("../../../assets/login/login_back.png")} style={styles.container}>
            {/* <View style={styles.logoContainer}>
                    <Image resizeMode="contain" style={styles.image} source={require('../../../assets/splash/logo.png')} />
                </View> */}
            <View style={{ flex: 1, backgroundColor: "#0008", justifyContent: "center" }}>
                {/* <ScrollView> */}
                <View
                    style={{
                        marginHorizontal: 20,
                        borderWidth: 2,
                        borderRadius: 10,
                        padding: 10,
                        height: 180,
                        borderColor: LS_COLORS.global.green,
                        justifyContent: "space-evenly"
                    }}
                >
                    <Text style={{ color: "white", fontSize: 24, textAlign: "center", fontFamily: LS_FONTS.PoppinsSemiBold }}>Customer</Text>
                    <Text style={{ color: "white", fontSize: 18, textAlign: "center", fontFamily: LS_FONTS.PoppinsSemiBold }}>Find the service you need</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                        <TouchableOpacity 
                        onPress={()=>{
                            next(1,"login")
                        }}
                        style={{ height: 45, flex: 1, backgroundColor: LS_COLORS.global.green, justifyContent: "center", borderRadius: 6 }}>
                            <Text style={{ color: "white", fontSize: 16, textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular }}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={()=>{
                            next(1,"register")
                        }}
                        style={{ height: 45, flex: 1, backgroundColor: LS_COLORS.global.white, justifyContent: "center", borderRadius: 6, marginLeft: 10 }}>
                            <Text style={{ color: "black", fontSize: 16, textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular }}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View
                    style={{
                        marginHorizontal: 20,
                        borderWidth: 2,
                        borderRadius: 10,
                        padding: 10,
                        height: 180,
                        borderColor: LS_COLORS.global.green,
                        marginTop: "20%",
                        justifyContent: "space-evenly"
                    }}
                >
                    <Text style={{ color: "white", fontSize: 24, textAlign: "center", fontFamily: LS_FONTS.PoppinsSemiBold }}>Service Provider</Text>
                    <Text style={{ color: "white", fontSize: 18, textAlign: "center", fontFamily: LS_FONTS.PoppinsSemiBold }}>Utilize your expertise and grow your business</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                        <TouchableOpacity onPress={() => {
                            next(2,"login")
                        }} style={{ height: 45, flex: 1, backgroundColor: LS_COLORS.global.green, justifyContent: "center", borderRadius: 6 }}>
                            <Text style={{ color: "white", fontSize: 16, textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular }}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                next(2,"register")
                            }}
                            style={{ height: 45, flex: 1, backgroundColor: LS_COLORS.global.white, justifyContent: "center", borderRadius: 6, marginLeft: 10 }}>
                            <Text style={{ color: "black", fontSize: 16, textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular }}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* </ScrollView> */}
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
