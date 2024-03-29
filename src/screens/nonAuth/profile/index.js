import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, Platform, SafeAreaView, Alert, Pressable, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { getCardImage, globalStyles } from '../../../utils';
import { role } from '../../../constants/globals';
/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import TextInputMask from 'react-native-text-input-mask';
import { CheckBox } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Entypo from 'react-native-vector-icons/Entypo'
// @"AIzaSyB5d--ow70_ZQqfsDdp2XSGX6AFg2tjhfU"
/* Components */
import Header from '../../../components/header';
import CustomInput from "../../../components/textInput"
import { CustomTextInput } from '../../../components/customTextInput';

import DropDown from '../../../components/dropDown';
import { showToast, storeItem } from '../../../components/validators';
import { BASE_URL, getApi } from '../../../api/api';
import { loadauthentication, logout, logoutAll, logoutState } from '../../../redux/features/loginReducer';
import Loader from '../../../components/loader';
import SearchableDropDown from '../../../components/searchableDropDown';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DeviceInfo, { getUniqueId, getManufacturer } from 'react-native-device-info';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ModalOTP from '../../../components/ModalOTP';
import _ from 'lodash'
import { Rating } from 'react-native-ratings';


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
        case "dob":
            return "Date of birth is required "

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
    const [userData, setUserData] = useState({ ...user, dob: moment(user.dob, "YYYY-MM-DD").format("MM/DD/YYYY") })
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
    const [isConnectedToAccount, setIsConnectedToAccount] = React.useState(false)
    // 
    const [connectedDetail, setConnectedDetail] = React.useState({})
    const [selection, setSelection] = React.useState({ start: 0 })
    const [selection1, setSelection1] = React.useState({ start: 0 })
    const [pictures, setPictures] = React.useState([])
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [initialDate, setInitialDate] = useState(new Date())
    // starting the value is always 
    const [isVerfiedPhone, setIsVerifiedPhone] = useState(true)
    const [otpModal, setOTPModal] = useState(false)
    // 
    const [devicdId, setDevicdId] = useState('')

    useEffect(() => {
        getDeviceID()
    }, [])

    const getDeviceID = async() =>{
        let device_id=await DeviceInfo.getUniqueId()
        setDevicdId(device_id)
    }

    const [experience, setExperince] = React.useState("")
    const [gender,setGender]=React.useState("Male")
    React.useEffect(() => {
        if (user.user_role == role.provider) {
            let exp = user.experience
            if (Number(exp) > 0) {
                if (Number(exp) > 1) {
                    exp += " years"
                } else {
                    exp += " year"
                }
            }
            setExperince(exp)
        }
        if(user?.gender){
            setGender(String(user?.gender))
        }
    }, [user])

    async function logout() {
        setLoader(true)
        let device_id=await DeviceInfo.getUniqueId()
        let headers = {
            "Authorization": `Bearer ${access_token}`
        }
        var formdata = new FormData();
        formdata.append("device_id", device_id);

        let config = {
            headers: headers,
            data: formdata,
            endPoint: user.user_role == role.customer ? '/api/customerLogout' : '/api/providerLogout',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                console.log(response,"response===>");
                if (response.status == true) {
                    storeItem('user', null)
                    storeItem('passcode', null)
                    props.navigation.navigate('WelcomeScreen')
                    dispatch(logoutAll())
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
        setUserData({ ...user, dob: moment(user.dob, "YYYY-MM-DD").format("MM/DD/YYYY") })
        setNotificationType(getNotificationType(user.notification_prefrence))
        homeAddressRef.current.setAddressText(homeAddressData.address_line_1)
        workAddressRef.current.setAddressText()

    }, [user])

    useEffect(() => {

        if (userData.profile_image) {
            setProfilePic({ uri: BASE_URL + userData.profile_image })
        }
    }, [userData])

    useFocusEffect(
        React.useCallback(() => {
            // getStates()
            setUserData({ ...user, dob: moment(user.dob, "YYYY-MM-DD").format("MM/DD/YYYY") })
            setIsSameAddress(user.is_same_address == 1 ? true : false)
            setNotificationType(getNotificationType(user.notification_prefrence))
        }, [])
    );
    useFocusEffect(
        React.useCallback(() => {
            if (user.user_role == role.provider) {
                getCheckAccountFromServer()
                getConnectAccountDetail()
            }
        }, [user])
    );
    useEffect(() => {
        const selectedItem = dropCityDataMaster.filter(item => item.name == dropCityValue)
        if (selectedItem.length > 0 && selectedItem[0].id !== undefined) {
            // setHomeAddressData({ ...homeAddressData, city: selectedItem[0].id })
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
        address_line_1: userData?.address[0]?.address_line_1??"",
        address_line_2: userData?.address[0]?.address_line_2??"",
        city: userData?.address[0]?.city??"",
        state: userData?.address[0]?.state??"",
        country: userData?.address[0]?.country??"",
        zip_code: userData?.address[0]?.zip_code??"",
        lat: userData?.address[0]?.lat??0,
        lon: userData?.address[0]?.long??0
    })

    const [workAddressData, setWorkAddressData] = useState({
        address_line_1: userData?.address[1]?.address_line_1??"",
        address_line_2: userData?.address[1]?.address_line_2??"",
        city: userData?.address[1]?.city??"",
        state: userData?.address[1]?.state??"",
        zip_code: userData?.address[1]?.zip_code??"",
        country: userData?.address[1]?.country??"",
        lat: userData?.address[1]?.lat??0,
        lon: userData?.address[1]?.long??0
    })
    useEffect(() => {
        if (userData?.address) {
            if (userData[0]?.type == "home") {
                setHomeAddressData({
                    address_line_1: userData?.address[0]?.address_line_1??"",
                    address_line_2: userData?.address[0]?.address_line_2??"",
                    city: userData?.address[0]?.city??"",
                    state: userData?.address[0]?.state??"",
                    country: userData?.address[0]?.country??"",
                    zip_code: userData?.address[0]?.zip_code??"",
                    lat: userData?.address[0]?.lat??0,
                    lon: userData?.address[0]?.long??0,
                })
            } else {
                setWorkAddressData({
                    address_line_1: userData?.address[0]?.address_line_1??"",
                    address_line_2: userData?.address[0]?.address_line_2??"",
                    city: userData?.address[0]?.city??"",
                    state: userData?.address[0]?.state??"",
                    country: userData?.address[0]?.country??"",
                    zip_code: userData?.address[0]?.zip_code??"",
                    lat: userData?.address[0]?.lat??0,
                    lon: userData?.address[0]?.long??0
                })
            }
            if (userData[1]?.type == "work") {
                setWorkAddressData({
                    address_line_1: userData?.address[1]?.address_line_1??"",
                    address_line_2: userData?.address[1]?.address_line_2??"",
                    city: userData?.address[1]?.city??"",
                    state: userData?.address[1]?.state??"",
                    country: userData?.address[1]?.country??"",
                    zip_code: userData?.address[1]?.zip_code??"",
                    lat: userData?.address[1]?.lat??0,
                    lon: userData?.address[1]?.long??0
                })
            } else {
                setHomeAddressData({
                    address_line_1: userData?.address[1]?.address_line_1??"",
                    address_line_2: userData?.address[1]?.address_line_2??"",
                    city: userData?.address[1]?.city??"",
                    state: userData?.address[1]?.state??"",
                    country: userData?.address[1]?.country??"",
                    zip_code: userData?.address[1]?.zip_code??"",
                    lat: userData?.address[1]?.lat??0,
                    lon: userData?.address[1]?.long??0
                })
            }
        }
    }, [userData])
    useEffect(() => {
        if (isSameAddress) {
            setWorkAddressData({
                ...workAddressData,
                address_line_1: homeAddressData.address_line_1??"",
                address_line_2: homeAddressData.address_line_2??"",
                city: homeAddressData?.city??"",
                state: homeAddressData?.state??"",
                country: homeAddressData?.country??"",
                zip_code: homeAddressData?.zip_code??"",
                lat: homeAddressData.lat??0,
                lon: homeAddressData.lon??0
            })
            // workAddressRef.current.setAddressText(homeAddressData.address_line_1)
            // setDropStateValueWork(dropStateValue)
            // setDropCityValueWork(dropCityValue)
        } else {
            if (userData?.address[1]) {
                setWorkAddressData({
                    address_line_1: userData.address[1]?.address_line_1??"",
                    address_line_2: userData.address[1]?.address_line_2??"",
                    city: userData?.address[1]?.city??"",
                    state: userData?.address[1]?.state??"",
                    country: userData?.address[1]?.country??"",
                    zip_code: userData?.address[1]?.zip_code??"",
                    lat: userData.address[1]?.lat??0,
                    lon: userData.address[1]?.long??0
                })
            }

            // workAddressRef.current.setAddressText(homeAddressData.address_line_1)
        }
    }, [isSameAddress, homeAddressData])

    React.useEffect(() => {
        workAddressRef.current.setAddressText(workAddressData.address_line_1)
    }, [workAddressData])

    useEffect(() => {
        if (isSameAddress) {
            setWorkAddressData({
                ...workAddressData,
                address_line_1: homeAddressData.address_line_1??"",
                address_line_2: homeAddressData.address_line_2??"",
                city: homeAddressData?.city??"",
                state: homeAddressData?.state??"",
                country: homeAddressData?.country??"",
                zip_code: homeAddressData?.zip_code??"",
                lat: homeAddressData.lat??0,
                lon: homeAddressData.lon??0
            })
            workAddressRef.current.setAddressText(homeAddressData.address_line_1)
            // setDropStateValueWork(dropStateValue)
            // setDropCityValueWork(dropCityValue)
        } else {

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
            endPoint: user.user_role == role.customer ? '/api/customer_profile_update' : '/api/provider_profile_update',
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
                            cropping: true,
                            forceJpg: true,
                            compressImageQuality:.7,
                        }).then(image => {
                            updateProfilePic(image)
                        }).catch(err => {
                            console.warn("Image picker error : ", err)
                        })
                    },
                },
                {
                    text: "Gallery", onPress: () => {
                        ImagePicker.openPicker({
                            width: 400,
                            height: 400,
                            cropping: true,
                            forceJpg: true,
                            compressImageQuality:.7,
                        }).then(image => {
                            updateProfilePic(image)
                        }).catch(err => {
                           
                        })
                    }
                },
            ]
        );
    }

    const saveUser = () => {
        setLoader(true)
        let required_keys_customer = ['first_name', 'last_name', 'dob', 'phone_number', 'email']

        // let keys = Object.keys(userData)
        // for (let index = 0; index < keys.length; index++) {
        //     if (typeof userData[keys[index]] == 'string' && userData[keys[index]].trim() == '' && keys[index] !== 'prefer_name'&&keys[index]!=="middle_name"&&keys[index]!=="prefer_name"&& keys[index] !== "about") {
        //         showToast(getMessage(keys[index]), 'danger')
        //         setLoader(false)
        //         return false
        //     }
        // }
        for (let i of required_keys_customer) {
            if (userData[`${i}`]?.trim() == '' || userData[`${i}`] == 0) {
                showToast(getMessage(i), 'danger')
                setLoader(false)
                return false
            }
        }

        if (!isVerfiedPhone) {
            showToast("Please verify your phone number.")
            setLoader(false)
            return
        }
        // if (user.user_role == role.provider && userData.about.trim() == "") {
        //     showToast("Bio is required", 'danger')
        //     setLoader(false)
        //     return false
        // }

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
                "country": homeAddressData?.country ?? "",
                "state": homeAddressData.state ?? "",
                "city": homeAddressData.city ?? "",
                "address_line_1": homeAddressData.address_line_1,
                "address_line_2": homeAddressData.address_line_2,
                "address_type": "home",
                "lat": homeAddressData.lat,
                "long": homeAddressData.lon,
                "zip_code": homeAddressData.zip ?? "",
            },
            {
                "country": homeAddressData?.country ?? "",
                "state": workAddressData.state ?? "",
                "city": workAddressData.city ?? "",
                "address_line_1": workAddressData.address_line_1,
                "address_line_2": workAddressData.address_line_2,
                "address_type": "work",
                "lat": workAddressData.lat,
                "long": workAddressData.lon,
                "zip_code": workAddressData.zip ?? "",
            }
        ]
        // alert(user.user_role)
        // return
        if (user?.user_role == role.provider) {
            // let homekeys = Object.keys(address[0])
            // for (let index = 0; index < homekeys.length; index++) {
            if (homeAddressData.address_line_1 == "") {
                showToast(`${user.user_role == 2 ? 'home' : 'permanent'} address is required`, 'danger')
                setLoader(false)
                return false
            }
            // }

            if (workAddressData.address_line_1 == "") {
                showToast(`${user.user_role == 2 ? 'work' : 'mailing'} address is required`, 'danger')
                setLoader(false)
                return false
            }
        }
        var date = moment(userData.dob, 'MM/DD/YYYY', true)
        var date1 = moment(userData.dob, 'YYYY-MM-DD', true)
        if (date.isValid() || date1.isValid) {

        } else {
            setLoader(false)
            return showToast("Invalid date format(mm/dd/yy)")
        }
        if (moment().diff(date, 'years') <= 18) {
            setLoader(false)
            return showToast("You must be 18 or over to use this application.")
        }
        save(address)
    }

    const getConnectAccountDetail = () => {
        try {
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
            getApi(config).then(response => {
                if (response.status == true) {
                    if (response.data) {
                        if (response.data.email && response.data.details_submitted) {
                            setIsConnectedToAccount(true)
                            setConnectedDetail(response.data)
                        }
                    }
                }
                else {
                    showToast(response.message, 'danger')
                }
            })
                .catch(err => {

                })
        } catch (err) {

        }
    }
    const getAccountLink = () => {
        try {
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
            getApi(config).then(response => {
                if (response.status == true) {
                    if (response.data) {
                        props.navigation.navigate("UserStack", { screen: "CustomWebView", params: { uri: response.data.url } })
                    }
                }
                else {
                    showToast(response.message, 'danger')
                }
            })
                .catch(err => {

                })
        } catch (err) {

        }
    }


    const createNewConnect = async () => {

        try {
            setLoader(true)
            let headers = {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${access_token}`
            }
            let config = {
                headers: headers,
                data: JSON.stringify({}),
                endPoint: '/api/providerCreateNewConnect',
                type: 'post'
            }
            let response = await getApi(config)
      
            if (response.status) {
                if (response.data) {
                    props.navigation.navigate("UserStack", { screen: "CustomWebView", params: { uri: response.data.url, change: true, connect_account_id: response.connect_account_id } })
                } else {
                    showToast(response.message, 'danger')
                }
            } else {
                showToast(response.message, 'danger')
            }

        } catch (err) {

        } finally {
            setLoader(false)
        }
    }
    useEffect(() => {
        if (user.user_role == role.provider) {
            getConnectAccountDetail()
        }
    }, [user])
    const save = (addr) => {
        let notifType = getNotificationTypeNumber(notificationType)
        if (!moment(userData.dob, "MM/DD/YYYY").isValid()) {
            showToast("Please enter valid date!", 'danger')
            setLoader(false)
            return
        }
        let headers = {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${access_token}`
        }
        // alert()
        var formdata = new FormData();
        formdata.append("user_id", userData.id);
        formdata.append("email", userData.email);
        formdata.append("first_name", userData.first_name);
        formdata.append("middle_name", userData.middle_name == "" ? "null" : userData.middle_name);
        formdata.append("last_name", userData.last_name);
        formdata.append("dob", moment(userData.dob, "MM/DD/YYYY").format("YYYY-MM-DD"));
        formdata.append("phone_number", userData.phone_number.match(/\d/g).join(""));

        if (user.user_role == role.provider) {
            formdata.append("about", userData.about);
            for (let i of pictures) {
                formdata.append("pictures[]", {
                    uri: Platform.OS == "ios" ? i.path.replace('file:///', '') : i.path,
                    name: i.filename ? i.filename : i.path.split("/").pop(),
                    type: i.mime,
                })
            }
            formdata.append("business_name", userData.business_name)
            formdata.append("experience", String(experience).replace(/[^\d.\.]/gi, ""))
            formdata.append("phone_is_public", userData.phone_is_public)
            formdata.append("tagline", userData.tagline)
            formdata.append("address_is_public", userData.address_is_public)
            formdata.append("service_is_at_address", userData.service_is_at_address)
            formdata.append("license", userData.license)
            if (userData.certificate_data?.length > 0) {
                formdata.append("certificateTextData", JSON.stringify(userData.certificate_data.map(x => x.certificate)))
            }

        }
        formdata.append("prefer_name", userData.prefer_name);
        formdata.append("notification_prefrence", notifType);
        formdata.append("is_same_address", isSameAddress ? 1 : 0);
        formdata.append("address", JSON.stringify(addr));
        formdata.append("gender",String(gender).toLowerCase())
        let config = {
            headers: headers,
            data: formdata,
            endPoint: user.user_role == role.customer ? '/api/customer_detail_update' : '/api/provider_detail_update',
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
        
        }
    }

    const getCheckAccountFromServer = () => {
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

    React.useEffect(() => {
   
    }, [homeAddressData, workAddressData])

    function formatPhoneNumber(value) {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, "");
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 8) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        if (phoneNumberLength < 13) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 12)}`;
    }
    const pickImageForGallery = () => {
        let count = 0

        if (pictures.length > 0) {
            count += pictures.length
        }
        if (userData.pictures_data?.length > 0) {
            count += userData.pictures_data?.length
        }
        if (count >= 10) {
            showToast("You can upload maximum of 10 photos only")

            return
        }
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
                            cropping: true,
                            forceJpg: true,
                            compressImageQuality:.7,
                        }).then(image => {

                            setPictures([...pictures, image])
                        }).catch(err => {
                            console.log("Image picker error : ", err)
                        })
                    },
                },
                {
                    text: "Gallery", onPress: () => {
                        ImagePicker.openPicker({
                            multiple: true,
                            forceJpg: true,
                        }).then(image => {
                            if (Array.isArray(image)) {
                                let images_length = image.length
                                if (count + images_length > 10) {
                                    showToast("You cannot add more than 10 pictures.")
                                }
                                setPictures([...pictures, ...image.slice(0, 10 - count)])
                            } else {
                                setPictures([...pictures, image])
                            }

                        }).catch(err => {
                      
                        })
                    }
                },
            ]
        );
    }
    React.useEffect(() => {
        if (Number(userData?.service_is_at_address)) {
            setUserData({ ...userData, address_is_public: 1 })
        }
    }, [userData?.service_is_at_address])

    const removePicture = async (data) => {
        try {
            setLoader(true)
            let headers = {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${access_token}`
            }
            let formdata = new FormData()
            formdata.append("picture_id", data.id)

            let config = {
                headers: headers,
                data: formdata,
                endPoint: '/api/deleteUploadPicture',
                type: 'post'
            }

            let response = await getApi(config)
            if (response.status) {
                dispatch(loadauthentication(response.data))
            }
        } catch (err) {

        } finally {
            setLoader(false)
        }
    }
    const handleConfirm = (date) => {
        setInitialDate(date)
        setUserData({ ...userData, dob: moment(date).format("MM/DD/YYYY") })
        setDatePickerVisibility(false)
    }

    const checkISVerified = async () => {
        let ph = userData?.phone_number?.match(/\d/g).join("")
        if (ph.length < 11) {
            showToast("Phone number must be 10 digits.")
            return
        }
        try {
            setLoader(true)
            let headers = {
                "Content-Type": "multipart/form-data",
            }
            let formdata = new FormData()
            formdata.append("phone_number", "+" + ph)

            let config = {
                headers: headers,
                data: formdata,
                endPoint: '/api/verifyPhoneOtpSend',
                type: 'post'
            }

            let response = await getApi(config)
            if (response.status) {
                showToast(response.message)
                setOTPModal(true)
            } else {
                showToast(response.message)
            }
        } catch (err) {
            showToast("Phone number must be 10 digits.")

        } finally {
            setLoader(false)
        }
    }

    return (
        <SafeAreaView style={{ ...globalStyles.safeAreaView, backgroundColor: LS_COLORS.global.green }}>
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Header
                    imageUrl={require("../../../assets/back.png")}
                    action={() => props.navigation.navigate('HomeScreen')}
                    imageUrl1={require("../../../assets/home.png")}
                    action1={() => props.navigation.navigate("HomeScreen")}
                    imageStyle={{ tintColor: "black" }}
                    imageStyle1={{ tintColor: "black" }}
                // containerStyle={{backgroundColor:LS_COLORS.global.cyan}}

                />
                <TouchableOpacity
                    style={{
                        height: 100,
                        aspectRatio: 1,
                        alignSelf: 'center',
                        zIndex: 100,
                        // top: Platform.OS === 'ios' ? "6%" : "1%",
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
                    <View style={{ marginTop: '0%', }}>
                        <Text maxFontSizeMultiplier={1.5} style={styles.text}>{user.user_role == role.provider ? "Service Provider Profile" : "Customer Profile"}</Text>
                        <Text maxFontSizeMultiplier={1.5} style={[styles.text1, { marginTop: 0 }]}>{userData.first_name}</Text>
                        {user.user_role==role.provider?<Rating
                                                readonly={true}
                                                imageSize={15}
                                                type="custom"
                                                // ratingBackgroundColor="white"
                                                ratingColor="#04BFBF"
                                                // tintColor="white"
                                                startingValue={Number(userData?.rating ?? 0)}
                                            />:null}
                        <Text maxFontSizeMultiplier={1.5} style={styles.text2}>Profile ID : {userData.id}</Text>
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        bounces={false}
                        keyboardShouldPersistTaps='handled'
                        style={styles.container}>
                        <View style={{ marginBottom: '5%' }}>

                            <View style={styles.personalContainer}>
                                <Text maxFontSizeMultiplier={1.5} style={{ ...styles.text2, alignSelf: "flex-start", marginTop: 20, marginLeft: 10 }}>PERSONAL INFORMATION</Text>
                                <CustomInput
                                    text="First Name"
                                    value={userData.first_name}
                                    onChangeText={(text) => {
                                        setUserData({ ...userData, first_name: text })
                                    }}
                                    inpuRef={fnameRef}
                                    returnKeyType={Platform.OS == "ios" ? "done" : "default"}

                                    // returnKeyType="next"
                                    // onSubmitEditing={() => { lnameRef.current._root.focus() }}
                                    required={true}
                                   
                                />
                       

                                <CustomInput
                                    text="Last Name"
                                    value={userData.last_name}
                                    onChangeText={(text) => {
                                        setUserData({ ...userData, last_name: text })
                                    }}
                                    inpuRef={lnameRef}
                                    returnKeyType={Platform.OS == "ios" ? "done" : "default"}

                                    // returnKeyType="next"
                                    // onSubmitEditing={() => prefNameRef.current._root.focus()}
                                    required={true}
                                />
                                <CustomInput
                                    text="Middle Name"
                                    value={userData.middle_name != "null" ? userData?.middle_name : ""}
                                    onChangeText={(text) => {
                                        setUserData({ ...userData, middle_name: text })
                                    }}
                                    // inpuRef={fnameRef}
                                    returnKeyType={Platform.OS == "ios" ? "done" : "default"}
                                    required={false}
                                />
                                <CustomInput
                                    text="Preferred Name"
                                    value={userData?.prefer_name === "null" ? "" : userData.prefer_name}
                                    onChangeText={(text) => {
                                        setUserData({ ...userData, prefer_name: text })
                                    }}
                                    inpuRef={prefNameRef}
                                    returnKeyType={Platform.OS == "ios" ? "done" : "default"}

                                // returnKeyType="next"
                                // onSubmitEditing={() => {
                                //     if(user.user_role==3){
                                //         bioRef.current._root.focus()
                                //     }else{
                                //         emailRef.current._root.focus()
                                //     }

                                // }}
                                />
                                <View style={{marginHorizontal:20}}>
                                    <DropDown
                                        title="Gender"
                                        item={["Male", "Female", "Non-Binary "]}
                                        value={gender}
                                        onChangeValue={(index, value) => { setGender(value) }}
                                        handleTextValue={true}
                                        containerStyle={{borderColor:LS_COLORS.global.textInutBorderColor,}}
                                        dropdownStyle={{height:120}}
                                    />
                                </View>
                                {user.user_role == role.provider && <CustomInput
                                    text="Tagline"
                                    value={userData?.tagline === "null" ? "" : userData.tagline}
                                    onChangeText={(text) => {
                                        setUserData({ ...userData, tagline: text })
                                    }}
                                    inpuRef={prefNameRef}
                                    customContainerStyles={{ paddingVertical: '2.5%' }}
                                    customInputStyles={{ height: 75 }}
                                    multiline
                                    maxLength={255}
                                    numberOfLines={3}
                                    onSubmitEditing={() => {
                                        // bioRef?.current?.blur()
                                    }}
                                    returnKeyType="done"
                                    bottomText={userData?.tagline?.length + "/255"}
                                    blurOnSubmit={true}
                                />}
                                {user.user_role == role.provider && <CustomInput
                                    // required
                                    text="Bio"
                                    value={userData?.about == 'null' ? "" : userData?.about}
                                    onChangeText={(text) => {
                                        setUserData({ ...userData, about: text })
                                    }}
                                    inpuRef={bioRef}
                                    customContainerStyles={{ paddingVertical: '2.5%' }}
                                    customInputStyles={{ height: 75 }}
                                    multiline
                                    maxLength={255}
                                    numberOfLines={3}
                                    onSubmitEditing={() => {
                                        // bioRef?.current?.blur()
                                    }}
                                    returnKeyType="done"
                                    bottomText={userData?.about?.length + "/255"}
                                    blurOnSubmit={true}
                                />}
                                <CustomTextInput
                                    title="Date of Birth *"
                                    value={userData?.dob}
                                    onChangeText={(formatted, extracted) => {
                                       
                                        setUserData({ ...userData, dob: formatted })
                                    }}
                                    containerStyle={{
                                        marginTop: 35,
                                        width: "90%",
                                        height: 80,
                                        alignSelf: "center",
                                        borderColor: LS_COLORS.global.textInutBorderColor,

                                    }}
                                    customInputStyle={{
                                        color: LS_COLORS.global.black,
                                        fontFamily: LS_FONTS.PoppinsMedium,
                                        fontSize: 16,
                                        // height:60,
                                        marginTop: 10,
                                        paddingHorizontal: 20
                                    }}
                                    titleStyle={{
                                        left: 20,
                                        color: LS_COLORS.global.grey, fontSize: 16, fontFamily: LS_FONTS.PoppinsRegular,
                                    }}
                                    inpuRef={emailRef}
                                    mask={"[00]/[00]/[0000]"}
                                    keyboardType='numeric'
                                    returnKeyType={Platform.OS == "ios" ? "done" : "default"}
                                    icon={<Entypo name='calendar' style={{ position: "absolute", right: 10, top: 10 }} color={LS_COLORS.global.green} size={28} onPress={() => {
                                        setDatePickerVisibility(true)
                                    }} />}
                                />
                                <CustomTextInput
                                    title="Phone Number *"
                                    value={user?.phone_number !== "null" ? user?.phone_number : ""}
                                    onChangeText={(formatted, extracted) => {
                                        let ph = formatted.match(/\d/g).join("")
                                        if (user.phone_number != ph) {
                                            setIsVerifiedPhone(false)
                                        } else if (user.phone_number == ph) {
                                            setIsVerifiedPhone(true)
                                        }
                                        setUserData({ ...userData, phone_number: formatted })
                                    }}
                                    containerStyle={{
                                        marginTop: 35,
                                        width: "90%",
                                        height: 80,
                                        alignSelf: "center",
                                        alignItems: "center",
                                        flexDirection: "row",
                                        borderColor: LS_COLORS.global.textInutBorderColor,

                                    }}
                                    customInputStyle={{
                                        color: LS_COLORS.global.black,
                                        fontFamily: LS_FONTS.PoppinsMedium,
                                        fontSize: 16,
                                        width: "90%",
                                        paddingHorizontal: 20
                                    }}
                                    titleStyle={{
                                        left: 20,
                                        color: LS_COLORS.global.grey, fontSize: 16, fontFamily: LS_FONTS.PoppinsRegular,
                                    }}
                                    mask={"+1 ([000]) [000] [0000]"}
                                    keyboardType='numeric'
                                    returnKeyType={Platform.OS == "ios" ? "done" : "default"}
                                    icon={
                                        isVerfiedPhone && <Entypo name="check" color={isVerfiedPhone ? 'green' : "grey"} size={20} />
                                    }
                                />
                                {!isVerfiedPhone && <Text maxFontSizeMultiplier={1.5} onPress={() => {
                                    checkISVerified()
                                }} style={{ color: LS_COLORS.global.green, textDecorationLine: "underline", marginLeft: 20 }}>Verify Phone Number</Text>}
                                {user.user_role == role.provider && <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, justifyContent: "space-between" }}>
                                    <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, marginLeft: 5, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.lightTextColor, flex: 1 }}>Make phone number public</Text>
                                    <CheckBox
                                        style={{}}
                                        containerStyle={{ width: 25 }}
                                        wrapperStyle={{}}
                                        checked={Number(userData?.phone_is_public)}
                                        onPress={() => setUserData({ ...userData, phone_is_public: Number(userData.phone_is_public) ? 0 : 1 })}
                                        checkedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                                    />
                                </View>}
                                <CustomInput
                                    text="Email"
                                    value={userData.email}
                                    onChangeText={(text) => {
                                        setUserData({ ...userData, email: text })
                                    }}
                                    inpuRef={emailRef}
                                    returnKeyType={Platform.OS == "ios" ? "done" : "default"}
                                    required={true}
                                    editable={false}
                                />
                                <View style={{ height: 20 }}></View>
                                <View style={{}}>
                                    <DropDown
                                        handleTextValue={true}
                                        title="Notification type"
                                        item={["Email", "Push Notification", "Text", "All"]}
                                        value={notificationType}
                                        onChangeValue={(index, value) => { setNotificationType(value) }}
                                        containerStyle={{ width: '90%', alignSelf: 'center', borderRadius: 50, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 30, paddingHorizontal: '5%', borderWidth: 0 }}
                                    />
                                    {/* } */}
                                </View>
                                {user.user_role == role.provider && <CustomInput
                                    text="Business Name"
                                    value={userData?.business_name == "null" ? "" : userData.business_name}
                                    onChangeText={(text) => {
                                        setUserData({ ...userData, business_name: text })
                                    }}
                                    inpuRef={prefNameRef}
                                    returnKeyType={Platform.OS == "ios" ? "done" : "default"}
                                />}
                                {/* <CustomInput
                                text="Phone Number"
                                value={formatPhoneNumber(userData.phone_number)}
                                onChangeText={(text) => {
                                    setUserData({ ...userData, phone_number: text })
                                }}
                                inpuRef={phoneRef}
                                returnKeyType={Platform.OS == "ios" ? "done" : "default"}
                                maxLength={12}
                                onSubmitEditing={() => {
                                    // setAddHomeAddressActive(true), setTimeout(() => {
                                    //     homeAddressLine1Ref?.current?._root?.focus()
                                    // }, 350)
                                }}
                                required={true}
                            /> */}


                                {user.user_role == role.provider && <CustomInput
                                    text="Driver License #"
                                    value={userData?.license ? (userData.license == "null" ? "" : userData.license) : ""}
                                    onChangeText={(text) => {
                                        setUserData({ ...userData, license: text })
                                    }}
                                    inpuRef={prefNameRef}
                                    returnKeyType={Platform.OS == "ios" ? "done" : "default"}
                                />}
                                <View style={{ marginTop: 25 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: '10%', alignItems: 'center', paddingLeft: '1.5%', marginBottom: 10 }}>
                                        <Text maxFontSizeMultiplier={1.5} style={{
                                            fontFamily: LS_FONTS.PoppinsMedium,
                                            marginHorizontal: '10%',
                                            color: LS_COLORS.global.black
                                        }}>
                                            {user.user_role == role.customer ? 'Home' : 'Permanent'} Address{user.user_role == role.customer ? '' : "*"}
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
                                                color: LS_COLORS.global.black,
                                            },
                                            listView: { paddingVertical: 5 },
                                            separator: {}
                                        }}
                                        placeholder={`${user.user_role == role.customer ? 'Home' : 'Permanent'} address${user.user_role == role.customer ? '' : "*"}`}
                                        fetchDetails={true}
                                        onPress={(data, details) => {
                                          
                                            const zip_code = details?.address_components.find((addressComponent) =>
                                                addressComponent.types.includes('postal_code'),
                                            )?.short_name;
                                            const country = details?.address_components.find((addressComponent) =>
                                                addressComponent.types.includes('country'),
                                            )?.long_name;
                                            const state = details?.address_components.find((addressComponent) =>
                                                addressComponent.types.includes('administrative_area_level_1'),
                                            )?.long_name;
                                            const city = details?.address_components.find((addressComponent) =>
                                                addressComponent.types.includes('administrative_area_level_2'),
                                            )?.short_name ?? details?.address_components.find((addressComponent) =>
                                                addressComponent.types.includes('locality'),
                                            )?.long_name
                                            setHomeAddressData({
                                                ...homeAddressData,
                                                address_line_1: data.description,
                                                lat: details.geometry.location.lat,
                                                lon: details.geometry.location.lng,
                                                city: city ?? "",
                                                state: state ?? "",
                                                country: country ?? "",
                                                zip_code: zip_code ?? ""
                                            })
                                        }}
                                        textInputProps={{
                                            onSubmitEditing: () => workAddressRef.current.focus(),
                                            placeholderTextColor: LS_COLORS.global.placeholder,
                                            selection: Platform.OS == "android" ? selection : null,
                                            // onChangeText: (t) => {
                                            //     setHomeAddressData({
                                            //         ...homeAddressData,
                                            //         address_line_1: t,
                                            //     })
                                            //     setSelection({ start: t?.length })
                                            // },
                                            maxFontSizeMultiplier: 1.5,
                                            onBlur: () => { setSelection({ start: 0 }) },
                                            onFocus: () => { setSelection({ start: homeAddressData?.address_line_1?.length }) }
                                        }}
                                        query={{
                                            key: 'AIzaSyCqBdweD7WqRWXNUUC0sYMWnXG1jfnPCRk',
                                            language: 'en'
                                        }}
                                    />

                                </View>
                                {user.user_role == role.provider &&
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, justifyContent: "space-between" }}>
                                        <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, marginLeft: 5, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.lightTextColor, flex: 1 }}>Provide service only at my address</Text>
                                        <CheckBox
                                            style={{}}
                                            containerStyle={{ width: 25, marginBottom: 0 }}
                                            wrapperStyle={{}}
                                            checked={Number(userData?.service_is_at_address)}
                                            onPress={() => setUserData({ ...userData, service_is_at_address: Number(userData.service_is_at_address) ? 0 : 1 })}
                                            checkedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                                            uncheckedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                                        />
                                    </View>
                                }
                                {user.user_role == role.provider &&
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30, marginHorizontal: 10, justifyContent: "space-between" }}>
                                        <Text maxFontSizeMultiplier={1.5} numberOfLines={1} style={{ fontSize: 12, marginLeft: 5, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.lightTextColor }}>Make address public</Text>
                                        <CheckBox
                                            style={{}}
                                            containerStyle={{ width: 25, marginTop: 0 }}
                                            wrapperStyle={{}}
                                            checked={Boolean(Number(userData?.address_is_public))}
                                            onPress={() => {
                                                if (Number(userData?.service_is_at_address)) {
                                                    return
                                                }
                                                setUserData({ ...userData, address_is_public: Number(userData.address_is_public) ? 0 : 1 })
                                            }}
                                            checkedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                                            uncheckedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                                        />
                                    </View>
                                }
                                <View style={{ marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: '10%', alignItems: 'center', paddingLeft: '1.5%' }}>
                                        <Text maxFontSizeMultiplier={1.1} style={{
                                            fontFamily: LS_FONTS.PoppinsMedium,
                                            marginHorizontal: '10%',
                                            color: LS_COLORS.global.black,
                                        }}>
                                            {user.user_role == role.customer ? 'Work' : 'Mailing'} Address{user.user_role == role.customer ? '' : "*"}
                                        </Text>
                                        <View style={{ flexDirection: 'row', justifyContent: "flex-end", alignItems: 'center', flex: 1 }}>
                                            <CheckBox
                                                style={{}}
                                                containerStyle={{ width: 25 }}
                                                wrapperStyle={{}}
                                                checked={isSameAddress}
                                                onPress={() => setIsSameAddress(!isSameAddress)}
                                                checkedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                                                uncheckedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                                            />
                                            <Text maxFontSizeMultiplier={1.26} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>Same address</Text>
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
                                                color: LS_COLORS.global.black,

                                            },
                                            listView: { paddingVertical: 5 },
                                            separator: {}
                                        }}
                                        placeholder={`${user.user_role == role.customer ? 'Work' : 'Mailing'} Address${user.user_role == role.customer ? '' : "*"}`}
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
                                            placeholderTextColor: LS_COLORS.global.placeholder,
                                            selection: Platform.OS == "android" ? selection1 : null,
                                            // onChangeText: (t) => {
                                            //     setWorkAddressData({
                                            //         ...workAddressData,
                                            //         address_line_1: t,
                                            //     })
                                            //     setSelection1({ start: t?.length })
                                            // },
                                            maxFontSizeMultiplier: 1.5,
                                            onBlur: () => { setSelection1({ start: 0 }) },
                                            onFocus: () => { setSelection1({ start: workAddressData?.address_line_1?.length }) }
                                        }}
                                        query={{
                                            key: 'AIzaSyCqBdweD7WqRWXNUUC0sYMWnXG1jfnPCRk',
                                            language: 'en',
                                        }}
                                    />

                                </View>

                                {user.user_role == role.provider &&
                                    <View>
                                        <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, marginLeft: 15, color: LS_COLORS.global.placeholder }}>Certificates (upto 5 )</Text>
                                        {userData?.certificate_data?.map((x, i) => <CustomInput
                                            text="Certificates"
                                            value={x?.certificate != "null" ? x?.certificate : ""}
                                            onChangeText={(text) => {
                                                let v = _.cloneDeep([...userData.certificate_data])
                                                v[i].certificate = text
                                                setUserData({ ...userData, certificate_data: v })
                                            }}
                                            icon={userData?.certificate_data?.length > 1 && <Entypo name='cross' size={20} color="red" onPress={() => {
                                                let v = [...userData.certificate_data]
                                                v.splice(i, 1)
                                                setUserData({ ...userData, certificate_data: v })
                                            }} style={{ position: "absolute", right: 0 }} />}
                                            returnKeyType={Platform.OS == "ios" ? "done" : "default"}
                                        />)}
                                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                            {userData?.certificate_data?.length < 5 && <Pressable style={{ marginTop: 10, marginBottom: 15, flexDirection: "row", alignItems: "center", justifyContent: "center" }} onPress={() => {
                                                if (userData.certificate_data?.length < 5) {
                                                    setUserData({ ...userData, certificate_data: [...userData.certificate_data, { certificate: "" }] })
                                                }
                                            }}>

                                                <Image source={require("../../../assets/signup/add_field1.png")} style={{ height: 30, width: 30 }} resizeMode="contain" />
                                                <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 14, color: LS_COLORS.global.black, fontFamily: LS_FONTS.PoppinsRegular, marginLeft: 10 }}>Add New Insurance</Text>
                                            </Pressable>}
                                        </View>
                                    </View>
                                }
                                {user.user_role == role.provider &&
                                    <CustomInput
                                        text="Experience"
                                        value={experience}
                                        onChangeText={(t) => {
                                            let g = t.replace(/[^\d.\.]/gi, '')
                                            if (g != "") {
                                                if (Number(g) <= 1) {
                                                    g += " year"
                                                } else {
                                                    g += " years"
                                                }
                                            }
                                            setExperince(g)
                                        }}
                                        keyboardType="numeric"
                                        returnKeyType={Platform.OS == "ios" ? "done" : "default"}
                                        TextInputProps={{
                                            selection: { start: String(experience).replace(/[^\d.\.]/gi, '').length }
                                        }}
                                    // icon={String(userData.experience).length>0&&<Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 15, color: "black", top: 16, left: (userData?.experience?.length??0) * 10 + 30, position: "absolute" }}>Years</Text>}
                                    />
                                }
                                {user.user_role == role.provider &&
                                    <View style={{ marginHorizontal: 10, marginTop: 20 }}>
                                        <Text maxFontSizeMultiplier={1.5} style={{ textAlign: "center", color: "black", fontFamily: LS_FONTS.PoppinsRegular }}>Add Pictures (Upto 10 Pictures)</Text>
                                        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                                            {userData.pictures_data?.map(x => (<Pressable style={{ height: widthPercentageToDP(25.5), borderRadius: 5, width: widthPercentageToDP(25.5), marginTop: 5, marginRight: 5, justifyContent: "center", alignItems: "center", backgroundColor: LS_COLORS.global.textInutBorderColor }}>
                                                <Image resizeMode='cover' source={{ uri: BASE_URL + x.image }} style={{ height: widthPercentageToDP(25.5), width: widthPercentageToDP(25.5), borderRadius: 5 }} />
                                                <Entypo name='cross' onPress={() => {
                                                    Alert.alert("Remove Image", "Do you want to remove this image from list?", [
                                                        { text: "no" },
                                                        {
                                                            text: "yes", onPress: () => {
                                                                removePicture(x)
                                                            }
                                                        }
                                                    ])
                                                }} color='red' size={20} style={{ position: "absolute", top: 0, right: 0 }} />
                                            </Pressable>))
                                            }
                                            {pictures.map((x, i) => <Pressable style={{ height: widthPercentageToDP(25.5), borderRadius: 5, width: widthPercentageToDP(25.5), marginTop: 5, marginRight: 5, justifyContent: "center", alignItems: "center", backgroundColor: LS_COLORS.global.textInutBorderColor }}>
                                                <Image resizeMode='cover' source={{ uri: x.path }} style={{ height: widthPercentageToDP(25.5), width: widthPercentageToDP(25.5), borderRadius: 5 }} />
                                                <Entypo name='cross' onPress={() => {
                                                    Alert.alert("Remove Image", "Do you want to remove this image from list?", [
                                                        { text: "no" },
                                                        {
                                                            text: "yes", onPress: () => {
                                                                let p = [...pictures]
                                                                p.splice(i, 1)
                                                                setPictures(p)
                                                            }
                                                        }
                                                    ])
                                                }} color='red' size={20} style={{ position: "absolute", top: 0, right: 0 }} />
                                            </Pressable>)}
                                            <View onTouchEnd={() => pickImageForGallery()} style={{ height: widthPercentageToDP(25.5), marginTop: 5, borderRadius: 5, width: widthPercentageToDP(25.5), justifyContent: "center", alignItems: "center", backgroundColor: LS_COLORS.global.textInutBorderColor }}>
                                                <Image resizeMode='contain' source={require("../../../assets/signup/photo.png")} style={{ height: 70, width: 70 }} />
                                            </View>
                                        </View>
                                    </View>
                                }
                                <View style={{ marginBottom: 30 }} />
                            </View>
                            {
                                user.user_role == role.customer
                                    ?
                                    <View style={{ ...styles.personalContainer, marginTop: 20, zIndex: -1000 }}>
                                        <Text maxFontSizeMultiplier={1.5} style={{ ...styles.text2, alignSelf: "flex-start", fontSize: 14, marginTop: 20, marginLeft: 10 }}>BILLING INFORMATION </Text>
                                        <TouchableOpacity onPress={() => {
                                            props.navigation.navigate("UserStack", { screen: "CardList" })
                                        }}>
                                            <Text maxFontSizeMultiplier={1.5} style={{ ...styles.text2, alignSelf: "flex-start", marginTop: 20, marginLeft: 10 }}>Manage Cards</Text>
                                        </TouchableOpacity>

                                        <View style={{ height: 50 }} />
                                    </View>
                                    :
                                    <View style={{ ...styles.personalContainer, paddingVertical: 20, marginTop: 10, zIndex: -1000 }}>
                                        <Text maxFontSizeMultiplier={1.5} style={{ ...styles.text2, alignSelf: "flex-start", marginLeft: 10 }}>Stripe Account Information</Text>
                                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '5%', marginTop: '2%', borderWidth: 0.5, width: '90%', alignSelf: 'center', alignItems: 'center', paddingVertical: 5, borderRadius: 8, borderColor: LS_COLORS.global.grey }}
                                            activeOpacity={0.7}
                                            onPress={() => {
                                                if (isConnectedToAccount) {

                                                } else {
                                                    getAccountLink()
                                                }
                                            }}>
                                            {isConnectedToAccount ? <View>
                                                <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 11 }}>Connected ({connectedDetail?.email})</Text>
                                            </View> : <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular }}>Add Account</Text>}
                                        </TouchableOpacity>
                                        {isConnectedToAccount && <Text maxFontSizeMultiplier={1.5} onPress={() => {
                                            createNewConnect()
                                        }} style={{ textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular, fontSize: 11, color: "red" }}>Change</Text>
                                        }
                                    </View>
                            }
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <View style={{ flexDirection: 'row', backgroundColor: LS_COLORS.global.transparent, paddingVertical: 5, justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: '5%' }}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => saveUser()} style={{ alignItems: "center" }}>
                        <Image source={require('../../../assets/save.png')} style={{ height: 30, aspectRatio: 1 }} resizeMode="contain" />
                        <Text maxFontSizeMultiplier={1.5} >Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => {
                        props.navigation.navigate("UserStack", { screen: 'Settings' })
                    }} style={{ alignItems: "center" }}>
                        <Image source={require('../../../assets/gear.png')} style={{ height: 30, aspectRatio: 1 }} resizeMode="contain" />
                        <Text maxFontSizeMultiplier={1.5} >Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => logout()} style={{ alignItems: "center" }}>
                        <Image source={require('../../../assets/logout.png')} style={{ height: 30, aspectRatio: 1 }} resizeMode="contain" />
                        <Text maxFontSizeMultiplier={1.5} >Logout</Text>
                    </TouchableOpacity>
                </View>
                {loader && <Loader />}
                <DateTimePickerModal
                    date={initialDate}
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={() => setDatePickerVisibility(false)}
                />
                <ModalOTP phone_number={"+" + userData?.phone_number?.match(/\d/g).join("")} setIsVerifiedPhone={setIsVerifiedPhone} visible={otpModal} setVisible={setOTPModal} />
            </View>
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
