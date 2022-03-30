
import { Container, Content, Icon, Switch } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    BackHandler,
    StatusBar,
    Text,
    View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReactNativeBiometrics from 'react-native-biometrics'
import Header from '../../../components/header';
import CustomButton from '../../../components/customButton';
import { getJsonData, storeJsonData } from '../../../asyncStorage/async'
import LS_COLORS from '../../../constants/colors';

const Settings = (props) => {
    const [passcodeVerification, setPassCodeVerification] = useState(false)
    const [biometricVerification, setBiometricVerification] = useState(false)

    const getPasscode = async () => {
        let pass = await getJsonData("passcode")
        let passVerification = await getJsonData("passcodeVerification")
        let fingerVerification = await getJsonData("fingerPrintVerification")
        if (pass && passVerification) {
            setPassCodeVerification(true)
        }
        if (pass && passVerification && fingerVerification) {
            setBiometricVerification(true)
        } else if (!passVerification) {
            setPassCodeVerification(false)
        }
    }

    const setPassCode = async (v) => {
        try{
            setPassCodeVerification(v)
            let pass = await getJsonData("passcode")
            let passVerification = await getJsonData("passcodeVerification")
            console.log(pass,v,passVerification)
            if (v) {
                if (pass && !passVerification) {
                    let x = await storeJsonData("passcodeVerification", true)
                    setPassCodeVerification(true)
                }
                if (!pass) {
                    props.navigation.navigate('SetPassCode')
                }
            }
            else {
                if (passVerification) {
                    let x = await storeJsonData("passcodeVerification", null)
                    let y = await storeJsonData("fingerPrintVerification", null)
                    storeJsonData("passcode",null)
                    setPassCodeVerification(false)
                    setBiometricVerification(false)
                }
                
            }
        }catch(err){
            console.error(err)
        }
       
    }

    const setBiometric = async (v) => {
        let passVerification = await getJsonData("passcodeVerification")
        const { biometryType } = await ReactNativeBiometrics.isSensorAvailable()
        let fingerVerification = await getJsonData("fingerPrintVerification")
        console.log("passVerification => ", passVerification)
        console.log("fingerVerification => ", fingerVerification)
        console.log("biometryType => ", biometryType)
        if (v) {
            if (!fingerVerification && biometryType !== undefined) {
                let x = await storeJsonData("fingerPrintVerification", true)
                setBiometricVerification(true)
            }
            else {
                if (biometryType === ReactNativeBiometrics.TouchID) {
                    if (passVerification) {
                        setBiometricVerification(true)
                    }
                    else {
                        Alert.alert('Turn on passcode authentication')
                    }
                } else if (biometryType === ReactNativeBiometrics.FaceID) {
                    if (passVerification) {
                        setBiometricVerification(true)
                    }
                    else {
                        Alert.alert('Turn on passcode authentication')
                    }
                } else if (biometryType === ReactNativeBiometrics.Biometrics) {
                    if (passVerification) {
                        setBiometricVerification(true)
                    }
                    else {
                        Alert.alert('Turn on passcode authentication')
                    }
                } else {
                    Alert.alert('Biometrics are not supported or turned off')
                    setBiometricVerification(false)
                }
            }
        }
        else {
            if (fingerVerification) {
                let x = await storeJsonData("fingerPrintVerification", null)
                setBiometricVerification(false)
            }
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            getPasscode()
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                props.navigation.goBack()
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );
        }, [])
    );
    return (
        <>
            <SafeAreaView style={{ flex: 1 ,backgroundColor:LS_COLORS.global.green}}>
            <StatusBar
                backgroundColor={LS_COLORS.global.green}
                 />
                <Header
                    imageUrl={require("../../../assets/back.png")}
                    action={() => props.navigation.goBack()}
                    imageUrl1={require("../../../assets/home.png")}
                    action1={() => props.navigation.navigate("MainDrawer",{screen:"HomeScreen"})}
                    title="Settings"
                    containerStyle={{backgroundColor:LS_COLORS.global.cyan}}

                />
                <Container>
                    <Content bounces={false} scrollEnabled={true} >
                        <View style={{ flex: 1 }}>
                            <View style={{ width: '90%', alignSelf: 'center', flex: 1 }}>
                                <View style={{ flexDirection: 'row', width: '100%', marginVertical: 10 }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={{}}>Passcode Authentication</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center' }}>
                                        <Switch
                                            value={passcodeVerification}
                                            onValueChange={() => setPassCode(!passcodeVerification)}
                                        />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', width: '100%', marginTop: 10 }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={{}}>Biometrics Authentication</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center' }}>
                                        <Switch
                                            value={biometricVerification}
                                            onValueChange={() => setBiometric(!biometricVerification)}
                                        />
                                    </View>
                                </View>
                                {passcodeVerification && <CustomButton
                                    title="Change Passcode"
                                    customStyles={{ width: '60%', marginTop: 10 }}
                                    action={() => props.navigation.navigate('SetPassCode')}
                                />}
                            </View>
                        </View>
                    </Content>
                </Container>
            </SafeAreaView>
        </>
    );
};


export default Settings;