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


const SignUpScreen = (props) => {

    const dispatch = useDispatch()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cnfPass, setCnfPass] = useState("")
    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <>
                <View style={styles.container}>
                    <View style={styles.textContainer}>
                        <Text style={styles.loginText}>Signup</Text>
                        <Text style={styles.text}>Add your details to Signup</Text>
                    </View>
                    <View style={styles.textInputContainer}>
                        <CustomTextInput
                            placeholder="Your Email"
                            value={name}
                            onChangeText={(text) => {
                                setName(text)
                            }}
                        />
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
                        <CustomTextInput
                            placeholder="Password"
                            value={cnfPass}
                            onChangeText={(text) => {
                                setCnfPass(text)
                            }}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <CustomButton
                            title="Sign Up"
                        />
                    </View>
                    <View style={styles.alreadyContainer}>
                        <Text style={styles.already}>Already have an account ?</Text>
                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate("LoginScreen")
                        }}>
                            <Text style={styles.already1}> Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </>
        </SafeAreaView>
    )
}

export default SignUpScreen;

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
        width: '100%'
    },
    alreadyContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: "3%"
    },
    already: {
        fontSize: 14,
        lineHeight: 19,
        color: LS_COLORS.global.lightTextColor,
        fontFamily: LS_FONTS.PoppinsRegular
    },
    already1:{
        fontSize: 14, 
        lineHeight: 19, 
        color: LS_COLORS.global.green, 
        fontFamily: LS_FONTS.PoppinsSemiBold
    }
})
