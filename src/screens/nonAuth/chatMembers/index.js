import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, TextInput, StatusBar, Platform, Image, TouchableOpacity, FlatList } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import RNGooglePlaces from 'react-native-google-places';
import DateTimePickerModal from "react-native-modal-datetime-picker";

/* Components */;
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Row } from 'native-base'
import { BASE_URL, getApi } from '../../../api/api';
import { Dimensions } from 'react-native';
import { showToast } from '../../../components/validators';
import { PermissionsAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/core';

const ChatMembers = (props) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const access_token = useSelector(state => state.authenticate.access_token)
    const user = useSelector(state => state.authenticate.user)
    console.log(user)
    const [member, setMembers] = useState("")

    useEffect(() => {
        getAllMembers()
    }, [])


    const getAllMembers = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }


        let config = {
            headers: headers,
            endPoint: user.user_role == 2 ? '/api/customerProvidersList' : '/api/customersList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setLoading(false)
                    setMembers([...response.data])

                }
                else {
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    const renderData = (itemData) => {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10,
                    marginTop: 15,
                    alignSelf: 'center',
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: '#4141411A',
                    width: "90%"
                }}
                activeOpacity={0.7}
                onPress={() => { props.navigation.navigate("ChatScreen", {item: itemData.item }) }}
            >
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        source={itemData.item.profile_image && itemData.item.profile_image !== "null" ? { uri: BASE_URL + itemData.item.profile_image } : require("../../../assets/user.png")}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 200,
                            overflow: 'hidden',
                        }}
                    />
                    <View style={{ marginLeft: '8%', alignSelf: 'center', width: "55%" }}>
                        <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 15, fontFamily: LS_FONTS.PoppinsMedium, color: 'black' }}>{itemData.item.first_name}</Text>
                    </View>
                    <View style={{ width: "20%", justifyContent: "flex-start", alignItems: "flex-end" }}>

                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <>
            <StatusBar 
         // translucent 
            // backgroundColor={"transparent"} 
            backgroundColor={LS_COLORS.global.green}
            barStyle="light-content" />
            <SafeAreaView style={{ flex: 1, backgroundColor: "#ACF0F2" }} edges={["top"]}>
                <Header
                    title="All Members"
                    imageUrl={require("../../../assets/back.png")}
                    action={() => {
                        props.navigation.goBack()
                    }}
                    containerStyle={{backgroundColor:LS_COLORS.global.cyan}}
                />
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    {member?.length === 0 ?
                        <View style={{ flex: 1, backgroundColor: "white", justifyContent: 'center', alignItems: "center" }}>
                            <Text maxFontSizeMultiplier={1.5} style={{ color: "black", fontFamily: LS_FONTS.PoppinsBold }}>No Members Found</Text>
                        </View>
                        : <FlatList
                            data={member}
                            renderData={renderData}
                            renderItem={(itemData) => renderData(itemData)}
                        />}
                    <View style={{ height: 50 }}></View>
                </View>
            </SafeAreaView>
        </>
    )
}

export default ChatMembers;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: LS_COLORS.global.cyan,
    },
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
    },
})





