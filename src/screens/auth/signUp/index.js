import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { getUniqueId } from 'react-native-device-info';
import { CheckBox } from 'react-native-elements';

/* Components */
import CustomTextInput from '../../../components/customTextInput';
import CustomButton from '../../../components/customButton';
import Loader from "../../../components/loader"
import { showToast } from '../../../components/validators';
import { getApi } from '../../../api/api';
import DropDown from '../../../components/dropDown';
import { setUserRole } from '../../../redux/features/loginReducer';
import SearchableDropDown from '../../../components/searchableDropDown';

/* Icons */
import Entypo from 'react-native-vector-icons/Entypo'

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

const getKeyName = (key) => {
    switch (key) {
        case "address_line_1":
            return "Address line 1"
        case "address_line_2":
            return "Address line 1"
        case "state":
            return "State"
        case "city":
            return "City"
        case "zip_code":
            return "Zip code"
    }
}

const SignUpScreen = (props) => {
    const dispatch = useDispatch()
    const fnameRef = useRef(null)
    const lnameRef = useRef(null)
    const prefNameRef = useRef(null)
    const emailRef = useRef(null)
    const passRef = useRef(null)
    const confPassRef = useRef(null)
    const phoneRef = useRef(null)

    const workAddressLine1Ref = useRef(null)
    const workAddressLine2Ref = useRef(null)
    const workAddressZipRef = useRef(null)
    const workAddressStateDropRef = useRef(null)
    const workAddressCityDropRef = useRef(null)

    const homeAddressLine1Ref = useRef(null)
    const homeAddressLine2Ref = useRef(null)
    const homeAddressZipRef = useRef(null)
    const homeAddressStateDropRef = useRef(null)
    const homeAddressCityDropRef = useRef(null)

    const [addWorkAddressActive, setAddWorkAddressActive] = useState(false)
    const [addHomeAddressActive, setAddHomeAddressActive] = useState(false)
    const [isSameAddress, setIsSameAddress] = useState(false)
    const role = useSelector(state => state.authenticate.user_role)
    const [loader, setLoader] = useState(false)

    /* State Drop Down */
    const [dropStateValue, setDropStateValue] = useState("State")
    const [dropStateData, setDropStateData] = useState([])
    const [dropStateDataMaster, setDropStateMaster] = useState([])

    /* City Drop Down */
    const [dropCityValue, setDropCityValue] = useState("")
    const [isEmptyCityList, setIsEmptyCityList] = useState(false)
    const [dropCityDataMaster, setDropCityMaster] = useState([])

    /* State Drop Down WORK */
    const [dropStateValueWork, setDropStateValueWork] = useState("State")

    /* City Drop Down WORK */
    const [dropCityValueWork, setDropCityValueWork] = useState("")
    const [isEmptyCityListWork, setIsEmptyCityListWork] = useState(false)
    const [dropCityDataMasterWork, setDropCityMasterWork] = useState([])

    const [isPassVisible, setIsPassVisible] = useState(false)
    const [isConfPassVisible, setIsConfPassVisible] = useState(false)

    useEffect(() => {
        setLoader(false)
    }, [])

    useEffect(() => {
        getStates()
    }, [])

    useEffect(() => {
        const selectedItem = dropCityDataMaster.filter(item => item.name == dropCityValue)
        if (!isEmptyCityList) {
            if (selectedItem.length > 0 && selectedItem[0].id !== undefined) {
                setHomeAddressData({ ...homeAddressData, city: selectedItem[0].id })
            }
        } else {
            setHomeAddressData({ ...homeAddressData, city: dropCityValue })
        }

    }, [dropCityValue])

    useEffect(() => {
        const selectedItem = dropCityDataMasterWork.filter(item => item.name == dropCityValueWork)
        if (!isEmptyCityListWork) {
            if (selectedItem.length > 0 && selectedItem[0].id !== undefined) {
                setWorkAddressData({ ...workAddressData, city: selectedItem[0].id })
            }
        } else {
            setWorkAddressData({ ...workAddressData, city: dropCityValueWork })
        }

    }, [dropCityValueWork])

    const [homeAddressData, setHomeAddressData] = useState({
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        zip: '',
    })

    const [workAddressData, setWorkAddressData] = useState({
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        zip: '',
    })

    useEffect(() => {
        if (isSameAddress) {
            setWorkAddressData({
                ...workAddressData,
                address_line_1: homeAddressData.address_line_1,
                address_line_2: homeAddressData.address_line_2,
                city: homeAddressData.city,
                state: homeAddressData.state,
                zip: homeAddressData.zip,
            })
            setDropStateValueWork(dropStateValue)
            setDropCityValueWork(dropCityValue)
        } else {
            setWorkAddressData({
                address_line_1: '',
                address_line_2: '',
                city: '',
                state: '',
                zip: '',
            })
            setDropStateValueWork("State")
            setDropCityValueWork('')
        }
    }, [isSameAddress, homeAddressData])

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

        if (signUpData.phone_number.length < 10) {
            setLoader(false)
            return showToast("Phone number must be of 10 digits")
        }

        const address = [
            {
                "country": 231,
                "state": homeAddressData.state,
                "city": homeAddressData.city,
                "address_line_1": homeAddressData.address_line_1,
                "address_line_2": homeAddressData.address_line_2,
                "address_type": "home",
                "lat": "",
                "long": "",
                "zip_code": homeAddressData.zip,
            },
            {
                "country": 231,
                "state": workAddressData.state,
                "city": workAddressData.city,
                "address_line_1": workAddressData.address_line_1,
                "address_line_2": workAddressData.address_line_2,
                "address_type": "work",
                "lat": "",
                "long": "",
                "zip_code": workAddressData.zip,
            }
        ]

        if (role == 2) {
            let homekeys = Object.keys(address[0])
            for (let index = 0; index < homekeys.length; index++) {
                if (homekeys[index] !== 'lat' && homekeys[index] !== 'long' && String(address[0][homekeys[index]]).trim() == '') {
                    showToast(`${getKeyName(homekeys[index])} is required for ${role == 1 ? 'home' : 'permanent'} address`, 'danger')
                    setLoader(false)
                    return false
                }
            }

            let keys = Object.keys(address[1])
            for (let index = 0; index < keys.length; index++) {
                if (keys[index] !== 'lat' && keys[index] !== 'long' && String(address[1][keys[index]]).trim() == '') {
                    showToast(`${getKeyName(keys[index])} is required for ${role == 1 ? 'work' : 'mailing'} address`, 'danger')
                    setLoader(false)
                    return false
                }
            }
        }

        let user_data = { ...signUpData, email: signUpData.email.toLowerCase(), address: JSON.stringify(address) }

        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        }

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

    const getCities = (state_id, type) => {
        if (type == "home") {
            homeAddressCityDropRef.current.blur()
        } else {
            workAddressCityDropRef.current.blur()
        }
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
                    if (type == "home") {
                        setDropCityMaster(response.data)
                        let city = response.data.filter(item => item.id == homeAddressData.city)
                        if (city.length > 0 && city[0].name !== undefined && homeAddressData.city) {
                            setDropCityValue(city[0].name)
                        } else {
                            setDropCityValue("")
                            setTimeout(() => {
                                homeAddressCityDropRef.current.focus()
                            }, 250);
                        }
                        setIsEmptyCityListWork(false)
                        setLoader(false)
                    } else {
                        setDropCityMasterWork(response.data)
                        let city = response.data.filter(item => item.id == workAddressData.city)
                        if (city.length > 0 && city[0].name !== undefined && workAddressData.city) {
                            setDropCityValueWork(city[0].name)
                        } else {
                            setDropCityValueWork("")
                            setTimeout(() => {
                                workAddressCityDropRef.current.focus()
                            }, 250);
                        }
                        setIsEmptyCityListWork(false)
                        setLoader(false)
                    }
                }
                else {
                    if (type == "home") {
                        setIsEmptyCityList(true)
                        setTimeout(() => {
                            homeAddressCityDropRef.current.focus()
                        }, 250);
                    } else {
                        setIsEmptyCityListWork(true)
                        setTimeout(() => {
                            workAddressCityDropRef.current.focus()
                        }, 250);
                    }
                    setLoader(false)
                }
            })
            .catch(err => {
                setLoader(false)
            })
    }

    const startGetCities = (value, type) => {
        const selectedItem = dropStateDataMaster.filter(item => item.name == value)
        if (type == "home") {
            if (selectedItem.length > 0 && selectedItem[0].id !== undefined) {
                setHomeAddressData({ ...homeAddressData, state: selectedItem[0].id })
            }
        } else {
            if (selectedItem.length > 0 && selectedItem[0].id !== undefined) {
                setWorkAddressData({ ...workAddressData, state: selectedItem[0].id })
            }
        }
        getCities(selectedItem[0].id, type)
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
                            <Text style={styles.text}>or</Text>
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
                                inputRef={fnameRef}
                                returnKeyType="next"
                                onSubmitEditing={() => lnameRef.current.focus()}
                            />
                            <CustomTextInput
                                placeholder="Last Name"
                                value={signUpData.last_name}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, last_name: text })
                                }}
                                inputRef={lnameRef}
                                returnKeyType="next"
                                onSubmitEditing={() => prefNameRef.current.focus()}
                            />
                            <CustomTextInput
                                placeholder="Preferred Name"
                                value={signUpData.prefer_name}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, prefer_name: text })
                                }}
                                inputRef={prefNameRef}
                                returnKeyType="next"
                                onSubmitEditing={() => emailRef.current.focus()}
                            />
                            <CustomTextInput
                                placeholder="Email"
                                value={signUpData.email}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, email: text })
                                }}
                                inputRef={emailRef}
                                returnKeyType="next"
                                keyboardType="email-address"
                                onSubmitEditing={() => passRef.current.focus()}
                            />
                            <CustomTextInput
                                placeholder="Password"
                                value={signUpData.password}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, password: text })
                                }}
                                secureTextEntry={!isPassVisible}
                                inputRef={passRef}
                                returnKeyType="next"
                                onSubmitEditing={() => confPassRef.current.focus()}
                                inlineImageLeft={<Entypo name={!isPassVisible ? "eye" : 'eye-with-line'} size={18} />}
                                onLeftPress={() => setIsPassVisible(state => !state)}
                            />
                            <CustomTextInput
                                placeholder="Confirm Password"
                                value={signUpData.password_confirmation}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, password_confirmation: text })
                                }}
                                secureTextEntry={!isConfPassVisible}
                                inputRef={confPassRef}
                                returnKeyType="next"
                                onSubmitEditing={() => phoneRef.current.focus()}
                                inlineImageLeft={<Entypo name={!isConfPassVisible ? "eye" : 'eye-with-line'} size={18} />}
                                onLeftPress={() => setIsConfPassVisible(state => !state)}
                            />
                            <CustomTextInput
                                placeholder="Phone Number"
                                value={signUpData.phone_number}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, phone_number: text })
                                }}
                                keyboardType='numeric'
                                inputRef={phoneRef}
                                returnKeyType={Platform.OS == "ios" ? "done" : "next"}
                                returnKeyLabel="next"
                                maxLength={10}
                                onSubmitEditing={() => {
                                    setAddHomeAddressActive(true), setTimeout(() => {
                                        homeAddressLine1Ref.current.focus()
                                    }, 250)
                                }}
                            />
                            <View>
                                {
                                    !addHomeAddressActive
                                        ?
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            onPress={() => { setAddHomeAddressActive(!addHomeAddressActive) }}
                                            style={{ flexDirection: "row", marginBottom: 15, marginLeft: '12%', alignItems: 'center' }}>
                                            <Image
                                                style={{ height: 24, width: 24, resizeMode: "contain" }}
                                                source={require("../../../assets/plus.png")}
                                            />
                                            <Text style={{ ...styles.text2, marginLeft: 10, }}>ADD {role == 1 ? 'HOME' : 'PERMANENT'} ADDRESS{role == 1 ? '' : "*"}</Text>
                                        </TouchableOpacity>
                                        :
                                        <>
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                onPress={() => { setAddHomeAddressActive(!addHomeAddressActive) }}
                                                style={{ flexDirection: "row", marginBottom: 15, marginLeft: '12%', alignItems: 'center' }}>
                                                <Image
                                                    style={{ height: 24, width: 24, resizeMode: "contain" }}
                                                    source={require("../../../assets/plus.png")}
                                                />
                                                <Text style={{ ...styles.text2, marginLeft: 10, }}>ADD {role == 1 ? 'HOME' : 'PERMANENT'} ADDRESS{role == 1 ? '' : "*"}</Text>
                                            </TouchableOpacity>
                                            <View style={{}}>
                                                <CustomTextInput
                                                    placeholder="ADDRESS LINE 1"
                                                    value={homeAddressData.address_line_1}
                                                    onChangeText={(text) => { setHomeAddressData({ ...homeAddressData, address_line_1: text }) }}
                                                    inputRef={homeAddressLine1Ref}
                                                    returnKeyType={"next"}
                                                    onSubmitEditing={() => homeAddressLine2Ref.current.focus()}
                                                />
                                                <CustomTextInput
                                                    placeholder="ADDRESS LINE 2"
                                                    value={homeAddressData.address_line_2}
                                                    onChangeText={(text) => { setHomeAddressData({ ...homeAddressData, address_line_2: text }) }}
                                                    inputRef={homeAddressLine2Ref}
                                                    returnKeyType={"next"}
                                                    onSubmitEditing={() => homeAddressStateDropRef.current.show()}
                                                />
                                                <DropDown
                                                    dropRef={homeAddressStateDropRef}
                                                    item={dropStateData}
                                                    value={dropStateValue}
                                                    onChangeValue={(index, value) => { setDropStateValue(value), startGetCities(value, "home") }}
                                                    containerStyle={{ width: '80%', alignSelf: 'center', borderRadius: 50, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 30, paddingHorizontal: '5%', borderWidth: 0 }}
                                                    dropdownStyle={{ maxHeight: 300 }}
                                                />

                                                <SearchableDropDown
                                                    dropRef={homeAddressCityDropRef}
                                                    onItemSelect={(item) => {
                                                        setDropCityValue(item.name)
                                                        homeAddressZipRef.current.focus()
                                                    }}
                                                    items={dropCityDataMaster}
                                                    onTextChange={(text) => setDropCityValue(text)}
                                                    value={dropCityValue}
                                                />

                                                <CustomTextInput
                                                    placeholder="Zip code"
                                                    value={homeAddressData.zip}
                                                    onChangeText={(text) => { setHomeAddressData({ ...homeAddressData, zip: text }) }}
                                                    keyboardType="numeric"
                                                    returnKeyType={Platform.OS == "ios" ? "done" : "next"}
                                                    inputRef={homeAddressZipRef}
                                                    onSubmitEditing={() => {
                                                        setAddWorkAddressActive(true), setTimeout(() => {
                                                            workAddressLine1Ref.current.focus()
                                                        }, 250)
                                                    }}
                                                />
                                            </View>
                                        </>
                                }
                            </View>
                            <View style={{ marginTop: 10 }}>
                                {
                                    !addWorkAddressActive
                                        ?
                                        <View style={{ flexDirection: "row", marginBottom: 15, marginHorizontal: '12%', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                onPress={() => setAddWorkAddressActive(!addWorkAddressActive)}
                                                style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image
                                                    style={{ height: 24, width: 24, resizeMode: "contain" }}
                                                    source={require("../../../assets/plus.png")}
                                                />
                                                <Text style={{ ...styles.text2, marginLeft: 10, }}>ADD {role == 1 ? 'WORK' : 'MAILING'} ADDRESS{role == 1 ? '' : "*"}</Text>
                                            </TouchableOpacity>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <CheckBox
                                                    style={{}}
                                                    containerStyle={{ width: 25 }}
                                                    wrapperStyle={{}}
                                                    checked={isSameAddress}
                                                    onPress={() => setIsSameAddress(!isSameAddress)}
                                                    checkedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                                                    uncheckedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                                                />
                                                <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, marginTop: 5 }}>Same address</Text>
                                            </View>
                                        </View>
                                        :
                                        <>
                                            <View style={{ flexDirection: "row", marginBottom: 15, marginHorizontal: '12%', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    onPress={() => setAddWorkAddressActive(!addWorkAddressActive)}
                                                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image
                                                        style={{ height: 24, width: 24, resizeMode: "contain" }}
                                                        source={require("../../../assets/plus.png")}
                                                    />
                                                    <Text style={{ ...styles.text2, marginLeft: 10, }}>ADD {role == 1 ? 'WORK' : 'MAILING'} ADDRESS{role == 1 ? '' : "*"}</Text>
                                                </TouchableOpacity>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <CheckBox
                                                        style={{}}
                                                        containerStyle={{ width: 25 }}
                                                        wrapperStyle={{}}
                                                        checked={isSameAddress}
                                                        onPress={() => setIsSameAddress(!isSameAddress)}
                                                        checkedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                                                        uncheckedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                                                    />
                                                    <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, marginTop: 5 }}>Same address</Text>
                                                </View>
                                            </View>
                                            <CustomTextInput
                                                placeholder="ADDRESS LINE 1"
                                                value={workAddressData.address_line_1}
                                                onChangeText={(text) => { setWorkAddressData({ ...workAddressData, address_line_1: text }) }}
                                                inputRef={workAddressLine1Ref}
                                                returnKeyType={"next"}
                                                onSubmitEditing={() => workAddressLine2Ref.current.focus()}
                                                editable={!isSameAddress}
                                            />
                                            <CustomTextInput
                                                placeholder="ADDRESS LINE 2"
                                                value={workAddressData.address_line_2}
                                                onChangeText={(text) => { setWorkAddressData({ ...workAddressData, address_line_2: text }) }}
                                                inputRef={workAddressLine2Ref}
                                                returnKeyType={"next"}
                                                onSubmitEditing={() => workAddressStateDropRef.current.show()}
                                                editable={!isSameAddress}
                                            />
                                            <DropDown
                                                dropRef={workAddressStateDropRef}
                                                item={dropStateData}
                                                value={dropStateValueWork}
                                                onChangeValue={(index, value) => { setDropStateValueWork(value), startGetCities(value, "work") }}
                                                containerStyle={{ width: '80%', alignSelf: 'center', borderRadius: 50, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 30, paddingHorizontal: '5%', borderWidth: 0 }}
                                                dropdownStyle={{ maxHeight: 300 }}
                                                disabled={isSameAddress}
                                            />
                                            <SearchableDropDown
                                                dropRef={workAddressCityDropRef}
                                                onItemSelect={(item) => {
                                                    setDropCityValueWork(item.name)
                                                    workAddressZipRef.current.focus()
                                                }}
                                                items={dropCityDataMasterWork}
                                                onTextChange={(text) => setDropCityValueWork(text)}
                                                value={dropCityValueWork}
                                                editable={!isSameAddress}
                                            />
                                            <CustomTextInput
                                                placeholder="Zip code"
                                                value={workAddressData.zip}
                                                onChangeText={(text) => { setWorkAddressData({ ...workAddressData, zip: text }) }}
                                                keyboardType="numeric"
                                                returnKeyType={Platform.OS == "ios" ? "done" : "next"}
                                                returnKeyType='done'
                                                inputRef={workAddressZipRef}
                                                editable={!isSameAddress}
                                            />
                                        </>
                                }
                            </View>
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
