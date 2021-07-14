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

const OtpScreen = props => {
  const [code, setCode] = useState()
  const [loader, setLoader] = useState(false)
  const role = useSelector(state => state.authenticate.user_role)

  function on_press_submit() {
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
          showToast(response.message, 'success')          
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
              <Text onPress={() => {
                {

                }
              }}
                style={{ fontFamily: Fonts.PoppinsMedium, color: '#FDABC0' }}>Resend</Text>
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
