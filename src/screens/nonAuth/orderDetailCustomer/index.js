// #liahs
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, Dimensions, Linking, ScrollView, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from 'react-native-geolocation-service';
import RNGooglePlaces from 'react-native-google-places';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Card, Avatar } from 'react-native-elements'
/* Components */;
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { BASE_URL, getApi } from '../../../api/api';
import { showToast } from '../../../components/validators';
import { PermissionsAndroid } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Loader from '../../../components/loader'
import CancelModal from '../../../components/cancelModal';
// placeholder image
const placeholder_image = require("../../../assets/user.png")
import _ from 'lodash'




function generate_series(step, start_time) {
    const dt = moment(start_time, 'YYYY-MM-DD HH:mm').toDate()
    const dt_another = moment(start_time, 'YYYY-MM-DD').add(1, "day").toDate()
    const rc = [];
    while (dt < dt_another) {
        const dated = moment(start_time, 'YYYY-MM-DD HH:mm')
        dated.hour(dt.getHours())
        dated.minute(dt.getMinutes())
        rc.push(dated);
        dt.setMinutes(dt.getMinutes() + step);
    }
    return rc;
}



export default function OrderDetailUpdateCustomer(props) {
    const { servicedata, subService, item } = props.route.params
    const [data, setData] = useState(null)
    const user = useSelector(state => state.authenticate.user)

    const access_token = useSelector(state => state.authenticate.access_token)
    const [loading, setLoading] = React.useState(false)
    const [totalWorkingMinutes, setTotalWorkingMinutes] = React.useState(0)
    const [selectedStartTime, setSelectedStartTime] = React.useState(moment())
    const [reason, setReason] = React.useState("")
    const [cancelModa, setCancelModal] = React.useState(false)
    const [virtualdata, setVirtualData] = React.useState({})
    const [extraTime, setExtraTime] = React.useState("1 hour")

    const getOrderDetail = (order_id) => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            data: JSON.stringify({ order_id }),
            endPoint: "/api/customerOrderDetail",
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                console.log("Response", response)
                if (response.status == true) {
                    if (response.data) {
                        setData(response.data)
                        setVirtualData(response.data.virtual_order)
                    } else {

                    }
                } else {
                    showToast(response.message)
                }
            }).catch(err => {
            }).finally(() => {
                setLoading(false)
            })
    }


    const submit = (order_status) => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            data: JSON.stringify({
                order_id: data.id,
                order_status: order_status,
                reason: reason
            }),
            endPoint: "/api/customerOrderStatusUpdate",
            type: 'post'
        }
        console.log(config)
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    showToast(response.message)
                    props.navigation.pop()
                } else {
                    showToast(response.message)
                }
            }).catch(err => {

            }).finally(() => {
                setLoading(false)

            })
    }

    useEffect(() => {
        if (item.id) {
            getOrderDetail(item.id)
        }
    }, [item])


    return (
        <View style={{ flex: 1, backgroundColor: LS_COLORS.global.white }}>
            <StatusBar translucent backgroundColor={"transparent"} barStyle="light-content" />
            <View style={{ width: '100%', height: '20%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: "hidden" }}>
                <ImageBackground
                    resizeMode="cover"
                    source={{ uri: BASE_URL + data?.order_items[0]?.services_image }}
                    style={[styles.image]}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                            <View style={{ height: "100%", justifyContent: 'center' }}>
                                <Header
                                    imageUrl={require("../../../assets/backWhite.png")}
                                    action={() => {
                                        props.navigation.goBack()
                                    }}
                                    title={data?.order_items && data?.order_items[0]?.services_name}
                                    titleStyle={{ color: "white" }}
                                    imageUrl1={require("../../../assets/homeWhite.png")}
                                    action1={() => {
                                        props.navigation.navigate("MainDrawer", { screen: "HomeScreen" })
                                    }}
                                    imageStyle1={{ tintColor: "white" }}
                                />
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: "center", height: "33%" }}>
                                <Text style={{ fontSize: 29, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.white }}>{subService?.name}</Text>
                            </View>
                        </SafeAreaView>
                    </View>
                </ImageBackground>
            </View>
            <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
                <View style={styles.container}>
                    {/* <RenderView /> */}
                    <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
                        <Text style={[styles.client_info_text]}>Order Update</Text>
                        <CardClientInfo virtual_data={virtualdata} data={data} setTotalWorkingMinutes={setTotalWorkingMinutes} />
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 20 }}>
                            <Text style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium }]}>User Requested Time Frame </Text>
                            <Text style={styles.baseTextStyle}>{moment(virtualdata?.order_start_time).format("hh:mm a")} - {moment(virtualdata?.order_end_time).format("hh:mm a")}</Text>
                        </View>
                        <Text style={{ color: LS_COLORS.global.danger, fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, textAlign: "center", marginTop: 20 }}>Adding new service requires 1 hour extra</Text>
                    </ScrollView>
                    {/* only show if order status is pending i.e 1 */}
                    {data?.order_status == 9 ? <View style={{ flexDirection: "row", justifyContent: "space-around", marginHorizontal: 20 }}>
                        <TouchableOpacity
                            style={[styles.save, { marginTop: 5 }]}
                            activeOpacity={0.7}
                            onPress={() => {
                                submit(10)
                            }}>
                            <Text style={styles.saveText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.save, { backgroundColor: LS_COLORS.global.white, marginTop: 5, borderWidth: 1, borderColor: LS_COLORS.global.green }]}
                            activeOpacity={0.7}
                            onPress={() => setCancelModal(true)}>
                            <Text style={[styles.saveText, { color: LS_COLORS.global.green }]}>Decline</Text>
                        </TouchableOpacity>
                    </View> : null
                    }
                </View>
            </SafeAreaView >
            <CancelModal
                title="Kindly fill the reason for rejection."
                visible={cancelModa}
                value={reason}
                // pressHandler={()=>setCancelModal(false)}
                onChangeText={(t) => { setReason(t) }}
                action1={() => {
                    setCancelModal(false)
                }}
                action={() => {
                    if (reason.trim() == "") {
                        showToast("Reason cannot be empty!")
                    }
                    else {
                        setCancelModal(false)
                        setReason('')
                        submit(11)
                    }
                }}
            />
            {loading && <Loader />}
        </View>
    )
}



const CardClientInfo = ({ data, virtual_data, setTotalWorkingMinutes }) => {
    const [country, setCountry] = useState("")
    const [items, setItems] = useState([])
    const [virtualOrders, setVirtualOrders] = React.useState([])
    const [totalTime, setTotalTime] = React.useState(0)

    useEffect(() => {
        if (virtual_data?.id) {
            setVirtualOrders(virtual_data)
        }
    }, [virtual_data])

    useEffect(() => {
        if (virtualOrders.order_items) {
            let t = virtualOrders.order_items.map(x => x.duration_time).filter(x => x)
            let total = t.reduce((a, b) => a + Number(b), 0)
            setTotalTime(total)
            setTotalWorkingMinutes(total)
        }
    }, [virtualOrders])

    useEffect(() => {
        if (data) {
            if (data.order_placed_address) {
                let d = data.order_placed_address.split(",")
                let c = d[d.length - 1]
                setCountry(c)
            }
            if (data.order_items) {
                setItems(data.order_items.filter(x => x.service_items_name))
            }
        }
    }, [data])

    const getTimeInHours = (minute) => {
        let d = parseInt(minute / 60) + "hrs"
        if (minute % 60 !== 0) {
            d += ` ${parseInt(minute % 60)}min`
        }
        return `${d}`
    }
    const user = useSelector(state => state.authenticate.user)

    return (
        <Card containerStyle={{ borderRadius: 10 }}>
            <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <Avatar
                        size="large"
                        rounded
                        source={user.user_role === 3 ? data?.customers_profile_image ? { uri: BASE_URL + data?.customers_profile_image } : placeholder_image : data?.providers_profile_image ? { uri: BASE_URL + data?.providers_profile_image } : placeholder_image}
                    />
                    <View style={{ marginLeft: 10, justifyContent: "center" }}>
                        <Text style={[styles.greenTextStyle, { fontSize: 16 }]}>{user.user_role === 3 ? data?.customers_first_name : data?.providers_first_name}</Text>
                        <Text style={[styles.baseTextStyle]}>{country}</Text>
                    </View>
                </View>
                <View >
                    <Text style={[styles.greenTextStyle, { textAlign: "right" }]}>{moment(data?.created_at).fromNow()}</Text>
                    <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, textAlign: "right" }}>Order<Text style={styles.greenTextStyle}># {data?.id}</Text></Text>
                </View>
            </View>
            {/* New Request products and Service */}
            <View style={{ marginVertical: 20 }}>
                <Text style={[styles.client_info_text, { textAlign: "left", fontSize: 14 }]}>New requested service/product</Text>
                {virtualOrders?.order_items?.map((i) => {
                    return (
                        <>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <Text style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium, flex: 1 }]} numberOfLines={1}>{i.service_items_name + "  (Service Charge)"}</Text>
                                <View style={{ height: 20, flexDirection: "row" }}>
                                    <Text style={styles.baseTextStyle}>{"$" + i.price}</Text>
                                </View>
                            </View>
                            {i.product.map((itemData, index) => {
                                return (
                                    <View key={itemData.id + " " + index} style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }} >
                                        <View style={{}} >
                                            <Text style={{ marginLeft: 20 }}>
                                                <Text style={styles.baseTextStyle}>{itemData.item_products_name + "(Product)"}</Text>
                                            </Text>
                                        </View>
                                        <View style={{ height: 20, flexDirection: "row" }}>
                                            <Text style={styles.baseTextStyle}>{"$" + itemData.price}</Text>
                                        </View>
                                    </View>
                                )
                            })
                            }
                            {i.extra_product.map((itemData, index) => {
                                return (
                                    <View key={itemData.id + " " + index} style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }} >
                                        <View style={{}} >
                                            <Text style={{ marginLeft: 20 }}>
                                                <Text style={styles.baseTextStyle}>{itemData.product_name + "(Other Product)"}</Text>
                                            </Text>
                                        </View>
                                        <View style={{ height: 20, flexDirection: "row" }}>
                                            <Text style={styles.baseTextStyle}>{"$" + itemData.product_price}</Text>
                                        </View>
                                    </View>
                                )
                            })
                            }
                            {i.other_data.map((itemData, index) => {
                                let other = itemData.other
                                let have_own = itemData.have_own
                                let need_recommendation = itemData.need_recommendation
                                return (
                                    <>
                                        {other && other.trim() != "" && <View key={itemData.id + " " + index} style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }} >
                                            <View style={{}} >
                                                <Text style={{ marginLeft: 20 }}>
                                                    <Text style={styles.baseTextStyle}>{other + "(Other Product)"}</Text>
                                                </Text>
                                            </View>
                                        </View>
                                        }
                                        {have_own && have_own.trim() != "" && <View key={itemData.id + " " + index} style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }} >
                                            <View style={{}} >
                                                <Text style={{ marginLeft: 20 }}>
                                                    <Text style={styles.baseTextStyle}>{have_own + "(Have Own Product)"}</Text>
                                                </Text>
                                            </View>
                                        </View>}
                                        {need_recommendation && need_recommendation == "true" && <View key={itemData.id + " " + index} style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }} >
                                            <View style={{}} >
                                                <Text style={{ marginLeft: 20 }}>
                                                    <Text style={styles.baseTextStyle}>Need Recommendation</Text>
                                                </Text>
                                            </View>
                                        </View>}
                                    </>
                                )
                            })
                            }
                        </>
                    )
                })}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text style={styles.greenTextStyle}>Total Amount</Text>
                <Text style={styles.greenTextStyle}>${virtualOrders?.order_total_price}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text style={styles.greenTextStyle}>Total Time</Text>
                <Text style={styles.greenTextStyle}>{getTimeInHours(totalTime)}</Text>
            </View>
        </Card>
    )
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: LS_COLORS.global.cyan,
    },
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
    },
    image: {
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 45,
        width: "40%",
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 6,
        alignSelf: 'center',
        marginTop: 40
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },
    client_info_text: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsBold,
        color: LS_COLORS.global.black,
        textTransform: "uppercase"
    },
    item: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 20,
    },
    checkBoxTxt: {
        marginLeft: 20,
    },
    dropdownBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: widthPercentageToDP(28),
        paddingHorizontal: 15,
        borderRadius: 30,
        paddingVertical: 5,
        marginHorizontal: 5
    },
    fromContainer: {
        height: 50,
        width: "100%",
        alignSelf: 'center',
        borderColor: LS_COLORS.global.lightTextColor,
        borderRadius: 3,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        overflow: 'hidden',
        paddingLeft: '5%'
    },
    inputStyle: {
        height: '100%',
        width: "90%"
    },
    mapContainer: {
        height: Dimensions.get('screen').height / 4,
        width: Dimensions.get('screen').width,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    greenTextStyle: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.green
    },
    baseTextStyle: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.black
    }
})





