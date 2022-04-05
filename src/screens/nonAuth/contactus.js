import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Image, TouchableOpacity, Alert, FlatList, Pressable, ImageBackground, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import Header from '../../components/header'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useFocusEffect } from '@react-navigation/native'
import { CreditCardInput, CardView } from "react-native-credit-card-input";
import TextInputMask from 'react-native-text-input-mask';
import { CheckBox } from 'react-native-elements'

import { getApi } from '../../api/api'
import { useSelector } from 'react-redux'
import Loader from '../../components/loader'
import LS_COLORS from '../../constants/colors'
import LS_FONTS from '../../constants/fonts'
import { Container, Content } from 'native-base'
import { showToast } from '../../components/validators';
import creditCardType from 'credit-card-type';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

export default function ContactUs({ navigation, route }) {
    const [loader, setLoader] = useState(false)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [data, setData] = useState({
        name: '',
        email: '',
        message: '',
    })


    const cardNameRef = useRef(null)
    const cardDateRef = useRef(null)







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
                    <ScrollView 
                    style={{flex:1}}
                    contentContainerStyle={{
                        flex:1,
                        flexGrow:1
                    }}
                    >
                        <View style={{ alignItems: "center" }}>
                            <View style={{ marginTop: 20 }} />
                            <Image source={require("./contact.png")} resizeMode="contain" style={{ width: "80%", height: "40%" }} />
                            <Text maxFontSizeMultiplier={1.5} style={{
                                color: LS_COLORS.global.black,
                                marginTop: 10,
                                fontFamily: LS_FONTS.PoppinsMedium,
                            }}>Fill the form below in case of any query.</Text>
                            <TextInput
                                maxFontSizeMultiplier={1.5}
                                style={styles.inputMaskStyle}
                                placeholder={'Name*'}
                                placeholderTextColor={"gray"}
                                onChangeText={(t) => {
                                    setData({ ...data, name: t })
                                }}
                                value={data.name}
                                ref={cardNameRef}
                            />
                            <TextInput maxFontSizeMultiplier={1.5}
                                style={styles.inputMaskStyle}
                                placeholder={'Email*'}
                                placeholderTextColor={"gray"}
                                onChangeText={(t) => {
                                    setData({ ...data, email: t })
                                }}
                                value={data.email}
                                ref={cardNameRef}
                            />
                            <TextInput
                                style={[styles.inputMaskStyle, { minHeight: 120 ,textAlignVertical:"top"}]}
                                multiline={true}
                                placeholder="Message"
                                placeholderTextColor={"gray"}
                                onChangeText={(t) => {
                                    setData({ ...data, message: t })
                                }}
                                maxFontSizeMultiplier={1.5}
                            />
                        </View>
                        </ScrollView>
                        {Platform.OS=="ios"&&<KeyboardAvoidingView behavior='padding' />}
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
        minHeight: 50,
        fontFamily: LS_FONTS.PoppinsMedium,
        fontSize: 16,
        borderWidth: 1,
        marginTop: 10
    }
})
