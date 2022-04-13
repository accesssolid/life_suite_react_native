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
import { Rating } from 'react-native-ratings'

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



const OrderClientDetail = (props) => {
    const DATE = props.route.params.data
    const fromInputRef = useRef(null)
    const toInputRef = useRef(null)
    let { servicedata, subService, item, order_id } = props.route.params
    const [itemdata,setitemData]=React.useState({})
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
    const [blockModal, setBlockModal] = React.useState(false)
    const [delayModalOpen, setDelayModalOpen] = React.useState(false)
    const [ratingModal, setRatingModal] = React.useState(false)
    const [textShowWithRed, settextShowWithRed] = React.useState("")

    // books data from  modal
    const [booked, setBooked] = React.useState([])

    useEffect(() => {
        if(item){
            setitemData(item)
        }
        if (order_id >= 0) {
            setitemData({ id: order_id })
        }
       
    }, [order_id])

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
        fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${toCoordinates.latitude}%2C${toCoordinates.longitude}&origins=${fromCoordinates.latitude}%2C${fromCoordinates.longitude}&key=AIzaSyBtDBhUzqiZRbcFQezVwgfB9I6Wr4TkJkE`).then(res => {

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
                        <Text maxFontSizeMultiplier={1.5} style={[styles.client_info_text]}>Client Info</Text>
                        <CardClientInfo settextShowWithRed={settextShowWithRed} data={data} virtual_data={virtualdata} setTotalWorkingMinutes={setTotalWorkingMinutes} />
                        {getReasonForCancellationText() && <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { fontSize: 13, fontFamily: LS_FONTS.PoppinsRegular, marginTop: 10, marginHorizontal: 20 }]}><Text maxFontSizeMultiplier={1.5} style={{ color: "red" }}>Reason</Text>: {getReasonForCancellationText()}</Text>}
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
                            <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium ,flex:1}]}>User Requested Time Frame </Text>
                            <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{moment(data?.requested_start_time).format("hh:mm a")} - {moment(data?.requested_end_time).format("hh:mm a")}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 5 }}>
                            <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }]}>Order Start Time</Text>
                            <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{moment(data?.order_start_time).format("hh:mm a")}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 5 }}>
                            <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }]}>Order End Time </Text>
                            <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{moment(data?.order_end_time).format("hh:mm a")}</Text>
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
                                            dropdownStyle={{ height: 120, width: 150 }}
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
                        submit={submit}
                        openDelayModal={() => setDelayModalOpen(true)}
                        openBlockModal={() => setBlockModal(true)}
                        openRatingModal={() => setRatingModal(true)}
                        gotoUpdateScreen={() => {
                            props.navigation.navigate("UpdateOrderItems", {
                                servicedata, subService, item:itemdata
                            })
                        }}
                    />
                </View>
            </SafeAreaView >
            <BookedSlotsModal visible={bookedModal} booked={booked} setVisible={setBookedModal} />
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
                        submit(2)
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
                        submit(2)
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

const CardClientInfo = ({ data, virtual_data, settextShowWithRed, setTotalWorkingMinutes }) => {
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

    }, [totalVirtualTime, totalTime, showVirtualData])
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
            let totalAmount1 =  Number(totalAmount)
            if (dtype == "flat") {
                totalAmount1 = totalAmount - Number(amount)
            } else if (dtype == "per") {
                totalAmount1 = totalAmount - (amount * totalAmount / 100)
            }
            let return_value= Number(totalAmount1)+Number(data?.provider_rating_data?.tip ?? 0)
            if(Number.isNaN(return_value)){
                return 0
            }else{
                return return_value
            }
        } else {
            let return_value=Number(totalAmount)+Number(data?.provider_rating_data?.tip ?? 0)
            if(Number.isNaN(return_value)){
                return 0
            }else{
                return return_value

            }
        }
    }

    const checkforDiscountToShow = (v_a, v_t, d_a, d_t, v_total, d_total) => {
        if (v_a && v_a !== "") {
            if (v_t == "flat") {
                return `$${v_a}`
            } else {
                return `$${v_a * v_total / 100}`
            }
        } else if (d_a && d_a !== "") {
            if (d_t == "flat") {
                return `$${d_a}`
            } else {
                return `$${d_a * d_total / 100}`
            }
        } else {
            return false
        }
    }

    return (
        <Card containerStyle={{ borderRadius: 10 }}>
            <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1.3, flexDirection: "row" }}>
                    <Avatar
                        size="large"
                        rounded
                        source={user.user_role === 3 ? data?.customers_profile_image ? { uri: BASE_URL + data?.customers_profile_image } : placeholder_image : data?.providers_profile_image ? { uri: BASE_URL + data?.providers_profile_image } : placeholder_image}
                    />
                    <View style={{ marginLeft: 10, justifyContent: "center" ,flex:1.2}}>
                        <Text maxFontSizeMultiplier={1.5}  style={[styles.greenTextStyle, { fontSize: 16 }]}>{user.user_role === 3 ? data?.customers_first_name : data?.providers_first_name}</Text>
                        <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle]}>{country}</Text>
                    </View>
                </View>
                <View  style={{flex:1}}>
                    <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle, { textAlign: "right" }]}><Text style={{color:"black"}}>Requested :</Text> {moment(data?.created_at).fromNow()}</Text>
                    <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, textAlign: "right" }}>Order<Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}># {data?.id}</Text></Text>
                    <Text maxFontSizeMultiplier={1.5} style={[{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, textAlign: "right" },styles.greenTextStyle]}><Text style={{color:"black"}}>Service Date : </Text>{moment(data?.order_start_time).format("MMMM DD[,] YYYY")}</Text>
                </View>
            </View>
            {/* request data */}
            {showVirtualData && <Text maxFontSizeMultiplier={1.5} style={[styles.client_info_text, { textAlign: "left", fontSize: 14, marginTop: 10 }]}>User Requested Order</Text>}
            {items?.map((i) => {
                return (<OrderItemsDetail i={i} />)
            })}
            {/* New Request products and Service */}
            {showVirtualData && virtualOrdersItems.length > 0 && <View style={{ marginVertical: 20 }}>
                <Text maxFontSizeMultiplier={1.5} style={[styles.client_info_text, { textAlign: "left", fontSize: 14 }]}>Provider Updated Order</Text>
                {virtualOrdersItems?.map((i) => {
                    return (<OrderItemsDetail i={i} />)
                })}
            </View>}
            {checkforDiscountToShow(virtual_data?.discount_amount, virtual_data?.discount_type, data?.discount_amount, data?.discount_type, virtual_data?.order_total_price, data?.order_total_price) && <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>Discount</Text>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>{checkforDiscountToShow(virtual_data?.discount_amount, virtual_data?.discount_type, data?.discount_amount, data?.discount_type, virtual_data?.order_total_price, data?.order_total_price)}</Text>
            </View>}
            {data?.provider_rating_data?.id &&
                <>
                    <View style={{ backgroundColor: "white", width: "100%", justifyContent: "space-between", flexDirection: "row", alignItems: "center",marginTop:10 }}>
                    <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>Tip</Text>
                        <Text maxFontSizeMultiplier={1.5} style={[styles.greenTextStyle]}>${data?.provider_rating_data?.tip ?? 0}</Text>
                    </View>
                </>
            }
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>Total Amount</Text>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>${showVirtualData ? getTotalVirtualAmount(virtual_data?.discount_type, virtual_data?.discount_amount, virtual_data?.order_total_price) : getTotalVirtualAmount(data?.discount_type, data?.discount_amount, data?.order_total_price)}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>Total Time</Text>
                <Text maxFontSizeMultiplier={1.5} style={styles.greenTextStyle}>{showVirtualData ? getTimeInHours(totalVirtualTime) : getTimeInHours(totalTime)}</Text>
            </View>
           
        </Card>
    )
}

const OrderItemsDetail = ({ i }) => {
    return (
        <>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium, flex: 1 }]} >{i.service_items_name + "  (Service Charge)"}</Text>
                <View style={{ height: 20, flexDirection: "row" }}>
                    <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{"$" + i.price}</Text>
                </View>
            </View>
            {i.product.map((itemData, index) => {
                return (
                    <View key={itemData.id + " " + index} style={{ justifyContent: 'space-between', flexDirection: 'row',marginTop:10}}>
                        <View style={{flex: 1 }} >
                            <Text maxFontSizeMultiplier={1.5} style={{ marginLeft: 20 }}>
                                <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{itemData.item_products_name + "(Product)"}</Text>
                            </Text>
                        </View>
                        <View style={{ height: 20, flexDirection: "row" }}>
                            <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{"$" + itemData.price}</Text>
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
                            <Text maxFontSizeMultiplier={1.5} style={styles.baseTextStyle}>{"$" + itemData.product_price}</Text>
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
                    <Text maxFontSizeMultiplier={1.5} style={[styles.baseTextStyle, { marginBottom: 8,marginTop:16 }]}>From</Text>
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



const GetButtons = ({ data, openCancelModal, submit, openBlockModal, openDelayModal, checkBookedInTime, gotoUpdateScreen, openRatingModal }) => {
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
                openCancelModal()
                break
            case buttons_types.delay_order:
                openDelayModal()
                break
            case buttons_types.start_order:
                let current = Date.now()
                let job_start = moment(data?.requested_start_time, "YYYY-MM-DD HH:mm:[00]").unix() * 1000
                if (current < job_start) {
                    Alert.alert('Start Order', `Customer requested job start time is ${moment(data?.requested_start_time).format("DD/MM/YYYY, hh:mm a")}. Do you still want to start the job right now?`, [
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





