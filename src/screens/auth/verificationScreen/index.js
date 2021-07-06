import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, StatusBar } from 'react-native';
import Colors from '../../../constants/colors';
import CustomButton from "../../../components/customButton"
import CustomTextInput from "../../../components/customTextInput"
import { Container, Content } from 'native-base';
import Fonts from '../../../constants/fonts';
import { globalStyles } from '../../../utils';
import Loader from '../../../components/loader';
import { showToast } from '../../../utils';

const VerificationCode = props => {
    const [email, setEmail] = useState('')
    const [loader, setLoader] = useState("")

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
          "API_KEY": "AsT@12620_!!!@",
          "email": email.toLowerCase(),
        }
        
        let config = {
          headers: headers,
          data: JSON.stringify(user_data),
          endPoint: 'user/send_otp',
          type: 'POST'
        }
        getApi(config).then((response) => {
          console.log('ress', response)
          if (response.Status == true) {
            showToast(response.Message, 'success')
            props.navigation.navigate('OtpScreen', { "email": email.toLowerCase() })
            setLoader(false)
          }
          else {
            showToast(response.Message, 'danger')
            setLoader(false)
          }
        })
      }
    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
            <Container>
                <Content>
                    <View style={styles.screen}>
                        <Text style={{ marginTop: "20%", ...styles.forgot }}>Forgot</Text>
                        <Text style={styles.forgot}>Password</Text>
                        <Text style={{ ...styles.email, marginTop: "25%" }}>We will email</Text>
                        <Text style={styles.email}>you instructions</Text>
                        <View style={{ marginTop: '5%' }}>
                            <CustomTextInput
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text)
                                }}
                            />
                        </View>
                        <View style={{ marginTop: '5%' }}>
                            <CustomButton
                                title='Send'
                                action={() => {
                                    props.navigation.navigate("OtpScreen")
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

});

export default VerificationCode;
