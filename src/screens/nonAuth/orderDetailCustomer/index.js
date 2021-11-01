// #liahs
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, TouchableOpacity, Dimensions, ScrollView, Image, Linking } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Avatar } from 'react-native-elements'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
/* Components */;
import Header from '../../../components/header';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { BASE_URL, getApi } from '../../../api/api';
import { showToast } from '../../../components/validators';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Loader from '../../../components/loader'
import CancelModal from '../../../components/cancelModal';
import BlockModal from '../../../components/blockModal';
import ReorderModal from '../../../components/reorderModal';
// placeholder image
const placeholder_image = require("../../../assets/user.png")
import _ from 'lodash'
import RNGooglePlaces from 'react-native-google-places';

import { order_types, buttons_customer, buttons_types } from '../../../constants/globals'

export default function OrderDetailUpdateCustomer(props) {
    const { item } = props.route.params
    const [data, setData] = useState(null)
    const user = useSelector(state => state.authenticate.user)

    const access_token = useSelector(state => state.authenticate.access_token)
    const [loading, setLoading] = React.useState(false)
    const [totalWorkingMinutes, setTotalWorkingMinutes] = React.useState(0)
    const [reason, setReason] = React.useState("")
    const [cancelModa, setCancelModal] = React.useState(false)
    const [blockModal, setBlockModal] = React.useState(false)
    const [cancelSearchModal, setCancelSearcHModal] = React.useState(false)
    const [virtualdata, setVirtualData] = React.useState({})
    const [reorderModal, setReorderModal] = React.useState(false)

    const [cancelOrderText, setCancelOrderText] = React.useState("Remaining cancellation requests: 10")
    const [textShowWithRed, settextShowWithRed] = React.useState("")
    const [fromCoordinates, setFromCoordinates] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
    })

    const [toCoordinates, setToCoordinates] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
    })

    React.useEffect(() => {
        console.log("Data", JSON.stringify(data))
        if (data?.id) {
            if (data.order_from_lat && data.order_from_long) {
                setToCoordinates({
                    latitude: data.order_from_lat,
                    longitude: data.order_from_long,
                })
            } else if (data.order_to_lat && data.order_to_long) {
                setToCoordinates({
                    latitude: data.order_to_lat,
                    longitude: data.order_to_long,
                })
            }
        }
    }, [data])

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
                if (response.status == true) {
                    if (response.data) {
                        setData(response.data)
                        console.log("Order Detail", JSON.stringify(response.data))
                        setVirtualData(response.data.virtual_order)
                    } else {

                    }
                    if (response.totalSettingData) {
                        let key_value = response.totalSettingData.find(x => x.key == "cancel_order_by_customer")
                        if (key_value) {
                            setCancelOrderText(`Remaining cancellation requests: ${key_value.value}.`)
                            if (response.totalUserAction) {
                                let filteredValues = response.totalUserAction.filter(x => x.key == "cancel_order_by_customer")
                                if (filteredValues.length > 0) {
                                    let total_remains = Number(key_value.value) - Number(filteredValues[0].no_of_action)
                                    setCancelOrderText(`Remaining cancellation requests: ${total_remains}`)
                                }
                            }
                        }
                    }
                } else {
                    showToast(response.message)
                }
            }).catch(err => {
            }).finally(() => {
                setLoading(false)
            })
    }

    const blockUser = async () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let user_data = {
            "provider_id": data?.provider_id,
        }

        let config = {
            headers: headers,
            data: JSON.stringify(user_data),
            endPoint: "/api/blockProvider",
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                console.log(response)
                if (response.status == true) {
                    showToast(response.message)
                    getOrderDetail(item.id)
                    setLoading(false)
                }
                else {
                    showToast(response.message)
                    setLoading(false)
                }
            }).catch(err => {
            }).finally(() => {
                setLoading(false)
            })
    }

    const unBlockUser = async () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let user_data = {
            "provider_id": data?.provider_id
        }

        let config = {
            headers: headers,
            data: JSON.stringify(user_data),
            endPoint: "/api/unBlockProvider",
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                console.log(response)
                if (response.status == true) {
                    showToast(response.message)
                    // props.navigation.pop()
                    getOrderDetail(item.id)
                    setLoading(false)
                }
                else {
                    showToast(response.message)
                    setLoading(false)
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
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    showToast(response.message)
                    if (cancelSearchModal) {
                        setCancelSearcHModal(false)
                        props.navigation.navigate("MechanicLocation", {
                            servicedata: data?.order_items?.map(x => ({ item_id: x.item_id, products: x.product.map(y => y.product_id) })),
                            subService: {
                                name: data?.order_items[0]?.services_name ?? data?.order_items[0]?.parent_services_name,
                                image: data?.order_items[0]?.services_image ?? data?.order_items[0]?.parent_services_image,
                                location_type: data?.order_items[0]?.services_location_type ?? 0
                            },
                            extraData: [],
                            orderData: data
                        })
                    } else {
                        props.navigation.pop()
                    }

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
        if (item.id) {
            getOrderDetail(item.id)
        }
    }, [item])

    useFocusEffect(React.useCallback(() => {
        getOrderDetail(item.id)
        getLocationPermission()
    }, []))

    const getLocationPermission = async () => {
        let hasLocationPermission = false
        if (Platform.OS == "ios") {
            Geolocation.requestAuthorization('always').then((res) => {
                if (res == "granted") {
                    hasLocationPermission = true
                    getCurrentLocation(hasLocationPermission)
                } else {
                    hasLocationPermission = false
                    getCurrentLocation(hasLocationPermission)
                }
            })
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Lifesuite Location Permission",
                        message:
                            "Lifesuite needs to access your location ",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    hasLocationPermission = true
                    getCurrentLocation(hasLocationPermission)
                } else {
                    hasLocationPermission = false
                    getCurrentLocation(hasLocationPermission)
                }
            } catch (err) {
                console.warn(err);
            }
        }
    }

    const searchAgain = () => {
        props.navigation.navigate("MechanicLocation", {
            servicedata: data?.order_items?.map(x => ({ item_id: x.item_id, products: x.product.map(y => y.product_id) })),
            subService: {
                name: data?.order_items[0]?.services_name ?? data?.order_items[0]?.parent_services_name,
                image: data?.order_items[0]?.services_image ?? data?.order_items[0]?.parent_services_image,
                location_type: data?.order_items[0]?.services_location_type ?? 0
            },
            extraData: [],
            orderData: data
        })
    }
    const gotToForReorder = () => {
        props.navigation.navigate("MechanicLocation", {
            servicedata: data?.order_items?.map(x => ({ item_id: x.item_id, products: x.product.map(y => y.product_id) })),
            subService: {
                name: data?.order_items[0]?.services_name ?? data?.order_items[0]?.parent_services_name,
                image: data?.order_items[0]?.services_image ?? data?.order_items[0]?.parent_services_image,
                location_type: data?.order_items[0]?.services_location_type ?? 0
            },
            reorder: true,
            extraData: [],
            orderData: data
        })
    }
    const getCurrentPlace = () => {
        RNGooglePlaces.getCurrentPlace(['placeID', 'location', 'name', 'address'])
            .then((results) => {
                setFromAddress(results[0].address)
                setFromCoordinates({ ...fromCoordinates, latitude: results[0].location.latitude, longitude: results[0].location.longitude })

            })
            .catch((error) => console.log(error.message));
    }

    const getCurrentLocation = (hasLocationPermission) => {
        if (hasLocationPermission) {
            Geolocation.getCurrentPosition(
                (position) => {
                    getCurrentPlace()
                },
                (error) => {
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        } else {
            showToast("Location permission not granted")
        }
    }
    const reOrder = async (start_time, end_time) => {
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
                order_start_time: start_time, //"2021-10-07 10:00:00",
                order_end_time: end_time // "2021-11-07 12:00:00"
            }),
            endPoint: "/api/reorderCreate",
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    showToast(response.message)

                    props.navigation.pop()


                } else {
                    console.log("Error", response)
                    showToast(response.message)
                }
            }).catch(err => {

            }).finally(() => {
                setLoading(false)

            })
    }

    const getReasonForCancellationText = () => {
        let x = data?.order_logs?.filter(x => (x.order_status == order_types.cancel || x.order_status == order_types.suspend || x.order_status == order_types.delay_request_reject || x.order_status == order_types.declined))
        let d = x?.filter(x => x.reason_description != null && x.reason_description != "")
        if (d?.length > 0) {
            return d[d.length - 1].reason_description
        }
        return null
    }

    return (
        <View style={{ flex: 1, backgroundColor: LS_COLORS.global.white }}>
            <StatusBar translucent backgroundColor={"transparent"} barStyle="light-content" />
            {/* header start */}
            <View style={{ width: '100%', height: '20%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: "hidden" }}>
                <ImageBackground
                    resizeMode="cover"
                    source={{ uri: BASE_URL + data?.order_items[0]?.services_image ?? data?.order_items[0]?.parent_services_image }}
                    style={[styles.image]}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                            <View style={{ height: "100%", justifyContent: 'center' }}>
                                <Header
                                    imageUrl={require("../../../assets/backWhite.png")}
                                    action={() => {
                                        props.navigation.goBack()
                                    }}
                                    title={data?.order_items && (data?.order_items[0]?.services_name ?? data?.order_items[0]?.parent_services_name)}
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
                    <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
                        <Text style={[styles.client_info_text]}>Order Detail</Text>
                        <CardClientInfo virtual_data={virtualdata} settextShowWithRed={settextShowWithRed} data={data} setTotalWorkingMinutes={setTotalWorkingMinutes} />
                        {getReasonForCancellationText() && <Text style={[styles.baseTextStyle, { fontSize: 13, fontFamily: LS_FONTS.PoppinsRegular, marginTop: 10 ,marginHorizontal:20}]}><Text style={{color:"red"}}>Reason</Text>: {getReasonForCancellationText()}</Text>}
                        <RenderAddressFromTO
                            fromShow={data?.order_items[0]?.services_location_type == 2}
                            toShow={(data?.order_items[0]?.services_location_type == 2 || data?.order_items[0]?.services_location_type == 1)}
                            currentAddress={fromCoordinates}
                            addresses={{
                                from: data?.order_from_address, //from address
                                to: data?.order_placed_address, //to address
                                fromCoordinates: { latitude: Number(data?.order_from_lat), longitude: Number(data?.order_from_long) }, //from in lat && long
                                toCoordinates: { latitude: Number(data?.order_placed_lat), longitude: Number(data?.order_placed_long) } //to in lat && long
                            }}
                        />
                        {data?.order_status == order_types.will_be_delayed &&
                            <><View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 10 }}>
                                <Text style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium }]}>Job has been delayed </Text>
                                <Text style={[styles.baseTextStyle, { color: LS_COLORS.global.green }]}>~{moment(data?.order_start_new_time).diff(moment(data?.order_start_time), "minutes")} minutes</Text>
                            </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 10 }}>
                                    <Text style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium }]}>Est. Old Start Time </Text>
                                    <Text style={[styles.baseTextStyle, { color: LS_COLORS.global.green }]}>{moment(data?.order_start_time).format("hh:mm a")}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 10 }}>
                                    <Text style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium }]}>Est. New Start Time</Text>
                                    <Text style={[styles.baseTextStyle, { color: LS_COLORS.global.green }]}>{moment(data?.order_start_new_time).format("hh:mm a")}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 10 }}>
                                    <Text style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium }]}>Est. New End Time</Text>
                                    <Text style={[styles.baseTextStyle, { color: LS_COLORS.global.green }]}>{moment(data?.order_end_new_time).format("hh:mm a")}</Text>
                                </View>
                            </>
                        }
                        {/* <TextReasonForCancel data= /> */}
                        {textShowWithRed !== "" && <Text style={[styles.saveText, { color: "red", marginTop: 10 }]}>{textShowWithRed}</Text>}
                    </ScrollView>
                    {/* lowerButton */}
                    <GetButtons
                        data={data}
                        openCancelModal={() => setCancelModal(true)}
                        openCancelSearchModal={() => setCancelSearcHModal(true)}
                        searchAgain={() => searchAgain()}
                        gotToForReorder={() => gotToForReorder()}
                        submit={submit}
                        openReorderModal={() => setReorderModal(true)}
                        openBlockModal={() => setBlockModal(true)}
                    />
                </View>
            </SafeAreaView >
            <CancelModal
                title={cancelOrderText}
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
                        submit(order_types.cancel)
                    }
                }}
            />
            <CancelModal
                title={cancelOrderText}
                visible={cancelSearchModal}
                value={reason}
                // pressHandler={()=>setCancelModal(false)}
                onChangeText={(t) => { setReason(t) }}
                action1={() => {
                    setCancelSearcHModal(false)

                }}
                action={() => {
                    if (reason.trim() == "") {
                        showToast("Reason cannot be empty!")
                    }
                    else {
                        submit(order_types.cancel)
                        // goto before provider listing screen

                    }
                }}
            />
            <BlockModal
                title={`Do you want to ${data?.blocked_to_user ? "un" : ""}block this user?`}
                visible={blockModal}
                onPressYes={() => {
                    if (data.blocked_to_user) {
                        unBlockUser()
                    } else {
                        blockUser()
                    }

                }}
                setVisible={setBlockModal}
            />
            <ReorderModal
                title={`Reorder`}
                visible={reorderModal}
                onPressYes={(start_time, end_time) => {
                    reOrder(start_time, end_time)
                }}
                setVisible={setReorderModal}
            />
            {loading && <Loader />}
        </View>
    )
}


//items && virtual order items manage screens
const CardClientInfo = ({ data, virtual_data, setTotalWorkingMinutes, settextShowWithRed }) => {
    const [country, setCountry] = useState("")
    const [items, setItems] = useState([])
    const [virtualOrdersItems, setVirtualOrdersItems] = React.useState([])
    const [totalTime, setTotalTime] = React.useState(0)
    const [totalVirtualTime, setTotalVirtualTime] = React.useState(0)
    const [showVirtualData, setShowVirtualData] = React.useState(false)

    useEffect(() => {
        if (showVirtualData) {
            if (totalTime && totalVirtualTime) {
                if (totalTime < totalVirtualTime) {
                    settextShowWithRed(`Adding new service requires ${totalVirtualTime - totalTime} min extra`)
                } else if (totalTime > totalVirtualTime) {
                    // settextShowWithRed(`New updated order requires ${totalTime - totalVirtualTime} min less.`)
                } else if (totalTime === totalVirtualTime) {
                    // settextShowWithRed(`New updated order require ${totalVirtualTime} min`)

                }
            }
        } else {
            settextShowWithRed(``)
        }
    }, [totalVirtualTime, totalTime])

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
        }
    }, [virtualOrdersItems])

    useEffect(() => {
        console.log("items", JSON.stringify(items))
        if (items.length > 0) {
            let t = items.map(x => x.duration_time).filter(x => x)
            let total = t.reduce((a, b) => a + Number(b), 0)
            setTotalTime(total)
            setTotalWorkingMinutes(total)
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

    const getTotalVirtualAmount = (dtype, amount, totalAmount) => {
        if (amount && amount !== "" && amount != 0) {
            let totalAmount1 = totalAmount
            if (dtype == "flat") {
                totalAmount1 = totalAmount - amount
            } else if (dtype == "per") {
                totalAmount1 = totalAmount - (amount * 100 / totalAmount)
            }
            return totalAmount1
        } else {
            return totalAmount
        }
    }

    const checkforDiscountToShow = (discount_amount, show) => {
        if (show && discount_amount && discount_amount != 0) {
            return true
        } else {
            return false
        }
    }
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
            {checkforDiscountToShow(showVirtualData, virtual_data?.discount_amount) && <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text style={styles.greenTextStyle}>Discount</Text>
                <Text style={styles.greenTextStyle}>{virtual_data?.discount_type == "flat" ? `$${virtual_data?.discount_amount}` : `${virtual_data?.discount_amount}%`}</Text>
            </View>}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text style={styles.greenTextStyle}>Total Amount</Text>
                <Text style={styles.greenTextStyle}>${showVirtualData ? getTotalVirtualAmount(virtual_data?.discount_type, virtual_data?.discount_amount, virtual_data?.order_total_price) : data?.order_total_price}</Text>
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


const RenderAddressFromTO = ({ addresses, currentAddress, fromShow, toShow }) => {
    const navigation = useNavigation()
    return (
        <View style={{ marginHorizontal: 20, marginTop: 0 }}>
            {fromShow &&
                <>
                    <Text style={[styles.baseTextStyle, { marginBottom: 8 }]}>Requested From</Text>
                    <TouchableOpacity
                        onPress={() => {
                            // navigation.navigate('MapScreen', { onConfirm: () => { }, coords: addresses.fromCoordinates })
                            if (addresses.fromCoordinates?.latitude && addresses.fromCoordinates?.longitude) {
                                if (Platform.OS == "android") {
                                    Linking.openURL(`google.navigation:q=${addresses.fromCoordinates?.latitude}+${addresses.fromCoordinates?.longitude}`)
                                } else {
                                    Linking.openURL(`maps://app?saddr=${currentAddress.latitude}+${currentAddress.longitude}&daddr=${addresses.fromCoordinates?.latitude}+${addresses.fromCoordinates?.longitude}`)
                                }
                            }
                        }}
                        style={styles.fromContainer}>
                        <Text style={[styles.baseTextStyle, { flex: 1, fontSize: 14 }]} numberOfLines={1}>{addresses?.from}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                // navigation.navigate('MapScreen', { onConfirm: () => { }, coords: addresses.fromCoordinates })
                                if (addresses.fromCoordinates?.latitude && addresses.fromCoordinates?.longitude) {
                                    if (Platform.OS == "android") {
                                        Linking.openURL(`google.navigation:q=${addresses.fromCoordinates?.latitude}+${addresses.fromCoordinates?.longitude}`)
                                    } else {
                                        Linking.openURL(`maps://app?saddr=${currentAddress.latitude}+${currentAddress.longitude}&daddr=${addresses.fromCoordinates?.latitude}+${addresses.fromCoordinates?.longitude}`)
                                    }
                                }
                            }}
                            style={{ height: 20, width: 40 }}
                            activeOpacity={0.7}>
                            <Image
                                style={{ flex: 1, resizeMode: "contain" }}
                                source={require("../../../assets/location.png")}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </>
            }
            {toShow &&
                <>
                    <Text style={[styles.baseTextStyle, { marginTop: 16, marginBottom: 8 }]}>Requested To</Text>
                    <TouchableOpacity
                        onPress={() => {
                            if (addresses.toCoordinates?.latitude && addresses.toCoordinates?.longitude) {
                                if (Platform.OS == "android") {
                                    Linking.openURL(`google.navigation:q=${addresses.toCoordinates?.latitude}+${addresses.toCoordinates?.longitude}`)
                                } else {
                                    Linking.openURL(`maps://app?saddr=${currentAddress.latitude}+${currentAddress.longitude}&daddr=${addresses.toCoordinates?.latitude}+${addresses.toCoordinates?.longitude}`)
                                }
                            }
                            // navigation.navigate('MapScreen', { onConfirm: () => { }, coords: addresses.toCoordinates })
                        }}
                        style={styles.fromContainer}>
                        <Text style={[styles.baseTextStyle, { flex: 1, fontSize: 14 }]} numberOfLines={1}>{addresses?.to}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                if (addresses.toCoordinates?.latitude && addresses.toCoordinates?.longitude) {
                                    if (Platform.OS == "android") {
                                        Linking.openURL(`google.navigation:q=${addresses.toCoordinates?.latitude}+${addresses.toCoordinates?.longitude}`)
                                    } else {
                                        Linking.openURL(`maps://app?saddr=${currentAddress.latitude}+${currentAddress.longitude}&daddr=${addresses.toCoordinates?.latitude}+${addresses.toCoordinates?.longitude}`)
                                    }
                                }
                                // navigation.navigate('MapScreen', { onConfirm: () => { }, coords: addresses.toCoordinates })
                            }}
                            style={{ height: 20, width: 40 }}
                            activeOpacity={0.7}>
                            <Image
                                style={{ flex: 1, resizeMode: "contain" }}
                                source={require("../../../assets/location.png")}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </>
            }
        </View>
    )
}

const GetButtons = ({ data, openCancelModal, openCancelSearchModal, submit, openBlockModal, searchAgain, openReorderModal, gotToForReorder }) => {
    const [buttons, setButtons] = React.useState([])
    console.log(JSON.stringify(data), "data")
    const navigation = useNavigation()
    React.useEffect(() => {
        console.log(buttons)
    }, [buttons])

    React.useEffect(() => {
        if (data && data.order_status) {
            for (let type of Object.values(order_types)) {
                if (data.order_status == type) {
                    switch (type) {
                        case order_types.update_acceptance:
                            setButtons(buttons_customer[`${order_types.update_acceptance},${data?.is_in_progress > 0 ? order_types.processing : order_types.confirmed}`])
                            break
                        case order_types.update_accepted:
                            setButtons(buttons_customer[`${order_types.update_accepted},${data?.is_in_progress > 0 ? order_types.processing : order_types.confirmed}`])
                            break
                        case order_types.update_reject:
                            setButtons(buttons_customer[`${order_types.update_reject},${data?.is_in_progress > 0 ? order_types.processing : order_types.confirmed}`])
                            break
                        default:
                            setButtons(buttons_customer[type])
                    }
                    break
                }
            }
        }
    }, [data])

    const pressHandler = (type) => {
        switch (type) {
            case buttons_types.cancel:
                openCancelModal()
                break
            case buttons_types['cancel&search']:
                openCancelSearchModal()
                break
            case buttons_types.chat:
                navigation.navigate("ChatScreen", {
                    item: {
                        id: data.provider_id,
                        email: data.providers_email,
                        first_name: data.providers_first_name,
                        last_name: data.providers_last_name,
                        phone_number: data.providers_phone_number,
                        profile_image: data.providers_profile_image
                    }
                })
                break
            case buttons_types.block:
                openBlockModal()
                break
            case buttons_types.accept:
                submit(order_types.update_accepted)
                break
            case buttons_types.reject:
                submit(order_types.update_reject)
                break
            case buttons_types.delay_accept:
                submit(order_types.delay_request_accept)
                break
            case buttons_types.decline:
                submit(order_types.delay_request_reject)
                break
            case buttons_types.suspend:
                navigation.navigate("OrderSuspend", { item: data })
                break
            case buttons_types.search_again:
                searchAgain()
                break
            case buttons_types.reorder:
                gotToForReorder()
                break
            case buttons_types.pay:
                navigation.navigate("FinishPay", { item: data,submit:submit.bind(this) })
                break
            // case buttons_types.accept:

        }
    }

    return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly" }}>
            {buttons.map(x => {
                let title = x.title
                if (x.type == buttons_types.block && data.blocked_to_user) {
                    title = "Unblock"
                }
                return (
                    <TouchableOpacity
                        onPress={() => pressHandler(x.type)}
                        style={[styles.save, { marginTop: 0, marginBottom: 10 }]}>
                        <Text style={styles.saveText}>{title}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
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





