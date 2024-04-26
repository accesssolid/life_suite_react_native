import {Container, Content, Icon} from 'native-base';

import React, {cloneElement, useEffect, useRef, useState} from 'react';
import {
  Alert,
  BackHandler,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import Header from '../../../components/header';
import CustomButton from '../../../components/customButton';
import {getJsonData, storeJsonData} from '../../../asyncStorage/async';
import LS_COLORS from '../../../constants/colors';
import {Switch} from 'react-native';

const Settings = props => {
  const [passcodeVerification, setPassCodeVerification] = useState(false);
  const [biometricVerification, setBiometricVerification] = useState(false);
  console.log(biometricVerification, 'biometricVerification===>>>>>');

  const getPasscode = async () => {
    let pass = await getJsonData('passcode');
    let passVerification = await getJsonData('passcodeVerification');
    let fingerVerification = await getJsonData('fingerPrintVerification');
    if (pass && passVerification) {
      setPassCodeVerification(true);
    }
    if (pass && passVerification && fingerVerification) {
      setBiometricVerification(true);
    } else if (!passVerification) {
      setPassCodeVerification(false);
    }
  };

  const setPassCode = async v => {
    try {
      setPassCodeVerification(v);
      let pass = await getJsonData('passcode');
      let passVerification = await getJsonData('passcodeVerification');
      console.log(pass, v, passVerification, 'iiiii');
      if (v) {
        if (pass && !passVerification) {
          let x = await storeJsonData('passcodeVerification', true);
          setPassCodeVerification(true);
        }
        if (!pass) {
          props.navigation.navigate('SetPassCode');
        }
      } else {
        if (passVerification) {
          let x = await storeJsonData('passcodeVerification', null);
          let y = await storeJsonData('fingerPrintVerification', null);
          storeJsonData('passcode', null);
          setPassCodeVerification(false);
          setBiometricVerification(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  //   async function androidbiomatric() {
  //     let passVerification = await getJsonData('passcodeVerification');
  //     console.log(passVerification, 'passVerification==>>');
  //     const rnBiometrics = new ReactNativeBiometrics()
  //     rnBiometrics.isSensorAvailable().then(resultObject => {
  //         console.log(resultObject,"resultObject==>>>");
  //         const { available, biometryType } = resultObject
  //         if (available && biometryType === BiometryTypes.Biometrics) {
  //             rnBiometrics
  //                 .simplePrompt({ promptMessage: 'Confirm fingerprint' })
  //                 .then(resultObject => {
  //                     const { success } = resultObject
  //                     if (resultObject.success) {
  //                        Alert.alert("YEsss")
  //                         // navigateToNext()
  //                     }

  //                 })
  //                 .catch(() => {
  //                     console.log('biometrics failed')
  //                 })
  //             console.log('TouchID is supported')
  //         } else if (available && biometryType === BiometryTypes.FaceID) {
  //             console.log('FaceID is supported')
  //         } else if (available && biometryType === BiometryTypes.Biometrics) {
  //             console.log('Biometrics is supported')
  //         }
  //         else {
  //             console.log('Biometrics not supported')
  //         }
  //     })

  // }

  const setBiometric = async v => {
    console.log(v, 'yess---');
    let passVerification = await getJsonData('passcodeVerification');
    console.log(passVerification, 'passVerification==>>');
    const rnBiometrics = new ReactNativeBiometrics();

    rnBiometrics.isSensorAvailable().then(async resultObject => {
      console.log(resultObject, 'resultObject==>>>');
      const {available, biometryType} = resultObject;

      //   const biometryType = await rnBiometrics.isSensorAvailable();

      // console.log(biometryType, 'biometryType==>>');

      let fingerVerification = await getJsonData('fingerPrintVerification');
      console.log(fingerVerification, 'fingerVerification==>>');
      if (v) {
        console.log(fingerVerification, biometryType,"=====<><><");

        if (!fingerVerification  && biometryType !== undefined) {
          let x = await storeJsonData('fingerPrintVerification', true);

          setBiometricVerification(true);
        } else {
          if (biometryType === BiometryTypes.TouchID) {
            console.log('touchid');
            if (passVerification) {
              setBiometricVerification(true);
            } else {
              Alert.alert('Turn on passcode authentication');
            }
          } else if (biometryType === BiometryTypes.FaceID) {
            console.log('FaceID');

            if (passVerification) {
              setBiometricVerification(true);
            } else {
              Alert.alert('Turn on passcode authentication');
            }
          } else if (biometryType === BiometryTypes.Biometrics) {
            console.log('Biometrics');
            if (passVerification) {
              setBiometricVerification(true);
            } else {
              Alert.alert('Turn on passcode authentication');
            }
          } else {
            Alert.alert('Biometrics are not supported or turned off');
            setBiometricVerification(false);
          }
        }
      } else {
        if (fingerVerification) {
          let x = await storeJsonData('fingerPrintVerification', null);
          setBiometricVerification(false);
        }
      }
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      getPasscode();
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        props.navigation.goBack();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
    }, []),
  );
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: LS_COLORS.global.green}}>
        <StatusBar backgroundColor={LS_COLORS.global.green} />
        <Header
          imageUrl={require('../../../assets/back.png')}
          action={() => props.navigation.goBack()}
          imageUrl1={require('../../../assets/home.png')}
          action1={() =>
            props.navigation.navigate('MainDrawer', {screen: 'HomeScreen'})
          }
          title="Settings"
          containerStyle={{backgroundColor: LS_COLORS.global.cyan}}
        />
        <View style={{backgroundColor: LS_COLORS.global.white, flex: 1}}>
          <ScrollView bounces={false} scrollEnabled={true}>
            <View style={{flex: 1}}>
              <View style={{width: '90%', alignSelf: 'center', flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    marginVertical: 10,
                  }}>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text maxFontSizeMultiplier={1.5} style={{}}>
                      Passcode Authentication
                    </Text>
                  </View>
                  <View style={{justifyContent: 'center'}}>
                    <Switch
                      value={passcodeVerification}
                      onValueChange={() => setPassCode(!passcodeVerification)}
                    />
                  </View>
                </View>
                <View
                  style={{flexDirection: 'row', width: '100%', marginTop: 10}}>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text maxFontSizeMultiplier={1.5} style={{}}>
                      Biometrics Authentication
                    </Text>
                  </View>
                  <View style={{justifyContent: 'center'}}>
                    <Switch
                      value={biometricVerification}
                      onValueChange={() => setBiometric(!biometricVerification)}
                      //   onValueChange={() =>androidbiomatric()}
                    />
                  </View>
                </View>
                {passcodeVerification && (
                  <CustomButton
                    title="Change Passcode"
                    customStyles={{width: '60%', marginTop: 10}}
                    action={() => props.navigation.navigate('SetPassCode')}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Settings;
