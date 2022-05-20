import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, TouchableOpacity, Modal } from 'react-native'

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
import { loginReducer, setAuthToken, setUserRole, setUserType } from '../../../redux/features/loginReducer';
import messaging from '@react-native-firebase/messaging';

/* Icons */
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { CommonActions, useNavigation } from '@react-navigation/native';
import * as RNLocalize from "react-native-localize";
import { changeSwitched } from '../../../redux/features/switchTo';




const LoginScreen = (props) => {
    const [fcmToken, setFcmToken] = useState("")
    const dispatch = useDispatch()
    const passRef = useRef(null)
    const role = useSelector(state => state.authenticate.user_role)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loader, setLoader] = useState(false)
    const [passVisible, setPassVisible] = useState(false)
    const [modalVisible, setModalVisible] = React.useState(false)
    const [message, setMessage] = React.useState("")
    const [user, setUser] = React.useState({})
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
            timezone: RNLocalize.getTimeZone()
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
                    dispatch(setUserType("user"))
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
                }
                else {
                    setLoader(false)
                    showToast(response.message, 'danger')
                    if (response?.data?.user_status == 2) {
                        setMessage(response.message)
                        setModalVisible(true)
                        setUser(response?.data)
                    }
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
                    <Ionicons onPress={() => props.navigation.goBack()} name='arrow-back' size={24} style={{ padding: 20 }} />
                    <Content showsVerticalScrollIndicator={false}>
                        <View style={styles.textContainer}>
                            <Text maxFontSizeMultiplier={1.7} style={styles.loginText}>{role == 1 ? "Customer" : "Service Provider"}</Text>
                            <Text maxFontSizeMultiplier={1.7} style={{ ...styles.loginText, fontSize: 24 }}>Login</Text>
                            <Text maxFontSizeMultiplier={1.7} style={styles.text}>Add your details to Login</Text>
                        </View>
                        <View style={{ marginTop: "10%" }} />
                        <CustomTextInput
                            placeholder="Your Email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text?.trim())
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
                            <Text maxFontSizeMultiplier={1.7} style={styles.forgot}>Forgot Password?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => switchRole()}
                            style={styles.forgotContainer}>
                            <Text maxFontSizeMultiplier={1.7} style={{ ...styles.forgot, alignSelf: 'center', textDecorationLine: 'underline' }}>Login as {role == 1 ? "Service Provider" : "Customer"}</Text>
                        </TouchableOpacity>
                        <View style={styles.alreadyContainer}>
                            <Text maxFontSizeMultiplier={1.7} style={[styles.already, { textAlign: "center" }]}>Don't have account ?<Text maxFontSizeMultiplier={1.7} style={styles.already1} onPress={() => {
                                props.navigation.navigate("SignUpScreen")
                            }}> Sign Up</Text></Text>
                        </View>
                        {loader == true && <Loader />}
                    </Content>
                </Container>
            </Root>
            <BlockMessageModal text={message} user={user} visible={modalVisible} setVisble={setModalVisible} />
        </SafeAreaView>
    )
}

export default LoginScreen;

const BlockMessageModal = ({ text, visible, setVisble ,user}) => {
    const navigation=useNavigation()
    return (
        <Modal
            onBackButtonPress={() => {
                if (setVisble) {
                    setVisble(false)
                }
            }}
            onBackdropPress={() => {
                if (setVisble) {
                    setVisble(false)
                }
            }}
            hasBackdrop={true}
            visible={visible}
            transparent={true}
        // animationType="slide"
        >
            <View style={{ flex: 1, backgroundColor: "#0005", justifyContent: "center" }}>
                <View style={styles.container1}>
                    <Text maxFontSizeMultiplier={1.5} style={styles.title}></Text>
                    <Image source={require('../../../assets/splash/logo.png')} resizeMode="contain" style={{ height: 100, width: 200, alignSelf: "center" }} />
                    <Text maxFontSizeMultiplier={1.4} style={{ color: "black", fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 16, textAlign: "center" }}>{text}</Text>

                    <View style={{ flexDirection: "row" ,justifyContent:"space-between"}}>
                        <TouchableOpacity onPress={() => {
                            if (setVisble) {
                                setVisble(false)
                            }
                        }} style={{ backgroundColor: LS_COLORS.global.green, padding: 10, width: "40%", alignSelf: "center", borderRadius: 5, margin: 10 }} >
                            <Text maxFontSizeMultiplier={1.4} style={{ fontFamily: LS_FONTS.PoppinsRegular, color: "white", textAlign: "center" }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                           navigation.navigate("ContactUs",{user})
                           setVisble(false)
                        }} style={{ backgroundColor: LS_COLORS.global.green, padding: 10, width: "40%", alignSelf: "center", borderRadius: 5, margin: 10 }} >
                            <Text maxFontSizeMultiplier={1.4} style={{ fontFamily: LS_FONTS.PoppinsRegular, color: "white", textAlign: "center" }}>Contact Us</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => {
                        if (setVisble) {
                            setVisble(false)
                        }
                    }} style={{ position: 'absolute', top: '3%', right: '3%' }}>
                        <Image source={require('../../../assets/cancel.png')} resizeMode="contain" style={{ height: 25, width: 25 }} />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

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
    wrapper: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container1: {
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







