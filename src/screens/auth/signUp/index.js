import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { getUniqueId } from 'react-native-device-info';

/* Components */
import CustomTextInput from '../../../components/customTextInput';
import CustomButton from '../../../components/customButton';
import Loader from "../../../components/loader"
import { showToast } from '../../../components/validators';
import { getApi } from '../../../api/api';
import DropDown from '../../../components/dropDown';
import { setUserRole } from '../../../redux/features/loginReducer';
import SearchableDropDown from '../../../components/searchableDropDown';

const getMessage = (name) => {
    switch (name) {
        case "first_name":
            return "First name is required"

        case "last_name":
            return "Last name is required"

        case "prefer_name":
            return "Prefered name is required"

        case "email":
            return "Email is required "

        case "password":
            return "Password is required"

        case "password_confirmation":
            return "Confirm password field is empty"

        case "phone_number":
            return "Phone number is required"

        default:
            return "All fields are required"
    }
}

const SignUpScreen = (props) => {
    const dispatch = useDispatch()
    const role = useSelector(state => state.authenticate.user_role)
    const [loader, setLoader] = useState(false)

    const dropData = ['Home', 'Work']

    /* Address Type Drop down */
    const [dropValue, setDropValue] = useState("Home")

    /* City Drop Down */
    const [dropCityValue, setDropCityValue] = useState("")
    const [isEmptyCityList, setIsEmptyCityList] = useState(false)
    const [dropCityDataMaster, setDropCityMaster] = useState([])

    /* State Drop Down */
    const [dropStateValue, setDropStateValue] = useState("State")
    const [dropStateData, setDropStateData] = useState([])
    const [dropStateDataMaster, setDropStateMaster] = useState([])

    useEffect(() => {
        getStates()
    }, [])

    useEffect(() => {
        if (dropStateValue !== "State") {
            const selectedItem = dropStateDataMaster.filter(item => item.name == dropStateValue)
            if (selectedItem.length > 0 && selectedItem[0].id !== undefined) {
                getCities(selectedItem[0].id)
                setAddressData({ ...addressData, state: selectedItem[0].id })
                setDropCityValue('')
            }
        }
    }, [dropStateValue])

    useEffect(() => {
        const selectedItem = dropCityDataMaster.filter(item => item.name == dropCityValue)
        if (!isEmptyCityList) {
            if (selectedItem.length > 0 && selectedItem[0].id !== undefined) {
                setAddressData({ ...addressData, city: selectedItem[0].id })
            }
        } else {
            setAddressData({ ...addressData, city: dropCityValue })
        }

    }, [dropCityValue])

    const [addressData, setAddressData] = useState({
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        zip: "",
    })

    const [signUpData, setSignUpData] = useState({
        first_name: '',
        last_name: '',
        prefer_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone_number: '',
        address: [],
        device_id: getUniqueId(),
        fcm_token: '#fcm!234'
    })

    async function on_press_register() {
        setLoader(true)

        let keys = Object.keys(signUpData)
        for (let index = 0; index < keys.length; index++) {
            if (typeof signUpData[keys[index]] == 'string' && signUpData[keys[index]].trim() == '') {
                showToast(getMessage(keys[index]), 'danger')
                setLoader(false)
                return false
            }
        }

        if (dropStateValue == "State") {
            showToast("Please select state", 'danger')
            setLoader(false)
            return false
        }

        if (dropCityValue == "") {
            showToast("Please select or enter city", 'danger')
            setLoader(false)
            return false
        }

        const address = [{
            "country": 231,
            "state": dropValue.toLowerCase() == "home" ? addressData.state : "",
            "city": dropValue.toLowerCase() == "home" ? addressData.city : "",
            "address_line_1": dropValue.toLowerCase() == "home" ? addressData.address_line_1 : "",
            "address_line_2": dropValue.toLowerCase() == "home" ? addressData.address_line_2 : "",
            "address_type": "home",
            "lat": "",
            "long": "",
            "zip_code": dropValue.toLowerCase() == "home" ? Number(addressData.zip) : "",
        },
        {
            "country": 231,
            "state": dropValue.toLowerCase() == "work" ? addressData.state : "",
            "city": dropValue.toLowerCase() == "work" ? addressData.city : "",
            "address_line_1": dropValue.toLowerCase() == "work" ? addressData.address_line_1 : "",
            "address_line_2": dropValue.toLowerCase() == "work" ? addressData.address_line_2 : "",
            "address_type": "work",
            "lat": "",
            "long": "",
            "zip_code": dropValue.toLowerCase() == "work" ? Number(addressData.zip) : "",
        }]

        if (dropValue.toLowerCase() == "home") {
            if (address[0].address_line_1.trim() == '' || address[0].address_line_2.trim() == '' || address[0].city == '' || address[0].state == '' || address[0].zip_code == '') {
                showToast('Address is required', 'danger')
                setLoader(false)
                return false
            }
        } else {
            if (address[1].address_line_1.trim() == '' || address[1].address_line_2.trim() == '' || address[1].city == '' || address[1].state == '' || address[1].zip_code == '') {
                showToast('Address is required', 'danger')
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

        if (signUpData.password != signUpData.password_confirmation) {
            showToast('Passwords Does not Match', 'danger')
            setLoader(false)
            return false
        }

        if (!isEmptyCityList) {
            let codeData = { "city": dropCityValue, "zip_code": addressData.zip }

            verifyZipCode(codeData).then((res) => {
                if (res.errors.length > 0) {
                    setLoader(false)
                    showToast("Invalid zip code")
                } else {
                    let headers = {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                    let user_data = { ...signUpData, email: signUpData.email.toLowerCase(), address: JSON.stringify(address) }

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
            }).catch(err => {
                setLoader(false)
                return showToast("Could not verify zip code please try again")
            })
        } else {
            let headers = {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
            let user_data = { ...signUpData, email: signUpData.email.toLowerCase(), address: JSON.stringify(address) }

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
    }

    const switchRole = () => {
        dispatch(setUserRole({ data: role == 1 ? 2 : 1 }))
    }

    const getStates = () => {
        setLoader(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
        let user_data = {
            "country_id": 231,
        }

        let config = {
            headers: headers,
            data: JSON.stringify(user_data),
            endPoint: '/api/state_list',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setDropStateMaster([...response.data])
                    let newArr = [...response.data].map((item, index) => {
                        return item.name
                    })
                    setDropStateData([...newArr])
                    setLoader(false)
                }
                else {
                    setLoader(false)
                }
            })
            .catch(err => {
                setLoader(false)
            })
    }

    const getCities = (state_id) => {
        setLoader(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
        let user_data = {
            "state_id": state_id,
        }

        let config = {
            headers: headers,
            data: JSON.stringify(user_data),
            endPoint: '/api/city_list',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setDropCityMaster(response.data)
                    setIsEmptyCityList(false)
                    setLoader(false)
                }
                else {
                    setIsEmptyCityList(true)
                    setLoader(false)
                }
            })
            .catch(err => {
                setLoader(false)
            })
    }

    const verifyZipCode = (data) => {
        return new Promise((resolve, reject) => {
            let headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
            }

            let user_data = { ...data }

            let config = {
                headers: headers,
                data: JSON.stringify(user_data),
                type: 'post'
            }

            fetch('http://122.160.70.200:3031/api/verify/checkZipCode', {
                body: config.data,
                headers: config.headers,
                method: config.type
            }).then(async (response) => {
                let json = await response.json()
                resolve(json)
            }).catch((error) => {
                reject(error)
            });
        })
    }

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}>
                <ScrollView style={{ flex: 1, width: '100%' }} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, width: '100%' }}>
                        <View style={styles.textContainer}>
                            <Text style={styles.loginText}>{role == 1 ? "Customer" : "Service Provider"}</Text>
                            <Text style={{ ...styles.loginText, fontSize: 24 }}>Signup</Text>
                            <Text style={styles.text}>Add your details to Signup</Text>
                            <TouchableOpacity onPress={() => switchRole()} activeOpacity={0.7}>
                                <Text style={{ ...styles.text, textDecorationLine: 'underline' }}>Signup as {role == 1 ? "Service Provider" : "Customer"}</Text>
                            </TouchableOpacity>
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
                                item={dropData}
                                value={dropValue}
                                onChangeValue={(index, value) => setDropValue(value)}
                                containerStyle={{ width: '80%', alignSelf: 'center', borderRadius: 50, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 30, paddingHorizontal: '5%', borderWidth: 0 }}
                                dropdownStyle={{ height: 75 }}
                            />
                            <CustomTextInput
                                placeholder="Address line 1"
                                value={signUpData.address_line_1}
                                onChangeText={(text) => setAddressData({ ...addressData, address_line_1: text })}
                            />
                            <CustomTextInput
                                placeholder="Address line 2"
                                value={signUpData.address_line_2}
                                onChangeText={(text) => setAddressData({ ...addressData, address_line_2: text })}
                            />
                            <DropDown
                                item={dropStateData}
                                value={dropStateValue}
                                onChangeValue={(index, value) => setDropStateValue(value)}
                                containerStyle={{ width: '80%', alignSelf: 'center', borderRadius: 50, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 30, paddingHorizontal: '5%', borderWidth: 0 }}
                                dropdownStyle={{ maxHeight: 300 }}
                            />

                            <SearchableDropDown
                                onItemSelect={(item) => {
                                    setDropCityValue(item.name)
                                }}
                                items={dropCityDataMaster}
                                onTextChange={(text) => setDropCityValue(text)}
                                value={dropCityValue}
                            />

                            <CustomTextInput
                                placeholder="Zip code"
                                value={signUpData.address.address_line_2}
                                value={signUpData.zip}
                                onChangeText={(text) => setAddressData({ ...addressData, zip: text })}
                                keyboardType='numeric'
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
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            {loader == true && <Loader />}
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
        fontFamily: LS_FONTS.PoppinsSemiBold,
        width: '90%',
        alignSelf: 'center'
    },
    text: {
        color: LS_COLORS.global.grey,
        fontFamily: LS_FONTS.PoppinsMedium,
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
        marginTop: 20,
        alignSelf: 'center'
    },
    textInputContainer: {
        marginTop: "10%",
        width: '100%',
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
