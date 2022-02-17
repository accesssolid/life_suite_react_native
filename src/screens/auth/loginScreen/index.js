import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, TouchableOpacity } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { getUniqueId, getManufacturer } from 'react-native-device-info';

/* Components */
import CustomTextInput from '../../../components/customTextInput';
import CustomButton from '../../../components/customButton';
import { Card, Container, Content, Root } from "native-base";
import { retrieveItem, showToast, storeItem } from '../../../components/validators'
import ReactNativeBiometrics from 'react-native-biometrics'
import Loader from "../../../components/loader"
import { getApi } from "../../../api/api"
import { loginReducer, setAuthToken, setUserRole } from '../../../redux/features/loginReducer';
import messaging from '@react-native-firebase/messaging';

/* Icons */
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { CommonActions } from '@react-navigation/native';
import * as RNLocalize from "react-native-localize";


const LoginScreen = (props) => {
    const [fcmToken, setFcmToken] = useState("")
    const dispatch = useDispatch()
    const passRef = useRef(null)
    const role = useSelector(state => state.authenticate.user_role)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loader, setLoader] = useState(false)
    const [passVisible, setPassVisible] = useState(false)

    const switchRole = () => {
        dispatch(setUserRole({ data: role == 1 ? 2 : 1 }))
    }

    useEffect(() => {
        GetToken()
    }, [])

    const GetToken = async () => {
        const authorizationStatus = await messaging().requestPermission();
        if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
            const token = await messaging().getToken()
            console.log('TOKEN==>>>>', token)
            setFcmToken(token)
        }
    }

    console.log(fcmToken)
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
            "fcm_token": fcmToken,
            device_id: getUniqueId(),
            login_type: "biometric",
            timezone:RNLocalize.getTimeZone()
        }
        let config = {
            headers: headers,
            data: JSON.stringify(user_data),
            endPoint: role == 1 ? '/api/customerSignin' : '/api/providerSignin',
            type: 'post'
        }

        getApi(config)
            .then(async (response) => {
                console.log(response)
                if (response.status == true) {
                    setLoader(false)
                    showToast(response.message, 'success')
                    await storeItem('user', response.data)
                    await storeItem('user_bio_data', response.data)
                    await storeItem('access_token', response.access_token)
                    dispatch(setAuthToken({ data: response.access_token }))
                    dispatch(loginReducer(response.data))
                    setEmail("")
                    setPassword("")
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                { name: "MainDrawer" },
                            ],
                        })
                    );
                    props.navigation.navigate("MainDrawer")
                    // if (response.data.user_role == 2) {
                    //     props.navigation.navigate("UserStack")
                    // } else {
                    //     props.navigation.navigate("ProviderStack")
                    // }
                }
                else {
                    setLoader(false)
                    showToast(response.message, 'danger')
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    async function on_press_touch() {
        try {
            const { biometryType } = await ReactNativeBiometrics.isSensorAvailable()

            ReactNativeBiometrics.isSensorAvailable()
                .then((resultObject) => {
                    const { available, biometryType } = resultObject
                    if (available && biometryType === ReactNativeBiometrics.TouchID) {
                        evaluateBiometric(biometryType)
                    } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
                        evaluateBiometric(biometryType)
                    } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
                        evaluateBiometric(biometryType)
                    } else {
                        showToast('Biometrics not supported', 'danger')
                    }
                })
        } catch (error) {
            console.log("on_press_touch error => ", error)
        }
    }

    const evaluateBiometric = (type) => {
        try {
            ReactNativeBiometrics.simplePrompt({ promptMessage: type == "FaceID" ? 'Confirm Face ID' : "Confirm fingerprint" })
                .then((resultObject) => {
                    const { success } = resultObject
                    if (success) {
                        retrieveItem('user_bio_data').then((data) => {
                            if (data) {
                                dispatch(loginReducer(data))
                                retrieveItem('access_token').then(res => {
                                    dispatch(setAuthToken({ data: res }))
                                    if (role == 1 && data.user_role == 2) {
                                        props.navigation.navigate("UserStack")
                                    } else if (role == 2 && data.user_role == 3)
                                        if (data.user_role == 2) {
                                            props.navigation.navigate("ProviderStack")
                                        } else {
                                            showToast("Please login first")
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
        } catch (error) {
            console.log("evaluateBiometric error => ", error)
        }
    }

    async function on_press_face() {
        try {
            const { biometryType } = await ReactNativeBiometrics.isSensorAvailable()
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
        } catch (error) {
            console.log("on_press_face error => ", error)
        }
    }

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Root>
                <Container style={styles.container}>
                    <Ionicons onPress={()=>props.navigation.goBack()} name='arrow-back' size={24} style={{padding:20}}/>
                    <Content showsVerticalScrollIndicator={false}>
                        <View style={styles.textContainer}>
                            <Text style={styles.loginText}>{role == 1 ? "Customer" : "Service Provider"}</Text>
                            <Text style={{ ...styles.loginText, fontSize: 24 }}>Login</Text>
                            <Text style={styles.text}>Add your details to Login</Text>
                        </View>
                        <View style={{ marginTop: "10%" }} />
                        <CustomTextInput
                            placeholder="Your Email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text)
                            }}
                            keyboardType="email-address"
                            returnKeyType="next"
                            onSubmitEditing={() => passRef.current.focus()}
                        />
                        <CustomTextInput
                            inputRef={passRef}
                            placeholder="Password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text)
                            }}
                            secureTextEntry={!passVisible}
                            inlineImageLeft={<Entypo name={!passVisible ? "eye" : 'eye-with-line'} size={18} />}
                            onLeftPress={() => setPassVisible(state => !state)}
                        />
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
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => switchRole()}
                            style={styles.forgotContainer}>
                            <Text style={{ ...styles.forgot, alignSelf: 'center', textDecorationLine: 'underline' }}>Login as {role == 1 ? "Service Provider" : "Customer"}</Text>
                        </TouchableOpacity>

                        <View style={styles.alreadyContainer}>
                            <Text style={styles.already}>Don't have account ?</Text>
                            <TouchableOpacity onPress={() => {
                                props.navigation.navigate("SignUpScreen")
                            }}>
                                <Text style={styles.already1}> Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={styles.facecontainer}>
                            {
                                Platform.OS == 'ios' &&
                                <TouchableOpacity onPress={() => on_press_touch()}>
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
                        </View> */}
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
        backgroundColor: LS_COLORS.global.white,
    },
    textContainer: {
        marginTop: "20%",
    },
    loginText: {
        fontSize: 24,
        textAlign: 'center',
        color: LS_COLORS.global.black,
        fontFamily: LS_FONTS.PoppinsSemiBold,
        alignSelf: 'center'
    },
    text: {
        color: LS_COLORS.global.grey,
        fontFamily: LS_FONTS.PoppinsMedium,
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
        marginTop: 20
    },
    buttonContainer: {
        marginTop: "5%",
        width: '100%'
    },
    forgotContainer: {
        width: "100%",
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
        marginTop: 30,
        paddingHorizontal: '10%'
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
