import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Platform, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { getUniqueId, getManufacturer } from 'react-native-device-info';

/* Components */
import Header from '../../../components/header';
import CustomInput from "../../../components/textInput"
import DropDown from '../../../components/dropDown';
import { showToast, storeItem } from '../../../components/validators';
import { BASE_URL, getApi } from '../../../api/api';
import { loadauthentication } from '../../../redux/features/loginReducer';
import Loader from '../../../components/loader';

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

        default:
            "Push Notification";
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

        default:
            1;
    }
}

const Profile = (props) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.authenticate.user)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [userData, setUserData] = useState({ ...user })
    const [loader, setLoader] = useState(false)
    const [add, setAdd] = useState(true)
    const [edit, setEdit] = useState(true)
    const [number, setNumber] = useState("")
    const [holderName, setHolderName] = useState("")
    const [notificationType, setNotificationType] = useState(getNotificationType(userData.notification_prefrence))

    /* State Drop Down */
    const [dropStateValue, setDropStateValue] = useState("State")
    const [dropStateData, setDropStateData] = useState([])
    const [dropStateDataMaster, setDropStateMaster] = useState([])

    /* City Drop Down */
    const [dropCityValue, setDropCityValue] = useState("City")
    const [dropCityData, setDropCityData] = useState([])
    const [isEmptyCityList, setIsEmptyCityList] = useState(false)
    const [dropCityDataMaster, setDropCityMaster] = useState([])

    /* State Drop Down WORK */
    const [dropStateValueWork, setDropStateValueWork] = useState("State")

    /* City Drop Down WORK */
    const [dropCityValueWork, setDropCityValueWork] = useState("City")
    const [dropCityDataWork, setDropCityDataWork] = useState([])
    const [isEmptyCityListWork, setIsEmptyCityListWork] = useState(false)
    const [dropCityDataMasterWork, setDropCityMasterWork] = useState([])

    useEffect(() => {
        setUserData({ ...user })
    }, [user])

    useEffect(() => {
        getStates()
    }, [])

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
    })

    const [workAddressData, setWorkAddressData] = useState({
        address_line_1: userData.address[1].address_line_1,
        address_line_2: userData.address[1].address_line_2,
        city: userData.address[1].city,
        state: userData.address[1].state,
        zip: userData.address[1].zip_code,
    })

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
            name: image.filename,
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
                    showToast(response.message, 'success')
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

    const saveUser = () => {
        setLoader(true)
        let notifType = getNotificationTypeNumber(notificationType)
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
        formdata.append("prefer_name", userData.prefer_name);
        formdata.append("notification_prefrence", notifType);
        formdata.append("address", JSON.stringify(address));

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
                        props.navigation.pop()
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
                        let newArr = [...response.data].map((item, index) => {
                            return item.name
                        })
                        setDropCityData([...newArr])
                        let city = response.data.filter(item => item.id == homeAddressData.city)
                        if (city.length > 0 && city[0].name !== undefined && homeAddressData.city) {
                            setDropCityValue(city[0].name)
                        } else {
                            setDropCityValue("City")
                        }
                        setIsEmptyCityListWork(false)
                        setLoader(false)
                    } else {
                        setDropCityMasterWork(response.data)
                        let newArr = [...response.data].map((item, index) => {
                            return item.name
                        })
                        setDropCityDataWork([...newArr])
                        let city = response.data.filter(item => item.id == workAddressData.city)
                        if (city.length > 0 && city[0].name !== undefined && workAddressData.city) {
                            setDropCityValueWork(city[0].name)
                        } else {
                            setDropCityValueWork("City")
                        }
                        setIsEmptyCityListWork(false)
                        setLoader(false)
                    }
                }
                else {
                    if (type == "home") {
                        setIsEmptyCityList(true)
                    } else {
                        setIsEmptyCityListWork(true)
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

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                imageUrl={require("../../../assets/back.png")}
                action={() => props.navigation.pop()}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => props.navigation.navigate("HomeScreen")}
            />
            <TouchableOpacity
                style={{ height: 116, aspectRatio: 1, alignSelf: 'center', position: 'absolute', zIndex: 100, top: Platform.OS === 'ios' ? "6%" : "1%", overflow: 'hidden', borderRadius: 70 }}
                activeOpacity={0.7}
                onPress={() => pickImage()}>
                <Image
                    resizeMode='contain'
                    style={{ height: '100%', width: '100%', }}
                    source={userData.profile_image ? { uri: BASE_URL + userData.profile_image } : require("../../../assets/andrea.png")}
                />
            </TouchableOpacity>

            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                bounces={false}
                style={styles.container}>
                <View style={{ marginTop: '15%' }}>
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
                        />
                        <CustomInput
                            text="Last Name"
                            value={userData.last_name}
                            onChangeText={(text) => {
                                setUserData({ ...userData, last_name: text })
                            }}
                        />
                        <CustomInput
                            text="Preffered Name"
                            value={userData.prefer_name}
                            onChangeText={(text) => {
                                setUserData({ ...userData, prefer_name: text })
                            }}
                        />
                        <CustomInput
                            text="Email Address"
                            value={userData.email}
                            onChangeText={(text) => {
                                setUserData({ ...userData, email: text })
                            }}
                        />
                        <CustomInput
                            text="Phone Number"
                            value={userData.phone_number}
                            onChangeText={(text) => {
                                setUserData({ ...userData, phone_number: text })
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                setAdd(!add)
                            }}>
                            {
                                add
                                    ?
                                    user.user_role == 2 &&
                                    <View style={{ flexDirection: "row", marginTop: 20, marginLeft: 20 }}>
                                        <Image
                                            style={{ height: 24, width: 24, resizeMode: "contain" }}
                                            source={require("../../../assets/plus.png")}
                                        />
                                        <Text style={{ ...styles.text2, marginLeft: 10, }}>ADD HOME ADDRESS</Text>
                                    </View>
                                    :
                                    <>
                                        <View style={{ flexDirection: "row", marginTop: 20, marginLeft: 20 }}>
                                            <Image
                                                style={{ height: 24, width: 24, resizeMode: "contain" }}
                                                source={require("../../../assets/minus.png")}
                                            />
                                            <Text style={{ ...styles.text2, marginLeft: 10, }}>ADD HOME ADDRESS</Text>
                                        </View>
                                        <View style={{}}>
                                            <CustomInput
                                                text="ADDRESS LINE 1"
                                                value={homeAddressData.address_line_1}
                                                onChangeText={(text) => { setHomeAddressData({ ...homeAddressData, address_line_1: text }) }}
                                            />
                                            <CustomInput
                                                text="ADDRESS LINE 2"
                                                value={homeAddressData.address_line_2}
                                                onChangeText={(text) => { setHomeAddressData({ ...homeAddressData, address_line_2: text }) }}
                                            />
                                            <View style={{ marginTop: 25 }} />
                                            <DropDown
                                                item={dropStateData}
                                                value={dropStateValue}
                                                onChangeValue={(index, value) => { setDropStateValue(value), startGetCities(value, "home") }}
                                                containerStyle={{ width: '80%', alignSelf: 'center', borderRadius: 50, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 30, paddingHorizontal: '5%', borderWidth: 0 }}
                                                dropdownStyle={{ maxHeight: 300 }}
                                            />
                                            {
                                                isEmptyCityList
                                                    ?
                                                    <CustomInput
                                                        placeholder="City"
                                                        value={homeAddressData.city}
                                                        onChangeText={(text) => { setHomeAddressData({ ...homeAddressData, city: text }) }}
                                                    />
                                                    :
                                                    <DropDown
                                                        item={dropCityData}
                                                        value={dropCityValue}
                                                        onChangeValue={(index, value) => setDropCityValue(value)}
                                                        containerStyle={{ width: '80%', alignSelf: 'center', borderRadius: 50, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 30, paddingHorizontal: '5%', borderWidth: 0 }}
                                                        dropdownStyle={{ maxHeight: 300 }}
                                                    />
                                            }

                                            <CustomInput
                                                placeholder="Zip code"
                                                value={homeAddressData.zip}
                                                onChangeText={(text) => { setHomeAddressData({ ...homeAddressData, zip: text }) }}
                                            />
                                        </View>
                                    </>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginTop: 10 }}
                            onPress={() => {
                                setEdit(!edit)
                            }}>
                            {edit ? <View style={{ flexDirection: "row", marginTop: 20, marginLeft: 20 }}>
                                <Image
                                    style={{ height: 24, width: 24, resizeMode: "contain" }}
                                    source={require("../../../assets/plus.png")}
                                />
                                <Text style={{ ...styles.text2, marginLeft: 10, }}>ADD WORK ADDRESS</Text>
                            </View> :
                                <>
                                    <View style={{ flexDirection: "row", marginTop: 20, marginLeft: 20 }}>
                                        <Image
                                            style={{ height: 24, width: 24, resizeMode: "contain" }}
                                            source={require("../../../assets/minus.png")}
                                        />
                                        <Text style={{ ...styles.text2, marginLeft: 10, }}>ADD WORK ADDRESS</Text>
                                    </View>
                                    <CustomInput
                                        text="ADDRESS LINE 1"
                                        value={workAddressData.address_line_1}
                                        onChangeText={(text) => { setWorkAddressData({ ...workAddressData, address_line_1: text }) }}
                                    />
                                    <CustomInput
                                        text="ADDRESS LINE 2"
                                        value={workAddressData.address_line_2}
                                        onChangeText={(text) => { setWorkAddressData({ ...workAddressData, address_line_2: text }) }}
                                    />
                                    <View style={{ marginTop: 25 }} />
                                    <DropDown
                                        item={dropStateData}
                                        value={dropStateValueWork}
                                        onChangeValue={(index, value) => { setDropStateValueWork(value), startGetCities(value, "work") }}
                                        containerStyle={{ width: '80%', alignSelf: 'center', borderRadius: 50, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 30, paddingHorizontal: '5%', borderWidth: 0 }}
                                        dropdownStyle={{ maxHeight: 300 }}
                                    />
                                    {
                                        isEmptyCityListWork
                                            ?
                                            <CustomInput
                                                placeholder="City"
                                                value={workAddressData.city}
                                                onChangeText={(text) => { setWorkAddressData({ ...workAddressData, city: text }) }}
                                            />
                                            :
                                            <DropDown
                                                item={dropCityDataWork}
                                                value={dropCityValueWork}
                                                onChangeValue={(index, value) => setDropCityValueWork(value)}
                                                containerStyle={{ width: '80%', alignSelf: 'center', borderRadius: 50, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 30, paddingHorizontal: '5%', borderWidth: 0 }}
                                                dropdownStyle={{ maxHeight: 300 }}
                                            />
                                    }

                                    <CustomInput
                                        placeholder="Zip code"
                                        value={workAddressData.zip}
                                        onChangeText={(text) => { setWorkAddressData({ ...workAddressData, zip: text }) }}
                                    />
                                </>
                            }
                        </TouchableOpacity>
                        <View style={{}}>
                            <DropDown
                                title="Notification type"
                                item={["Email", "Push Notification", "Text"]}
                                value={notificationType}
                                onChangeValue={(index, value) => setNotificationType(value)}
                                containerStyle={{ width: '90%', alignSelf: 'center', borderRadius: 50, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 30, paddingHorizontal: '5%', borderWidth: 0 }}
                            />
                        </View>
                        <View style={{ height: 40 }}></View>
                    </View>
                    {
                        user.user_role == 2
                            ?
                            <View style={{ ...styles.personalContainer, marginTop: 20 }}>
                                <Text style={{ ...styles.text2, alignSelf: "flex-start", marginTop: 20, marginLeft: 10 }}>BILLING INFORMATION</Text>
                                <CustomInput
                                    text="Credit Card Number"
                                    value={number}
                                    onChangeText={(text) => {
                                        setNumber(text)
                                    }}
                                />
                                <CustomInput
                                    text="Credit Card Holder Name"
                                    value={holderName}
                                    onChangeText={(text) => {
                                        setHolderName(text)
                                    }}
                                />
                                <CustomInput
                                    text="Expiry Date"
                                    value={number}
                                    onChangeText={(text) => {
                                        setNumber(text)
                                    }}
                                />
                                <View style={{ height: 50 }} />
                            </View>
                            :
                            <View style={{ ...styles.personalContainer, paddingVertical: 20, marginTop: 10 }}>
                                <Text style={{ ...styles.text2, alignSelf: "flex-start", marginLeft: 10 }}>Bank Information</Text>
                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '5%', marginTop: '2%', borderWidth: 0.5, width: '90%', alignSelf: 'center', alignItems: 'center', paddingVertical: 5, borderRadius: 8, borderColor: LS_COLORS.global.grey }}
                                    activeOpacity={0.7}
                                    onPress={() => alert('x')}>
                                    <Text style={{ fontFamily: LS_FONTS.PoppinsRegular }}>Add Accounts</Text>
                                    <View style={{ height: 21, aspectRatio: 1 }}>
                                        <Image
                                            style={{ height: '100%', width: '100%', resizeMode: "contain" }}
                                            source={require("../../../assets/plus.png")}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                    }
                    <TouchableOpacity
                        style={styles.save}
                        activeOpacity={0.7}
                        onPress={() => saveUser()}>
                        <Text style={styles.saveText}>
                            Save
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ ...styles.save, marginBottom: 15 }}
                        activeOpacity={0.7}
                        onPress={() => {
                            storeItem('user', null)
                            props.navigation.navigate('WelcomeScreen')
                        }}>
                        <Text style={styles.saveText}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
