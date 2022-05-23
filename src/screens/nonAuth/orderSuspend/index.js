// #liahs
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ImageBackground, Image, StatusBar, KeyboardAvoidingView, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Avatar, CheckBox, Input } from 'react-native-elements'
/* Components */;
import Header from '../../../components/header';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { BASE_URL, getApi } from '../../../api/api';
import { showToast } from '../../../components/validators';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Loader from '../../../components/loader'
// placeholder image
const placeholder_image = require("../../../assets/user.png")
import _ from 'lodash'

import { order_types, buttons_customer, buttons_types } from '../../../constants/globals'


export default function OrderSuspend(props) {
    const { item } = props.route.params
    const [data, setData] = useState(null)
    const user = useSelector(state => state.authenticate.user)

    const access_token = useSelector(state => state.authenticate.access_token)
    const [loading, setLoading] = React.useState(false)
    const [totalWorkingMinutes, setTotalWorkingMinutes] = React.useState(0)
    const [reason, setReason] = React.useState("")
    const [reasonCheck, setReasonCheck] = React.useState("No Show")
    const [cancelOrderText, setCancelOrderText] = React.useState("")
    const [virtualdata, setVirtualData] = React.useState({})
    const [extraTime, setExtraTime] = React.useState("1 hour")
    const scrollRef = React.useRef(null)
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
                        console.log("Order Detail", JSON.stringify(response.data))
                        setVirtualData(response.data.virtual_order)
                        if (response.totalSettingData) {
                            let key_value = response.totalSettingData.find(x => x.key == "suspend_order_by_customer_inprogress")
                            if (key_value && key_value?.status == "1") {
                                setCancelOrderText(`Remaining suspend requests: ${key_value.value}.`)
                                if (response.totalUserAction) {
                                    let filteredValues = response.totalUserAction.filter(x => x.key == "suspend_order_by_customer_inprogress")
                                    if (filteredValues.length > 0) {
                                        let total_remains = Number(key_value.value) - Number(filteredValues[0].no_of_action)
                                        setCancelOrderText(`Remaining suspend requests: ${total_remains}`)
                                    }
                                }
                            } else {
                                setCancelOrderText(``)

                            }
                        }
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


    const submit = () => {
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
                order_status: order_types.suspend,
                reason: reasonCheck == "Other" ? reason : reasonCheck
            }),
            endPoint: "/api/customerOrderStatusUpdate",
            type: 'post'
        }
        console.log(JSON.stringify(config))
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    showToast(response.message)
                    props.navigation.navigate("MainDrawer", { screen: "Orders" })
                } else {
                    console.log("Error", response)
                    showToast(response.message)
                }
            }).catch(err => {

            }).finally(() => {
                setLoading(false)

            })
    }

    useEffect(() => {
        if (item?.id) {
            getOrderDetail(item?.id)
        }
    }, [item])


    return (
        <View style={{ flex: 1, backgroundColor: LS_COLORS.global.white }}>
            <StatusBar
                // translucent 
                // backgroundColor={"transparent"} 
                backgroundColor={LS_COLORS.global.green}
                barStyle="light-content" />
            {/* header start */}
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
                        </SafeAreaView>
                    </View>
                </ImageBackground>
            </View>
            {/* header end */}
            <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
                <View style={styles.container}>
                    {/* <RenderView Card Main/> */}
                    <ScrollView ref={scrollRef} contentContainerStyle={{ paddingVertical: 16 }}>
                        <Text style={[styles.client_info_text]}>Suspend in progress</Text>
                        <CardClientInfo virtual_data={virtualdata} data={data} setTotalWorkingMinutes={setTotalWorkingMinutes} />
                        <Text style={[styles.client_info_text, { fontSize: 13, marginVertical: 5, color: "red" }]}>{cancelOrderText}</Text>
                        <Text style={[styles.client_info_text, { fontSize: 13, marginVertical: 5 }]}>Reason</Text>
                        {["No Show", "Tasks not performed", "Incorrect Products", "Other"].map(x => {
                            return (
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <CheckBox
                                        checked={reasonCheck == x}
                                        onPress={() => {
                                            setReasonCheck(x)
                                        }}
                                        containerStyle={{ marginVertical: 0 }}
                                        checkedIcon={<Image style={{ height: 23, width: 23 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                                    />
                                    <Text style={styles.baseTextStyle}>{x}</Text>
                                </View>)
                        })}
                        <Input onFocus={() => {
                            // scrollRef?.current?.scrollTo({y:2000})
                            setTimeout(() => {
                                scrollRef?.current?.scrollTo({ y: 2000 })
                            }, 200)
                        }} maxFontSizeMultiplier={1.4} disabled={reasonCheck != "Other"} value={reason} onChangeText={t => setReason(t)} multiline={true} containerStyle={{ height: 100, borderWidth: 1, width: "90%", alignSelf: "center", borderColor: "gray", borderRadius: 5 }} inputContainerStyle={{ borderBottomWidth: 0 }} inputStyle={[styles.baseTextStyle, { borderWidth: 0 }]} />
                    </ScrollView>
                    {/* lowerButton */}
                    <View style={{ flexDirection: "row", marginBottom: 10, justifyContent: "space-evenly" }}>
                        <TouchableOpacity onPress={submit} style={[styles.save, { borderRadius: 50, marginTop: 5 }]}>
                            <Text style={styles.saveText}>Yes, Suspend</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            props.navigation.pop()
                        }} style={[styles.save, { borderRadius: 50, marginTop: 5 }]}>
                            <Text style={styles.saveText}>Keep Order</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {Platform.OS == "ios" && <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={40} />}
            </SafeAreaView >

            {loading && <Loader />}
        </View>
    )
}


//items && virtual order items manage screens
const CardClientInfo = ({ data, virtual_data, setTotalWorkingMinutes }) => {
    const [country, setCountry] = useState("")
    const [items, setItems] = useState([])
    const [virtualOrdersItems, setVirtualOrdersItems] = React.useState([])
    const [totalTime, setTotalTime] = React.useState(0)
    const [totalVirtualTime, setTotalVirtualTime] = React.useState(0)
    const [showVirtualData, setShowVirtualData] = React.useState(false)

    useEffect(() => {
        if (virtual_data?.id) {
            setVirtualOrdersItems(virtual_data.order_items)
        }
    }, [virtual_data])

    useEffect(() => {
        if (virtualOrdersItems.length > 0) {
            let t = virtualOrdersItems.map(x => x.duration_time).filter(x => x)
            let total = t.reduce((a, b) => a + Number(b), 0)
            setTotalVirtualTime(total)
            // setTotalWorkingMinutes(total)
        }
    }, [virtualOrdersItems])

    useEffect(() => {
        console.log("items", JSON.stringify(items))
        if (items.length > 0) {
            let t = items.map(x => x.duration_time).filter(x => x)
            let total = t.reduce((a, b) => a + Number(b), 0)
            setTotalTime(total)
            // setTotalWorkingMinutes(total)
        }
    }, [items])

    useEffect(() => {
        if (data) {
            if (data.order_placed_address) {
                let d = data.order_placed_address.split(",")
                let c = d[d.length - 1]
                setCountry(c)
            }

            if (data.order_status == order_types.update_acceptance) {
                setShowVirtualData(true)
            }

            if (data.order_items) {
                setItems(data.order_items.filter(x => x.service_items_name))
            }
        }
    }, [data])

    const getTimeInHours = (minute) => {
        let d = parseInt(minute / 60) + " Hr"
        if (minute % 60 !== 0) {
            d += ` ${parseInt(minute % 60)} Mins`
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
            {/* request data */}
            {showVirtualData && <Text style={[styles.client_info_text, { textAlign: "left", fontSize: 14, marginTop: 10 }]}>User Requested Order</Text>}
            {items?.map((i) => {
                return (<OrderItemsDetail i={i} />)
            })}
            {/* New Request products and Service */}
            {showVirtualData && virtualOrdersItems.length > 0 && <View style={{ marginVertical: 20 }}>
                <Text style={[styles.client_info_text, { textAlign: "left", fontSize: 14 }]}>Provider Updated Order</Text>
                {virtualOrdersItems?.map((i) => {
                    return (<OrderItemsDetail i={i} />)
                })}
            </View>}

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text style={styles.greenTextStyle}>Total Amount</Text>
                <Text style={styles.greenTextStyle}>${showVirtualData ? virtual_data?.order_total_price : data?.order_total_price}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text style={styles.greenTextStyle}>Order Start Time</Text>
                <Text style={styles.greenTextStyle}>{showVirtualData ? moment(virtual_data?.order_start_time).format("hh:mm a") : moment(data?.order_start_time).format("hh:mm a")}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text style={styles.greenTextStyle}>Order End Time</Text>
                <Text style={styles.greenTextStyle}>{showVirtualData ? moment(virtual_data?.order_end_time).format("hh:mm a") : moment(data?.order_end_time).format("hh:mm a")}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text style={styles.greenTextStyle}>Total Time</Text>
                <Text style={styles.greenTextStyle}>{showVirtualData ? getTimeInHours(totalVirtualTime) : getTimeInHours(totalTime)}</Text>
            </View>
        </Card>
    )
}


const OrderItemsDetail = ({ i }) => {
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





