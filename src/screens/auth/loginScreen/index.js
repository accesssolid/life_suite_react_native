import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, TouchableOpacity } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import CustomTextInput from '../../../components/customTextInput';
import CustomButton from '../../../components/customButton';


const LoginScreen = (props) => {

    const dispatch = useDispatch()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <>
                <View style={styles.container}>
                    <View style={styles.textContainer}>
                        <Text style={styles.loginText}>Login</Text>
                        <Text style={styles.text}>Add your details to Login</Text>
                    </View>
                    <View style={styles.textInputContainer}>
                        <CustomTextInput
                            placeholder="Your Email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text)
                            }}
                        />
                        <CustomTextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text)
                            }}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <CustomButton
                            title="Login"
                            activeOpacity={0.7}
                            action={() => {
                                props.navigation.navigate("HomeScreen")
                            }}
                        />
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {

                        }}
                        style={styles.forgotContainer}>
                        <Text style={styles.forgot}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <View style={styles.alreadyContainer}>
                        <Text style={styles.already}>Don't have account ?</Text>
                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate("SignUpScreen")
                        }}>
                            <Text style={styles.already1}> Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </>
        </SafeAreaView>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: LS_COLORS.global.white,

    },
    textContainer: {
        marginTop: "20%"
    },
    loginText: {
        fontSize: 28,
        lineHeight: 42,
        textAlign: 'center',
        color: LS_COLORS.global.black,
        fontFamily: LS_FONTS.PoppinsSemiBold
    },
    text: {
        color: LS_COLORS.global.grey,
        fontFamily: LS_FONTS.PoppinsMedium,
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
        marginTop: 20
    },
    textInputContainer: {
        marginTop: "10%",
        width: '100%'
    },
    buttonContainer: {
        marginTop: "5%",
        width: '100%'
    },
    forgotContainer: {
        width: "30%",
        marginTop: 20,
    },
    forgot: {
        color: LS_COLORS.global.lightTextColor,
        fontFamily: LS_FONTS.PoppinsRegular,
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
    },
    alreadyContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: "5%"
    },
    already: {
        fontSize: 14,
        lineHeight: 19,
        color: LS_COLORS.global.lightTextColor,
        fontFamily: LS_FONTS.PoppinsRegular
    },
    already1: {
        fontSize: 14,
        lineHeight: 19,
        color: LS_COLORS.global.green,
        fontFamily: LS_FONTS.PoppinsSemiBold
    }
})
