import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, TouchableOpacity } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import CustomTextInput from '../../../components/customTextInput';
import CustomButton from '../../../components/customButton';
import Loader from "../../../components/loader"
import { showToast } from '../../../components/validators';
import { getApi } from '../../../api/api';
import { Container, Content, Root } from 'native-base';
import DropDown from '../../../components/dropDown';
const SignUpScreen = (props) => {
    const dispatch = useDispatch()
    const role = useSelector(state => state.authenticate.user_role)
    const [loader, setLoader] = useState(false)
    const [isDropOpen, setIsDropOpen] = useState(false)
    const [dropValue, setDropValue] = useState("Home")
    const [signUpData, setSignUpData] = useState({
        first_name: '',
        last_name: '',
        prefer_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone_number: '',
        address: [
            {
                "address_line_1": "",
                "address_line_2": "",
                "address_type": "home",
                "lat": "",
                "long": ""
            },
            {
                "address_line_1": "",
                "address_line_2": "",
                "address_type": "work",
                "lat": "",
                "long": ""
            }
        ],
        device_id: '#dev12',
        fcm_token: '#fcm!234'
    })

    const dropData = role == 1 ? [{
        label: 'Home',
        value: 'Home'
    },
    {
        label: 'Work',
        value: 'Work'
    }] : [{
        label: 'Work',
        value: 'Work'
    }]

    const setAddress = (text, line) => {
        if (dropValue.toLowerCase() == "home") {
            let newVal = {}
            if (line == "line1") {
                newVal = {
                    "address_line_1": text,
                    "address_line_2": signUpData.address[0].address_line_2,
                    "address_type": "home",
                    "lat": "",
                    "long": ""
                }
                let addr = [...signUpData.address]
                addr[0] = newVal
                setSignUpData({ ...signUpData, address: [...addr] })
            } else {
                newVal = {
                    "address_line_1": signUpData.address[0].address_line_1,
                    "address_line_2": text,
                    "address_type": "home",
                    "lat": "",
                    "long": ""
                }
                let addr = [...signUpData.address]
                addr[0] = newVal
                setSignUpData({ ...signUpData, address: [...addr] })
            }
        } else {
            let newVal = {}
            if (line == "line1") {
                newVal = {
                    "address_line_1": text,
                    "address_line_2": signUpData.address[1].address_line_2,
                    "address_type": "work",
                    "lat": "",
                    "long": ""
                }
                let addr = [...signUpData.address]
                addr[1] = newVal
                setSignUpData({ ...signUpData, address: [...addr] })
            } else {
                newVal = {
                    "address_line_1": signUpData.address[1].address_line_1,
                    "address_line_2": text,
                    "address_type": "work",
                    "lat": "",
                    "long": ""
                }
                let addr = [...signUpData.address]
                addr[1] = newVal
                setSignUpData({ ...signUpData, address: [...addr] })
            }
        }
    }

    function on_press_register() {
        setLoader(true)
        Object.keys(signUpData).forEach((element, index) => {
            console.log(element, index, signUpData[element])
            if (typeof signUpData[element] == String && signUpData[element].trim() == '') {
                showToast('All fields are required', 'danger')
                setLoader(false)
                return false
            }
        });

        if (role == 1) {
            if (dropValue.toLowerCase() == "home") {
                if (signUpData.address[0].address_line_1.trim() == '' || signUpData.address[0].address_line_2.trim() == '') {
                    showToast('All fields are required', 'danger')
                    setLoader(false)
                    return false
                }
            } else {
                if (signUpData.address[1].address_line_1.trim() == '' || signUpData.address[1].address_line_2.trim() == '') {
                    showToast('All fields are required', 'danger')
                    setLoader(false)
                    return false
                }
            }
        } else {
            if (signUpData.address[1].address_line_1.trim() == '' || signUpData.address[1].address_line_2.trim() == '') {
                showToast('All fields are required', 'danger')
                setLoader(false)
                return false
            }
        }
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(signUpData.email) == false) {
            showToast('Enter Valid Email', 'danger')
            setLoader(false)
            return false
        }
        if (signUpData.password.length < 6) {
            showToast('Password Must have 6 Characters', 'danger')
            setLoader(false)
            return false
        }
        if (signUpData.password != signUpData.password_confirmation) {
            showToast('Passwords Does not Match', 'danger')
            setLoader(false)
            return false
        }
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
        let user_data = { ...signUpData, email: signUpData.email.toLowerCase(), address: JSON.stringify(signUpData.address) }
        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: role == 1 ? '/api/customerSignup' : '/api/providerSignup',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    showToast('User Registered Successfully', 'success')
                    setLoader(false)
                    props.navigation.navigate('LoginScreen')
                }
                else {
                    showToast(response.message, 'danger')
                    setLoader(false)
                }
            }).catch(err => {

            })
    }

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Root>
                <Container style={styles.container}>
                    <Content showsVerticalScrollIndicator={false}>
                        <View style={styles.textContainer}>
                            <Text style={styles.loginText}>Signup</Text>
                            <Text style={styles.text}>Add your details to Signup</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <CustomTextInput
                                placeholder="First Name"
                                value={signUpData.first_name}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, first_name: text })
                                }}
                            />
                            <CustomTextInput
                                placeholder="Last Name"
                                value={signUpData.last_name}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, last_name: text })
                                }}
                            />
                            <CustomTextInput
                                placeholder="Preferred Name"
                                value={signUpData.prefer_name}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, prefer_name: text })
                                }}
                            />
                            <CustomTextInput
                                placeholder="Email"
                                value={signUpData.email}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, email: text })
                                }}
                            />
                            <CustomTextInput
                                placeholder="Password"
                                value={signUpData.password}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, password: text })
                                }}
                                secureTextEntry
                            />
                            <CustomTextInput
                                placeholder="Confirm Password"
                                value={signUpData.password_confirmation}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, password_confirmation: text })
                                }}
                                secureTextEntry
                            />
                            <CustomTextInput
                                placeholder="Phone Number"
                                value={signUpData.phone_number}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, phone_number: text })
                                }}
                            />
                            <Text style={{ width: '75%', alignSelf: 'center', marginBottom: 10, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.black }}>Address Type</Text>
                            <DropDown
                                isOpen={isDropOpen}
                                setOpen={setIsDropOpen}
                                item={dropData}
                                defaultValue={"Home"}
                                value={dropValue}
                                setValue={setDropValue}
                                containerStyle={{ width: '75%', alignSelf: 'center', borderRadius: 50, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 30, paddingHorizontal: '5%' }}
                                dropStyle={{ width: '75%', alignSelf: 'center', backgroundColor: LS_COLORS.global.white }}
                            />
                            <CustomTextInput
                                placeholder="Address line 1"
                                value={signUpData.address.address_line_1}
                                onChangeText={(text) => setAddress(text, "line1")}
                            />
                            <CustomTextInput
                                placeholder="Address line 2"
                                value={signUpData.address.address_line_2}
                                onChangeText={(text) => setAddress(text, "line2")}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <CustomButton
                                title="Sign Up"
                                action={() => {
                                    on_press_register()
                                }}
                            />
                        </View>
                        <View style={styles.alreadyContainer}>
                            <Text style={styles.already}>Already have an account ?</Text>
                            <TouchableOpacity onPress={() => {
                                props.navigation.navigate("LoginScreen")
                            }}>
                                <Text style={styles.already1}> Login</Text>
                            </TouchableOpacity>
                        </View>
                    </Content>
                </Container>
                {loader == true && <Loader />}
            </Root>
        </SafeAreaView>
    )
}

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: LS_COLORS.global.white,

    },
    textContainer: {
        marginTop: "20%"
    },
    loginText: {
        fontSize: 28,
        lineHeight: 42,
        textAlign: 'center',
        color: LS_COLORS.global.black,
        fontFamily: LS_FONTS.PoppinsSemiBold
    },
    text: {
        color: LS_COLORS.global.grey,
        fontFamily: LS_FONTS.PoppinsMedium,
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
        marginTop: 20
    },
    textInputContainer: {
        marginTop: "10%",
        width: '100%'
    },
    buttonContainer: {
        width: '100%'
    },
    alreadyContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: "3%",
        marginBottom: '5%'
    },
    already: {
        fontSize: 14,
        lineHeight: 19,
        color: LS_COLORS.global.lightTextColor,
        fontFamily: LS_FONTS.PoppinsRegular
    },
    already1: {
        fontSize: 14,
        lineHeight: 19,
        color: LS_COLORS.global.green,
        fontFamily: LS_FONTS.PoppinsSemiBold
    }
})
