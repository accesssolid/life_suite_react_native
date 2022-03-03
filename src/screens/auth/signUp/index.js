import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, Alert, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, ImageBackground, Pressable } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { getUniqueId } from 'react-native-device-info';
import { CheckBox } from 'react-native-elements';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

/* Components */
import { CustomTextInput } from '../../../components/customTextInput';
import CustomButton from '../../../components/customButton';
import Loader from "../../../components/loader"
import { showToast } from '../../../components/validators';
import { getApi } from '../../../api/api';
import { DropDown } from '../../../components/dropDown';
import { setUserRole } from '../../../redux/features/loginReducer';
import SearchableDropDown from '../../../components/searchableDropDown';
import { role as roles } from '../../../constants/globals';
import TermsModal from '../../../components/termsModal';
import PrivacyModal from '../../../components/privacyModal';
/* Icons */
import Entypo from 'react-native-vector-icons/Entypo'
import moment from 'moment';
import { getTimeZone } from 'react-native-localize';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ModalOTP from '../../../components/ModalOTP';
import Ionicons from 'react-native-vector-icons/Ionicons'

const getMessage = (name) => {
    switch (name) {
        case "first_name":
            return "First name is required"

        case "last_name":
            return "Last name is required"

        case "prefer_name":
            return "Prefered name is required"
        case "dob":
            return "Date of birth is required"
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
const getNotiPref = (text) => {
    switch (text) {
        case "Email":
            return 1

        case "Push Notification":
            return 2

        case "Text":
            return 3

        case "All":
            return 4
    }
}
const m_filed_text = ["Agree to terms and conditions.", "Agree to privacy policy", "Agree to CDC guidelines."]
const SignUpScreen = (props) => {
    const dispatch = useDispatch()
    const fnameRef = useRef(null)
    const mnameRef = useRef(null)
    const lnameRef = useRef(null)
    const prefNameRef = useRef(null)
    const dobRef = useRef(null)
    const bioRef = useRef(null)
    const emailRef = useRef(null)
    const passRef = useRef(null)
    const confPassRef = useRef(null)
    const phoneRef = useRef(null)
    const tagRef = useRef(null)
    const businessRef = useRef(null)
    const licenseRef = useRef(null)

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

    const homeAddressRef = useRef(null)
    const workAddressRef = useRef(null)
    const [notificationType, setNotificationType] = useState(getNotificationType(1))

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

    const [openPrivacyModal, setOpenPrivacyModal] = useState(false)
    const [openTermsModal, setOpenTermsModal] = useState(false)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [initialDate, setInitialDate] = useState(new Date())

    useEffect(() => {
        setLoader(false)
    }, [])

    useEffect(() => {
        // getStates()
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
        lat: '',
        lon: ''
    })

    const [workAddressData, setWorkAddressData] = useState({
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        zip: '',
        lat: '',
        lon: '',
    })

    // for privacy policy checkbox and terms and conditions and cdc
    const [m_field, setMField] = React.useState([])
    // certifications
    // profile pic
    const [profile_pic, setProfilePic] = React.useState(null)
    const [pictures, setPictures] = React.useState([])
    const [selection, setSelection] = React.useState({ start: 0 })
    const [selection1, setSelection1] = React.useState({ start: 0 })
    // starting the value is always 
    const [isVerfiedPhone, setIsVerifiedPhone] = useState(false)
    const [otpModal, setOTPModal] = useState(false)
    const [verified_number, setVerifiedNumber] = React.useState("")
    const getMandototyFiled = async () => {
        try {

            let headers = {
                "Content-Type": "application/json"
            }

            let config = {
                headers: headers,
                data: JSON.stringify({}),
                endPoint: '/api/handleFlagsList',
                type: 'post'
            }
            let res = await getApi(config)
            console.log(res)
            if (res.status) {
                console.log("RESS",res.data)
                setMField(res.data)
            }
        } catch (err) {

        }
    }

    useEffect(() => {
        getMandototyFiled()
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
        } else {
            setWorkAddressData({
                address_line_1: '',
                address_line_2: '',
                city: '',
                state: '',
                zip: '',
                lat: '',
                lon: ''
            })
            workAddressRef.current.setAddressText('')
            // setDropStateValueWork("State")
            // setDropCityValueWork('')
        }
    }, [isSameAddress, homeAddressData])

    const [signUpData, setSignUpData] = useState({
        first_name: '',
        last_name: '',
        dob: 0,
        phone_number: '',
        email: '',
        password: '',
        password_confirmation: '',
        address: [],
        device_id: getUniqueId(),
        fcm_token: '#fcm!234',
        is_accept_privatepolicy: 0,
        is_accept_cdd: 0,
        is_accept_termscondition: 0,
        notification_prefrence: 1,
        is_same_address: 0,
        bio: '',
        middle_name: '',
        prefer_name: '',
    })

    const [provider_data, setProviderData] = React.useState({
        tagline: "",
        business_name: "",
        mailing_address: "",
        experience: 0,
        phone_is_public: 0,
        address_is_public: 0,
        service_is_at_address: 0,
        certificateTextData: [""],
        license: ""
    })
    async function on_press_register() {

        setLoader(true)

        let required_keys_customer = ['first_name', 'last_name', 'dob', 'phone_number']
        if (role == 2) {
            required_keys_customer = ['first_name', 'last_name', 'dob', 'email', 'phone_number']
        }
        let keys = Object.keys(signUpData)
        
        for (let i of required_keys_customer) {
            console.log(i)
            if (String(signUpData[`${i}`])?.trim() == '' || signUpData[`${i}`] == 0) {
                showToast(getMessage(i), 'danger')
                setLoader(false)
                return false
            }
        }
         
        // if (!isVerfiedPhone) {
        //     showToast("Please verify your phone number.")
        //     setLoader(false)
        //     return
        // }
        if(role!=2){
            if(signUpData.email.trim()==""){
                showToast("Email is required")
                setLoader(false)
                return
            }
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

        if (role == 2) {
            let homekeys = Object.keys(address[0])
            for (let index = 0; index < homekeys.length; index++) {
                if (homekeys[index] !== 'state' && homekeys[index] !== 'city' && String(address[0][homekeys[index]]).trim() == '' && homekeys[index] !== 'zip_code' && homekeys[index] !== 'address_line_2' && homekeys[index] !== 'lat' && homekeys[index] !== 'long') {
                    showToast(`${role == 1 ? 'home' : 'permanent'} address is required. `, 'danger')
                    setLoader(false)
                    return false
                }
            }
            if (workAddressData.address_line_1 == '') {
                showToast(`${role == 1 ? 'work' : 'mailing'} address is required.`, 'danger')
                setLoader(false)
                return false
            }


        }

        let password_checks = ['password', 'password_confirmation']
        for (let i of password_checks) {

            if (String(signUpData[`${i}`])?.trim() == '' || signUpData[`${i}`] == 0) {
                showToast(getMessage(i), 'danger')
                setLoader(false)
                return false
            }
        }
        // setLoader(false)
        // alert("Working")
        // return
        // if (signUpData.bio.trim() == "" && role !== 1) {
        //     showToast("Bio is required", 'danger')
        //     setLoader(false)
        //     return false
        // }

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
        var date = moment(signUpData.dob, 'MM/DD/YYYY', true)
        if (!date.isValid()) {
            setLoader(false)
            return showToast("Invalid date format(mm/dd/yy)")
        }
        if (moment().diff(date, 'years') <= 18) {
            setLoader(false)
            return showToast("You must be 18 or over to use this application.")
        }
        if (m_field.filter(x => x.status == "1").length > 1) {
            let m_length = m_field.filter(x => x.status == "1").length
            let count = 0
            if (signUpData.is_accept_privatepolicy) {
                count += 1
            }
            if (signUpData.is_accept_termscondition) {
                count += 1
            }
            if (signUpData.is_accept_cdd) {
                count += 1
            }
            if (count < m_length) {
                setLoader(false)
                if (!signUpData.is_accept_termscondition) {
                    return showToast("You must agree to terms and conditions.")
                }
                if (!signUpData.is_accept_privatepolicy) {
                    return showToast("You must agree to privacy policy.")
                }
                if (!signUpData.is_accept_cdd) {
                    return showToast("You must agree to CDC guidelines.")
                }
            }
        }

        function getFormData(object) {
            const formData = new FormData();
            Object.keys(object).forEach(key => formData.append(key, object[key]));
            return formData;
        }

        let user_data = {
            ...signUpData,
            about: signUpData.bio,
            email: signUpData.email.toLowerCase(),
            address: JSON.stringify(address),
            phone_number: signUpData.phone_number.replace(/[^\d]/g, ""),
            is_same_address: isSameAddress ? 1 : 0,
            dob: moment(signUpData.dob, "MM/DD/YYYY").format("YYYY-MM-DD"),
            notification_prefrence: getNotiPref(notificationType),
            timezone: getTimeZone(),

        }

        if (profile_pic?.path) {
            user_data.profile = {
                uri: Platform.OS == "ios" ? profile_pic.path.replace('file:///', '') : profile_pic.path,
                name: profile_pic.filename ? profile_pic.filename : profile_pic.path.split("/").pop(),
                type: profile_pic.mime,
            }
        }

        if (role != 1) {
            user_data = { ...user_data, ...provider_data,experience:String(provider_data.experience).replace(/[^\d.\.]/gi, ''), certificateTextData: JSON.stringify(provider_data.certificateTextData), mailing_address: signUpData.email }
        }
        let body = getFormData(user_data)
        for (let i of pictures) {
            body.append("pictures[]", {
                uri: Platform.OS == "ios" ? i.path.replace('file:///', '') : i.path,
                name: i.filename ? i.filename : i.path.split("/").pop(),
                type: i.mime,
            })
        }
        console.log("body", JSON.stringify(user_data))

        let headers = {
            "Content-Type": "multipart/form-data"
        }
        // console.log(body)
        // setLoader(false)
        // return 
        
        let config = {
            headers: headers,
            data: body,
            endPoint: role == 1 ? '/api/customerSignup' : '/api/providerSignup',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    showToast('User Registered Successfully', 'success')
                    setLoader(false)
                    props.navigation.replace('LoginScreen')
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
                            setProfilePic(image)
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
                            setProfilePic(image)
                        }).catch(err => {
                            console.log("Image picker error : ", err)
                        })
                    }
                },
            ]
        );
    }

    const pickImageForGallery = () => {
        if (pictures.length >= 10) {
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
                            cropping: true
                        }).then(image => {
                            console.log(image);
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
                        }).then(image => {
                            if (Array.isArray(image)) {
                                let p = [...pictures, ...image]
                                if (p.length > 10) {
                                    showToast("You can upload maximum of 10 photos only")
                                }
                                setPictures(p.slice(0, 10))
                            } else {
                                setPictures([...pictures, image])
                            }

                        }).catch(err => {
                            console.log("Image picker error : ", err)
                        })
                    }
                },
            ]
        );
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
    const handleConfirm = (date) => {
        setInitialDate(date)
        setSignUpData({ ...signUpData, dob: moment(date).format("MM/DD/YYYY") })
        setDatePickerVisibility(false)
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

    function formatPhoneNumber(value) {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, "");
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 8) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        if (phoneNumberLength < 13) return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 12)}`;
    }
    React.useEffect(() => {
        if (provider_data.service_is_at_address) {
            setProviderData({ ...provider_data, address_is_public: 1 })
        }
    }, [provider_data.service_is_at_address])


    const checkISVerified = async () => {


        try {
            let ph = signUpData?.phone_number?.match(/\d/g).join("")
            if (ph.length < 11) {
                showToast("Phone number must be 10 digits.")
                return
            }
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
        <SafeAreaView style={globalStyles.safeAreaView}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}>
                <ScrollView style={{ flex: 1, width: '100%' }} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                    <Ionicons onPress={() => props.navigation.goBack()} name='arrow-back' size={24} style={{ padding: 20 }} />

                    <View style={{ flex: 1, width: '100%' }}>
                        <View style={styles.textContainer}>
                            <Text style={styles.loginText}>{role == 1 ? "Customer" : "Service Provider"}</Text>
                            <Text style={{ ...styles.loginText }}>Signup</Text>
                            <Pressable onPress={() => pickImage()} style={{ marginTop: 10, width: 100, alignSelf: "center" }}>
                                <ImageBackground source={require("../../../assets/signup/wedding.png")} style={{ width: 100, justifyContent: "center", alignItems: "center", alignSelf: "center", height: 100 }}>
                                    {profile_pic?.path ?
                                        <Image source={{ uri: profile_pic?.path }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                                        : <Image source={require("../../../assets/signup/photo.png")} style={{ width: 36, height: 28 }} />
                                    }
                                </ImageBackground>
                            </Pressable>
                            <Text style={styles.text}>Add Profile Picture</Text>
                            {/* <Text style={styles.text}>or</Text>
                            <TouchableOpacity onPress={() => switchRole()} activeOpacity={0.7}>
                                <Text style={{ ...styles.text, textDecorationLine: 'underline' }}>Signup as {role == 1 ? "Service Provider" : "Customer"}</Text>
                            </TouchableOpacity> */}
                        </View>
                        <View style={styles.textInputContainer}>
                            <Text style={[styles.text, { marginTop: 0, marginBottom: 30, alignSelf: "flex-start", marginLeft: 20, textTransform: "uppercase" }]}>Personal Information</Text>
                            <CustomTextInput
                                placeholder="First Name"
                                title="First Name"
                                required
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
                                title="Last Name"
                                required
                                value={signUpData.last_name}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, last_name: text })
                                }}
                                inputRef={lnameRef}
                                returnKeyType="next"
                                onSubmitEditing={() => mnameRef.current.focus()}
                            />
                            <CustomTextInput
                                placeholder="Middle Name"
                                title="Middle Name"
                                value={signUpData.middle_name}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, middle_name: text })
                                }}
                                inputRef={mnameRef}
                                returnKeyType="next"
                                onSubmitEditing={() => prefNameRef.current.focus()}
                            />
                            <CustomTextInput
                                placeholder="Preferred Name"
                                title="Preferred Name"
                                value={signUpData.prefer_name}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, prefer_name: text })
                                }}
                                inputRef={prefNameRef}
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    if (role != 1) {
                                        tagRef.current.focus()

                                    } else {
                                        dobRef.current.focus()
                                    }

                                }}
                            />
                            {role !== 1 && <CustomTextInput
                                placeholder="Taglines"
                                title="Tag Line"
                                value={provider_data.tagline}
                                onChangeText={(text) => {
                                    setProviderData({ ...provider_data, tagline: text })
                                }}
                                inputRef={tagRef}
                                returnKeyType="next"
                                onSubmitEditing={() => bioRef.current.focus()}
                            />}
                            {role !== 1 && <CustomTextInput
                                inputRef={bioRef}
                                placeholder="Bio..."
                                title="Bio"
                                value={signUpData.bio}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, bio: text })
                                }}
                                multiline
                                maxLength={255}
                                numberOfLines={3}
                                customContainerStyle={{}}
                                customInputStyle={{ height: 100, paddingTop: '5%', textAlignVertical: 'top' }}
                                customImageStyles={{ bottom: '-65%', right: '0%' }}
                                inlineImageLeft={<Text
                                    style={{ fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.black, fontSize: 12 }}>
                                    {signUpData.bio.length}/255
                                </Text>}
                            />}
                            <CustomTextInput
                                placeholder="mm/dd/yyyy"
                                title="Date of birth *"
                                value={signUpData.dob}
                                onChangeText={(formatted, extracted) => {
                                    setSignUpData({ ...signUpData, dob: formatted })
                                }}
                                mask={"[00]/[00]/[0000]"}
                                inputRef={dobRef}
                                returnKeyType="next"
                                keyboardType='numeric'
                                customContainerStyle={{ width: "82%" }}
                                containerStyle={{ flexDirection: "row", alignItems: "center" }}
                                icon={<Entypo name='calendar' color={LS_COLORS.global.green} size={28} onPress={() => {
                                    setDatePickerVisibility(true)
                                }} />}
                                onSubmitEditing={() => phoneRef.current.focus()}
                            />
                            {role != 1 && <CustomTextInput
                                placeholder="Email"
                                title="Email"
                                required
                                value={signUpData.email}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, email: text })
                                }}
                                inputRef={emailRef}
                                returnKeyType={"next"}
                                keyboardType="email-address"
                                onSubmitEditing={() => businessRef.current.focus()}
                            />}
                            {role != 1 &&
                                <CustomTextInput
                                    placeholder="Business Name"
                                    title="Business Name"
                                    value={provider_data.business_name}
                                    onChangeText={(text) => {
                                        setProviderData({ ...provider_data, business_name: text })
                                    }}
                                    inputRef={businessRef}
                                    returnKeyType={"next"}
                                    keyboardType="email-address"
                                    onSubmitEditing={() => phoneRef.current.focus()}
                                />
                            }
                            <CustomTextInput
                                placeholder="Phone Number"
                                title="Phone Number"
                                required
                                mask={"+1 ([000]) [000] [0000]"}
                                value={signUpData.phone_number}
                                onChangeText={(formatted) => {
                                    if (verified_number != formatted || verified_number == "") {
                                        setIsVerifiedPhone(false)
                                    } else {
                                        setIsVerifiedPhone(true)
                                    }
                                    setSignUpData({ ...signUpData, phone_number: formatted })
                                }}
                                keyboardType='numeric'
                                inputRef={phoneRef}
                                returnKeyType={"next"}
                                returnKeyLabel="next"
                                containerStyle={{ marginBottom: role !== 1 ? 0 : 30, flexDirection: "row", alignItems: "center" }}
                                customContainerStyle={{ width: "85%" }}
                                maxLength={12}
                                icon={
                                    isVerfiedPhone ? <Entypo name="check" color={'green'} size={20} /> : null
                                }

                            // onSubmitEditing={() => {
                            // setAddHomeAddressActive(true), setTimeout(() => {
                            //     homeAddressRef.current.focus()
                            // }, 250)
                            // }}
                            />
                            {!isVerfiedPhone && <Text onPress={() => {
                                checkISVerified()
                            }} style={{ color: LS_COLORS.global.green, textDecorationLine: "underline", marginTop: -20, marginBottom: 20, marginLeft: 20 }}>Verify Phone Number</Text>}
                            {role !== 1 &&
                                <View style={{ flexDirection: 'row', marginBottom: 30, alignItems: 'center', marginHorizontal: 10, justifyContent: "space-between" }}>
                                    <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.lightTextColor }}>Make phone number public</Text>
                                    <CheckBox
                                        style={{}}
                                        containerStyle={{ width: 25 }}
                                        wrapperStyle={{}}
                                        checked={provider_data.phone_is_public}
                                        onPress={() => setProviderData({ ...provider_data, phone_is_public: provider_data.phone_is_public ? 0 : 1 })}
                                        checkedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                                    />
                                </View>
                            }



                            {role == 1 && <CustomTextInput
                                placeholder="Email"
                                title="Email"
                                required
                                value={signUpData.email}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, email: text })
                                }}
                                inputRef={emailRef}
                                returnKeyType={"next"}
                                keyboardType="email-address"
                                onSubmitEditing={() => homeAddressRef.current.focus()}
                            />}

                            <View style={{}}>
                                <DropDown
                                    title="Notification type"
                                    item={["Email", "Push Notification", "Text", "All"]}
                                    value={notificationType}
                                    onChangeValue={(index, value) => { setNotificationType(value) }}
                                />
                            </View>
                            {role !== 1 && <CustomTextInput
                                placeholder="Driver Licence # State ID"
                                title="Driver Licence # State ID # State"
                                value={provider_data.license}
                                onChangeText={(text) => {
                                    setProviderData({ ...provider_data, license: text })
                                }}
                                // inputRef={prefNameRef}
                                returnKeyType="next"
                                onSubmitEditing={() => homeAddressRef.current.focus()}
                            />}
                            <View style={{ position: "relative", borderWidth: 1, marginBottom: role !== 1 ? 0 : 30, marginHorizontal: 10, borderColor: LS_COLORS.global.lightTextColor, borderRadius: 7 }}>
                                <Text style={{
                                    fontFamily: LS_FONTS.PoppinsRegular,
                                    marginHorizontal: 20,
                                    marginBottom: 5,
                                    fontSize: 12, color: LS_COLORS.global.lightTextColor,
                                    // color: LS_COLORS.global.black,
                                    marginHorizontal: 10, position: "absolute", top: -10, backgroundColor: "white",
                                    zIndex: 1000

                                }}>
                                    {role == 1 ? 'Home' : 'Permanent'} Address{role == 1 ? '' : "*"}
                                </Text>
                                <GooglePlacesAutocomplete
                                    ref={homeAddressRef}
                                    styles={{
                                        container: {
                                            width: '95%',
                                            backgroundColor: LS_COLORS.global.white,
                                            borderRadius: 28,
                                            // alignSelf: 'center',
                                            fontSize: 14,
                                            fontFamily: LS_FONTS.PoppinsRegular,
                                            paddingTop: 5,
                                            // paddingHorizontal: '10%',
                                            maxHeight: 200
                                        },
                                        textInput: {
                                            // backgroundColor: LS_COLORS.global.white,
                                            color: LS_COLORS.global.black,

                                        },
                                        listView: { paddingVertical: 5 },
                                        separator: {}
                                    }}
                                    placeholder={`${role == 1 ? 'Home' : 'Permanent'} address${role == 1 ? '' : "*"}`}
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
                                        placeholderTextColor: LS_COLORS.global.placeholder,
                                        selection: selection,
                                        returnKeyType: "next",
                                        onBlur: () => { setSelection({ start: 0 }) },
                                        onFocus: () => { setSelection(null) }
                                    }}
                                    query={{
                                        key: 'AIzaSyBRpW8iA1sYpuNb_gzYKKVtvaVbI-wZpTM',
                                        language: 'en',
                                    }}
                                />

                            </View>
                            {role !== 1 &&
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, justifyContent: "space-between" }}>
                                    <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.lightTextColor }}>Provide service only at my address</Text>
                                    <CheckBox
                                        style={{}}
                                        containerStyle={{ width: 25, marginBottom: 0 }}
                                        wrapperStyle={{}}
                                        checked={provider_data.service_is_at_address}
                                        onPress={() => setProviderData({ ...provider_data, service_is_at_address: provider_data.service_is_at_address ? 0 : 1 })}
                                        checkedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                                    />
                                </View>
                            }
                            {role !== 1 &&
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30, marginHorizontal: 10, justifyContent: "space-between" }}>
                                    <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.lightTextColor }}>Make address public</Text>
                                    <CheckBox
                                        style={{}}
                                        containerStyle={{ width: 25, marginTop: 0 }}
                                        wrapperStyle={{}}
                                        checked={provider_data.address_is_public}
                                        onPress={() => {
                                            if (!provider_data.service_is_at_address) {
                                                setProviderData({ ...provider_data, address_is_public: provider_data.address_is_public ? 0 : 1 })
                                            }
                                        }}
                                        checkedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                                    />
                                </View>
                            }
                            <View style={{ position: "relative", borderWidth: 1, marginBottom: 0, marginHorizontal: 10, borderColor: LS_COLORS.global.lightTextColor, borderRadius: 7 }}>
                                <Text style={{
                                    fontFamily: LS_FONTS.PoppinsRegular,
                                    marginHorizontal: 20,
                                    marginBottom: 5,
                                    fontSize: 12, color: LS_COLORS.global.lightTextColor,
                                    // color: LS_COLORS.global.black,
                                    marginHorizontal: 10, position: "absolute", top: -10, backgroundColor: "white",
                                    zIndex: 1000

                                }}>
                                    {role == 1 ? 'Work' : 'Mailing'} Address{role == 1 ? '' : "*"}
                                </Text>



                                <GooglePlacesAutocomplete
                                    ref={workAddressRef}
                                    styles={{
                                        container: {
                                            width: '95%',
                                            backgroundColor: LS_COLORS.global.white,
                                            borderRadius: 28,
                                            // alignSelf: 'center',
                                            fontSize: 14,
                                            fontFamily: LS_FONTS.PoppinsRegular,
                                            paddingTop: 5,
                                            // paddingHorizontal: '10%',
                                            maxHeight: 200
                                        },
                                        textInput: {
                                            // backgroundColor: LS_COLORS.global.white,
                                            color: LS_COLORS.global.black,
                                        },
                                        listView: { paddingVertical: 5 },
                                        separator: {}
                                    }}
                                    placeholder={`${role == 1 ? 'Work' : 'Mailing'} Address${role == 1 ? '' : "*"}`}
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
                                        selection: selection1,
                                        returnKeyType: "next",
                                        onBlur: () => { setSelection1({ start: 0 }) },
                                        onFocus: () => { setSelection1(null) },
                                        onSubmitEditing: () => {
                                            if (role != 1) {

                                            } else {
                                                passRef.current.focus()
                                            }
                                        },
                                    }}
                                    query={{
                                        key: 'AIzaSyBRpW8iA1sYpuNb_gzYKKVtvaVbI-wZpTM',
                                        language: 'en',
                                    }}
                                />

                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: 30, alignItems: 'center', marginHorizontal: 10, justifyContent: "space-between" }}>
                                <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.lightTextColor }}>Same as above</Text>
                                <CheckBox
                                    style={{}}
                                    containerStyle={{ width: 25 }}
                                    wrapperStyle={{}}
                                    checked={isSameAddress}
                                    onPress={() => setIsSameAddress(!isSameAddress)}
                                    checkedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                                    uncheckedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                                />
                            </View>
                            {role !== 1 &&
                                <>
                                    {provider_data?.certificateTextData?.map((x, i) => <CustomTextInput
                                        title="Certifications"
                                        placeholder="Certifications"
                                        value={x}
                                        onChangeText={(text) => {
                                            let v = [...provider_data.certificateTextData]
                                            v[i] = text
                                            setProviderData({ ...provider_data, certificateTextData: v })
                                        }}

                                        icon={provider_data.certificateTextData.length > 1 && <Entypo name='cross' size={20} color="red" onPress={() => {
                                            let v = [...provider_data.certificateTextData]
                                            v.splice(i, 1)
                                            setProviderData({ ...provider_data, certificateTextData: v })
                                        }} style={{ position: "absolute", right: 0 }} />}
                                    />)}
                                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                        {provider_data?.certificateTextData.length < 5 && <Pressable onPress={() => {
                                            if (provider_data.certificateTextData.length < 5) {
                                                setProviderData({ ...provider_data, certificateTextData: [...provider_data.certificateTextData, ""] })
                                            }
                                        }}>
                                            <Image source={require("../../../assets/signup/add_field.png")} style={{ height: 30, width: widthPercentageToDP(40), marginBottom: 30 }} resizeMode="contain" />
                                        </Pressable>}
                                        {/* <Text onPress={() => {
                                            let v = [...provider_data.certificateTextData]
                                            v.pop()
                                            setProviderData({ ...provider_data, certificateTextData: v })

                                        }} style={{ fontSize: 16, paddingVertical: 4, paddingHorizontal: 5, height: 35, marginLeft: 10, borderWidth: 1, borderColor: "gray", borderRadius: 5, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.lightTextColor }}>Remove</Text> */}
                                    </View>
                                </>
                            }
                            {role !== 1 &&
                                <CustomTextInput
                                    // placeholder="Preferred Name"
                                    title="Experience"
                                    keyboardType='numeric'
                                    placeholder="Experience"
                                    value={provider_data.experience}
                                    showValue={provider_data.experience}
                                    onChangeText={t => {
                                        let g = t.replace(/[^\d.\.]/gi, '')
                                        if (g != "") {
                                            if (Number(g) <= 1) {
                                                g += " year"
                                            } else {
                                                g += " years"
                                            }

                                        }
                                        setProviderData({ ...provider_data, experience: g })
                                    }}
                                    TextInputProps={{
                                        selection: { start: String(provider_data.experience).replace(/[^\d.\.]/gi, '').length }
                                    }}
                                // icon={(String(provider_data.experience).length>0||String(provider_data.experience)!="")&&<Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 13, color: "black", top: 15, left: (provider_data.experience?.length ?? 0) * 10 + 10, position: "absolute" }}>Years</Text>}
                                />}

                            {role !== 1 &&
                                <View style={{ marginBottom: 30, marginHorizontal: 10 }}>
                                    <Text style={{ textAlign: "center", color: "black", fontFamily: LS_FONTS.PoppinsRegular }}>Add Pictures (Upto 10 Pictures)</Text>
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                                        {pictures.map((x, i) => <View style={{ height: widthPercentageToDP(25.5), borderRadius: 5, width: widthPercentageToDP(25.5), position: "relative", marginTop: 5, marginRight: 5, backgroundColor: LS_COLORS.global.textInutBorderColor }}>
                                            <Image resizeMode='cover' source={{ uri: x.path }} style={{ width: widthPercentageToDP(25.5), height: widthPercentageToDP(25.5), borderRadius: 5 }} />
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
                                        </View>)}
                                        <View onTouchEnd={() => pickImageForGallery()} style={{ height: widthPercentageToDP(25.5), marginTop: 5, borderRadius: 5, width: widthPercentageToDP(25.5), justifyContent: "center", alignItems: "center", backgroundColor: LS_COLORS.global.textInutBorderColor }}>
                                            <Image resizeMode='contain' source={require("../../../assets/signup/photo.png")} style={{ height: widthPercentageToDP(20), width: widthPercentageToDP(20) }} />
                                        </View>
                                    </View>
                                </View>
                            }
                            <CustomTextInput
                                placeholder="Password"
                                title="Password"
                                required
                                value={signUpData.password}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, password: text })
                                }}
                                secureTextEntry={true}
                                inputRef={passRef}
                                containerStyle={{ flexDirection: "row", alignItems: "center" }}
                                customContainerStyle={{ width: "85%" }}
                                returnKeyType={"next"}
                                onSubmitEditing={() => confPassRef.current.focus()}
                            // inlineImageLeft={<Entypo name={!isPassVisible ? "eye" : 'eye-with-line'} size={18} />}
                            // onLeftPress={() => setIsPassVisible(state => !state)}
                            />
                            <CustomTextInput
                                placeholder="Confirm Password"
                                title="Confirm Password"
                                required
                                value={signUpData.password_confirmation}
                                onChangeText={(text) => {
                                    setSignUpData({ ...signUpData, password_confirmation: text })
                                }}
                                secureTextEntry={true}
                                inputRef={confPassRef}
                                containerStyle={{ flexDirection: "row", alignItems: "center" }}
                                customContainerStyle={{ width: "85%" }}
                            // returnKeyType="next"
                            // onSubmitEditing={() => phoneRef.current.focus()}
                            // inlineImageLeft={<Entypo name={!isConfPassVisible ? "eye" : 'eye-with-line'} size={18} />}
                            // onLeftPress={() => setIsConfPassVisible(state => !state)}
                            />
                        </View>
                        {/* terms and consiftions */}
                        {m_field.filter(x => x.id == 1 && x.status == "1").length > 0 && <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                            <CheckBox
                                style={{}}
                                containerStyle={{ width: 25 }}
                                wrapperStyle={{}}
                                checked={signUpData.is_accept_termscondition}
                                onPress={() => setSignUpData({ ...signUpData, is_accept_termscondition: signUpData.is_accept_termscondition ? 0 : 1 })}
                                checkedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                                uncheckedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                            />
                            <Text numberOfLines={1} onPress={() => {
                                props.navigation.navigate("CustomWebView", {
                                    userType: role == 1 ? "customer" : "provider", type: "terms", title: "Terms and conditions", onAccept: () => {
                                        setSignUpData({ ...signUpData, is_accept_termscondition: 1 })
                                    }, notAccept: () => {
                                        setSignUpData({ ...signUpData, is_accept_termscondition: 0 })
                                    }
                                })
                            }} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.lightTextColor, textDecorationLine: "underline" }}>{m_filed_text[0]}</Text>
                        </View>}

                        {m_field.filter(x => x.id == 2 && x.status == "1").length > 0 && <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                            <CheckBox
                                style={{}}
                                containerStyle={{ width: 25 }}
                                wrapperStyle={{}}
                                checked={signUpData.is_accept_privatepolicy}
                                onPress={() => setSignUpData({ ...signUpData, is_accept_privatepolicy: signUpData.is_accept_privatepolicy ? 0 : 1 })}
                                checkedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                                uncheckedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                            />
                            <Text numberOfLines={1} onPress={() => {
                                props.navigation.navigate("CustomWebView", {
                                    userType: role == 1 ? "customer" : "provider", type: "privacy", title: "Privacy Poicy", onAccept: () => {
                                        setSignUpData({ ...signUpData, is_accept_privatepolicy: 1 })
                                    }, notAccept: () => {
                                        setSignUpData({ ...signUpData, is_accept_privatepolicy: 0 })
                                    }
                                })
                                // setOpenPrivacyModal(true)
                            }} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.lightTextColor, textDecorationLine: "underline" }}>{m_filed_text[1]}</Text>
                        </View>}
                        {m_field.filter(x => x.id == 3 && x.status == "1").length > 0 && <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                            <CheckBox
                                style={{}}
                                containerStyle={{ width: 25 }}
                                wrapperStyle={{}}
                                checked={signUpData.is_accept_cdd}
                                onPress={() => setSignUpData({ ...signUpData, is_accept_cdd: signUpData.is_accept_cdd ? 0 : 1 })}
                                checkedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                                uncheckedIcon={<Image style={{ height: 20, width: 20 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                            />
                            <Text numberOfLines={1} onPress={() => props.navigation.navigate("CovidScreen", {
                                isChecked: signUpData.is_accept_cdd,
                                onChecked: (v) => {
                                    setSignUpData({ ...signUpData, is_accept_cdd: v })
                                }
                            })} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.lightTextColor, textDecorationLine: "underline" }}>{m_filed_text[2]}</Text>
                        </View>}

                        <View style={[styles.buttonContainer, { marginTop: 20 }]}>
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
            {/* <PrivacyModal isVisible={openPrivacyModal} setVisible={setOpenPrivacyModal} type={role == 1 ? "customer" : "provider"} />
            <TermsModal isVisible={openTermsModal} setVisible={setOpenTermsModal} type={role == 1 ? "customer" : "provider"} /> */}
            <DateTimePickerModal
                date={initialDate}
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={() => setDatePickerVisibility(false)}
            />
            <ModalOTP phone_number={"+" + (signUpData?.phone_number ? signUpData?.phone_number.match(/\d/g).join("") : "")} setIsVerifiedPhone={v => {
                setIsVerifiedPhone(v)
                if (v) {
                    setVerifiedNumber(signUpData?.phone_number)
                }
            }} visible={otpModal} setVisible={setOTPModal} />
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
        marginTop: "5%"
    },
    loginText: {
        fontSize: 20,
        lineHeight: 42,
        textAlign: 'center',
        color: LS_COLORS.global.black,
        fontFamily: LS_FONTS.PoppinsSemiBold,
        width: '90%',
        alignSelf: 'center',
        textTransform: "uppercase"
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
        width: '90%',
        alignSelf: "center",
        backgroundColor: "white",
        shadowColor: "#000",
        paddingVertical: 10,
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,

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
