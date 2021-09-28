// #liahs
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, Dimensions, TextInput, ScrollView, Alert } from 'react-native'
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
import BookedSlotsModal from './bookedSlotsModal';
import Loader from '../../../components/loader'
import CancelModal from '../../../components/cancelModal';
// placeholder image
const placeholder_image = require("../../../assets/user.png")



function generate_series(step, start_time) {
    const dt = new Date(1970, 0, 1);
    const rc = [];
    while (dt.getDate() === 1) {
        const dated = new Date(start_time)
        dated.setHours(dt.getHours())
        dated.setMinutes(dt.getMinutes())
        rc.push(dated);
        dt.setMinutes(dt.getMinutes() + step);
    }
    return rc;
}



const OrderClientDetail = (props) => {
    const DATE = props.route.params.data
    const fromInputRef = useRef(null)
    const toInputRef = useRef(null)
    const { servicedata, subService, item } = props.route.params
    const [data, setData] = useState(null)
    const user = useSelector(state => state.authenticate.user)
    const [bookedModal, setBookedModal] = React.useState(false)
    const [availableStartTimes, setAvailableStartTimes] = React.useState([])

    const [fromAddress, setFromAddress] = useState("")
    const access_token = useSelector(state => state.authenticate.access_token)
    const [loading, setLoading] = React.useState(false)
    const [totalWorkingMinutes, setTotalWorkingMinutes] = React.useState(0)
    const [selectedStartTime, setSelectedStartTime] = React.useState(null)
    const [estimated_time, setEstimatedTime] = React.useState("1 hr")
    const [reason, setReason] = React.useState("")
    const [cancelModa, setCancelModal] = React.useState(false)
    // books data from  modal
    const [booked, setBooked] = React.useState([])

    React.useEffect(() => {
        if (data) {
            let ds = generate_series(15, data.order_start_time)
            let end_time = moment(data.order_end_time).subtract(totalWorkingMinutes, 'minutes').toDate()
            console.log("dddddddddddd", data, totalWorkingMinutes, end_time, data.order_end_time)
            let filteredDs = ds.filter(x => x >= new Date(data.order_start_time) && x <= new Date(end_time))
            setSelectedStartTime(filteredDs[0])
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
        }
        getBookedSlots()
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
            data: JSON.stringify({ booking_date: moment().format("YYYY-MM-DD") }),
            endPoint: '/api/providerBookedServices',
            type: 'post'
        }
        console.log(config)
        getApi(config)
            .then((response) => {
                console.log("Booked Slots", response)
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
        fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${toCoordinates.latitude}%2C${toCoordinates.longitude}&origins=${fromCoordinates.latitude}%2C${fromCoordinates.longitude}&key=AIzaSyDY5JgaWK8EK2TC6Zm6460Qwo0G4NbWM-I`).then(res => {
            console.log(res)
            return res.json()
        }).then(x => { console.log(x) }).catch(err => {
            console.log(err)
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
                    console.log("Position", position)
                    getCurrentPlace()
                },
                (error) => {
                    console.log(error.code, error.message);
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
                console.log(results)
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
                console.log(response)
                if (response.status == true) {
                    if (response.data) {
                        setData(response.data)
                    } else {

                    }
                } else {

                }
            }).catch(err => {
            }).finally(() => {
                setLoading(false)
            })
    }

    const checkBookedInTime = () => {
        let end_time = (moment(selectedStartTime).add(totalWorkingMinutes, "minutes").toDate())
        let bookedInTime = booked.filter(x => {
            if ((new Date(x.order_start_time) <= selectedStartTime && selectedStartTime <= new Date(x.order_end_time)) || (end_time <= new Date(x.order_end_time) && end_time >= new Date(x.order_end_time))) {
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

    const submit = (order_status) => {
        if (order_status == 3) {
            if (!selectedStartTime) {
                return
            }
        }

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
            endPoint: "/api/providerOrderStatusUpdate",
            type: 'post'
        }
        if (order_status == 3) {
            config.data = JSON.stringify({
                order_id: data.id,
                order_status: order_status,
                order_start_time: moment(selectedStartTime).format("YYYY-MM-DD HH:mm"),
                order_end_time: moment(selectedStartTime).add(totalWorkingMinutes, "minutes").format("YYYY-MM-DD HH:mm"),
            })
        }
        console.log(config)
        getApi(config)
            .then((response) => {
                console.log(response)
                if (response.status == true) {
                    getOrderDetail(data.id)
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
                                        props.navigation.navigate("HomeScreen")
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
                        <Text style={[styles.client_info_text]}>Client Info</Text>
                        <CardClientInfo data={data} setTotalWorkingMinutes={setTotalWorkingMinutes} />
                        <RenderAddressFromTO addresses={{
                            from: data?.order_from_address, //from address
                            to: data?.order_placed_address, //to address
                            fromCoordinates: { latitude: data?.order_from_lat, longitude: data?.order_from_long }, //from in lat && long
                            toCoordinates: { latitude: data?.order_placed_lat, longitude: data?.order_placed_long } //to in lat && long
                        }}
                        />
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 20 }}>
                            <Text style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium }]}>User Requested Time Frame </Text>
                            <Text style={styles.baseTextStyle}>{moment(data?.order_start_time).format("hh:mm a")} - {moment(data?.order_end_time).format("hh:mm a")}</Text>
                        </View>
                        {/* only show if order status is pending i.e 1 */}
                        {data?.order_status == 1 && <><View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 10 }}>
                            <View>
                                <Text style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsSemiBold }]}>Available Start Time</Text>
                                <Text onPress={() => setBookedModal(true)} style={[styles.baseTextStyle, { color: "skyblue" }]}>(View Booked Slots)</Text>
                            </View>
                            <View>
                                <DropDown
                                    item={availableStartTimes.map(x => moment(x).format("hh:mm a"))}
                                    value={moment(selectedStartTime).format("hh:mm a")}
                                    onChangeValue={(index, value) => {
                                        setSelectedStartTime(availableStartTimes[index])
                                    }}
                                    containerStyle={{ width: 150, alignSelf: 'center', borderRadius: 6, backgroundColor: LS_COLORS.global.lightGrey, borderWidth: 0, }}
                                    dropdownStyle={{ height: 120, width: 150 }}
                                />
                            </View>
                        </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 10 }}>
                                <View>
                                    <Text style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsSemiBold }]}>Estimated Drive Time</Text>
                                    <Text style={[styles.baseTextStyle]}>(From Current Location)</Text>
                                </View>
                                <Text style={[styles.baseTextStyle]}>{estimated_time}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-around", marginHorizontal: 20, marginTop: 10 }}>
                                <TouchableOpacity
                                    style={styles.save}
                                    activeOpacity={0.7}
                                    onPress={() => checkBookedInTime()}>
                                    <Text style={styles.saveText}>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.save, { backgroundColor: LS_COLORS.global.white, borderWidth: 1, borderColor: LS_COLORS.global.green }]}
                                    activeOpacity={0.7}
                                    onPress={() => setCancelModal(true)}>
                                    <Text style={[styles.saveText, { color: LS_COLORS.global.green }]}>Decline</Text>
                                </TouchableOpacity>
                            </View>
                        </>}
                    </ScrollView>
                </View>
            </SafeAreaView >
            <BookedSlotsModal visible={bookedModal} setVisible={setBookedModal} />
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
            {loading && <Loader />}
        </View>
    )
}

export default OrderClientDetail;

const CardClientInfo = ({ data, setTotalWorkingMinutes }) => {
    const [country, setCountry] = useState("")
    const [items, setItems] = useState([])
    const [totalTime, setTotalTime] = React.useState(0)

    useEffect(() => {
        if (items) {
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
            {items?.map((i) => {
                    return (
                        <>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <Text style={[styles.baseTextStyle, { fontFamily: LS_FONTS.PoppinsMedium }]}>{i.service_items_name + "  (Service Charge)"}</Text>
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
                        </>
                    )
                })
            }
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text style={styles.greenTextStyle}>Total Amount</Text>
                <Text style={styles.greenTextStyle}>${data?.order_total_price}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <Text style={styles.greenTextStyle}>Total Time</Text>
                <Text style={styles.greenTextStyle}>{getTimeInHours(totalTime)}</Text>
            </View>
        </Card>
    )
}

const RenderAddressFromTO = ({ addresses }) => {
    const navigation = useNavigation()
    return (
        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
            <Text style={[styles.baseTextStyle, { marginBottom: 8 }]}>From</Text>
            <View style={styles.fromContainer}>
                <Text style={[styles.baseTextStyle, { flex: 1, fontSize: 14 }]} numberOfLines={1}>{addresses?.from}</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('MapScreen', { onConfirm: () => { }, coords: addresses.fromCoordinates })}
                    style={{ height: 20, width: 40 }}
                    activeOpacity={0.7}>
                    <Image
                        style={{ flex: 1, resizeMode: "contain" }}
                        source={require("../../../assets/location.png")}
                    />
                </TouchableOpacity>
            </View>
            <Text style={[styles.baseTextStyle, { marginTop: 16, marginBottom: 8 }]}>To</Text>
            <View style={styles.fromContainer}>
                <Text style={[styles.baseTextStyle, { flex: 1, fontSize: 14 }]} numberOfLines={1}>{addresses?.to}</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('MapScreen', { onConfirm: () => { }, coords: addresses.toCoordinates })}
                    style={{ height: 20, width: 40 }}
                    activeOpacity={0.7}>
                    <Image
                        style={{ flex: 1, resizeMode: "contain" }}
                        source={require("../../../assets/location.png")}
                    />
                </TouchableOpacity>
            </View>

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





