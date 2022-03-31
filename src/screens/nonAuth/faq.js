import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, Alert, ScrollView, Pressable, ImageBackground, StyleSheet, StatusBar, Linking } from 'react-native'

import Header from '../../components/header'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { getApi } from '../../api/api'
import { useSelector,useDispatch } from 'react-redux'
import LS_COLORS from '../../constants/colors'
import LS_FONTS from '../../constants/fonts'
import { showToast } from '../../utils'
import { setFAQList } from '../../redux/features/faq'

export default function FAQ({ navigation, route }) {
    const [loader, setLoader] = useState(false)
    const access_token = useSelector(state => state.authenticate.access_token)
    const cards = useSelector(state => state.faq.list)
    const dispatch=useDispatch()

    const getFAQ = () => {
        setLoader(true)
        let headers = {
            "Authorization": `Bearer ${access_token}`
        }

        let config = {
            headers: headers,
            endPoint: '/api/faqList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                console.log(response)
                if (response.status == true && response.data) {
                    dispatch(setFAQList(response.data))
                }
                else {
                    dispatch(setFAQList([]))

                }
            })
            .catch(err => {
                console.log(err)
                setLoader(false)
            }).finally(() => {
                setLoader(false)
            })
    }




    useFocusEffect(React.useCallback(() => {
        getFAQ()
    }, []))





    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor={LS_COLORS.global.cyan} />
            <SafeAreaView style={{ flex: 1, backgroundColor: LS_COLORS.global.cyan }}>
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <Header imageUrl={require("../../assets/back.png")}
                        action={() => navigation.goBack()}
                        // imageUrl1={require("../../assets/home.png")}
                        // action1={() => props.navigation.navigate("HomeScreen")}
                        title={'FAQ'}
                        containerStyle={{ backgroundColor: LS_COLORS.global.cyan }}
                    />
                    <ScrollView>
                        {cards.map((f, index) => {
                            return (
                                <FAQComponent key={index + ""} faq={f} />
                            )
                        })}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    )
}


const FAQComponent = ({ faq }) => {
    const [show,setShow]=React.useState(false)
    return (
        <Pressable 
        onPress={()=>{
            setShow(!show)
        }}
        style={{
            backgroundColor: "white", padding: 20, shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            marginTop: 15,
            borderRadius: 10,
            marginHorizontal: 15,
            elevation: 6,
        }}>
            <View style={{flexDirection:"row"}}>
                <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 15 ,flex:1}}>{faq.question}</Text>
                <Image source={require("../../assets/Images1/whitedropdown.png")}  resizeMode="contain" style={{tintColor:LS_COLORS.global.green,height:15,width:15}}/>
               
            </View>
            {show&&
                <View style={{marginTop:10}}>
                    <Text maxFontSizeMultiplier={1.5} style={{fontFamily:LS_FONTS.PoppinsRegular,fontSize:14,color:LS_COLORS.global.black}}>{faq?.answer}</Text>
                    <Text maxFontSizeMultiplier={1.5} onPress={()=>{
                        Linking.openURL(faq?.youtube_link).then(x=>{
                            console.log(x)
                        }).catch(err=>{
                            showToast("Invalid url")
                        })
                    }} style={{fontFamily:LS_FONTS.PoppinsRegular,fontSize:14,color:"#1A85FF"}} >{faq?.youtube_link}</Text>
                </View>
                }
        </Pressable>
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
        width: 111,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 28,
        alignSelf: 'center',
        marginVertical: 15
    },
    saveText: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    }
})
