import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Platform, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';

/* Components */
import Header from '../../../components/header';
import CustomInput from "../../../components/textInput"
import CustomButton from "../../../components/customButton"
import { showToast, storeItem } from '../../../components/validators';
import { BASE_URL, getApi } from '../../../api/api';
import { loadauthentication } from '../../../redux/features/loginReducer';

const Profile = (props) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.authenticate.user)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [userData, setUserData] = useState({ ...user })
    const [loader, setLoader] = useState(false)
    const [add, setAdd] = useState(true)
    const [edit, setEdit] = useState(true)
    const [add3, setAdd3] = useState("")
    const [number, setNumber] = useState("")
    const [holderName, setHolderName] = useState("")

    useEffect(() => {
        setUserData({ ...user })
    }, [user])

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

        let config = {
            headers: headers,
            data: formdata,
            endPoint: user.user_role == 2 ? '/api/customer_detail_update' : '/api/provider_detail_update',
            type: 'post'
        }

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
    }

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.pop()
                }}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => {
                    props.navigation.navigate("HomeScreen")
                }}
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

                <View style={{ top: '6%' }}>

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
                            {add ? <View style={{ flexDirection: "row", marginTop: 20, marginLeft: 20 }}>
                                <Image
                                    style={{ height: 24, width: 24, resizeMode: "contain" }}
                                    source={require("../../../assets/plus.png")}
                                />
                                <Text style={{ ...styles.text2, marginLeft: 10, }}>ADD HOME ADDRESS</Text>
                            </View> :
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
                                            value={userData.address[0].address_type.toLowerCase() == "home" ? userData.address[0].address_line_1 : ''}
                                        // onChangeText={(text) => {
                                        //     setUserData({ ...signUpData, address: [{ ...userData.address[0], address_line_1: text }] })
                                        // }}
                                        />
                                        <CustomInput
                                            text="ADDRESS LINE 2"
                                            value={userData.address[0].address_type.toLowerCase() == "home" ? userData.address[0].address_line_2 : ''}
                                        // onChangeText={(text) => {
                                        //     setUserData({ ...signUpData, address: [{ ...userData.address[0], address_line_2: text }] })
                                        // }}
                                        />
                                        {/* <TouchableOpacity style={styles.save} activeOpacity={0.7} onPress={() => { setAdd(!add) }}>
                                            <Text style={styles.saveText}>
                                                Save
                                            </Text>
                                        </TouchableOpacity> */}
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
                                        value={userData.address[0].address_type.toLowerCase() !== "home" ? userData.address[0].address_line_1 : ''}
                                    // onChangeText={(text) => {
                                    //     setUserData({ ...signUpData, address: [{ ...userData.address[0], address_line_1: text }] })
                                    // }}
                                    />
                                    <CustomInput
                                        text="ADDRESS LINE 2"
                                        value={userData.address[0].address_type.toLowerCase() !== "home" ? userData.address[0].address_line_1 : ''}
                                    // onChangeText={(text) => {
                                    //     setUserData({ ...signUpData, address: [{ ...userData.address[0], address_line_1: text }] })
                                    // }}
                                    />
                                    {/* <TouchableOpacity style={styles.save} activeOpacity={0.7} onPress={() => { setEdit(!edit) }}>
                                        <Text style={styles.saveText}>
                                            Save
                                        </Text>
                                    </TouchableOpacity> */}
                                </>
                            }
                        </TouchableOpacity>
                        <View style={{}}>
                            <CustomInput
                                text="Type of Notification"
                                value={add3}
                            />
                        </View>
                        <View style={{ height: 40 }}></View>
                    </View>
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
                        <View style={{ height: 50 }}></View>
                    </View>
                </View>
                <View style={{ height: 200 }} />
                <TouchableOpacity
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
                    onPress={() => {
                        storeItem('user', null)
                        props.navigation.navigate('WelcomeScreen')
                    }}>
                    <Text style={styles.saveText}>
                        Logout
                    </Text>
                </TouchableOpacity>
                <View style={{ height: 20 }} />
            </ScrollView>
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
        top: "3%",
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
        marginTop: 20
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    }
})
