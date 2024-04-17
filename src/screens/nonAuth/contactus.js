import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Image, TouchableOpacity, Alert, FlatList, Pressable, ImageBackground, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native'
import Header from '../../components/header'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getApi } from '../../api/api'
import { useSelector } from 'react-redux'
import Loader from '../../components/loader'
import LS_COLORS from '../../constants/colors'
import LS_FONTS from '../../constants/fonts'
import { showToast } from '../../components/validators';

export default function ContactUs({ navigation, route }) {
    const [loader, setLoader] = useState(false)
    const access_token = useSelector(state => state.authenticate.access_token)
    const user = useSelector(state => state.authenticate.user)
    const userType = useSelector(state => state.authenticate.type)
    const [data, setData] = useState({
        name: '',
        email: '',
        message: '',
    })
    const emailRef = useRef(null)
    const messageRef = useRef(null)
    const scrollRef = React.useRef(null)
    // console.log("user",user)
    React.useEffect(()=>{
        if(user){
            if(userType!="guest"){
                setData({...data,name:user?.first_name+" "+user?.last_name,email:user?.email})
            }else{
                setData({...data, name: '',email: '',})
            }
          
        }
    },[user,userType])

    const submit = async (token) => {
        setLoader(true)
        let headers = {
            "Authorization": `Bearer ${access_token}`
        }
        const formdata = new FormData()
        formdata.append("name", data.name)
        formdata.append("email", data.email)
        formdata.append("message", data.message)
        formdata.append("submit_from", "mobile")
        if(userType!="guest"){
            formdata.append("user_role",user?.user_role)
            formdata.append("user_id",user?.id)
        }
        let config = {
            headers: headers,
            data: formdata,
            endPoint: '/api/contactUsAdd',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    showToast("Form submitted successfully")
                    navigation.goBack()
                }
                else {
                    showToast(response?.message)
                }
            })
            .catch(err => {
                setLoader(false)
            }).finally(() => {
                setLoader(false)
            })
    }

    const cardUpdate = async () => {

    }

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: LS_COLORS.global.green }}>
                <Header
                    containerStyle={{ backgroundColor: LS_COLORS.global.cyan }}
                    imageUrl={require("../../assets/back.png")}
                    action={() => navigation.goBack()}
                    // imageUrl1={require("../../assets/home.png")}
                    // action1={() => props.navigation.navigate("HomeScreen")}
                    title={'contact us'} />
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "none"} style={{ backgroundColor: "white", flex: 1 }}>
                        <ScrollView ref={scrollRef} contentContainerStyle={{ alignItems: "center" }} showsVerticalScrollIndicator={false} style={{ padding: 10 }}>
                            {/* <View style={{ alignItems: "center" }}> */}
                            <View style={{ marginTop: 20 }} />
                            <Image source={require("./contact.png")} resizeMode="contain" style={{ width: Dimensions.get("window").width * 0.8, height: Dimensions.get("window").height * 0.4 }} />
                            <Text maxFontSizeMultiplier={1.5} style={{
                                color: LS_COLORS.global.black,
                                marginTop: 10,
                                fontFamily: LS_FONTS.PoppinsMedium,
                            }}>Fill the form below in case of any query.</Text>
                            <TextInput
                                maxFontSizeMultiplier={1.2}
                                style={styles.inputMaskStyle}
                                placeholder={'Name*'}
                                placeholderTextColor={"gray"}
                                onChangeText={(t) => {
                                    setData({ ...data, name: t })
                                }}
                                editable={userType=="guest"}
                                value={data.name}
                                returnKeyType="next"
                                onFocus={d => {
                                    setTimeout(() => {
                                        scrollRef?.current?.scrollTo({ y: 1000 })
                                    }, 200)
                                }}
                                onSubmitEditing={() => {
                                    emailRef?.current?.focus()
                                }}
                            />
                            <TextInput maxFontSizeMultiplier={1.2}
                                style={styles.inputMaskStyle}
                                editable={userType=="guest"}
                                placeholder={'Email*'}
                                placeholderTextColor={"gray"}
                                onChangeText={(t) => {
                                    setData({ ...data, email: t })
                                }}
                                value={data.email}
                                ref={emailRef}
                                onFocus={d => {
                                    setTimeout(() => {
                                        scrollRef?.current?.scrollTo({ y: 1000 })
                                    }, 200)
                                }}
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    messageRef?.current?.focus()
                                }}
                            />
                            <TextInput
                                style={[styles.inputMaskStyle, { height: 120, textAlignVertical: "top" }]}
                                multiline={true}
                                placeholder="Message"
                                placeholderTextColor={"gray"}
                                onChangeText={(t) => {
                                    setData({ ...data, message: t })
                                }}
                                onFocus={d => {
                                    setTimeout(() => {
                                        scrollRef?.current?.scrollTo({ y: 1000 })
                                    }, 200)
                                }}
                                maxFontSizeMultiplier={1.2}
                                ref={messageRef}
                            />
                            {/* </View> */}
                            <View style={{ marginBottom: 100 }} />
                        </ScrollView>
                    </KeyboardAvoidingView>

                    <TouchableOpacity
                        style={styles.save}
                        activeOpacity={0.7}
                        onPress={() => {
                            submit()
                        }}
                    >
                        <Text maxFontSizeMultiplier={1.5} style={styles.saveText}>Send</Text>
                    </TouchableOpacity>

                </View>

            </SafeAreaView>
            {loader && <Loader />}
        </>
    )
}


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
        width: "40%",
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 5,
        alignSelf: 'center',
        marginVertical: 15
    },
    saveText: {
        fontSize: 13,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },
    inputMaskStyle: {
        borderRadius: 7,
        borderColor: LS_COLORS.global.textInutBorderColor,
        paddingLeft: 16,
        width: '90%',
        alignSelf: 'center',
        color: LS_COLORS.global.black,
        height: 60,
        fontFamily: LS_FONTS.PoppinsMedium,
        fontSize: 14,
        borderWidth: 1,
        marginTop: 10
    }
})
