import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, FlatList, StatusBar, Platform, Image, TouchableOpacity, ScrollView } from 'react-native'

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
import { Card, Row } from 'native-base'
import { TextInput } from 'react-native-gesture-handler';
import { BASE_URL } from '../../../api/api';
import { Dimensions } from 'react-native';
import { showToast } from '../../../components/validators';
import { PermissionsAndroid } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';

const Notification = (props) => {
    const [notifications, setNotifications] = useState([
        {
            name: "hlloftuuctjjfcgcghcfgcjfgcgfcfgcfhcfcfgcfcfgcfcxfgcgffgcfcfgcgffcgfcgfcfcfgcfcfgcfcgffgfcfcfgfccfgcfgcfgcfcfgfgccfgfcgcfcfgcfgfgfcgcfgcfcfcfgcfgfcgcfgcfgcfgfcgfcgfcgcfgcf",
            text: "Good One",
            time: "11.31",
            color:'#ACF0F2'
        },
        {
            name: "hllogkjsvdfvsdkvfvdsfjdfs",
            text: "Good One",
            time: "11.31",
            color:'lightgrey'
        },
        {
            name: "hllokjbajsvdf",
            text: "Good One",
            time: "11.31",
            color:'#ACF0F2'
        },
        {
            name: "hlloftuuctjjfcgcghcfgcjfgcgfcfgcfhcfcfgcfcfgcfcxfgcgffgcfcfgcfcfcfgfccfgcfgcfgcfcfgfgccfgfcgcfcfgcfgfgfcgcfgcfcfcfgcfgfcgcfgcfgcfgfcgfcgfcgcfgcf",
            text: "Good One",
            time: "11.31",
            color:'#ACF0F2'
        },
        {
            name: "hllogkjsvdfvsdkvfvdsfjdfs",
            text: "Good One",
            time: "11.31",
            color:'lightgrey'
        },
        {
            name: "hllokjbajsvdf",
            text: "Good One",
            time: "11.31",
            color:'#ACF0F2'
        }
    ])
    const renderData = (itemData) => {
        return (
            <Card
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 15,
                    alignSelf: 'center',
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: '#4141411A',
                    width: "90%",
                    overflow:"hidden",
                    height:50
                }}
                activeOpacity={0.7}
            >
                <View style={{ flexDirection: 'row' }}>
                <View style={{ backgroundColor:itemData.item.color , width: '7%', borderRadius: 10, justifyContent: "center", alignItems: "center",right:10 }}></View>
                    <View style={{ marginLeft: '5%', alignSelf: 'center', width: "65%" }}>
                        <Text numberOfLines={4} style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsRegular, color: 'black' }}>{itemData.item.name}</Text>
                    </View>
                    <View style={{ width: "20%", justifyContent: "flex-start", alignItems: "flex-end" }}>
                        <Text style={{ color: "grey", fontFamily: LS_FONTS.PoppinsRegular }}>{itemData.item.time}</Text>
                    </View>
                </View>
            </Card>
        )
    }
    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <SafeAreaView style={{ flex: 1, backgroundColor: "#ACF0F2" }} edges={["top"]}>
                <Header
                    title="Notification"
                    imageUrl={require("../../../assets/back.png")}
                    action={() => {
                        props.navigation.goBack()
                    }}
                />
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    {
                        notifications?.length === 0 ?
                            <View style={{ flex: 1, backgroundColor: "white", justifyContent: 'center', alignItems: "center", marginTop: 10 }}>
                                <Text style={{ color: "black", fontFamily: LS_FONTS.PoppinsBold }}>No Chats Found</Text>
                            </View>
                            : <FlatList
                                data={notifications}
                                renderData={renderData}
                                renderItem={(itemData) => renderData(itemData)}
                            />
                    }
                </View>
            </SafeAreaView>
        </>
    )
}

export default Notification;

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




