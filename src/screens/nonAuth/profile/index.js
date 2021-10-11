import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, Platform, SafeAreaView, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { getCardImage, globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import TextInputMask from 'react-native-text-input-mask';
import { CheckBox } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

/* Components */
import Header from '../../../components/header';
import CustomInput from "../../../components/textInput"
import DropDown from '../../../components/dropDown';
import { showToast, storeItem } from '../../../components/validators';
import { BASE_URL, getApi } from '../../../api/api';
import { loadauthentication, logout } from '../../../redux/features/loginReducer';
import Loader from '../../../components/loader';
import SearchableDropDown from '../../../components/searchableDropDown';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getUniqueId, getManufacturer } from 'react-native-device-info';



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

const getNotificationType = (type) => {
    switch (type) {
        case 1:
            return "Email"

        case 2:
            return "Push Notification"

        case 3:
            return "Text"

        case 4:
            return "All"
    }
}

const getNotificationTypeNumber = (type) => {
    switch (type) {
        case "Email":
            return 1

        case "Push Notification":
            return 2

        case "Text":
            return 3

        case "All":
            return 4

        default:
            1;
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

const Profile = (props) => {
    const dispatch = useDispatch()

    const fnameRef = useRef(null)
    const lnameRef = useRef(null)
    const prefNameRef = useRef(null)
    const bioRef = useRef(null)
    const emailRef = useRef(null)
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

    const cardNameRef = useRef(null)
    const cardNumberRef = useRef(null)
    const cardDateRef = useRef(null)

    const homeAddressRef = useRef(null)
    const workAddressRef = useRef(null)

    const [addWorkAddressActive, setAddWorkAddressActive] = useState(false)
    const [addHomeAddressActive, setAddHomeAddressActive] = useState(false)

    const user = useSelector(state => state.authenticate.user)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [userData, setUserData] = useState({ ...user })
    const [loader, setLoader] = useState(false)
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    })
    const [notificationType, setNotificationType] = useState(getNotificationType(user.notification_prefrence))
    const [notifDropOpen, setNotifDropOpen] = useState(false)
    const [notifItems, setNotifItems] = useState([
        { label: 'Email', value: 'Email' },
        { label: 'Push Notification', value: 'Push Notification' },
        { label: 'Text', value: 'Text' },
        { label: 'All', value: 'All' },
    ]);
    var creditCardType = require("credit-card-type");
    var cards = creditCardType(cardDetails.number)

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
    const [isSameAddress, setIsSameAddress] = useState(false)
    const [profilePic, setProfilePic] = useState(require("../../../assets/user.png"))

    // 
    const [isConnectedToAccount,setIsConnectedToAccount]=React.useState(false)
    
    function logout() {
        setLoader(true)
        let headers = {
            Accept: "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        var formdata = new FormData();
        formdata.append("device_id", getUniqueId());

        let config = {
            headers: headers,
            data: formdata,
            endPoint: user.user_role == 2 ? '/api/customerLogout' : '/api/providerLogout',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                console.log("response",response)
                if (response.status == true) {
                    storeItem('user', null),
                    props.navigation.navigate('WelcomeScreen')
                }
                else {
                    setLoader(false)
                    showToast(response.message, 'danger')
                }
            })
            .catch(err => {
            })
    }

    useEffect(() => {
        setUserData({ ...user })
        setNotificationType(getNotificationType(user.notification_prefrence))
        homeAddressRef.current.setAddressText(homeAddressData.address_line_1)
    }, [user])

    useEffect(() => {
        if (userData.profile_image) {
            setProfilePic({ uri: BASE_URL + userData.profile_image })
        }
    }, [userData])

    useFocusEffect(
        React.useCallback(() => {
            // getStates()
            setUserData({ ...user })
            setIsSameAddress(user.is_same_address == 1 ? true : false)
            setNotificationType(getNotificationType(user.notification_prefrence))
        }, [])
    );
  useFocusEffect(
        React.useCallback(() => {
            if(user.user_role==3){
                getCheckAccountFromServer()
                getConnectAccountDetail()
            }
        }, [user])
    );
    useEffect(() => {
        const selectedItem = dropCityDataMaster.filter(item => item.name == dropCityValue)
        if (selectedItem.length > 0 && selectedItem[0].id !== undefined) {
            setHomeAddressData({ ...homeAddressData, city: selectedItem[0].id })
        }
    }, [dropCityValue])

    useEffect(() => {
        const selectedItem = dropCityDataMasterWork.filter(item => item.name == dropCityValueWork)
        if (selectedItem.length > 0 && selectedItem[0].id !== undefined) {
            setWorkAddressData({ ...workAddressData, city: selectedItem[0].id })
        }
    }, [dropCityValueWork])

    useEffect(() => {
        getInitialAddressData()
    }, [dropStateDataMaster])

    const [homeAddressData, setHomeAddressData] = useState({
        address_line_1: userData.address[0].address_line_1,
        address_line_2: userData.address[0].address_line_2,
        city: userData.address[0].city,
        state: userData.address[0].state,
        zip: userData.address[0].zip_code,
        lat: userData.address[0].lat,
        lon: userData.address[0].long
    })

    const [workAddressData, setWorkAddressData] = useState({
        address_line_1: userData.address[1].address_line_1,
        address_line_2: userData.address[1].address_line_2,
        city: userData.address[1].city,
        state: userData.address[1].state,
        zip: userData.address[1].zip_code,
        lat: userData.address[1].lat,
        lon: userData.address[1].long
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
                lat: homeAddressData.lat,
                lon: homeAddressData.lon
            })
            workAddressRef.current.setAddressText(homeAddressData.address_line_1)
            // setDropStateValueWork(dropStateValue)
            // setDropCityValueWork(dropCityValue)
        }
    }, [isSameAddress, homeAddressData])

    useEffect(() => {
        if (isSameAddress) {
            setWorkAddressData({
                ...workAddressData,
                address_line_1: homeAddressData.address_line_1,
                address_line_2: homeAddressData.address_line_2,
                city: homeAddressData.city,
                state: homeAddressData.state,
                zip: homeAddressData.zip,
                lat: homeAddressData.lat,
                lon: homeAddressData.lon
            })
            workAddressRef.current.setAddressText(homeAddressData.address_line_1)
            // setDropStateValueWork(dropStateValue)
            // setDropCityValueWork(dropCityValue)
        }
    }, [homeAddressData])

    const updateProfilePic = (image) => {
        setLoader(true)
        let headers = {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${access_token}`
        }

        var formdata = new FormData();
        formdata.append("user_id", user.id);
        formdata.append('profile', {
            uri: Platform.OS == "ios" ? image.path.replace('file:///', '') : image.path,
            name: image.filename ? image.filename : image.path.split("/").pop(),
            type: image.mime,
        });

        let config = {
            headers: headers,
            data: formdata,
            endPoint: user.user_role == 2 ? '/api/customer_profile_update' : '/api/provider_profile_update',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setLoader(false)
                    dispatch(loadauthentication(response.data))
                    showToast("Profile picture updated", 'success')
                }
                else {
                    setLoader(false)
                    showToast(response.message, 'danger')
                }
            })
            .catch(err => {

            })
    }

    const pickImage = () => {
        Alert.alert(
            "LifeSuite",
            "Select picture using ...",
            [
                { text: "Cancel", onPress: () => { }, style: "cancel" },
                {
                    text: "Camera",
                    onPress: () => {
                        ImagePicker.openCamera({
                            width: 400,
                            height: 400,
                            cropping: true
                        }).then(image => {
                            console.log(image);
                            updateProfilePic(image)
                        }).catch(err => {
                            console.log("Image picker error : ", err)
                        })
                    },
                },
                {
                    text: "Gallery", onPress: () => {
                        ImagePicker.openPicker({
                            width: 400,
                            height: 400,
                            cropping: true
                        }).then(image => {
                            console.log(image);
                            updateProfilePic(image)
                        }).catch(err => {
                            console.log("Image picker error : ", err)
                        })
                    }
                },
            ]
        );
    }

    const saveUser = () => {
        setLoader(true)

        let keys = Object.keys(userData)
        for (let index = 0; index < keys.length; index++) {
            if (typeof userData[keys[index]] == 'string' && userData[keys[index]].trim() == '' && keys[index] !== 'prefer_name' && keys[index] !== "about") {
                showToast(getMessage(keys[index]), 'danger')
                setLoader(false)
                return false
            }
        }

        if (user.user_role == 3 && userData.about.trim() == "") {
            showToast("Bio is required", 'danger')
            setLoader(false)
            return false
        }

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (reg.test(userData.email) == false) {
            showToast('Enter Valid Email', 'danger')
            setLoader(false)
            return false
        }

        if (userData.phone_number.length < 10) {
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
                "lat": homeAddressData.lat,
                "long": homeAddressData.lon,
                "zip_code": homeAddressData.zip,
            },
            {
                "country": 231,
                "state": workAddressData.state,
                "city": workAddressData.city,
                "address_line_1": workAddressData.address_line_1,
                "address_line_2": workAddressData.address_line_2,
                "address_type": "work",
                "lat": workAddressData.lat,
                "long": workAddressData.lon,
                "zip_code": workAddressData.zip,
            }
        ]

        if (userData.user_role == 3) {
            let homekeys = Object.keys(address[0])
            for (let index = 0; index < homekeys.length; index++) {
                if (homekeys[index] !== 'state' && homekeys[index] !== 'city' && String(address[0][homekeys[index]]).trim() == '' && homekeys[index] !== 'zip_code' && homekeys[index] !== 'address_line_2' && homekeys[index] !== 'lat' && homekeys[index] !== 'long') {
                    showToast(`${getKeyName(homekeys[index])} is required for ${user.user_role == 2 ? 'home' : 'permanent'} address`, 'danger')
                    setLoader(false)
                    return false
                }
            }

            let keys = Object.keys(address[1])
            for (let index = 0; index < keys.length; index++) {
                if (keys[index] !== 'state' && keys[index] !== 'city' && String(address[0][keys[index]]).trim() == '' && keys[index] !== 'zip_code' && keys[index] !== 'address_line_2' && keys[index] !== 'lat' && keys[index] !== 'long') {
                    showToast(`${getKeyName(keys[index])} is required for ${user.user_role == 2 ? 'work' : 'mailing'} address`, 'danger')
                    setLoader(false)
                    return false
                }
            }
        }

        save(address)
    }

    const getConnectAccountDetail=()=>{
        try{
            let headers = {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${access_token}`
            }
            let config = {
                headers: headers,
                data: JSON.stringify({}),
                endPoint: '/api/isAccountSetupDetail',
                type: 'post'
            }
            getApi(config).then(response=>{
                console.log(response)
                if (response.status == true) {
                    if(response.data){
                        if(response.data.email&&response.data.details_submitted){
                            setIsConnectedToAccount(true)
                        }
                    }
                }
                else {
                    showToast(response.message, 'danger')
                }
            })
            .catch(err => {

            })
        }catch(err){

        }
    }
    const getAccountLink=()=>{
        try{
            let headers = {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${access_token}`
            }
            let config = {
                headers: headers,
                data: JSON.stringify({}),
                endPoint: '/api/addConnectAccountLink',
                type: 'post'
            }
            getApi(config).then(response=>{
                console.log(response)
                if (response.status == true) {
                    if(response.data){
                        props.navigation.navigate("UserStack",{screen:"CustomWebView",params:{uri:response.data.url}})
                    }
                }
                else {
                    showToast(response.message, 'danger')
                }
            })
            .catch(err => {

            })
        }catch(err){

        }
    }
    useEffect(()=>{
        if(user.user_role==3){
            getConnectAccountDetail()
        }
    },[  user])
    const save = (addr) => {
        let notifType = getNotificationTypeNumber(notificationType)

        let headers = {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${access_token}`
        }

        var formdata = new FormData();
        formdata.append("user_id", userData.id);
        formdata.append("email", userData.email);
        formdata.append("first_name", userData.first_name);
        formdata.append("last_name", userData.last_name);
        formdata.append("phone_number", userData.phone_number);
        if (user.user_role == 3) {
            formdata.append("about", userData.about);
        }
        formdata.append("prefer_name", userData.prefer_name);
        formdata.append("notification_prefrence", notifType);
        formdata.append("is_same_address", isSameAddress ? 1 : 0);
        formdata.append("address", JSON.stringify(addr));

        let config = {
            headers: headers,
            data: formdata,
            endPoint: user.user_role == 2 ? '/api/customer_detail_update' : '/api/provider_detail_update',
            type: 'post'
        }

        try {
            getApi(config)
                .then((response) => {
                    if (response.status == true) {
                        setLoader(false)
                        dispatch(loadauthentication(response.data))
                        showToast(response.message, 'success')
                        props.navigation.goBack()
                    }
                    else {
                        setLoader(false)
                        showToast(response.message, 'danger')
                    }
                })
                .catch(err => {

                })
        } catch (error) {
            console.log("error ==>> ", error)
        }
    }

    const getCheckAccountFromServer= () => {
        let headers = {
            Accept: "application/json",
            "Authorization": `Bearer ${access_token}`
        }
     
        let config = {
            headers: headers,
            data: JSON.stringify({}),
            endPoint: '/api/isAccountSetup',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                
                }
                else {
                  
                }
            })
            .catch(err => {
                setLoader(false)
            })
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

    const getCities = (state_id, type) => {
        if (type == "home") {
            if (homeAddressCityDropRef.current) {
                homeAddressCityDropRef.current.blur()
            }
        } else {
            if (workAddressCityDropRef.current) {
                workAddressCityDropRef.current.blur()
            }
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
                                if (homeAddressCityDropRef.current) {
                                    homeAddressCityDropRef.current.focus()
                                }
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
                                if (workAddressCityDropRef.current) {
                                    workAddressCityDropRef.current.focus()
                                }
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
                            if (homeAddressCityDropRef.current) {
                                homeAddressCityDropRef.current.focus()
                            }
                        }, 250);
                    } else {
                        setIsEmptyCityListWork(true)
                        setTimeout(() => {
                            if (workAddressCityDropRef.current) {
                                workAddressCityDropRef.current.focus()
                            }
                        }, 250);
                    }
                    setLoader(false)
                }
            })
            .catch(err => {
                setLoader(false)
            })
    }

    const getInitialAddressData = () => {
        if (dropStateDataMaster.length > 0) {
            let homeState = dropStateDataMaster.filter(item => item.id == homeAddressData.state)
            let workState = dropStateDataMaster.filter(item => item.id == workAddressData.state)
            if (homeState.length > 0 && homeState[0].name !== undefined) {
                setDropStateValue(homeState[0].name)
            }
            if (workState.length > 0 && workState[0].name !== undefined) {
                setDropStateValueWork(workState[0].name)
            }
            getCities(homeAddressData.state, "home")
            getCities(workAddressData.state, "work")
        }
    }

    function formatPhoneNumber(value) {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, "");
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 8) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        if (phoneNumberLength < 13) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 12)}`;
    }

    return (
        <SafeAreaView style={{ ...globalStyles.safeAreaView, backgroundColor: LS_COLORS.global.white }}>
            <Header
                imageUrl={require("../../../assets/back.png")}
                action={() => props.navigation.goBack()}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => props.navigation.navigate("HomeScreen")}
            />
            <TouchableOpacity
                style={{
                    height: 100,
                    aspectRatio: 1,
                    alignSelf: 'center',
                    position: 'absolute',
                    zIndex: 100,
                    top: Platform.OS === 'ios' ? "6%" : "1%",
                    overflow: 'hidden',
                    borderRadius: 70,
                    borderWidth: 0.5,
                    borderColor: LS_COLORS.global.grey,
                }}
                activeOpacity={0.7}
                onPress={() => pickImage()}>
                <Image
                    resizeMode='contain'
                    style={{ height: '100%', width: '100%', }}
                    source={profilePic}
                />
            </TouchableOpacity>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    keyboardShouldPersistTaps='handled'
                    style={styles.container}>
                    <View style={{ marginTop: '15%', marginBottom: '5%' }}>
                        <View style={{}}>
                            <Text style={styles.text}>MY INFORMATION</Text>
                            <Text style={styles.text1}>{userData.first_name}</Text>
                            <Text style={styles.text2}>Profile ID : {userData.id}</Text>
                        </View>
                        <View style={styles.personalContainer}>
                            <Text style={{ ...styles.text2, alignSelf: "flex-start", marginTop: 20, marginLeft: 10 }}>PERSONAL INFORMATION</Text>
                            <CustomInput
                                text="First Name"
                                value={userData.first_name}
                                onChangeText={(text) => {
                                    setUserData({ ...userData, first_name: text })
                                }}
                                inpuRef={fnameRef}
                                returnKeyType="next"
                                onSubmitEditing={() => { lnameRef.current._root.focus() }}
                                required={true}
                            />
                            <CustomInput
                                text="Last Name"
                                value={userData.last_name}
                                onChangeText={(text) => {
                                    setUserData({ ...userData, last_name: text })
                                }}
                                inpuRef={lnameRef}
                                returnKeyType="next"
                                onSubmitEditing={() => prefNameRef.current._root.focus()}
                                required={true}
                            />
                            <CustomInput
                                text="Preffered Name"
                                value={userData?.prefer_name === "null" ? "" : userData.prefer_name}
                                onChangeText={(text) => {
                                    setUserData({ ...userData, prefer_name: text })
                                }}
                                inpuRef={prefNameRef}
                                returnKeyType="next"
                                onSubmitEditing={() => bioRef.current._root.focus()}
                            />

                            {user.user_role == 3 && <CustomInput
                                required
                                text="Bio"
                                value={userData?.about}
                                onChangeText={(text) => {
                                    setUserData({ ...userData, about: text })
                                }}
                                inpuRef={bioRef}
                                returnKeyType="default"
                                customContainerStyles={{ paddingVertical: '2.5%' }}
                                customInputStyles={{ height: 75 }}
                                multiline
                                maxLength={255}
                                numberOfLines={3}
                                bottomText={userData?.about?.length + "/255"}
                            />}

                            <CustomInput
                                text="Email Address"
                                value={userData.email}
                                onChangeText={(text) => {
                                    setUserData({ ...userData, email: text })
                                }}
                                inpuRef={emailRef}
                                returnKeyType="next"
                                onSubmitEditing={() => phoneRef.current._root.focus()}
                                required={true}
                            />
                            <CustomInput
                                text="Phone Number"
                                value={formatPhoneNumber(userData.phone_number)}
                                onChangeText={(text) => {
                                    setUserData({ ...userData, phone_number: text })
                                }}
                                inpuRef={phoneRef}
                                returnKeyType={Platform.OS == "ios" ? "done" : "next"}
                                maxLength={12}
                                onSubmitEditing={() => {
                                    setAddHomeAddressActive(true), setTimeout(() => {
                                        homeAddressLine1Ref.current._root.focus()
                                    }, 250)
                                }}
                                required={true}
                            />
                            <View style={{ marginTop: 25 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: '10%', alignItems: 'center', paddingLeft: '1.5%', marginBottom: 10 }}>
                                    <Text style={{
                                        fontFamily: LS_FONTS.PoppinsMedium,
                                        marginHorizontal: '10%',
                                        color: LS_COLORS.global.black
                                    }}>
                                        {user.user_role == 2 ? 'Home' : 'Permanent'} Address{user.user_role == 2 ? '' : "*"}
                                    </Text>
                                </View>
                                <GooglePlacesAutocomplete
                                    ref={homeAddressRef}
                                    styles={{
                                        container: {
                                            width: '80%',
                                            backgroundColor: LS_COLORS.global.lightGrey,
                                            borderRadius: 28,
                                            alignSelf: 'center',
                                            fontSize: 14,
                                            fontFamily: LS_FONTS.PoppinsRegular,
                                            paddingTop: 5,
                                            paddingHorizontal: '10%',
                                            maxHeight: 200
                                        },
                                        textInput: {
                                            backgroundColor: LS_COLORS.global.lightGrey,

                                        },
                                        listView: { paddingVertical: 5 },
                                        separator: {}
                                    }}
                                    placeholder={`${user.user_role == 2 ? 'Home' : 'Permanent'} address${user.user_role == 2 ? '' : "*"}`}
                                    fetchDetails={true}
                                    onPress={(data, details) => {
                                        setHomeAddressData({
                                            ...homeAddressData,
                                            address_line_1: data.description,
                                            lat: details.geometry.location.lat,
                                            lon: details.geometry.location.lng
                                        })
                                    }}
                                    textInputProps={{
                                        onSubmitEditing: () => workAddressRef.current.focus(),
                                        placeholderTextColor: LS_COLORS.global.placeholder
                                    }}
                                    query={{
                                        key: 'AIzaSyBRpW8iA1sYpuNb_gzYKKVtvaVbI-wZpTM',
                                        language: 'en',
                                    }}
                                />
                                {/* {
                                    !addHomeAddressActive
                                        ?
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            onPress={() => { setAddHomeAddressActive(!addHomeAddressActive) }}
                                            style={{ flexDirection: "row", marginLeft: '5%', marginTop: 20, alignItems: 'center' }}>
                                            <Image
                                                style={{ height: 24, width: 24, resizeMode: "contain" }}
                                                source={require("../../../assets/plus.png")}
                                            />
                                            <Text style={{ ...styles.text2, marginLeft: 10, }}>ADD {user.user_role == 2 ? 'HOME' : 'PERMANENT'} ADDRESS{user.user_role == 1 ? '' : "*"}</Text>
                                        </TouchableOpacity>
                                        :
                                        <>
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                onPress={() => { setAddHomeAddressActive(!addHomeAddressActive) }}
                                                style={{ flexDirection: "row", marginLeft: '5%', marginTop: 20, alignItems: 'center' }}>
                                                <Image
                                                    style={{ height: 24, width: 24, resizeMode: "contain" }}
                                                    source={require("../../../assets/plus.png")}
                                                />
                                                <Text style={{ ...styles.text2, marginLeft: 10, }}>ADD {user.user_role == 2 ? 'HOME' : 'PERMANENT'} ADDRESS{user.user_role == 1 ? '' : "*"}</Text>
                                            </TouchableOpacity>
                                            <View style={{}}>
                                                <CustomInput
                                                    text="ADDRESS LINE 1"
                                                    value={homeAddressData.address_line_1}
                                                    onChangeText={(text) => { setHomeAddressData({ ...homeAddressData, address_line_1: text }) }}
                                                    inpuRef={homeAddressLine1Ref}
                                                    returnKeyType={"next"}
                                                    onSubmitEditing={() => homeAddressLine2Ref.current._root.focus()}
                                                />
                                                <CustomInput
                                                    text="ADDRESS LINE 2"
                                                    value={homeAddressData.address_line_2}
                                                    onChangeText={(text) => { setHomeAddressData({ ...homeAddressData, address_line_2: text }) }}
                                                    inpuRef={homeAddressLine2Ref}
                                                    returnKeyType={"next"}
                                                    onSubmitEditing={() => homeAddressStateDropRef.current.show()}
                                                />
                                                <View style={{ marginTop: 25 }} />
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
                                                        homeAddressZipRef.current._root.focus()
                                                    }}
                                                    items={dropCityDataMaster}
                                                    onTextChange={(text) => setDropCityValue(text)}
                                                    value={dropCityValue}
                                                />

                                                <CustomInput
                                                    text="Zip code"
                                                    value={homeAddressData.zip}
                                                    onChangeText={(text) => { setHomeAddressData({ ...homeAddressData, zip: text }) }}
                                                    keyboardType="numeric"
                                                    keyboardType="numeric"
                                                    returnKeyType={Platform.OS == "ios" ? "done" : "next"}
                                                    inpuRef={homeAddressZipRef}
                                                    onSubmitEditing={() => {
                                                        setAddWorkAddressActive(true), setTimeout(() => {
                                                            workAddressLine1Ref.current._root.focus()
                                                        }, 250)
                                                    }}
                                                />
                                            </View>
                                        </>
                                } */}
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: '10%', alignItems: 'center', paddingLeft: '1.5%' }}>
                                    <Text style={{
                                        fontFamily: LS_FONTS.PoppinsMedium,
                                        marginHorizontal: '10%',
                                        color: LS_COLORS.global.black
                                    }}>
                                        {user.user_role == 2 ? 'Work' : 'Mailing'} Address{user.user_role == 2 ? '' : "*"}
                                    </Text>
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
                                        <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>Same address</Text>
                                    </View>
                                </View>
                                <GooglePlacesAutocomplete
                                    ref={workAddressRef}
                                    styles={{
                                        container: {
                                            width: '80%',
                                            backgroundColor: LS_COLORS.global.lightGrey,
                                            borderRadius: 28,
                                            alignSelf: 'center',
                                            fontSize: 14,
                                            fontFamily: LS_FONTS.PoppinsRegular,
                                            paddingTop: 5,
                                            paddingHorizontal: '10%',
                                            maxHeight: 200
                                        },
                                        textInput: {
                                            backgroundColor: LS_COLORS.global.lightGrey,
                                        },
                                        listView: { paddingVertical: 5 },
                                        separator: {}
                                    }}
                                    placeholder={`${user.user_role == 2 ? 'Work' : 'Mailing'} Address${user.user_role == 2 ? '' : "*"}`}
                                    fetchDetails={true}
                                    onPress={(data, details) => {
                                        setWorkAddressData({
                                            ...workAddressData,
                                            address_line_1: data.description,
                                            lat: details.geometry.location.lat,
                                            lon: details.geometry.location.lng
                                        })
                                    }}
                                    textInputProps={{
                                        editable: !isSameAddress,
                                        placeholderTextColor: LS_COLORS.global.placeholder
                                    }}
                                    query={{
                                        key: 'AIzaSyBRpW8iA1sYpuNb_gzYKKVtvaVbI-wZpTM',
                                        language: 'en',
                                    }}
                                />
                                {/* {
                                    !addWorkAddressActive
                                        ?
                                        <View style={{ flexDirection: "row", marginBottom: 15, marginHorizontal: '5%', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                onPress={() => setAddWorkAddressActive(!addWorkAddressActive)}
                                                style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image
                                                    style={{ height: 24, width: 24, resizeMode: "contain" }}
                                                    source={require("../../../assets/plus.png")}
                                                />
                                                <Text style={{ ...styles.text2, marginLeft: 10, }}>ADD {user.user_role == 2 ? 'WORK' : 'MAILING'} ADDRESS{user.user_role == 1 ? '' : "*"}</Text>
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
                                            <View style={{ flexDirection: "row", marginBottom: 15, marginHorizontal: '5%', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    onPress={() => setAddWorkAddressActive(!addWorkAddressActive)}
                                                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image
                                                        style={{ height: 24, width: 24, resizeMode: "contain" }}
                                                        source={require("../../../assets/plus.png")}
                                                    />
                                                    <Text style={{ ...styles.text2, marginLeft: 10, }}>ADD {user.user_role == 2 ? 'WORK' : 'MAILING'} ADDRESS{user.user_role == 1 ? '' : "*"}</Text>
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
                                            <CustomInput
                                                text="ADDRESS LINE 1"
                                                value={workAddressData.address_line_1}
                                                onChangeText={(text) => { setWorkAddressData({ ...workAddressData, address_line_1: text }) }}
                                                inpuRef={workAddressLine1Ref}
                                                returnKeyType={"next"}
                                                onSubmitEditing={() => workAddressLine2Ref.current._root.focus()}
                                                editable={!isSameAddress}
                                            />
                                            <CustomInput
                                                text="ADDRESS LINE 2"
                                                value={workAddressData.address_line_2}
                                                onChangeText={(text) => { setWorkAddressData({ ...workAddressData, address_line_2: text }) }}
                                                inpuRef={workAddressLine2Ref}
                                                returnKeyType={"next"}
                                                onSubmitEditing={() => workAddressStateDropRef.current.show()}
                                                editable={!isSameAddress}
                                            />
                                            <View style={{ marginTop: 25 }} />
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
                                                    workAddressZipRef.current._root.focus()
                                                }}
                                                items={dropCityDataMasterWork}
                                                onTextChange={(text) => setDropCityValueWork(text)}
                                                value={dropCityValueWork}
                                                editable={!isSameAddress}
                                            />
                                            <CustomInput
                                                text="Zip code"
                                                value={workAddressData.zip}
                                                onChangeText={(text) => { setWorkAddressData({ ...workAddressData, zip: text }) }}
                                                keyboardType="numeric"
                                                returnKeyType={Platform.OS == "ios" ? "done" : "next"}
                                                returnKeyType='done'
                                                inpuRef={workAddressZipRef}
                                                editable={!isSameAddress}
                                            />
                                        </>
                                } */}
                            </View>
                            <View style={{ height: 20 }}></View>
                            <View style={{}}>
                                {
                                    Platform.OS == "ios"
                                        ?
                                        <DropDownPicker
                                            open={notifDropOpen}
                                            value={notificationType}
                                            items={notifItems}
                                            showArrowIcon={true}
                                            setOpen={setNotifDropOpen}
                                            setValue={setNotificationType}
                                            setItems={setNotifItems}
                                            zIndex={99999999}
                                            style={{
                                                borderWidth: 0,
                                                borderColor: LS_COLORS.global.borderColor,
                                                backgroundColor: 'transparent',
                                            }}
                                            arrowIconContainerStyle={{ marginRight: '5%' }}
                                            arrowIconStyle={{ tintColor: LS_COLORS.global.green }}
                                            tickIconStyle={{ tintColor: LS_COLORS.global.green }}
                                            containerStyle={{ width: '80%', alignSelf: 'center', borderRadius: 50, backgroundColor: LS_COLORS.global.lightGrey, borderWidth: 0, zIndex: 1000000 }}
                                            labelStyle={{ color: LS_COLORS.global.black, width: '100%', paddingLeft: '7.5%' }}
                                            textStyle={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular }}
                                            dropDownContainerStyle={{ borderWidth: 0.3, borderColor: LS_COLORS.global.grey, borderRadius: 0, zIndex: 9999999999 }}
                                            listItemContainerStyle={{ zIndex: 999999999 }}
                                        />
                                        :
                                        <DropDown
                                            title="Notification type"
                                            item={["Email", "Push Notification", "Text", "All"]}
                                            value={notificationType}
                                            onChangeValue={(index, value) => { setNotificationType(value), user.user_role == 2 ? cardNumberRef.current.focus() : null }}
                                            containerStyle={{ width: '90%', alignSelf: 'center', borderRadius: 50, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 30, paddingHorizontal: '5%', borderWidth: 0 }}
                                            dropdownStyle={{ height: 120 }}
                                        />
                                }
                                <View style={{ height: 40 }}></View>
                            </View>
                        </View>
                        {
                            user.user_role == 2
                                ?
                                <View style={{ ...styles.personalContainer, marginTop: 20, zIndex: -1000 }}>
                                    <Text style={{ ...styles.text2, alignSelf: "flex-start",fontSize:14, marginTop: 20, marginLeft: 10 }}>BILLING INFORMATION </Text>
                                    <TouchableOpacity onPress={()=>{
                                        props.navigation.navigate("UserStack",{screen:"CardList"})
                                    }}>
                                        <Text style={{ ...styles.text2, alignSelf: "flex-start", marginTop: 20, marginLeft: 10 }}>Manage Cards</Text>
                                    </TouchableOpacity>
                                    {/* <View style={{
                                        borderRadius: 7,
                                        borderColor: LS_COLORS.global.textInutBorderColor,
                                        paddingLeft: 16,
                                        width: '100%',
                                        maxWidth: '90%',
                                        alignSelf: 'center',
                                        height: 50,
                                        borderWidth: 1,
                                        marginTop: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <View style={{ flex: 1 }}>
                                            <TextInputMask
                                                style={{
                                                    color: LS_COLORS.global.black,
                                                    fontFamily: LS_FONTS.PoppinsMedium,
                                                    fontSize: 16,
                                                }}
                                                placeholder={'Credit Card Number'}
                                                onChangeText={(formatted, extracted) => {
                                                    console.log(formatted)
                                                    console.log(extracted)
                                                    setCardDetails({ ...cardDetails, number: extracted })
                                                }}
                                                value={cardDetails.number}
                                                mask={"[0000] [0000] [0000] [0000]"}
                                                keyboardType="numeric"
                                                ref={cardNumberRef}
                                                returnKeyType="next"
                                                onSubmitEditing={() => cardNameRef.current.focus()}
                                            />
                                        </View>
                                        <View style={{ height: '100%', aspectRatio: 1, position: 'absolute', right: 15, alignItems: 'center', justifyContent: 'center' }}>
                                            {
                                                cardDetails.number.length > 0
                                                    ?
                                                    <Image
                                                        source={getCardImage(cards.length > 0 && cards[0].type !== undefined ? cards[0].type : null)}
                                                        resizeMode="contain"
                                                        style={{ height: '90%', aspectRatio: 1 }}
                                                    />
                                                    :
                                                    null
                                            }

                                        </View>
                                    </View>
                                    <TextInputMask
                                        style={{
                                            borderRadius: 7,
                                            borderColor: LS_COLORS.global.textInutBorderColor,
                                            paddingLeft: 16,
                                            width: '100%',
                                            maxWidth: '90%',
                                            alignSelf: 'center',
                                            color: LS_COLORS.global.black,
                                            height: 50,
                                            fontFamily: LS_FONTS.PoppinsMedium,
                                            fontSize: 16,
                                            borderWidth: 1,
                                            marginTop: 10
                                        }}
                                        placeholder={'Credit Card Holder Name'}
                                        onChangeText={(formatted, extracted) => {
                                            console.log(formatted)
                                            console.log(extracted)
                                            setCardDetails({ ...cardDetails, name: extracted })
                                        }}
                                        value={cardDetails.name}
                                        ref={cardNameRef}
                                        returnKeyType="next"
                                        onSubmitEditing={() => cardDateRef.current.focus()}
                                    />

                                    <TextInputMask
                                        style={{
                                            borderRadius: 7,
                                            borderColor: LS_COLORS.global.textInutBorderColor,
                                            paddingLeft: 16,
                                            width: '100%',
                                            maxWidth: '90%',
                                            alignSelf: 'center',
                                            color: LS_COLORS.global.black,
                                            height: 50,
                                            fontFamily: LS_FONTS.PoppinsMedium,
                                            fontSize: 16,
                                            borderWidth: 1,
                                            marginTop: 10
                                        }}
                                        placeholder={'Expiry Date(MM/YY)'}
                                        onChangeText={(formatted, extracted) => {
                                            console.log(formatted)
                                            console.log(extracted)
                                            setCardDetails({ ...cardDetails, expiry: extracted })
                                        }}
                                        value={cardDetails.expiry}
                                        mask={"[00]/[00]"}
                                        keyboardType="numeric"
                                        ref={cardDateRef}
                                        returnKeyType="done"
                                    />

                                    <TextInputMask
                                        style={{
                                            borderRadius: 7,
                                            borderColor: LS_COLORS.global.textInutBorderColor,
                                            paddingLeft: 16,
                                            width: '100%',
                                            maxWidth: '90%',
                                            alignSelf: 'center',
                                            color: LS_COLORS.global.black,
                                            height: 50,
                                            fontFamily: LS_FONTS.PoppinsMedium,
                                            fontSize: 16,
                                            borderWidth: 1,
                                            marginTop: 10
                                        }}
                                        placeholder={'CVV'}
                                        onChangeText={(formatted, extracted) => {
                                            console.log(formatted)
                                            console.log(extracted)
                                            setCardDetails({ ...cardDetails, cvv: extracted })
                                        }}
                                        value={cardDetails.cvv}
                                        mask={"[000]"}
                                        keyboardType="numeric"
                                        ref={cardDateRef}
                                        returnKeyType="done"
                                    /> */}
                                    <View style={{ height: 50 }} />
                                </View>
                                :
                                <View style={{ ...styles.personalContainer, paddingVertical: 20, marginTop: 10, zIndex: -1000 }}>
                                    <Text style={{ ...styles.text2, alignSelf: "flex-start", marginLeft: 10 }}>Account Information</Text>
                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '5%', marginTop: '2%', borderWidth: 0.5, width: '90%', alignSelf: 'center', alignItems: 'center', paddingVertical: 5, borderRadius: 8, borderColor: LS_COLORS.global.grey }}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            if(isConnectedToAccount){

                                            }else{
                                                getAccountLink()
                                            }
                                        }}>
                                        {isConnectedToAccount?<Text>Connect Account Linked</Text>:<Text style={{ fontFamily: LS_FONTS.PoppinsRegular }}>Join Account</Text>}
                                    </TouchableOpacity>
                                </View>
                        }
                        {/* <TouchableOpacity
                            style={styles.save}
                            activeOpacity={0.7}
                            onPress={() => saveUser()}>
                            <Text style={styles.saveText}>
                                Save
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.save}
                            activeOpacity={0.7}
                            onPress={() => props.navigation.navigate('Settings')}>
                            <Text style={styles.saveText}>
                                Settings
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ ...styles.save, marginBottom: 15 }}
                            activeOpacity={0.7}
                            onPress={() => {
                                storeItem('user', null)
                                props.navigation.navigate('HomeScreen')
                                props.navigation.navigate('WelcomeScreen')
                            }}>
                            <Text style={styles.saveText}>
                                Logout
                            </Text>
                        </TouchableOpacity> */}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <View style={{ flexDirection: 'row', backgroundColor: LS_COLORS.global.transparent, height: Dimensions.get('screen').height / 12, justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: '5%' }}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => saveUser()} style={{ height: 30, aspectRatio: 1 }}>
                    <Image source={require('../../../assets/save.png')} style={{ height: '100%', width: '100%' }} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => props.navigation.navigate('Settings')} style={{ height: 30, aspectRatio: 1 }}>
                    <Image source={require('../../../assets/gear.png')} style={{ height: '100%', width: '100%' }} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() =>  logout() } style={{ height: 30, aspectRatio: 1 }}>
                    <Image source={require('../../../assets/logout.png')} style={{ height: '100%', width: '100%' }} resizeMode="contain" />
                </TouchableOpacity>
            </View>
            {loader && <Loader />}
        </SafeAreaView>
    )
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
    },
    text: {
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsBold,
        marginTop: 16,
        alignSelf: 'center'
    },
    text1: {
        fontSize: 18,
        fontFamily: LS_FONTS.PoppinsMedium,
        marginTop: 16,
        alignSelf: 'center',
        color: LS_COLORS.global.green
    },
    text2: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsRegular,
        alignSelf: 'center',
        color: '#5A5A5A'
    },
    personalContainer: {
        maxHeight: '100%',
        marginTop: "3%",
        width: "90%",
        elevation: 200,
        shadowColor: '#00000029',
        backgroundColor: 'white',
        shadowColor: '#00000029',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        borderRadius: 10,
        alignSelf: 'center',
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 40,
        width: 111,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 28,
        alignSelf: 'center',
        marginVertical: 15
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    }
})
