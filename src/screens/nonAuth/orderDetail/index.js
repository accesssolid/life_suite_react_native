// #liahs
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, Dimensions, Linking, ScrollView, Alert } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
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
import BookedSlotsModal from './bookedSlotsModal';
import Loader from '../../../components/loader'
import CancelModal from '../../../components/cancelModal';
import BlockModal from '../../../components/blockModal';
import RatingModal from '../../../components/ratingModal'
// placeholder image
const placeholder_image = require("../../../assets/user.png")
import _ from 'lodash'
import { order_types, buttons_customer, buttons_provider, buttons_types } from '../../../constants/globals'
import DelayModal from '../../../components/delayModal';
import messaging from '@react-native-firebase/messaging';
import lodash from 'lodash'
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




const OrderClientDetail = (props) => {
    const DATE = props.route.params.data
    const fromInputRef = useRef(null)
    const toInputRef = useRef(null)
    let { servicedata, subService, item, order_id } = props.route.params
    const [itemdata, setitemData] = React.useState({})
    const [data, setData] = useState(null)
    const [virtualdata, setVirtualData] = React.useState({})
    const user = useSelector(state => state.authenticate.user)
    const [bookedModal, setBookedModal] = React.useState(false)
    const [availableStartTimes, setAvailableStartTimes] = React.useState([])

    const [fromAddress, setFromAddress] = useState("")
    const access_token = useSelector(state => state.authenticate.access_token)
    const [loading, setLoading] = React.useState(false)
    const [totalWorkingMinutes, setTotalWorkingMinutes] = React.useState(0)
    const [selectedStartTime, setSelectedStartTime] = React.useState(moment())
    const [estimated_time, setEstimatedTime] = React.useState("1 hr")
    const [reason, setReason] = React.useState("")
    const [cancelModa, setCancelModal] = React.useState(false)
    const [declineModal, setDeclineModal] = React.useState(false)
    const [blockModal, setBlockModal] = React.useState(false)
    const [delayModalOpen, setDelayModalOpen] = React.useState(false)
    const [ratingModal, setRatingModal] = React.useState(false)
    const [textShowWithRed, settextShowWithRed] = React.useState("")
    const [tbdTime, setTbdTime] = React.useState(false)
    const [notificationData, setNotificationData] = React.useState({
        title: "",
        color: "white"
    })
    // books data from  modal
    const [booked, setBooked] = React.useState([])
    const [whoCancelled, setWhoCancelled] = React.useState({})
    const [order_variant, setOrderVariant] = React.useState({})
    const [orderVT, setOrderVT] = useState({
        showVirtualData: false,
        totalVirtualTime: 0,
        totalTime: 0,
    })
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
            console.log("Variant", variant, data?.ordered_variant)

            setOrderVariant(variant)
        } catch (err) {
            console.log(err)
        } finally {

        }
    }

    useEffect(() => {
        if (item) {
            setitemData(item)
        }
        if (order_id >= 0) {
            setitemData({ id: order_id })
        }

    }, [order_id])

    useFocusEffect(React.useCallback(() => {
        let unsubscribe = messaging().onMessage((remoteMessage) => {
            if (remoteMessage?.data?.link) {
                getOrderDetail(itemdata?.id)
            }
        })
        return unsubscribe
    }, [itemdata]))

    React.useEffect(() => {
        if (data) {
            let ds = generate_series(15, data.order_start_time)
            let end_time = moment(data.order_end_time, "YYYY-MM-DD HH:mm").subtract(totalWorkingMinutes, 'minutes')
            let filteredDs = ds.filter(x => x.toDate() >= moment(data.order_start_time, "YYYY-MM-DD HH:mm").toDate() && x.toDate() <= end_time.toDate())
            if (filteredDs[0]) {
                setSelectedStartTime(filteredDs[0])
            } else {
                setSelectedStartTime(moment(data.order_start_time, "YYYY-MM-DD HH:mm"))
            }
            setAvailableStartTimes(filteredDs)
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
    }, [data, totalWorkingMinutes])

    const [fromCoordinates, setFromCoordinates] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
    })

    const [toCoordinates, setToCoordinates] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
    })

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
            getBookedSlots()
        }
    }, [data])


    const getBookedSlots = () => {
        // setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            data: JSON.stringify({ booking_date: moment(data?.order_start_time, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD") }),
            endPoint: '/api/providerBookedServices',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    if (response.data) {
                        setBooked(response.data)
                    } else {

                    }
                } else {

                }
            }).catch(err => {
            }).finally(() => {
                // setLoading(false)
            })
    }

    React.useEffect(() => {
        fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${toCoordinates.latitude}%2C${toCoordinates.longitude}&origins=${fromCoordinates.latitude}%2C${fromCoordinates.longitude}&key=AIzaSyA8vPYceBJX2Mt43IKubB1Gpa2EcZ6Mg_g`).then(res => {

            return res.json()
        }).then(res => {
            if (res?.rows[0]) {
                let element = res.rows[0].elements[0]
                let duration = element?.duration?.text
                if (duration) {
                    setEstimatedTime(duration)
                }
            }
        }).catch(err => {
        })
    }, [toCoordinates, fromCoordinates])



    useEffect(() => {
        // subService.location_type : 2 - Both , 1 - From only
        getLocationPermission()
    }, [])

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

    const getCurrentPlace = () => {
        RNGooglePlaces.getCurrentPlace(['placeID', 'location', 'name', 'address'])
            .then((results) => {
                setFromAddress(results[0].address)
                setFromCoordinates({ ...fromCoordinates, latitude: results[0].location.latitude, longitude: results[0].location.longitude })

            })
            .catch((error) => console.log(error.message));
    }

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
            endPoint: user.user_role === 3 ? '/api/providerOrderDetail' : "/api/customerOrderDetail",
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    console.log(response.data)
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

    const checkBookedInTime = () => {
        let end_time = _.cloneDeep(selectedStartTime)?.add(totalWorkingMinutes, "minutes").toDate()
        let bookedInTime = booked.filter(x => {
            if ((moment(x.order_start_time, "YYYY-MM-DD HH:mm").toDate() <= selectedStartTime?.toDate() && selectedStartTime?.toDate() <= moment(x.order_end_time, "YYYY-MM-DD HH:mm").toDate()) || (end_time <= moment(x.order_end_time, "YYYY-MM-DD HH:mm").toDate() && end_time >= moment(x.order_end_time, "YYYY-MM-DD HH:mm").toDate())) {
                return true
            } else {
                return false
            }
        })
        if (bookedInTime.length > 0) {
            Alert.alert("Alert", "You have already booked in this time slot. Do you still want to accept?", [{
                text: "Cancel",

            },
            {
                text: "Ok",
                onPress: () => submit(3)
            }
            ])
        } else {
            submit(3)
        }

    }

    const submit = (order_status, delay_time) => {
        // console.log(selectedStartTime)
        // return 
        if (order_status == 3) {
            if (!selectedStartTime) {
                showToast("Select available start time to accept the order.")
                return
            }
        }

        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        const datac = {
            order_id: data.id,
            order_status: order_status,
            reason: reason
        }
        if (delay_time) {
            datac[`delay_time`] = delay_time
        }
        if (order_status == order_types.processing || order_status == order_types.service_finished) {
            datac[`current_date`] = moment().format("YYYY-MM-DD HH:mm:[00]")
        }
        let config = {
            headers: headers,
            data: JSON.stringify(datac),
            endPoint: "/api/providerOrderStatusUpdate",
            type: 'post'
        }
        if (order_status == 3) {
            config.data = JSON.stringify({
                order_id: data.id,
                order_status: order_status,
                order_start_time: _.cloneDeep(selectedStartTime)?.format("YYYY-MM-DD HH:mm"),
                order_end_time: _.cloneDeep(selectedStartTime)?.add(totalWorkingMinutes, "minutes").format("YYYY-MM-DD HH:mm"),
            })
        }


        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setData(response.data)
                    setVirtualData(response.data.virtual_order)
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
            "customer_id": data?.customer_id,
            "reason_description": "",
        }

        let config = {
            headers: headers,
            data: JSON.stringify(user_data),
            endPoint: "/api/blockCustomer",
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    showToast(response.message)
                    getOrderDetail(itemdata?.id)
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
            "customer_id": data?.customer_id,
            "reason_description": "",
        }

        let config = {
            headers: headers,
            data: JSON.stringify(user_data),
            endPoint: "/api/unBlockCustomer",
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    showToast(response.message)
                    // props.navigation.pop()
                    getOrderDetail(itemdata?.id)
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
    useEffect(() => {
        if (itemdata?.id) {
            getOrderDetail(itemdata?.id)
        }
    }, [itemdata])

    useFocusEffect(React.useCallback(() => {
        if (itemdata?.id) {
            getOrderDetail(itemdata?.id)
        }
    }, [itemdata]))

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
                end_date: tbdTime ? "TBD" : moment(data?.order_end_new_time).format("MM/DD/YYYY hh:mm a"),
            })
        }
        else if (notificationData.title == "InProgress") {
            return ({
                start: "Start Date/Time",
                end: "Estimated End Date/Time",
                start_date: moment(provider_start_date, "YYYY-MM-DD HH:mm:[00]").format("MM/DD/YYYY hh:mm a"),
                end_date: tbdTime ? "TBD" : (orderVT.showVirtualData ? moment(provider_start_date, "YYYY-MM-DD HH:mm:[00]").add("minute", orderVT.totalVirtualTime).format("MM/DD/YYYY hh:mm a") : moment(provider_start_date, "YYYY-MM-DD HH:mm:[00]").add("minute", orderVT.totalTime).format("MM/DD/YYYY hh:mm a")),
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
                start_date: showProviderStartTime ? moment(provider_start_date, "YYYY-MM-DD HH:mm:[00]").format("MM/DD/YYYY hh:mm a") : moment(data?.order_start_time).format("MM/DD/YYYY hh:mm a"),
                end_date: tbdTime ? "TBD" : "---"
            })
        } else if (data?.order_status == order_types.update_acceptance) {
            return ({
                start: "Estimated Start Date/Time",
                end: "Estimated End Date/Time",
                start_date: moment(data?.order_start_time).format("MM/DD/YYYY hh:mm a"),
                end_date: tbdTime ? "TBD" : moment(virtualdata?.order_end_time).format("MM/DD/YYYY hh:mm a"),
            })
        } else if (notificationData.title == "Completed") {
            return ({
                start: "Start Date/Time",
                end: "End Date/Time",
                start_date: showProviderStartTime ? moment(provider_start_date, "YYYY-MM-DD HH:mm:[00]").format("MM/DD/YYYY hh:mm a") : moment(data?.order_start_time).format("MM/DD/YYYY hh:mm a"),
                end_date: showProviderEndTime ? moment(provider_end_date, "YYYY-MM-DD HH:mm:[00]").format("MM/DD/YYYY hh:mm a") : moment(data?.order_end_time).format("MM/DD/YYYY hh:mm a")
            })
        } else if (notificationData.title == "Requesting") {
            return ({
                start: "Requested Start Date/Time",
                end: "Requested End Date/Time",
                start_date: moment(data?.order_start_time).format("MM/DD/YYYY hh:mm a"),
                end_date: notificationData.title != "Requesting" && tbdTime ? "TBD" : moment(data?.order_end_time).format("MM/DD/YYYY hh:mm a")
            })
        }
        return ({
            start: "Estimated Start Date/Time",
            end: "Estimated End Date/Time",
            start_date: moment(data?.order_start_time).format("MM/DD/YYYY hh:mm a"),
            end_date: notificationData.title != "Requesting" && tbdTime ? "TBD" : moment(data?.order_end_time).format("MM/DD/YYYY hh:mm a")
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
    return (
        <View style={{ flex: 1, backgroundColor: LS_COLORS.global.white }}>
            <StatusBar
                // translucent 
                // backgroundColor={"transparent"} 
                backgroundColor={LS_COLORS.global.green}
                barStyle="light-content" />
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
                                <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 29, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.white }}>{subService?.name}</Text>
                            </View>
                        </SafeAreaView>
                    </View>
                </ImageBackground>
            </View>
            <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
                <View style={styles.container}>
                    {/* <RenderView /> */}
                    <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, alignItems: "center" }}>
                            <Text maxFontSizeMultiplier={1.5} style={[styles.client_info_text, { textAlign: "left" }]}>Client Info</Text>
                            <Text maxFontSizeMultiplier={1.3} style={[styles.baseTextStyle, { fontSize: 12, textTransform: "none", flex: 1, textAlign: "right" }]}>Order Status: {notificationData?.title}</Text>
                        </View>
                        {data?.order_status == 15 && <Text maxFontSizeMultiplier={1.3} style={[styles.baseTextStyle, { fontSize: 12, marginHorizontal: 20, textTransform: "none", flex: 1, textAlign: "right" }]}>(Payment Pending)</Text>}
                        {/* {Boolean(order_variant?.variant)&& <Text style={{marginHorizontal: 20}}>{order_variant?.variant}</Text>} */}
                        <CardClientInfo setOrderVT={setOrderVT} setTbdTime={setTbdTime} order_variant={order_variant} orderType={notificationData.title} noti_color={notificationData.color} settextShowWithRed={settextShowWithRed} data={data} virtual_data={virtualdata} setTotalWorkingMinutes={setTotalWorkingMinutes} />
                        {getReasonForCancellationText() && <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { fontSize: 13, fontFamily: LS_FONTS.PoppinsRegular, marginTop: 10, marginHorizontal: 20 }]}><Text maxFontSizeMultiplier={1.5} style={{ color: "red" }}>Reason:</Text> {getReasonForCancellationText()}</Text>}
                        {whoCancelled?.type != undefined && <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { fontSize: 13, fontFamily: LS_FONTS.PoppinsRegular, marginTop: 10, marginHorizontal: 20 }]}><Text maxFontSizeMultiplier={1.5} style={{ color: "red" }}>Cancelled By:</Text> {whoCancelled?.type} ({whoCancelled?.name})</Text>}
                        <RenderAddressFromTO
                            fromShow={data?.order_items[0]?.services_location_type == 2}
                            toShow={(data?.order_items[0]?.services_location_type == 2 || data?.order_items[0]?.services_location_type == 1)}
                            currentAddress={fromCoordinates} addresses={{
                                from: data?.order_from_address, //from address
                                to: data?.order_placed_address, //to address
                                fromCoordinates: { latitude: Number(data?.order_from_lat), longitude: Number(data?.order_from_long) }, //from in lat && long
                                toCoordinates: { latitude: Number(data?.order_placed_lat), longitude: Number(data?.order_placed_long) } //to in lat && long
                            }}
                        />
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 20 }}>
                            <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium, flex: 1 }]}>User Requested Time Frame </Text>
                            <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{moment(data?.requested_start_time).format("hh:mm a")} - {moment(data?.requested_end_time).format("hh:mm a")}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 5 }}>
                            <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium, flex: 1, color: LS_COLORS.global.green }]}>{getDateTimeShow().start}</Text>
                            <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { marginLeft: 5, textAlign: "right" }]}>{getDateTimeShow().start_date}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 5 }}>
                            <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium, flex: 1, color: LS_COLORS.global.green }]}>{getDateTimeShow().end}</Text>
                            <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { marginLeft: 5, textAlign: "right" }]}>{getDateTimeShow().end_date}</Text>
                        </View>
                        {/* only show if order status is pending i.e 1 */}
                        {(data?.order_status == 1) &&
                            <>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 10 }}>
                                    <View>
                                        <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsSemiBold }]}>Available Start Time</Text>
                                        <Text maxFontSizeMultiplier={1.5} onPress={() => setBookedModal(true)} style={[styles.baseTextStyle, { color: "skyblue" }]}>(View Booked Slots)</Text>
                                    </View>
                                    <View>
                                        <DropDown
                                            item={availableStartTimes.map(x => x.format("hh:mm a"))}
                                            value={selectedStartTime?.format("hh:mm a")}
                                            onChangeValue={(index, value) => {
                                                setSelectedStartTime(availableStartTimes[index])
                                            }}
                                            containerStyle={{ width: 150, alignSelf: 'center', borderRadius: 6, backgroundColor: LS_COLORS.global.lightGrey, borderWidth: 0, }}
                                            dropdownStyle={{ height: availableStartTimes?.length == 0 ? 10 : (availableStartTimes?.length * 40 < 160 ? availableStartTimes?.length * 40 : 160), width: 150 }}
                                        />
                                    </View>
                                </View>
                            </>
                        }
                        {textShowWithRed !== "" && <Text maxFontSizeMultiplier={1.5} style={[styles.saveText, { color: "red", marginTop: 10 }]}>{textShowWithRed}</Text>}
                    </ScrollView>
                    <GetButtons
                        data={data}
                        checkBookedInTime={checkBookedInTime}
                        openCancelModal={() => setCancelModal(true)}
                        openDeclineModal={() => setDeclineModal(true)}
                        submit={submit}
                        openDelayModal={() => setDelayModalOpen(true)}
                        openBlockModal={() => setBlockModal(true)}
                        openRatingModal={() => setRatingModal(true)}
                        gotoUpdateScreen={() => {
                            props.navigation.navigate("UpdateOrderItems", {
                                servicedata, subService, item: itemdata
                            })
                        }}
                    />
                </View>
            </SafeAreaView >
            <BookedSlotsModal visible={bookedModal} booked={booked} setVisible={setBookedModal} />
            <CancelModal
                title="Kindly fill the reason for rejection."
                visible={declineModal}
                value={reason}
                // pressHandler={()=>setCancelModal(false)}
                onChangeText={(t) => { setReason(t) }}
                action1={() => {
                    setDeclineModal(false)
                }}
                action={() => {
                    if (reason.trim() == "") {
                        showToast("Reason cannot be empty!")
                    }
                    else {
                        setDeclineModal(false)
                        setReason('')
                        submit(order_types.declined)
                    }
                }}
            />
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
                        submit(order_types.cancel)
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
            <RatingModal
                title={`Rating`}
                visible={ratingModal}
                data={data?.provider_rating_data}
                onPressYes={() => {


                }}
                setVisible={setRatingModal}
            />
            <DelayModal
                open={delayModalOpen}
                pressHandler={() => {
                    setDelayModalOpen(false)
                }}
                submit={(value) => {
                    setDelayModalOpen(false)
                    submit(order_types.will_be_delayed, value)
                }}
            />
            {loading && <Loader />}
        </View >
    )
}

export default OrderClientDetail;

const CardClientInfo = ({ data, order_variant, noti_color, setOrderVT, orderType, virtual_data, settextShowWithRed, setTbdTime, setTotalWorkingMinutes }) => {
    const [country, setCountry] = useState("")
    const [items, setItems] = useState([])
    const [virtualOrdersItems, setVirtualOrdersItems] = React.useState([])
    const [totalTime, setTotalTime] = React.useState(0)
    const [totalVirtualTime, setTotalVirtualTime] = React.useState(0)
    const [showVirtualData, setShowVirtualData] = React.useState(false)

    useEffect(() => {
        if (showVirtualData) {
            if (totalTime >= 0 && totalVirtualTime >= 0) {
                if (totalTime < totalVirtualTime) {
                    // settextShowWithRed(`Adding new service requires ${getTimeInHours(totalVirtualTime - totalTime,false)} extra`)
                    settextShowWithRed(`Updating order requires ${getTimeInHours(totalVirtualTime - totalTime, false)} extra`)
                } else if (totalTime > totalVirtualTime) {
                    // settextShowWithRed(`New updated order requires ${totalTime - totalVirtualTime} min less.`)
                } else if (totalTime === totalVirtualTime) {
                    // settextShowWithRed(`New updated order require ${totalVirtualTime} min`)
                }
            }
        } else {
            settextShowWithRed(``)
        }
        setOrderVT({
            totalVirtualTime,
            totalTime,
            showVirtualData
        })
    }, [totalVirtualTime, totalTime, showVirtualData])

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
            // setTotalWorkingMinutes(total)
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
    }, [items, virtualOrdersItems, showVirtualData])

    useEffect(() => {
        let showTBD = true
        for (let i of items) {
            if (i?.duration_time != "") {
                showTBD = false
            }
        }
        if (showVirtualData) {
            showTBD = true
            for (let i of virtualOrdersItems) {
                if (i?.duration_time != "") {
                    showTBD = false
                }
            }
        }
        setTbdTime(showTBD)
    }, [items, virtualOrdersItems, showVirtualData])

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
                setItems(data.order_items.filter(x => x.service_items_name))
            }
        }
    }, [data])

    const getTimeInHours = (minute, check = true) => {
        if (check && (orderType == "Upcoming" && data?.ordered_sub_services == 12) || (orderType == "InProgress" && data?.ordered_sub_services == 12)) {
            return "---"
        }
        let d = parseInt(minute / 60) + " Hr"
        if (minute % 60 !== 0) {
            d += ` ${parseInt(minute % 60)} Mins`
        }
        if (Number(minute) == 0) {
            if (check) {
                return ("--")
            }
            return "0 Mins"

        }
        return `${d}`
    }
    const user = useSelector(state => state.authenticate.user)

    const getTotalVirtualAmount = (dtype, amount, totalAmount,isServiceOnly) => {
        if (amount && amount !== "" && amount != 0) {
            let totalAmount1 = Number(totalAmount)
            if (dtype == "flat") {
                totalAmount1 = totalAmount - Number(amount)
            } else if (dtype == "per") {
                totalAmount1 = totalAmount - (amount * totalAmount / 100)
            }
            let return_value = Number(totalAmount1) + Number(data?.provider_rating_data?.tip ?? 0)
            if (Number.isNaN(return_value)) {
                return isServiceOnly?"0.00":"3.50"
            } else {
                return  isServiceOnly?Number(Number(return_value)-Number(3.50)).toFixed(2):Number(return_value).toFixed(2)
            }
        } else {
            let return_value = Number(totalAmount) + Number(data?.provider_rating_data?.tip ?? 0)
            if (Number.isNaN(return_value)) {
                return isServiceOnly?"0.00":"3.50"
            } else {
                return isServiceOnly?Number(Number(return_value)-Number(3.50)).toFixed(2):Number(return_value).toFixed(2)
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
    return (
        <Card containerStyle={{ borderRadius: 10, overflow: "hidden" }}>
            <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1.3, flexDirection: "row" }}>
                    <Avatar
                        size="large"
                        rounded
                        source={user.user_role === 3 ? data?.customers_profile_image ? { uri: BASE_URL + data?.customers_profile_image } : placeholder_image : data?.providers_profile_image ? { uri: BASE_URL + data?.providers_profile_image } : placeholder_image}
                    />
                    <View style={{ marginLeft: 10, justifyContent: "center", flex: 1.2 }}>
                        <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle, { fontSize: 16 }]}>{user.user_role === 3 ? data?.customers_first_name : data?.providers_first_name}</Text>
                        <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle]}>{country}</Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle, { textAlign: "right" }]}><Text style={{ color: "black" }}>Requested :</Text> {moment(data?.created_at).fromNow()}</Text>
                    <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, textAlign: "right" }}>Order<Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}># {data?.id}</Text></Text>
                    <Text maxFontSizeMultiplier={1.5} style={[{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, textAlign: "right" }, styles.greenTextStyle]}><Text style={{ color: "black" }}>Requested Service Date : </Text>{moment(data?.order_start_time).format("MMMM DD[,] YYYY")}</Text>
                </View>
            </View>
            <View >
                {Boolean(order_variant?.variant_title) && <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle, { textAlign: "left", fontSize: 12, }]}><Text style={{ color: LS_COLORS.global.black }}>{order_variant?.variant_title}:</Text> {String(order_variant?.variant).toUpperCase()}</Text>}
                <View style={{}}>
                    {order_variant?.variant_title == "Vehicle Type" && <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle, { textAlign: "left", fontSize: 12, }]}><Text style={{ color: LS_COLORS.global.black }}>Make:</Text> {order_variant?.make}</Text>}
                    {order_variant?.variant_title == "Vehicle Type" && <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle, { textAlign: "left", fontSize: 12, }]}><Text style={{ color: LS_COLORS.global.black }}>Model:</Text> {order_variant?.model}</Text>}
                    {order_variant?.variant_title == "Vehicle Type" && <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle, { textAlign: "left", fontSize: 12, }]}><Text style={{ color: LS_COLORS.global.black }}>Year:</Text> {order_variant?.year}</Text>}
                </View>
            </View>
            {/* request data */}
            {showVirtualData && <Text maxFontSizeMultiplier={1.5} style={[styles.client_info_text, { textAlign: "left", fontSize: 14, marginTop: 10 }]}>User Requested Order</Text>}
            {items?.map((i) => {
                return (<OrderItemsDetail i={i} orderType={orderType} />)
            })}
            {/* New Request products and Service */}
            {showVirtualData && virtualOrdersItems.length > 0 && <View style={{ marginVertical: 20 }}>
                <Text maxFontSizeMultiplier={1.5} style={[styles.client_info_text, { textAlign: "left", fontSize: 14 }]}>Provider Updated Order</Text>
                {virtualOrdersItems?.map((i) => {
                    return (<OrderItemsDetail i={i} orderType={orderType} />)
                })}
            </View>}
            {showDistance && <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>Distance : </Text>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>{data?.mile_distance ? lodash.round(data?.mile_distance, 2) : 0} miles</Text>
            </View>}
            {checkforDiscountToShow(virtual_data?.discount_amount, virtual_data?.discount_type, data?.discount_amount, data?.discount_type, virtual_data?.order_total_price, data?.order_total_price) && <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>Discount</Text>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>{checkforDiscountToShow(virtual_data?.discount_amount, virtual_data?.discount_type, data?.discount_amount, data?.discount_type, virtual_data?.order_total_price, data?.order_total_price)}</Text>
            </View>}
            {data?.provider_rating_data?.id &&
                <>
                    <View style={{ backgroundColor: "white", width: "100%", justifyContent: "space-between", flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                        <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>Tip</Text>
                        <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle]}>${data?.provider_rating_data?.tip ? Number(data?.provider_rating_data?.tip).toFixed(2) : "0.00"}</Text>
                    </View>
                </>
            }
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle, { fontFamily: LS_FONTS.PoppinsBold }]}>{orderType != "Completed" && "Estimated "} Total Service Amount</Text>
                <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle, { fontFamily: LS_FONTS.PoppinsBold }]}>${showVirtualData ? getTotalVirtualAmount(virtual_data?.discount_type, virtual_data?.discount_amount, virtual_data?.order_total_price,true) : getTotalVirtualAmount(data?.discount_type, data?.discount_amount, data?.order_total_price,true)}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>Customer Application Fee</Text>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>$3.50</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <View >
                    <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>{orderType != "Completed" && "Estimated "}Total Processed Amount</Text>
                </View>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>${showVirtualData ? getTotalVirtualAmount(virtual_data?.discount_type, virtual_data?.discount_amount, virtual_data?.order_total_price) : getTotalVirtualAmount(data?.discount_type, data?.discount_amount, data?.order_total_price)}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>{orderType != "Completed" && "Estimated "}Total Time</Text>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>{showVirtualData ? getTimeInHours(totalVirtualTime) : getDifferenceTime()}</Text>
            </View>
            <View style={{ position: "absolute", height: 1000, backgroundColor: noti_color, width: 4, left: -15, top: -20 }} />
        </Card>
    )
}

const OrderItemsDetail = ({ i, orderType }) => {
    return (
        <>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium, flex: 1 }]} >{i.service_items_name + "  (Service Charge)"}</Text>
                <View style={{ height: 20, flexDirection: "row" }}>
                    <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{(i.price == "" ? (orderType == "Completed" ? ("$0.00") : "TBD") : ("$" + Number(i?.price).toFixed(2)))}</Text>
                </View>
            </View>
            {i.product.map((itemData, index) => {
                return (
                    <View key={itemData.id + " " + index} style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flex: 1 }} >
                            <Text maxFontSizeMultiplier={1.5} style={{ marginLeft: 20 }}>
                                <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{itemData.item_products_name + "(Product)"}</Text>
                            </Text>
                        </View>
                        <View style={{ height: 20, flexDirection: "row" }}>
                            <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{(itemData.price == "" ? (orderType == "Completed" ? ("$0.00") : "TBD") : ("$" + Number(itemData?.price).toFixed(2)))}</Text>
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
                            <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{(itemData.product_price == "" ? (orderType == "Completed" ? ("$0.00") : "TBD") : ("$" + Number(itemData?.product_price).toFixed(2)))}</Text>
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

const RenderAddressFromTO = ({ addresses, currentAddress, fromShow, toShow }) => {
    const navigation = useNavigation()
    return (
        <View style={{ marginHorizontal: 20 }}>
            {fromShow &&
                <>
                    <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { marginBottom: 8, marginTop: 16 }]}>From</Text>
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
                    <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { marginTop: 16, marginBottom: 8 }]}>To</Text>
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



const GetButtons = ({ data, openDeclineModal, openCancelModal, submit, openBlockModal, openDelayModal, checkBookedInTime, gotoUpdateScreen, openRatingModal }) => {
    const [buttons, setButtons] = React.useState([])
    const navigation = useNavigation()


    React.useEffect(() => {
        if (data && data.order_status) {
            for (let type of Object.values(order_types)) {
                if (data.order_status == type) {
                    switch (type) {
                        case order_types.update_acceptance:
                            setButtons(buttons_provider[`${order_types.update_acceptance},${data?.is_in_progress > 0 ? order_types.processing : order_types.confirmed}`])
                            break
                        case order_types.update_accepted:
                            setButtons(buttons_provider[`${order_types.update_accepted},${data?.is_in_progress > 0 ? order_types.processing : order_types.confirmed}`])
                            break
                        case order_types.update_reject:
                            setButtons(buttons_provider[`${order_types.update_reject},${data?.is_in_progress > 0 ? order_types.processing : order_types.confirmed}`])
                            break
                        default:
                            setButtons(buttons_provider[type])
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
                break
            case buttons_types.chat:
                navigation.navigate("ChatScreen", {
                    item: {
                        id: data.customer_id,
                        email: data.customers_email,
                        first_name: data.customers_first_name,
                        last_name: data.customers_last_name,
                        phone_number: data.customers_phone_number,
                        profile_image: data.customers_profile_image
                    }
                })
                break
            case buttons_types.block:
                openBlockModal()
                break
            case buttons_types.accept:
                checkBookedInTime()
                break
            case buttons_types.decline:
                openDeclineModal()
                break
            case buttons_types.delay_order:
                openDelayModal()
                break
            case buttons_types.start_order:
                let current = Date.now()
                let startD = data?.order_start_time
                if (data?.order_status == order_types.will_be_delayed) {
                    startD = data?.order_start_new_time
                }
                let job_start = moment(startD, "YYYY-MM-DD HH:mm:[00]").unix() * 1000
                if (current < job_start) {
                    Alert.alert('Start Order', `Customer requested job start time is ${moment(startD, "YYYY-MM-DD HH:mm:[00]").format("MM/DD/YYYY, hh:mm a")}. Do you still want to start the job right now?`, [
                        { text: "No", onPress: () => { } },
                        {
                            text: "Yes", onPress: () => {
                                submit(order_types.processing)
                            }
                        },
                    ])
                } else {
                    submit(order_types.processing)
                }
                break
            case buttons_types.suspend:
                navigation.navigate("OrderSuspend", { item: data })
                break
            case buttons_types.update_order:
                gotoUpdateScreen()
                break
            case buttons_types.completed:
                submit(order_types.service_finished)
                break
            case buttons_types.view_rating:
                openRatingModal()
                break
            case buttons_types.cancel_update:
                Alert.alert("Cancel", "Do you want to cancel the Update Request?", [
                    {
                        text: "No"
                    },
                    {
                        text: "Yes",
                        onPress: () => {
                            submit(order_types.cancel_request)
                        }
                    }
                ])

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





