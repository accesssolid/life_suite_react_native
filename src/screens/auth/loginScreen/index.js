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
import { Card, Container, Content, Root } from "native-base";
import { retrieveItem, showToast, storeItem } from '../../../components/validators'
import ReactNativeBiometrics from 'react-native-biometrics'
import Loader from "../../../components/loader"
import { getApi } from "../../../api/api"
import { loginReducer, setAuthToken } from '../../../redux/features/loginReducer';
const LoginScreen = (props) => {
    const dispatch = useDispatch()
    const role = useSelector(state => state.authenticate.user_role)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loader, setLoader] = useState(false)

    function on_press_login() {
        setLoader(true)
        if (email.length == 0 || password.length == 0) {
            showToast('Enter All Fields', 'danger')
            setLoader(false)
            return false
        }
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
        let user_data = {
            "email": email.toLowerCase(),
            "password": password,
            "fcm_token": "fcm123",
            device_id: "dev124",
            login_type: "biometric",
        }
        let config = {
            headers: headers,
            data: JSON.stringify(user_data),
            endPoint: role == 1 ? '/api/customerSignin' : '/api/providerSignin',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setLoader(false)
                    showToast(response.message, 'success')
                    storeItem('user', response.data)
                    storeItem('user_bio_data', response.data)
                    storeItem('access_token', response.access_token)
                    dispatch(setAuthToken({ data: response.access_token }))
                    dispatch(loginReducer(response.data))
                    setEmail("")
                    setPassword("")
                    if (response.data.user_role == 2) {
                        props.navigation.navigate("UserStack")
                    } else {
                        props.navigation.navigate("ProviderStack")
                    }
                }
                else {
                    setLoader(false)
                    showToast(response.message, 'danger')
                }
            })
            .catch(err => {

            })
    }

    async function on_press_touch() {
        const { biometryType } = await ReactNativeBiometrics.isSensorAvailable()

        if (biometryType === Platform.OS == 'ios' ? ReactNativeBiometrics.TouchID : ReactNativeBiometrics.Biometrics) {
            ReactNativeBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
                .then((resultObject) => {
                    const { success } = resultObject
                    if (success) {
                        retrieveItem('user_bio_data').then((data) => {
                            if (data) {
                                dispatch(loginReducer(data))
                                retrieveItem('access_token').then(res => {
                                    dispatch(setAuthToken({ data: res }))
                                    if (data.user_role == 2) {
                                        props.navigation.navigate("UserStack")
                                    } else {
                                        props.navigation.navigate("ProviderStack")
                                    }
                                })
                            }
                            else {
                                showToast('You have to login First Time', 'danger')
                            }
                        })
                    } else {
                        console.log('user cancelled biometric prompt')
                    }
                })
                .catch(() => {
                    console.log('biometrics failed')
                })
        }
        else {
            showToast('Does not Support TouchID', 'danger')
        }
    }

    // on_press_face
    async function on_press_face() {
        const { biometryType } = await ReactNativeBiometrics.isSensorAvailable()
        console.log(biometryType)
        if (biometryType === Platform.OS == 'ios' ? ReactNativeBiometrics.FaceID : ReactNativeBiometrics.Biometrics) {
            ReactNativeBiometrics.simplePrompt({ promptMessage: 'Confirm FaceID', })
                .then((resultObject) => {
                    const { success } = resultObject
                    if (success) {
                        retrieveItem('user_bio_data').then((data) => {
                            if (data) {
                                dispatch(loginReducer(data))
                                retrieveItem('access_token').then(res => {
                                    dispatch(setAuthToken({ data: res }))
                                    if (data.user_role == 2) {
                                        props.navigation.navigate("UserStack")
                                    } else {
                                        props.navigation.navigate("ProviderStack")
                                    }
                                })
                            }
                            else {
                                showToast('You have to login First Time', 'danger')
                            }
                        })
                    } else {
                        console.log('User cancelled biometric prompt')
                    }
                })
                .catch(() => {
                    console.log('biometrics failed')
                })
        }
        else {
            showToast('Doesnot Support FaceID', 'danger')
        }

    }
    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Root>
                <Container style={styles.container}>
                    <Content>
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
                                keyboardType="email-address"
                            />
                            <CustomTextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text)
                                }}
                                secureTextEntry
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <CustomButton
                                title="Login"
                                activeOpacity={0.7}
                                action={() => {
                                    on_press_login()
                                }}
                            />
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                                props.navigation.navigate("VerificationCode")
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
                        <View style={styles.facecontainer}>
                            {
                                Platform.OS == 'ios' &&
                                <TouchableOpacity onPress={() => on_press_face()}>
                                    <Card style={styles.card}>
                                        <Image
                                            style={styles.image}
                                            source={require("../../../assets/face.png")}
                                        />
                                    </Card>
                                </TouchableOpacity>
                            }

                            <TouchableOpacity onPress={() => on_press_touch()}>
                                <Card style={styles.card}>
                                    <Image
                                        style={styles.image}
                                        source={require("../../../assets/fingerPrint.png")}
                                    />
                                </Card>
                            </TouchableOpacity>

                        </View>
                        {loader == true && <Loader />}
                    </Content>
                </Container>
            </Root>
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
        width: "50%",
        marginTop: 20,
        alignSelf: 'center'
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
    },
    facecontainer: {
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: 'center',
        marginTop: 30
    },
    card: {
        borderRadius: 17,
        height: 80,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 43,
        height: 43,
        resizeMode: 'contain'
    },
})
