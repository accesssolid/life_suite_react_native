import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native'

/* Constants */
import LS_COLORS from '../../constants/colors';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import ReactNativeBiometrics from 'react-native-biometrics'

/* Methods */
import { retrieveItem, showToast } from '../../components/validators';
import { loginReducer, setAuthToken } from '../../redux/features/loginReducer';
import { getApi } from '../../api/api';
import { getJsonData, storeJsonData } from '../../asyncStorage/async'
import { StackActions, NavigationActions, CommonActions } from '@react-navigation/native';
import {role} from '../../constants/globals'

const Splash = (props) => {
    const dispatch = useDispatch()
    const access_token = useSelector(state => state.authenticate.access_token)
    const user = useSelector(state => state.authenticate.user)

    useEffect(() => {
        // checkAuth()
        BiometricsAuth()
    }, [])

    useEffect(() => {
        if (access_token !== null) {
            getUser(user.id)
        }
    }, [access_token,user])

    const getUser = (id) => {
        // alert()
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let user_data = {
            "user_id": id,
        }
        let config = {
            headers: headers,
            data: JSON.stringify(user_data),
            endPoint: user.user_role == role.customer ? '/api/customer_detail' : '/api/provider_detail',
            type: 'post'
        }
       
        console.log("Config",config)

        getApi(config)
            .then((response) => {
                
                if (response.status == true) {
                    dispatch(loginReducer(response.data))
                    setTimeout(() => {
                        props.navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [
                                    { name: "MainDrawer" },
                                ],
                            })
                        );

                        // props.navigation.navigate("MainDrawer")
                        // if (response.data.user_role == 2) {
                        //     props.navigation.navigate("UserStack")
                        // } else {
                        //     props.navigation.navigate("ProviderStack")
                        // }
                    }, 2000);
                }
                else {
                    if (response.message !== "The user id field is required.") {
                        // showToast(response.message, 'danger')
                    }
                    setLoader(false)
                }
            })
            .catch(err => {
                // setLoader(false)
                // props.navigation.navigate('WelcomeScreen')

            })
    }

    const checkAuth = () => {
        retrieveItem('user').then((data) => {
            if (data) {
                dispatch(loginReducer(data))
                retrieveItem('access_token').then(res => {
                    dispatch(setAuthToken({ data: res }))
                })
            }
            else {
                setTimeout(() => {
                    props.navigation.navigate('WelcomeScreen')
                }, 2000);
            }
        })
    }

    const BiometricsAuth = async () => {
        const pass = await getJsonData("passcode")
        const bioVerification = await getJsonData("fingerPrintVerification")

        if (pass) {
            const { biometryType } = await ReactNativeBiometrics.isSensorAvailable()
            if (Platform.OS == 'ios') {
                if (bioVerification) {
                    if (biometryType === ReactNativeBiometrics.TouchID) {
                        ReactNativeBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
                            .then((resultObject) => {
                                const { success } = resultObject
                                if (success) {
                                    checkAuth()
                                } else {
                                    setTimeout(() => {
                                        props.navigation.navigate('Passcode')
                                    }, 1000);
                                }
                            })
                            .catch(() => {
                                setTimeout(() => {
                                    props.navigation.navigate('Passcode')
                                }, 1000);
                            })
                    }
                    else if (biometryType === ReactNativeBiometrics.FaceID) {
                        ReactNativeBiometrics.simplePrompt({ promptMessage: 'Confirm face' })
                            .then((resultObject) => {
                                const { success } = resultObject
                                if (success) {
                                    checkAuth()
                                } else {
                                    setTimeout(() => {
                                        props.navigation.navigate('Passcode')
                                    }, 1000);
                                }
                            })
                            .catch(() => {
                                setTimeout(() => {
                                    props.navigation.navigate('Passcode')
                                }, 1000);
                            })
                    }
                    else {
                        setTimeout(() => {
                            props.navigation.navigate('Passcode')
                        }, 1000);
                    }
                }
                else {
                    setTimeout(() => {
                        props.navigation.navigate('Passcode')
                    }, 1000);
                }
            } else {
                if (bioVerification) {
                    if (biometryType === ReactNativeBiometrics.Biometrics) {
                        ReactNativeBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
                            .then((resultObject) => {
                                const { success } = resultObject
                                if (success) {
                                    checkAuth()
                                } else {
                                    setTimeout(() => {
                                        props.navigation.navigate('Passcode')
                                    }, 1000);
                                }
                            })
                            .catch(() => {
                                setTimeout(() => {
                                    props.navigation.navigate('Passcode')
                                }, 1000);
                            })
                    }
                    else {
                        setTimeout(() => {
                            props.navigation.navigate('Passcode')
                        }, 1000);
                    }
                }
                else {
                    setTimeout(() => {
                        props.navigation.navigate('Passcode')
                    }, 1000);
                }
            }
        }
        else {
            setTimeout(async () => {
                checkAuth()
            }, 1000);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image resizeMode="contain" style={styles.image} source={require('../../assets/splash/life.png')} />
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
