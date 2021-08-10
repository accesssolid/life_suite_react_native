
import { Container, Content, Icon, Switch } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    BackHandler,
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TextInputComponent,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ReactNativeBiometrics from 'react-native-biometrics'
import Header from '../../../components/header';
import CustomButton from '../../../components/customButton';

const Settings = (props) => {
    const [passcodeVerification, setPassCodeVerification] = useState(false)
    const [biometricVerification, setBiometricVerification] = useState(false)
    // const getPasscode = async () => {

    //     let pass = await getData(Constants.Passcode)
    //     let passVerification = await getData(Constants.PasscodeVerification)
    //     let fingerVerification = await getData(Constants.FingerPrintVerification)
    //     console.log(passVerification, fingerVerification, '[[[[[', pass)
    //     if (pass && passVerification) {
    //         console.log('hhhhhh')
    //         setPassCodeVerification(true)
    //     }
    //     if (pass && passVerification && fingerVerification) {
    //         setBiometricVerification(true)
    //     } else if (!passVerification) {
    //         console.log('lll')
    //         setPassCodeVerification(false)
    //     }
    // }

    const setPassCode = async (v) => {
        setPassCodeVerification(v)
        // let pass = await getData(Constants.Passcode)
        // let passVerification = await getData(Constants.PasscodeVerification)
        // if (v) {
        //     if (pass && !passVerification) {
        //         let x = await storeData(Constants.PasscodeVerification, '1')
        //         setPassCodeVerification(true)
        //     }
        //     if (!pass) {
        //         props.navigation.navigate('SetPasscode')
        //     }
        // }
        // else {
        //     if (passVerification) {
        //         let x = await storeData(Constants.PasscodeVerification, null)
        //         let y = await storeData(Constants.FingerPrintVerification, null)

        //         setPassCodeVerification(false)
        //         setBiometricVerification(false)

        //         console.log(x)
        //     }
        // }
    }

    const setBiometric = async (v) => {
        setBiometricVerification(v)
        // let passVerification = await getData(Constants.PasscodeVerification)
        // const { biometryType } = await ReactNativeBiometrics.isSensorAvailable()
        // let fingerVerification = await getData(Constants.FingerPrintVerification)
        // if (v) {
        //     if (!fingerVerification) {
        //         let x = await storeData(Constants.FingerPrintVerification, '1')
        //         setBiometricVerification(true)
        //     }
        //     else {
        //         if (biometryType === ReactNativeBiometrics.TouchID) {
        //             if (passVerification) {
        //                 setBiometricVerification(true)

        //             }
        //             else {
        //                 Alert.alert('Turn on passcode authentication')
        //             }
        //         } else if (biometryType === ReactNativeBiometrics.FaceID) {
        //             if (passVerification) {
        //                 setBiometricVerification(true)

        //             }
        //             else {
        //                 Alert.alert('Turn on passcode authentication')
        //             }
        //         } else if (biometryType === ReactNativeBiometrics.Biometrics) {
        //             if (passVerification) {
        //                 setBiometricVerification(true)

        //             }
        //             else {
        //                 Alert.alert('Turn on passcode authentication')
        //             }
        //         } else {
        //             Alert.alert('Biometrics are not supported or turned off')
        //             setBiometricVerification(false)
        //         }
        //     }
        // }
        // else {
        //     if (fingerVerification) {
        //         let x = await storeData(Constants.FingerPrintVerification, null)
        //         setBiometricVerification(false)
        //     }
        // }
    }

    // useFocusEffect(
    //     React.useCallback(() => {
    //         getPasscode()
    //     }, [])
    // );

    // useFocusEffect(
    //     React.useCallback(() => {
    //         const backAction = () => {
    //             props.navigation.goBack()
    //             return true;
    //         };

    //         const backHandler = BackHandler.addEventListener(
    //             "hardwareBackPress",
    //             backAction
    //         );
    //     }, [])
    // );

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    imageUrl={require("../../../assets/back.png")}
                    action={() => props.navigation.pop()}
                    imageUrl1={require("../../../assets/home.png")}
                    action1={() => props.navigation.navigate("HomeScreen")}
                    title="Settings"
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
                                    onPress={() => props.navigation.navigate('ConfirmSetPassCode')}
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