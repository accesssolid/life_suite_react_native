import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, FlatList, StatusBar, Pressable } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { SafeAreaView } from 'react-native-safe-area-context';


/* Components */;
import Header from '../../../components/header';
import { Card, Row } from 'native-base'
import { BASE_URL, getApi } from '../../../api/api';
import { Dimensions } from 'react-native';
import { showToast } from '../../../components/validators';
import { PermissionsAndroid } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native'
import { role } from '../../../constants/globals';
import { loadNotificaitonsThunk, updateReadNotification } from '../../../redux/features/notification';
import { DropDown } from '../../../components/dropDown';

const notification_color = [
    {
        title: "Requesting",
        ids: [1],
        color: "purple"
    },
    {
        title: "Upcoming",
        ids: [3, 4, 6, 5, 12, 9, 10, 11],
        color: "#02a4ea"
    },
    {
        title: "InProgress",
        ids: [7, 15],
        color: "#fdca0d"
    },
    {
        title: "Completed",
        ids: [8],
        color: "#23b14d"
    },
    {
        title: "Cancelled",
        ids: [2, 14, 16, 13, 17],
        color: "#ec1c25"
    }
]
const Notification = (props) => {
    const [loading, setLoading] = React.useState(false)
    const dispatch = useDispatch()
    const access_token = useSelector(state => state.authenticate.access_token)
    const user = useSelector(state => state.authenticate.user)
    const notificationsg = useSelector(state => state.notification)?.data
    console.log("Notifications", JSON.stringify(notifications))
    const [showUnread, setShowUnread] = useState(false)
    const [notifications, setNotifications] = useState([])

    const seenNotification = async (data) => {
        if (data.is_read == "0") {
            setLoading(true)
            let headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }
            let config = {
                headers: headers,
                data: JSON.stringify({ notification_id: data.id }),
                endPoint: user.user_role == role.provider ? '/api/providerReadNotification' : "/api/customerReadNotification",
                type: 'post'
            }

            getApi(config)
                .then((response) => {
                    if (response.status == true) {
                        dispatch(loadNotificaitonsThunk())
                    }
                    else {
                        showToast(response.message)
                    }
                }).catch(err => {
                }).finally(() => {
                    setLoading(false)
                    if (data?.type == "order") {
                        if (user?.user_role == role.customer) {
                            props.navigation.navigate("UserStack", { screen: "OrderDetailCustomer", params: { item: { id: data.order_id } } })
                        } else {
                            props.navigation.navigate("ProviderStack", { screen: "OrderDetail", params: { item: { id: data.order_id } } })
                        }
                    }
                })
        } else {
            if (data?.type == "order") {
                if (user?.user_role == role.customer) {
                    props.navigation.navigate("UserStack", { screen: "OrderDetailCustomer", params: { item: { id: data.order_id } } })
                } else {
                    props.navigation.navigate("ProviderStack", { screen: "OrderDetail", params: { item: { id: data.order_id } } })
                }
            }
        }
    }

    useFocusEffect(React.useCallback(() => {
        dispatch(loadNotificaitonsThunk())
    }, []))

    useEffect(() => {
        if (showUnread) {
            let notis = notificationsg.filter(x => x?.is_read == "0")
            setNotifications(notis)
        } else {
            setNotifications(notificationsg)
        }
    }, [notificationsg, showUnread])
    const renderData = ({ item }) => {
        let backgroundColor = "#5CBFBF"
        let orderType = ""
        if (item.type == "order") {
            for (let c of notification_color) {
                if (c.ids.includes(item.service_orders_order_status)) {
                    // backgroundColor = c.color
                    orderType = c.title
                    break
                }
            }
        }
        if (item.is_read != "0") {
            backgroundColor = "gray"
        }
        return (
            <Pressable
                onPress={() => {
                    seenNotification(item)
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
                        minHeight: 62
                    }}
                    activeOpacity={0.7}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '7%', borderRadius: 10, justifyContent: "center", alignItems: "center", right: 10, backgroundColor: backgroundColor }}></View>
                        <View style={{ marginLeft: '5%', alignSelf: 'center', width: "65%" }}>
                            <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, color: '#707070' }}>{item.description}</Text>
                        </View>
                        <View style={{ width: "20%", justifyContent: "space-evenly", alignItems: "flex-end" }}>
                            <Text maxFontSizeMultiplier={1.5} style={{ color: "grey", fontFamily: LS_FONTS.PoppinsRegular, textAlign: "right", fontSize: 12 }}>{moment(item.created_at).format("hh:mm a")}</Text>
                            {/* <Text maxFontSizeMultiplier={1.5} style={{ color: "grey", fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12 }}>{orderType}</Text> */}
                        </View>
                    </View>
                </Card>
            </Pressable>
        )
    }
    const [selected, setSelected] = React.useState("Show All")
    return (
        <>
            <StatusBar
                // translucent 
                // backgroundColor={"transparent"} 
                backgroundColor={LS_COLORS.global.green}
                barStyle="light-content" />
            <SafeAreaView style={{ flex: 1, backgroundColor: LS_COLORS.global.green }} edges={["top"]}>
                <Header
                    title="Notification"
                    imageUrl={require("../../../assets/back.png")}
                    action={() => {
                        props.navigation.goBack()
                    }}
                    containerStyle={{ backgroundColor: LS_COLORS.global.cyan }}

                />
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <DropDown
                        handleTextValue={true}
                        item={["Show All", "Show Unread"]}
                        value={selected}
                        onChangeValue={(index, value) => {
                            if (index == 0) {
                                setSelected("Show All")
                                setShowUnread(false)
                            } else {
                                setShowUnread(true)
                                setSelected("Show Unread")

                            }
                        }}
                        containerStyle1={{ borderRadius: 6, backgroundColor: LS_COLORS.global.lightGrey, marginTop: 10, marginBottom: 0,marginRight:20, borderWidth: 0 ,width:200,alignSelf:"flex-end"}}
                        containerStyle={{ borderRadius: 6, backgroundColor: LS_COLORS.global.lightGrey, marginTop: 0,minHeight:40, borderWidth: 0 }}
                        dropdownStyle={{ height: 2 * 40 }}
                    />
                    {
                        notifications?.length === 0 ?
                            <View style={{ flex: 1, backgroundColor: "white", justifyContent: 'center', alignItems: "center", marginTop: 10 }}>
                                <Text maxFontSizeMultiplier={1.5} style={{ color: "black", fontFamily: LS_FONTS.PoppinsBold }}>No notification found</Text>
                            </View>
                            : <FlatList
                                data={notifications}
                                // style={{marginTop:80}}
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





