import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, StatusBar ,ScrollView} from 'react-native';
import Colors from '../../../constants/colors';
import CustomButton from "../../../components/customButton"
import CustomTextInput from "../../../components/customTextInput"
// import { Container, Content, ScrollView } from 'native-base';
import Fonts from '../../../constants/fonts';
import { globalStyles } from '../../../utils';
import Loader from '../../../components/loader';
import { showToast } from '../../../utils';
import { getApi } from '../../../api/api';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
const VerificationCode = props => {
  const [email, setEmail] = useState('')
  const [loader, setLoader] = useState("")
  const role = useSelector(state => state.authenticate.user_role)

  function on_enter_email() {
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
          props.navigation.navigate('OtpScreen', { "email": email.toLowerCase() })
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
      <StatusBar
        backgroundColor={Colors.global.green}
        barStyle="light-content" />
        
      <View>
        <ScrollView>
        <MaterialIcons onPress={()=>props.navigation.goBack()} name='arrow-back' size={24} style={{padding:20}}/>

          <View style={styles.screen}>
            <Text maxFontSizeMultiplier={1.7} style={{ marginTop: "20%", ...styles.forgot }}>Forgot</Text>
            <Text maxFontSizeMultiplier={1.7} style={styles.forgot}>Password</Text>
            <Text maxFontSizeMultiplier={1.7} style={{ ...styles.email, marginTop: "25%" }}>We will email</Text>
            <Text maxFontSizeMultiplier={1.7} style={styles.email}>you instructions</Text>
            <View  style={{ marginTop: '5%' }}>
              <CustomTextInput
                placeholder="Enter your email"
                value={email}
                keyboardType="email-address"
                returnKeyType="done"
                onChangeText={(text) => {
                  setEmail(text?.trim())
                }}
              />
            </View>
            <View style={{ marginTop: '5%' }}>
              <CustomButton
                title='Send'
                action={() => {
                  on_enter_email()
                  // props.navigation.navigate("OtpScreen")
                }}
              />
            </View>
          </View>
        </ScrollView>
        {loader == true && <Loader />}
      </View>
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

});

export default VerificationCode;
