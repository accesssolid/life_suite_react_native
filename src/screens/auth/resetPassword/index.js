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
import { getApi } from '../../../api/api';
import { useSelector } from 'react-redux';

const ResetPassword = (props) => {
    const { email, otp } = props.route.params
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [loader, setLoader] = useState("")
    const role = useSelector(state => state.authenticate.user_role)

    function on_submit() {
        setLoader(true)

        let headers = {
            Accept: 'application/json',
            "Content-Type": "application/json"
        }

        let user_data = {
            "email": email,
            "otp": otp,
            "new_password": password
        }

        let config = {
            headers: headers,
            data: JSON.stringify(user_data),
            endPoint: role == 1 ? '/api/customerForgotPasswordChange' : '/api/providerForgotPasswordChange',
            type: 'POST'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setLoader(false)
                    showToast(response.message, 'success')
                    props.navigation.navigate('LoginScreen')
                }
                else {
                    setLoader(false)
                    showToast(response.message, 'danger')
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
                        <Text style={{ marginTop: "20%", ...styles.forgot }}>Reset</Text>
                        <Text style={styles.forgot}>Password</Text>
                        <Text style={{ ...styles.email, marginTop: "25%" }}>Enter new Password</Text>
                        <View style={{ marginTop: '5%' }}>
                            <CustomTextInput
                                placeholder="New Password"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text)
                                }}
                            />
                            <CustomTextInput
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text)
                                }}
                            />
                        </View>
                        <View style={{ marginTop: '5%' }}>
                            <CustomButton
                                title='Reset'
                                action={() => {
                                    on_submit()
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

export default ResetPassword;
