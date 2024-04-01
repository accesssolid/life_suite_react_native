// #liahs
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, PermissionsAndroid, TouchableOpacity, Dimensions, ScrollView, Image, Linking, Pressable, Alert } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import Geolocation from 'react-native-geolocation-service';

/* Packages */
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Avatar } from 'react-native-elements'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
/* Components */;
import Header from '../../../components/header';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { BASE_URL, getApi } from '../../../api/api';
import { showToast } from '../../../components/validators';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Loader from '../../../components/loader'
import CancelModal from '../../../components/cancelModal';
import BlockModal from '../../../components/blockModal';
import ReorderModal from '../../../components/reorderModal';
// placeholder image
const placeholder_image = require("../../../assets/user.png")
import _ from 'lodash'
import RNGooglePlaces from 'react-native-google-places';
import { Rating } from 'react-native-ratings';
import { order_types, buttons_customer, buttons_types } from '../../../constants/globals'
import * as RNLocalize from "react-native-localize";
import Entypo from 'react-native-vector-icons/Entypo'
import RateAndCommentModal from '../../../components/RateAndComment';
import { updateBlockModal } from '../../../redux/features/blockModel'
import BlockMessageModal from '../../../components/BlockMessageModal'
import messaging from '@react-native-firebase/messaging';
import { setVariantData } from '../../../redux/features/variantData';
import lodash from 'lodash'
import { setFavList } from '../../../redux/features/favorites';
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

export default function OrderDetailUpdateCustomer(props) {
    let { item, order_id } = props.route.params
    const [data, setData] = useState(null)
    const user = useSelector(state => state.authenticate.user)
    const dispatch = useDispatch()
    const access_token = useSelector(state => state.authenticate.access_token)
    const [loading, setLoading] = React.useState(false)
    const [totalWorkingMinutes, setTotalWorkingMinutes] = React.useState(0)
    const [reason, setReason] = React.useState("")
    const [cancelModa, setCancelModal] = React.useState(false)
    const [blockModal, setBlockModal] = React.useState(false)
    const [cancelSearchModal, setCancelSearcHModal] = React.useState(false)
    const [virtualdata, setVirtualData] = React.useState({})
    const [reorderModal, setReorderModal] = React.useState(false)
    const [fromAddress, setFromAddress] = useState("")
    const [itemData, setItemData] = React.useState({})
    const [cancelOrderText, setCancelOrderText] = React.useState("Remaining cancellation requests: 10")
    const [textShowWithRed, settextShowWithRed] = React.useState("")
    const [rateVisible, setRateVisible] = React.useState(false)
    const [totalSettingData, settotalSettingData] = React.useState([])
    const [tbdTime,setTbdTime]=React.useState(false)

    const [fromCoordinates, setFromCoordinates] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
    })
    const [cancelRanges, setCancelRanges] = React.useState([])
    const [toCoordinates, setToCoordinates] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
    })
    const [notificationData, setNotificationData] = React.useState({
        title: "",
        color: "white"
    })

    const [whoCancelled, setWhoCancelled] = React.useState({})
    const [order_variant, setOrderVariant] = React.useState({})
   
    React.useEffect(() => {
        if (data?.order_logs?.length > 0) {
            let logs = [...data?.order_logs]
            logs.reverse()
            let d = logs.find(x => x.order_status == data?.order_status)
            if (d && [2, 14, 16, 13, 17].includes(data?.order_status)) {
                // setWhoCancelled()
                if (d.status_change_by_role == 2) {
                    setWhoCancelled({ type: "Customer", name: `${data?.customers_first_name} ${data?.customers_last_name}` })
                } if (d.status_change_by_role == 3) {
                    setWhoCancelled({ type: "Provider", name: `${data?.providers_first_name} ${data?.providers_last_name}` })
                }
            }


        }
        checkOrderVariant()
    }, [data])
    const checkOrderVariant = () => {
        try {
            let variant = JSON.parse(data?.ordered_variant)

            setOrderVariant(variant)
        } catch (err) {
            console.log(err)
        } finally {

        }
    }
    useFocusEffect(React.useCallback(() => {
        let unsubscribe = messaging().onMessage((remoteMessage) => {
            if (remoteMessage?.data?.link) {
                getOrderDetail(itemData?.id)
            }
        })
        return unsubscribe
    }, [itemData]))
    useEffect(() => {
        if (item?.id) {
            setItemData(item)
        }
        if (order_id >= 0) {
            let item1 = { id: order_id }
            setItemData(item1)
        }
    }, [order_id, item])

    React.useEffect(() => {
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
            for (let c of notification_color) {
                if (c.ids.includes(data.order_status)) {
                    if (data?.is_in_progress > 0 && c.title == "Upcoming") {
                        setNotificationData({
                            title: "InProgress",
                            ids: [7, 15],
                            color: "#fdca0d"
                        })
                    } else {
                        setNotificationData(c)
                    }
                    break
                }
            }
        }
    }, [data])
    React.useEffect(() => {
        if (data) {
            // props.navigation.navigate("OrderSuspend", { item: data })
        }

    }, [data])

    const getOrderDetail = (order_id, showLoading = true) => {
        if (showLoading) {
            setLoading(true)
        }

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
                    console.log("Response",response.data)
                    if (response.data) {
                        setData(response.data)
                        setVirtualData(response.data.virtual_order)
                    } else {

                    }
                    if (response.cancel_charge_ranges) {
                        setCancelRanges(response.cancel_charge_ranges.filter(x => x.status == "1"))
                    }
                    if (response.totalSettingData) {
                        let key_value = response.totalSettingData.find(x => x.key == "cancel_order_by_customer")
                        if (key_value && key_value?.status == "1") {
                            setCancelOrderText(`Remaining cancellation requests: ${key_value.value}.`)
                            if (response.totalUserAction) {
                                let filteredValues = response.totalUserAction.filter(x => x.key == "cancel_order_by_customer")
                                if (filteredValues.length > 0) {
                                    let total_remains = Number(key_value.value) - Number(filteredValues[0].no_of_action)
                                    setCancelOrderText(`Remaining cancellation requests: ${total_remains}`)
                                }
                            }
                        } else {
                            setCancelOrderText(``)
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
                if (response.status == true) {
                    showToast(response.message)
                    getOrderDetail(itemData?.id)
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
                if (response.status == true) {
                    showToast(response.message)
                    // props.navigation.pop()
                    getOrderDetail(itemData?.id)
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
        let datac = {
            order_id: data.id,
            order_status: order_status,
            reason: reason
        }
        if(order_status==order_types.delay_request_reject){
            datac.reason="Delay not Accepted"
        }
        // if(order_status==order_types.processing||order_status==order_types.completed){
        //     datac[`current_date`] = moment().format("YYYY-MM-DD HH:mm:[00]")
        // }
        let config = {
            headers: headers,
            data: JSON.stringify(datac),
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
                            serviceData: data?.order_items?.map(x => ({ item_id: x.item_id, products: x.product.map(y => y.product_id) })),
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
                    showToast(response.message)
                }
            }).catch(err => {

            }).finally(() => {
                setLoading(false)

            })
    }
    const handleUpdateAddRate = (id, dat) => {
        if (dat?.rating == "0" || dat?.rating == "" || dat?.rating == 0) {
            setTimeout(() => {
                showToast("Please rate this job.")
            }, 200)

            return
        }
        setRateVisible(false)
        setLoading(true)
        let headers = {
            "Authorization": `Bearer ${access_token}`
        }
        const body = new FormData()
        if (id || id > 0) {
            body.append("rating_id", id)
        } else {
            body.append("order_id", data.id)
        }
        body.append("rating", dat.rating)
        body.append("comment", dat.comment)

        let config = {
            headers: headers,
            data: body,
            endPoint: id || id > 0 ? "/api/customerEditRating" : "/api/customerAddRating",
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    showToast(response.message)
                } else {
                    showToast(response.message)
                }
            }).catch(err => {

            }).finally(() => {
                setLoading(false)
                getOrderDetail(itemData?.id, false)
            })
    }

    const handleDeleteRate = (id) => {
        setLoading(true)
        let headers = {
            "Authorization": `Bearer ${access_token}`
        }
        const body = new FormData()
        body.append("rating_id", id)
        let config = {
            headers: headers,
            data: body,
            endPoint: "/api/customerRatingDelete",
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    showToast(response.message)
                } else {
                    showToast(response.message)
                }
            }).catch(err => {

            }).finally(() => {
                setLoading(false)
                getOrderDetail(itemData?.id, false)

            })
    }

    useEffect(() => {
        if (itemData?.id) {
            getOrderDetail(itemData?.id)
        }
    }, [itemData])

    useFocusEffect(React.useCallback(() => {
        if (itemData?.id) {
            getOrderDetail(itemData?.id)
        }

        getLocationPermission()
    }, [itemData]))

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
        if (user?.user_status == 1) {
            dispatch(setVariantData(order_variant))
            props.navigation.navigate("MechanicLocation", {
                serviceData: data?.order_items?.map(x => ({ item_id: x.item_id, products: x.product.map(y => y.product_id) })),
                subService: {
                    name: data?.order_items[0]?.services_name ?? data?.order_items[0]?.parent_services_name,
                    image: data?.order_items[0]?.services_image ?? data?.order_items[0]?.parent_services_image,
                    location_type: data?.order_items[0]?.services_location_type ?? 0
                },
                extraData: [],
                orderData: data
            })
        } else {
            dispatch(updateBlockModal(true))
        }
    }
    const [showMessage, setShowMessage] = React.useState(false)
    const [showMessage1, setShowMessage1] = React.useState(false)
    const gotToForReorder = () => {
        if (user?.user_status == 1 && data?.providers_user_status == 1 && data?.provider_provide_service > 0) {
            dispatch(setVariantData(order_variant))
            props.navigation.navigate("MechanicLocation", {
                serviceData: data?.order_items?.map(x => ({ item_id: x.item_id, products: x.product.map(y => y.product_id) })),
                subService: {
                    name: data?.order_items[0]?.services_name ?? data?.order_items[0]?.parent_services_name,
                    image: data?.order_items[0]?.services_image ?? data?.order_items[0]?.parent_services_image,
                    location_type: data?.order_items[0]?.services_location_type ?? 0
                },
                reorder: true,
                extraData: [],
                orderData: data
            })
        } else {
            if (user?.user_status != 1) {
                dispatch(updateBlockModal(true))
            } else if (data?.providers_user_status != 1) {
                setShowMessage(true)
            } else if (data?.provider_provide_service == 0) {
                setShowMessage1(true)
            }

        }

    }
    const getCurrentPlace = () => {
        setTimeout(() => {
            RNGooglePlaces.getCurrentPlace(['placeID', 'location', 'name', 'address'])
            .then((results) => {
                console.log(results,'res')
                setFromAddress(results[0].address)
                setFromCoordinates({ ...fromCoordinates, latitude: results[0].location.latitude, longitude: results[0].location.longitude })

            })
            .catch((error) => console.log(error.message));
        }, 0);
     
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
                order_end_time: end_time, // "2021-11-07 12:00:00",
                "timezone": RNLocalize.getTimeZone()

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
                    showToast(response.message)
                }
            }).catch(err => {

            }).finally(() => {
                setLoading(false)

            })
    }

    const getReasonForCancellationText = () => {
        let x = data?.order_logs?.filter(x => (x.order_status == order_types.cancel || x.order_status == order_types.expired || x.order_status == order_types.suspend || x.order_status == order_types.delay_request_reject || x.order_status == order_types.declined))
        let d = x?.filter(x => x.reason_description != null && x.reason_description != "")
        if (d?.length > 0) {
            return d[d.length - 1].reason_description
        }
        return null
    }

    const getCancellationText = () => {
        const order_start_time = moment(data?.order_start_time)
        const time = moment().diff(order_start_time, "minutes")
        let text = ""
        for (let d of cancelRanges) {
            if (d.start_minutes < time && time >= d.end_minutes) {
                text = `You will be charged a $${d?.percentage}% or ${Number(d?.percentage) * Number(data?.order_total_price) / 100} whichever is more than if within 24 hours. `
                break
            }
        }
        // if(time<=5){
        //     return text
        // }if(time>5 && time<=10)
        return text
    }
    const [rateType, setRateType] = React.useState("rate")
    const [is_fav,setIsFav]=React.useState(false)
    const like = () => {
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
            data: JSON.stringify({ ...user_data }),
            endPoint: '/api/favouriteProviderAdd',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setIsFav(!is_fav)
                }
                else {
                }

            }).catch(err => {
                console.log("error", err)
            }).finally(() => {
                setLoading(true)
                getFavProvider()
            })
    }
    const favs = useSelector(state => state.favorites)?.list
    
    useEffect(() => {
        if(favs.map(x=>x.id)?.includes(data?.provider_id)){
            setIsFav(true)
        }

    }, [favs,data])
 
    useEffect(()=>{
        getFavProvider()
    },[])
    const getFavProvider = () => {
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            endPoint: '/api/favouriteProviders',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    dispatch(setFavList([...response.data]))
                }   
                else {
                    dispatch(setFavList([]))
                }
            }).catch(err => {
            }).finally(()=>{
                setLoading(false)
            })
    }
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
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, alignItems: "center" }}>
                            <Text maxFontSizeMultiplier={1.5} style={[styles.client_info_text, { textAlign: "left" }]}>Order Detail</Text>
                            <Text maxFontSizeMultiplier={1.3} style={[styles.baseTextStyle, { fontSize: 12, textTransform: "none", flex: 1, textAlign: "right" }]}>Order Status: {notificationData?.title}</Text>
                        </View>
                        {data?.order_status == 15 && <Text maxFontSizeMultiplier={1.3} style={[styles.baseTextStyle, { fontSize: 12, marginHorizontal: 20, textTransform: "none", flex: 1, textAlign: "right" }]}>(Payment Pending)</Text>}
                        <CardClientInfo tbdTime={tbdTime} notificationData={notificationData} setTbdTime={setTbdTime} order_variant={order_variant} orderType={notificationData.title} noti_color={notificationData.color} handleClickOnEdit={(v, t) => {
                            setRateType(t)
                            setRateVisible(true)
                        }} virtual_data={virtualdata} settextShowWithRed={settextShowWithRed} data={data} setTotalWorkingMinutes={setTotalWorkingMinutes} />
                        {getReasonForCancellationText() && <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { fontSize: 13, fontFamily: LS_FONTS.PoppinsRegular, marginTop: 10, marginHorizontal: 20 }]}><Text style={{ color: "red" }}>Reason:</Text> {getReasonForCancellationText()}</Text>}
                        {whoCancelled?.type != undefined && <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { fontSize: 13, fontFamily: LS_FONTS.PoppinsRegular, marginTop: 10, marginHorizontal: 20 }]}><Text maxFontSizeMultiplier={1.5} style={{ color: "red" }}>Cancelled By:</Text> {whoCancelled?.type} ({whoCancelled?.name})</Text>}

                        <RenderAddressFromTO
                            service_is_at_address={data?.service_is_at_address}
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
                                <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium }]}>Job has been delayed </Text>
                                <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { color: LS_COLORS.global.green }]}>~{moment(data?.order_start_new_time).diff(moment(data?.order_start_time), "minutes")} minutes</Text>
                            </View>
                            </>
                        }

                        {/* <TextReasonForCancel data= /> */}
                        {textShowWithRed !== "" && <Text maxFontSizeMultiplier={1.5} style={[styles.saveText, { color: "red", marginTop: 10 }]}>{textShowWithRed}</Text>}
                        <TouchableOpacity
                        onPress={() => {
                            like()
                        }}
                        style={[styles.save, { marginTop: 10,width:"90%"}]}>
                        <Text maxFontSizeMultiplier={1.5} style={styles.saveText}>{is_fav?"Remove Provider from Favorites":"Add Provider to Favorites"}</Text>
                    </TouchableOpacity>
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
                subCancelText={getCancellationText()}
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
                subCancelText={getCancellationText()}
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
            <RateAndCommentModal
                visible={rateVisible}
                setVisible={setRateVisible}
                data={data?.provider_rating_data}
                handleAddUpdate={handleUpdateAddRate}
                handleDelete={handleDeleteRate}
            />
            <BlockMessageModal />
            <BlockMessageModal visible={showMessage1} setVisble={setShowMessage1} text={`Provider is no longer providing this Service.`} />
            <BlockMessageModal visible={showMessage} setVisble={setShowMessage} text={`This service provider account is ${data?.providers_user_status == 2 ? "inactive" : "blocked"}. Please look for some another provider for getting service`} />
            {loading && <Loader />}
        </View>
    )
}


//items && virtual order items manage screens
const CardClientInfo = ({ data, order_variant, orderType,notificationData, noti_color, virtual_data,tbdTime,setTbdTime, setTotalWorkingMinutes, settextShowWithRed, handleClickOnEdit }) => {
    const [country, setCountry] = useState("")
    const [items, setItems] = useState([])
    const [virtualOrdersItems, setVirtualOrdersItems] = React.useState([])
    const [totalTime, setTotalTime] = React.useState(0)
    const [totalVirtualTime, setTotalVirtualTime] = React.useState(0)
    const [showVirtualData, setShowVirtualData] = React.useState(false)
    const navigation = useNavigation()
    useEffect(() => {
        if (showVirtualData) {
            if (totalTime>=0 && totalVirtualTime>=0) {
                if (totalTime < totalVirtualTime) {
                    settextShowWithRed(`Updating order requires ${getTimeInHours(totalVirtualTime - totalTime,false)} extra`)
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
        } else {
            setVirtualOrdersItems([])
        }
    }, [virtual_data])

    useEffect(() => {
        if (virtualOrdersItems.length > 0) {
            let t = virtualOrdersItems.map(x => x.duration_time).filter(x => x)
            let total = t.reduce((a, b) => a + Number(b), 0)
            setTotalVirtualTime(total)
        } else {
            setTotalVirtualTime(0)

        }
    }, [virtualOrdersItems])

    useEffect(() => {
        if (items.length > 0) {
            let t = items.map(x => x.duration_time).filter(x => x)
            let total = t.reduce((a, b) => a + Number(b), 0)
            setTotalTime(total)
            setTotalWorkingMinutes(total)
        }
    }, [items])
    useEffect(()=>{
        let showTBD=true
        for(let i of items){
            if(i?.duration_time!=""){
                showTBD=false
            }
        }
        if(showVirtualData){
            showTBD=true
            for(let i of virtualOrdersItems){
                if(i?.duration_time!=""){
                    showTBD=false
                }
            }
        }
        console.log("ITEMS",virtualOrdersItems)
        setTbdTime(showTBD)
    },[items,virtualOrdersItems,showVirtualData])
    useEffect(() => {
        if (data) {
            if (data.order_placed_address) {
                let d = data.order_placed_address.split(",")
                let c = d[d.length - 1]
                setCountry(c)
            }

            if (data.order_status == order_types.update_acceptance) {
                setShowVirtualData(true)
            } else {
                setShowVirtualData(false)
            }

            if (data.order_items) {
                console.log(data.order_items)
                setItems(data.order_items.filter(x => x.service_items_name))
            }
        }
    }, [data])

    const getTimeInHours = (minute,check=true) => {
        if(check&&(orderType=="Upcoming"&&data?.ordered_sub_services==12)||(orderType=="InProgress"&&data?.ordered_sub_services==12)){
            return "---"
        }
        let d = parseInt(minute / 60) + " Hr"
        if (minute % 60 !== 0) {
            d += ` ${parseInt(minute % 60)} Mins`
        }
        if(Number(minute)==0){
            if(check){
                return("--")
            }else{
                return "0 Mins"
            }
            
        }
        return `${d}`
    }

    const user = useSelector(state => state.authenticate.user)

    const getTotalVirtualAmount = (dtype, amount, totalAmount) => {
        if (amount && amount !== "" && amount != 0) {
            let totalAmount1 = Number(totalAmount)
            if (dtype == "flat") {
                totalAmount1 = totalAmount - Number(amount)
            } else if (dtype == "per") {
                totalAmount1 = totalAmount - (amount * totalAmount / 100)
            }
            let return_value = Number(totalAmount1) + Number(data?.provider_rating_data?.tip ?? 0)
            if (Number.isNaN(return_value)) {
                return "0.00"
            } else {
                return Number(return_value).toFixed(2)
            }
        } else {
            let return_value = Number(totalAmount) + Number(data?.provider_rating_data?.tip ?? 0)
            if (Number.isNaN(return_value)) {
                return "0.00"
            } else {
                return Number(return_value).toFixed(2)
            }
        }
    }

    const checkforDiscountToShow = (v_a, v_t, d_a, d_t, v_total, d_total) => {
        if (v_a && v_a !== "") {
            if (v_t == "flat") {
                return `$${Number(v_a).toFixed(2)}`
            } else {
                return `$${Number(v_a * v_total / 100).toFixed(2)}`
            }
        } else if (d_a && d_a !== "") {
            if (d_t == "flat") {
                return `$${Number(d_a).toFixed(2)}`
            } else {
                return `$${Number(d_a * d_total / 100).toFixed(2)}`
            }
        } else {
            return false
        }
    }
    // liahs
    const getDateTimeShow = () => {
        let provider_start_date = (Boolean(data?.provider_order_start_at) && data?.provider_order_start_at != "") ? data?.provider_order_start_at : data?.order_start_time
        let provider_end_date = (Boolean(data?.provider_order_end_at) && data?.provider_order_end_at != "") ? data?.provider_order_end_at : data?.order_end_time
        let showProviderStartTime = (Boolean(data?.provider_order_start_at) && data?.provider_order_start_at != "")
        let showProviderEndTime = (Boolean(data?.provider_order_end_at) && data?.provider_order_end_at != "")
        
        if (data?.order_status == order_types.will_be_delayed) {
            return ({
                start: "Estimated Start Date/Time",
                end: "Estimated End Date/Time",
                start_date: moment(data?.order_start_new_time).format("MM/DD/YYYY hh:mm a"),
                end_date:tbdTime?"TBD": moment(data?.order_end_new_time).format("MM/DD/YYYY hh:mm a"),
            })
        }
        else if (notificationData.title == "InProgress") {
            return ({
                start: "Start Date/Time",
                end: "Estimated End Date/Time",
                start_date: moment(provider_start_date, "YYYY-MM-DD HH:mm:[00]").format("MM/DD/YYYY hh:mm a"),
                end_date: tbdTime?"TBD":(showVirtualData?moment(provider_start_date, "YYYY-MM-DD HH:mm:[00]").add("minute",totalVirtualTime).format("MM/DD/YYYY hh:mm a"):moment(provider_start_date, "YYYY-MM-DD HH:mm:[00]").add("minute",totalTime).format("MM/DD/YYYY hh:mm a")),
            })
        } else if (data?.order_status == order_types.suspend) {
            return ({
                start: "Start Date/Time",
                end: "End Date/Time",
                start_date: showProviderStartTime ? moment(provider_start_date, "YYYY-MM-DD HH:mm:[00]").format("MM/DD/YYYY hh:mm a") : moment(data?.order_end_time).format("MM/DD/YYYY hh:mm a"),
                end_date: moment(data?.updated_at).format("MM/DD/YYYY hh:mm a")
            })
        } else if (notificationData?.title == "Upcoming" && data?.ordered_sub_services == 12) {
            return ({
                start: "Estimated Start Date/Time",
                end: "Estimated End Date/Time",
                start_date:showProviderStartTime?moment(provider_start_date, "YYYY-MM-DD HH:mm:[00]").format("MM/DD/YYYY hh:mm a") : moment(data?.order_start_time).format("MM/DD/YYYY hh:mm a"),
                end_date: tbdTime?"TBD":"---"
            })
        } else if (data?.order_status == order_types.update_acceptance) {
            return ({
                start: "Estimated Start Date/Time",
                end: "Estimated End Date/Time",
                start_date: moment(data?.order_start_time).format("MM/DD/YYYY hh:mm a"),
                end_date:tbdTime?"TBD": moment(virtual_data?.order_end_time).format("MM/DD/YYYY hh:mm a"),
            })
        } else if (notificationData.title == "Completed") {
            return ({
                start: "Start Date/Time",
                end: "End Date/Time",
                start_date: showProviderStartTime ? moment(provider_start_date, "YYYY-MM-DD HH:mm:[00]").format("MM/DD/YYYY hh:mm a") : moment(data?.order_start_time).format("MM/DD/YYYY hh:mm a"),
                end_date: showProviderEndTime ? moment(provider_end_date, "YYYY-MM-DD HH:mm:[00]").format("MM/DD/YYYY hh:mm a") : moment(data?.order_end_time).format("MM/DD/YYYY hh:mm a")
            })
        }else if (notificationData.title == "Requesting") {
            return ({
                start: "Requested Start Date/Time",
                end: "Requested End Date/Time",
                start_date: moment(data?.order_start_time).format("MM/DD/YYYY hh:mm a"),
                end_date:notificationData.title!="Requesting"&&tbdTime?"TBD": moment(data?.order_end_time).format("MM/DD/YYYY hh:mm a")
            })
        }
        return ({
            start: "Estimated Start Date/Time",
            end: "Estimated End Date/Time",
            start_date: moment(data?.order_start_time).format("MM/DD/YYYY hh:mm a"),
            end_date:notificationData.title!="Requesting"&&tbdTime?"TBD": moment(data?.order_end_time).format("MM/DD/YYYY hh:mm a")
        })
    }

    const getDifferenceTime = () => {
        if (data?.order_status == order_types.completed || data?.order_status == order_types.service_finished) {
            if (Boolean(data?.provider_order_end_at) && data?.provider_order_end_at != "" && Boolean(data?.provider_order_start_at) && data?.provider_order_start_at != "") {
                return getTimeInHours(moment(data?.provider_order_end_at, "YYYY-MM-DD HH:mm:[00]").diff(moment(data?.provider_order_start_at, "YYYY-MM-DD HH:mm:[00]"), "minute"))
            }
        }
        return getTimeInHours(totalTime)
    }
    const [showDistance, setShowDistance] = React.useState(false)
    React.useEffect(() => {
        for (let i of items) {
            for (let p of i.product) {
                if (p.item_products_is_per_mile == "1") {
                    setShowDistance(true)
                    break
                }
            }
        }
    }, [items])
    // React.useEffect(()=>{
    //     if(data?.)
    // },[data])
    return (
        <Card containerStyle={{ borderRadius: 10, overflow: "hidden" }}>
            <View style={{ flexDirection: "row" }}>
                <Pressable onPress={() => {
                    navigation.navigate("ProviderDetail", { providerId: data.provider_id, service: data?.order_items && (data?.order_items[0]?.services_name ?? data?.order_items[0]?.parent_services_name),service_id:data?.ordered_sub_services })
                }} style={{ flex: 1, flexDirection: "row" }}>
                    <Avatar
                        size="large"
                        rounded
                        source={user.user_role === 3 ? data?.customers_profile_image ? { uri: BASE_URL + data?.customers_profile_image } : placeholder_image : data?.providers_profile_image ? { uri: BASE_URL + data?.providers_profile_image } : placeholder_image}
                    />
                    <View style={{ marginLeft: 10, justifyContent: "center", flex: 1.3 }}>
                        <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle, { fontSize: 16 }]}>{user.user_role === 3 ? data?.customers_first_name : data?.providers_first_name}</Text>
                        {Boolean(data?.providers_business_name)&&<Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { fontSize: 12 ,fontStyle:"italic"}]}>{data?.providers_business_name}</Text>}

                        <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle]}>{country}</Text>
                        <View style={{ backgroundColor: "white", width: "100%", flexDirection: "row", alignItems: "center" }}>
                            <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, {}]}>Rating: {lodash.round(data?.providers_rating??0,2)} </Text>
                            {Number(data?.providers_rating) > 0 ? <Rating
                                readonly={true}
                                imageSize={12}
                                type="custom"
                                ratingBackgroundColor="white"
                                ratingColor="#04BFBF"
                                tintColor="white"
                                startingValue={1}
                            /> : <Text style={{ color: "#04BFBF" }}>-</Text>}
                        </View>
                    </View>
                </Pressable>
                <View style={{ flex: 1 }} >
                    <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle, { textAlign: "right" }]}><Text style={{ color: "black" }}>Requested :</Text> {moment(data?.created_at).fromNow()}</Text>
                    <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, textAlign: "right" }}>Order<Text style={styles.greenTextStyle}># {data?.id}</Text></Text>
                    <Text maxFontSizeMultiplier={1.5} style={[{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, textAlign: "right", width: "90%", alignSelf: "flex-end" }, styles.greenTextStyle]}><Text style={{ color: "black" }}>Requested Service Date : </Text>{moment(data?.order_start_time).format("MMMM DD[,] YYYY")}</Text>

                </View>
            </View>
            {<View>
                {Boolean(order_variant?.variant_title) && order_variant?.variant_title != "" && <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle, { textAlign: "left", fontSize: 12, }]}><Text style={{ color: LS_COLORS.global.black }}>{order_variant?.variant_title}:</Text> {String(order_variant?.variant).toUpperCase()}</Text>}
                <View style={{}}>
                    {order_variant?.variant_title == "Vehicle Type" && <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle, { textAlign: "left", fontSize: 12, }]}><Text style={{ color: LS_COLORS.global.black }}>Make:</Text> {order_variant?.make}</Text>}
                    {order_variant?.variant_title == "Vehicle Type" && <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle, { textAlign: "left", fontSize: 12, }]}><Text style={{ color: LS_COLORS.global.black }}>Model:</Text> {order_variant?.model}</Text>}
                    {order_variant?.variant_title == "Vehicle Type" && <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle, { textAlign: "left", fontSize: 12, }]}><Text style={{ color: LS_COLORS.global.black }}>Year:</Text> {order_variant?.year}</Text>}
                </View>
            </View>}
            {/* request data */}
            {showVirtualData && <Text maxFontSizeMultiplier={1.5} style={[styles.client_info_text, { textAlign: "left", fontSize: 14, marginTop: 10 }]}>User Requested Order</Text>}
            {items?.map((i) => {
                return (<OrderItemsDetail i={i} orderType={orderType} />)
            })}
            {/* New Request products and Service */}
            {showVirtualData && virtualOrdersItems.length > 0 && <View style={{ marginVertical: 20 }}>
                <Text maxFontSizeMultiplier={1.5} style={[styles.client_info_text, { textAlign: "left", fontSize: 14 }]}>Provider Updated Order</Text>
                {virtualOrdersItems?.map((i) => {
                    return (<OrderItemsDetail i={i}  orderType={orderType}  />)
                })}
            </View>}
            {checkforDiscountToShow(virtual_data?.discount_amount, virtual_data?.discount_type, data?.discount_amount, data?.discount_type, virtual_data?.order_total_price, data?.order_total_price) && <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>Discount</Text>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>{checkforDiscountToShow(virtual_data?.discount_amount, virtual_data?.discount_type, data?.discount_amount, data?.discount_type, virtual_data?.order_total_price, data?.order_total_price)}</Text>
            </View>}
            {data?.provider_rating_data?.id &&
                <>
                    <View style={{ backgroundColor: "white", width: "100%", justifyContent: "space-between", flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                        <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>Tip</Text>
                        <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle]}>${data?.provider_rating_data?.tip ?Number(data?.provider_rating_data?.tip).toFixed(2): "0.00"}</Text>
                    </View>
                </>
            }
            {showDistance && <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>Distance : </Text>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>{data?.mile_distance ? lodash.round(data?.mile_distance, 2) : 0} miles</Text>
            </View>}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>LyfeSuite Application Fee</Text>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>${data?.application_charges==""?"0.00":Number(data?.application_charges).toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>{orderType != "Completed" && "Estimated "}Total Amount</Text>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>${showVirtualData ? getTotalVirtualAmount(virtual_data?.discount_type, virtual_data?.discount_amount, virtual_data?.order_total_price) : getTotalVirtualAmount(data?.discount_type, data?.discount_amount, data?.order_total_price)}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle, { flex: 1, marginRight: 10 }]}>{getDateTimeShow().start}</Text>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>{ getDateTimeShow().start_date}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle, { flex: 1, marginRight: 10 }]}>{getDateTimeShow().end}</Text>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>{getDateTimeShow().end_date}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>{orderType != "Completed" && "Estimated "}Total Time</Text>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>{showVirtualData ? getTimeInHours(totalVirtualTime) : getDifferenceTime()}</Text>
            </View>
            {data?.order_status == order_types.completed &&
                <>
                    <View style={{ backgroundColor: "white", width: "100%", marginTop: 10, flexDirection: "row", alignItems: "center" }}>
                        <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle]}>Rating: </Text>
                        <Rating
                            readonly={true}
                            imageSize={10}
                            type="custom"
                            ratingBackgroundColor="white"
                            ratingColor="#04BFBF"
                            tintColor="white"
                            startingValue={0}
                            startingValue={data?.provider_rating_data?.rating ? data?.provider_rating_data?.rating : "0"}
                        />
                        <Entypo
                            onPress={() => {
                                handleClickOnEdit("rate", true)
                            }}
                            size={20} name='edit' color={LS_COLORS.global.green} />
                    </View>
                    <View style={{ backgroundColor: "white", width: "100%", marginTop: 10, flexDirection: "row", alignItems: "center" }}>
                        <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle]}>Comment: </Text>
                        <Text maxFontSizeMultiplier={1.5} style={{ flex: 1, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.darkGray, fontSize: 12 }}>{data?.provider_rating_data?.comment}</Text>
                        <Entypo onPress={() => {
                            handleClickOnEdit("comment", true)
                        }} size={20} name='edit' color={LS_COLORS.global.green} />
                    </View>
                </>
            }
            <View style={{ position: "absolute", height: 1000, backgroundColor: noti_color, width: 4, left: -15, top: -20 }} />
        </Card>
    )
}


const OrderItemsDetail = ({ i,orderType }) => {
    return (
        <>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium, flex: 1 }]} >{i.service_items_name + "  (Service Charge)"}</Text>
                <View style={{ height: 20, flexDirection: "row" }}>
                    <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{(i.price == "" ? (orderType=="Completed"?("$0.00"):"TBD") : ("$" + Number(i?.price).toFixed(2)))}</Text>
                </View>
            </View>
            {i.product.map((itemData, index) => {
                return (
                    <View key={itemData.id + " " + index} style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }} >
                        <View style={{ flex: 1 }} >
                            <Text maxFontSizeMultiplier={1.5} style={{ marginLeft: 20 }}>
                                <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{itemData.item_products_name + "(Product)"}</Text>
                            </Text>
                        </View>
                        <View style={{ height: 20, flexDirection: "row" }}>
                            <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{(itemData.price == "" ?(orderType=="Completed"?("$0.00"):"TBD")  : ("$" + Number(itemData?.price).toFixed(2)))}</Text>
                        </View>
                    </View>
                )
            })
            }
            {i.extra_product.map((itemData, index) => {
                return (
                    <View key={itemData.id + " " + index} style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }} >
                        <View style={{}} >
                            <Text maxFontSizeMultiplier={1.5} style={{ marginLeft: 20 }}>
                                <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{itemData.product_name + "(Other Product)"}</Text>
                            </Text>
                        </View>
                        <View style={{ height: 20, flexDirection: "row" }}>
                            <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{(itemData.product_price == "" ?(orderType=="Completed"?("$0.00"):"TBD")  : ("$" + Number(itemData?.product_price).toFixed(2)))}</Text>
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
                                <Text maxFontSizeMultiplier={1.5} style={{ marginLeft: 20 }}>
                                    <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{other + "(Other Product)"}</Text>
                                </Text>
                            </View>
                        </View>
                        }
                        {have_own && have_own.trim() != "" && <View key={itemData.id + " " + index} style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }} >
                            <View style={{}} >
                                <Text maxFontSizeMultiplier={1.5} style={{ marginLeft: 20 }}>
                                    <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{have_own + "(Have Own Product)"}</Text>
                                </Text>
                            </View>
                        </View>}
                        {need_recommendation && need_recommendation == "true" && <View key={itemData.id + " " + index} style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }} >
                            <View style={{}} >
                                <Text maxFontSizeMultiplier={1.5} style={{ marginLeft: 20 }}>
                                    <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>Need Recommendation</Text>
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


const RenderAddressFromTO = ({ addresses, currentAddress, fromShow, toShow ,service_is_at_address}) => {
    const navigation = useNavigation()
    return (
        <View style={{ marginHorizontal: 20, marginTop: 0 }}>
            {fromShow &&
                <>
                    <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { marginBottom: 8, marginTop: 16 }]}>Requested From</Text>
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
                        <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { flex: 1, fontSize: 14 }]} numberOfLines={1}>{addresses?.from}</Text>
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
                    <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { marginTop: 16, marginBottom: 8 }]}>{Boolean(Number(service_is_at_address))?"Provider Address":"Requested To"}</Text>
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
                        <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { flex: 1, fontSize: 14 }]} numberOfLines={1}>{addresses?.to}</Text>
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
    const navigation = useNavigation()
    // navigation.navigate("FinishPay", { item: data, submit: submit.bind(this) })

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
                Alert.alert("Cancel","Do you want to cancel the update order?",[
                    {
                        text:"No"
                    },{
                    text:"Yes",
                    onPress:()=>{
                        submit(order_types.update_reject)
                    }
                }])
                //
                break
            case buttons_types.delay_accept:
                submit(order_types.delay_request_accept)
                break
            case buttons_types.decline:
                Alert.alert("Decline", "Are you sure?  This will also Cancel the request.", [
                    { text: "No, Keep Request" },
                    {
                        text: "Yes, Please Cancel", onPress: () => {
                            submit(order_types.delay_request_reject)
                        }
                    },
                ])

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
                navigation.navigate("FinishPay", { item: data, submit: submit.bind(this) })
                break
            // case buttons_types.accept:

        }
    }

    return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly" }}>
            {buttons?.map(x => {
                let title = x.title
                if (x.type == buttons_types.block && data.blocked_to_user) {
                    title = "Unblock"
                }
                return (
                    <TouchableOpacity
                        onPress={() => pressHandler(x.type)}
                        style={[styles.save, { marginTop: 0, marginBottom: 10 }]}>
                        <Text maxFontSizeMultiplier={1.5} style={styles.saveText}>{title}</Text>
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





