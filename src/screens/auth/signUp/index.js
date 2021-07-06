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
import Loader from "../../../components/loader"
import { showToast } from '../../../components/validators';
import { getApi } from '../../../api/api';
import { Container, Content,Root } from 'native-base';
const SignUpScreen = (props) => {
    const role = props.route.params.role
    console.log(role)
    const dispatch = useDispatch()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cnfPass, setCnfPass] = useState("")
    const [loader,setLoader] = useState(false)

    function on_press_register() {
        setLoader(true)
        if (name.length == 0 || email.length == 0 || password.length == 0 ||
            cnfPass.length == 0 
        ) {
            showToast('Required All Fields', 'danger')
            setLoader(false)
            return false
        }
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) == false) {
            showToast('Enter Valid Email', 'danger')
            setLoader(false)
            return false
        }
        if (password.length < 6) {
            showToast('Password Must have 6 Characters', 'danger')
            setLoader(false)
            return false
        }
        if (password != cnfPass) {
            showToast('Password Doesnot Match', 'danger')
            setLoader(false)
            return false
        }
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
        let user_data = {
            "name": name,
            "email": email.toLowerCase(),
            "password": password,
            "password_confirmation": cnfPass,
            "user_role" : role
        }
        let config = {
            headers: headers,
            data: JSON.stringify(user_data),
            endPoint: '/api/signup',
            type: 'post'
        }
        getApi(config).then((response) => {
            console.log('resp', response)
            if (response.status == true) {
                showToast('User Registered Successfully', 'success')
                props.navigation.navigate('LoginScreen')
                setLoader(false)
                setName("")
                setEmail("")
                setPassword("")
                setCnfPass("")
            }
            else {
                showToast(response.message, 'danger')
                setLoader(false)
            }
        })
    }
    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Root>
                <Container style={styles.container}>
                    <Content>
                    <View style={styles.textContainer}>
                        <Text style={styles.loginText}>Signup</Text>
                        <Text style={styles.text}>Add your details to Signup</Text>
                    </View>
                    <View style={styles.textInputContainer}>
                        <CustomTextInput
                            placeholder="Name"
                            value={name}
                            onChangeText={(text) => {
                                setName(text)
                            }}
                        />
                        <CustomTextInput
                            placeholder="Email"
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
                            secureTextEntry
                        />
                        <CustomTextInput
                            placeholder="Confirm Password"
                            value={cnfPass}
                            onChangeText={(text) => {
                                setCnfPass(text)
                            }}
                            secureTextEntry
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <CustomButton
                            title="Sign Up"
                            action= {() => {
                                on_press_register()
                            }}
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
                    </Content>
                </Container>
                {
                    loader == true &&
                    <Loader />

                }

            </Root>
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
