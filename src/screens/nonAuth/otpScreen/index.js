import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, StatusBar } from 'react-native';
import Colors from '../../../constants/colors';
import CustomButton from "../../../components/customButton"
import CustomTextInput from "../../../components/customTextInput"
import { Container, Content } from 'native-base';
import Fonts from '../../../constants/fonts';
import { globalStyles } from '../../../utils';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import {showToast} from "../../../components/validators"
import Loader from '../../../components/loader';

const OtpScreen = props => {
    function otp() {
        setLoader(true)
        let headers = {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
        let user_data = {
          "API_KEY": "AsT@12620_!!!@",
          "otp": code,
        }
        let config = {
          headers: headers,
          data: JSON.stringify(user_data),
          endPoint: 'user/verify_account',
          type: 'post'
        }
        getApi(config).then((response) => {
          console.log('resp', response)
          if (response.Status == true) {
            showToast(response.Message)
            props.navigation.navigate('Login')
            setLoader(false)
          }
          else {
            showToast(response.Message)
            setLoader(false)
          }
        })
      }
    
      function on_press_resend() {
    
        setLoader(true)
    
        let headers = {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
    
        let user_data = {
          "API_KEY": "AsT@12620_!!!@",
          "email": props.route.params.email,
        }
        let config = {
          headers: headers,
          data: JSON.stringify(user_data),
          endPoint: 'user/send_otp',
          type: 'post'
        }
        getApi(config).then((response) => {
          console.log('resp', response)
          if (response.Status == true) {
            showToast(response.Message, 'success')
            setLoader(false)
          }
          else {
            showToast(response.Message, 'danger')
            setLoader(false)
    
          }
        })
      }
      const [code, setCode] = useState()
      const [loader, setLoader] = useState(false)
    return(
        <SafeAreaView style={globalStyles.safeAreaView}>
            <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
            <Container>
                <Content>
                    <View style={styles.screen}>
                        <Text style={{ marginTop: "20%", ...styles.forgot }}>Verification</Text>
                        <Text style={{ ...styles.email, marginTop: "25%" }}>Please enter the</Text>
                        <Text style={styles.email}>4-digit Verification code</Text>
                        <Text style={styles.email}>sent to your mail.</Text>
                        <View style={{ marginTop: '8%' }}>
                            <OTPInputView
                                pinCount={4}
                                style={styles.otp}
                                codeInputFieldStyle={styles.input}
                                placeholderTextColor="black"
                                keyboardType="number-pad"
                                onCodeFilled={(code) => {
                                    setCode(code)
                                }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 40, alignSelf: 'center' }}>
                            <Text style={{ fontFamily: Fonts.PoppinsMedium, color: Colors.white }}>Didn't receive the code? </Text>
                            <Text onPress={() => {{

                            }}} 
                            style={{ fontFamily: Fonts.PoppinsMedium, color: '#FDABC0' }}>Resend</Text>
                        </View>
                        <View style={{marginTop:'10%'}}>
                            <CustomButton
                                title='Submit'
                                action={() => {
                                    props.navigation.navigate("")
                                }}
                            />
                        </View>
                    </View>
                </Content>
                {loader == true && <Loader />}
            </Container>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        // backgroundColor: Colors.white,
    },
    design: {
        height: 220,
        width: 300,
    },
    forgot: {
        alignSelf: 'center',
        fontSize: 30,
        lineHeight: 40,
        color: Colors.global.black,
        fontFamily: Fonts.PoppinsBold
    },
    email: {
        fontSize: 16,
        lineHeight: 18,
        color: Colors.global.grey,
        fontFamily: Fonts.PoppinsBold,
        alignSelf: "center"
    },
    input: {
        color: "#D3D3D3",
        borderColor: "#D3D3D3",
        borderRadius: 5,
    },
    otp: {
        width: "70%",
        height: 48,
        alignSelf: 'center'
    },

});

export default OtpScreen;
