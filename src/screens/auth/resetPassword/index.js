import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, StatusBar,ScrollView } from 'react-native';
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
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
const ResetPassword = (props) => {
    const { email, otp } = props.route.params
    const passRef = useRef(null)
    const confPassRef = useRef(null)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isPassVisible, setIsPassVisible] = useState(false)
    const [isConfPassVisible, setIsConfPassVisible] = useState(false)

    const [loader, setLoader] = useState("")
    const role = useSelector(state => state.authenticate.user_role)

    useEffect(() => {
        setLoader(false)
    }, [])

    function on_submit() {
        setLoader(true)

        if (password !== confirmPassword) {
            setLoader(false)
            return showToast("Password and confirm password does not match")
        }

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
            <StatusBar backgroundColor={Colors.global.green} barStyle="light-content" />
            <View>
                <ScrollView>
                <MaterialIcons onPress={()=>props.navigation.goBack()} name='arrow-back' size={24} style={{padding:20}}/>
                    <View style={styles.screen}>
                        <Text maxFontSizeMultiplier={1.7} style={{ marginTop: "20%", ...styles.forgot }}>Reset</Text>
                        <Text maxFontSizeMultiplier={1.7} style={styles.forgot}>Password</Text>
                        <Text maxFontSizeMultiplier={1.7} style={{ ...styles.email, marginTop: "25%" }}>Enter new Password</Text>
                        <View style={{ marginTop: '5%' }}>
                            <CustomTextInput
                                placeholder="New Password"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text)
                                }}
                                secureTextEntry={!isPassVisible}
                                inputRef={passRef}
                                returnKeyType="next"
                                onSubmitEditing={() => confPassRef.current.focus()}
                                inlineImageLeft={<Entypo name={!isPassVisible ? "eye" : 'eye-with-line'} size={18} />}
                                onLeftPress={() => setIsPassVisible(state => !state)}
                            />
                            <CustomTextInput
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text)
                                }}
                                secureTextEntry={!isConfPassVisible}
                                inputRef={confPassRef}
                                returnKeyType="done"
                                inlineImageLeft={<Entypo name={!isConfPassVisible ? "eye" : 'eye-with-line'} size={18} />}
                                onLeftPress={() => setIsConfPassVisible(state => !state)}
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

export default ResetPassword;
