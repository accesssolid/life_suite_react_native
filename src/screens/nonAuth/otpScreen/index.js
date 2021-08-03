import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, StatusBar } from 'react-native';
import Colors from '../../../constants/colors';
import CustomButton from "../../../components/customButton"
import CustomTextInput from "../../../components/customTextInput"
import { Container, Content } from 'native-base';
import Fonts from '../../../constants/fonts';
import { globalStyles } from '../../../utils';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { showToast } from "../../../components/validators"
import Loader from '../../../components/loader';
import { useSelector } from 'react-redux';
import { getApi } from '../../../api/api';
import { TouchableOpacity } from 'react-native';
import LS_COLORS from '../../../constants/colors';

const OtpScreen = props => {
  const [code, setCode] = useState('')
  const [loader, setLoader] = useState(false)
  const email = props.route.params.email
  const role = useSelector(state => state.authenticate.user_role)

  function on_press_submit() {
    if (code.trim() == '') {
      return showToast("Please enter verification code")
    }
    setLoader(true)
    let headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    }

    let user_data = {
      "email": props.route.params.email,
      "otp": code
    }
    let config = {
      headers: headers,
      data: JSON.stringify(user_data),
      endPoint: role == 1 ? '/api/customerForgotOtpMatch' : '/api/providerForgotOtpMatch',
      type: 'post'
    }
    getApi(config)
      .then((response) => {
        if (response.status == true) {
          setLoader(false)
          // showToast(response.message, 'success')
          props.navigation.navigate('ResetPassword', { otp: code, email: props.route.params.email })
        }
        else {
          setLoader(false)
          showToast(response.message, 'danger')
        }
      })
      .catch(err => {

      })
  }

  function resendCode() {
    setCode('')
    setLoader(true)
    if (email.length == 0) {
      showToast('Enter Email', 'danger')
      setLoader(false)
      return false
    }
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) == false) {
      showToast('Enter Valid Email', 'danger')
      setLoader(false)
      return false
    }
    let headers = {
      Accept: 'application/json',
      "Content-Type": "application/json"
    }

    let user_data = {
      "email": email.toLowerCase(),
    }

    let config = {
      headers: headers,
      data: JSON.stringify(user_data),
      endPoint: role == 1 ? '/api/customerForgotPassword' : '/api/providerForgotPassword',
      type: 'POST'
    }

    getApi(config)
      .then((response) => {
        if (response.status == true) {
          showToast("Verification code sent on your email", 'success')
          setLoader(false)
        }
        else {
          showToast(response.message, 'danger')
          setLoader(false)
        }
      })
      .catch(err => {
        setLoader(false)
      })
  }

  return (
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
                code={code}
                pinCount={4}
                style={styles.otp}
                codeInputFieldStyle={styles.input}
                placeholderTextColor="black"
                keyboardType="number-pad"
                onCodeChanged={code => setCode(code)}             
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 40, alignSelf: 'center' }}>
              <Text style={{ fontFamily: Fonts.PoppinsMedium, color: Colors.white }}>Didn't receive the code? </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => resendCode()}>
                <Text style={{ fontFamily: Fonts.PoppinsMedium, color: '#FDABC0' }}>Resend</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: '10%' }}>
              <CustomButton
                title='Submit'
                action={() => {
                  on_press_submit()
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
    color: LS_COLORS.global.darkBlack,
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
