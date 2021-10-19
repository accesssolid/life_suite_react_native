import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, FlatList, StatusBar, Platform, Image, TouchableOpacity, ScrollView, Pressable } from 'react-native'

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
import { BASE_URL, getApi } from '../../../api/api';
import { Dimensions } from 'react-native';
import { showToast } from '../../../components/validators';
import { PermissionsAndroid } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native'

const Notification = (props) => {
    const [loading, setLoading] = React.useState(false)
    const dispatch = useDispatch()
    const access_token = useSelector(state => state.authenticate.access_token)
    const user = useSelector(state => state.authenticate.user)

    const [notifications, setNotifications] = useState([])


    const getNotifications = async () => {
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            data: JSON.stringify({ notification_type: "all" }),
            endPoint: user.user_role == 3 ? '/api/providerNotificationList' : "/api/customerNotificationList",
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                console.log(response)
                if (response.status == true) {
                    setNotifications(response.data)
                }
                else {
                    showToast(response.message)
                }
            }).catch(err => {
            }).finally(() => {
                setLoading(false)
            })
    }

    useFocusEffect(React.useCallback(() => {
        getNotifications()
    }, []))

    const renderData = ({ item }) => {
        return (
            <Pressable
                onPress={() => {

                }}
            >
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
                        overflow: "hidden",
                        height: 50
                    }}
                    activeOpacity={0.7}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '7%', borderRadius: 10, justifyContent: "center", alignItems: "center", right: 10, backgroundColor: item.is_read == "0" ? "#5CBFBF" : "gray" }}></View>
                        <View style={{ marginLeft: '5%', alignSelf: 'center', width: "65%" }}>
                            <Text numberOfLines={4} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, color: '#707070' }}>Order #{item.order_id} {item.description}</Text>
                        </View>
                        <View style={{ width: "20%", justifyContent: "center", alignItems: "flex-end" }}>
                            <Text style={{ color: "grey", fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12 }}>{moment(item.created_at).format("hh:mm a")}</Text>
                        </View>
                    </View>
                </Card>
            </Pressable>
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
                                <Text style={{ color: "black", fontFamily: LS_FONTS.PoppinsBold }}>No notification found</Text>
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





