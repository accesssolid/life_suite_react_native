import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import RNGooglePlaces from 'react-native-google-places';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { BASE_URL, getApi } from '../../../api/api';

/* Components */;
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { TextInput } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { showToast } from '../../../components/validators';
import { PermissionsAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import SureModal from '../../../components/sureModal';
import Loader from '../../../components/loader';
import * as RNLocalize from "react-native-localize";
import lodash from 'lodash'
import { setCurrentLocationData } from '../../../redux/features/currentlocation';
// #liahs_before_providers

const MechanicLocation = (props) => {
    const { servicedata, subService, extraData, orderData, reorder } = props.route.params
    const user = useSelector(state => state.authenticate.user)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
    const [startTime, setStartTime] = useState(moment())
    const [endTime, setEndTime] = useState(moment())
    const [fromAddress, setFromAddress] = useState("")
    const [toAddress, setToAddress] = useState("")
    const [date, setDate] = useState("")
    const [open, setOpen] = useState(false)
    const dispatch=useDispatch()
    const [loading, setLoading] = React.useState(false)
    const access_token = useSelector(state => state.authenticate.access_token)

    const [isLoadCurrentLocation, setIsLoadCurrentLocation] = React.useState(false)
    React.useEffect(() => {
        console.log("Params", props.route.params)
    }, [props.route.params])
    const currentLocation=useSelector(state=>state.currentLocation)?.current
    // const [currentLocation, setCurrentLocation] = React.useState({
        
    // })

    const [fromCoordinates, setFromCoordinates] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
    })

    const [toCoordinates, setToCoordinates] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
    })

    const [activeCoordinates, setActiveCoordinates] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
    })

    // useEffect(() => {
    //     setActiveCoordinates(fromCoordinates)
    // }, [fromCoordinates])

    useEffect(() => {
        if (toCoordinates?.latitude == 37.78825 && toCoordinates.longitude == -122.4324) {
            setActiveCoordinates(currentLocation)
        } else {
            setActiveCoordinates(toCoordinates)
        }

    }, [toCoordinates, currentLocation])

    useEffect(() => {
        // subService.location_type : 2 - Both , 1 - From only
        if (isLoadCurrentLocation) {
            getLocationPermission()
        }



    }, [isLoadCurrentLocation])


    React.useEffect(() => {
        if (orderData) {
            // alert( orderData.order_from_long)
            setIsLoadCurrentLocation(false)
            if (orderData.order_from_address) {
                setFromAddress(orderData.order_from_address)
            }
            if (orderData.order_from_lat || orderData.order_from_long) {
                setFromCoordinates({
                    latitude: Number(orderData.order_from_lat),
                    longitude: Number(orderData.order_from_long),
                })
            }
            if (orderData.order_placed_address) {
                setToAddress(orderData.order_placed_address)
            }
            if (orderData.order_placed_lat || orderData.order_placed_long) {
                setToCoordinates({
                    latitude: Number(orderData.order_placed_lat),
                    longitude: Number(orderData.order_placed_long),
                })
            }
        } else {
            setIsLoadCurrentLocation(true)
        }
    }, [orderData])

    var rad = function (x) {
        return x * Math.PI / 180;
    };

    var getDistance = function (p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2.latitude - p1.latitude);
        var dLong = rad(p2.longitude - p1.longitude);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d * 0.000621371; // returns the distance in meter
    };

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
                dispatch(setCurrentLocationData({ latitude: results[0].location.latitude, longitude: results[0].location.longitude }))
                setToAddress(results[0].address)
                setToCoordinates({ ...toCoordinates, latitude: results[0].location.latitude, longitude: results[0].location.longitude })
            })
            .catch((error) => console.log(error.message));
    }

    const [total_distance, setTotalDistance] = React.useState(0)


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
                order_id: orderData.id,
                order_start_time: start_time, //"2021-10-07 10:00:00",
                order_end_time: end_time, // "2021-11-07 12:00:00"
                "order_placed_address": toAddress,
                "order_placed_lat": toCoordinates.latitude,
                "order_placed_long": toCoordinates.longitude,
                "order_from_lat": fromCoordinates.latitude,
                "order_from_long": fromCoordinates.longitude,
                "order_from_address": fromAddress,
                "timezone": RNLocalize.getTimeZone(),
                "mile_distance": lodash.round(total_distance, 2)
            }),
            endPoint: "/api/reorderCreate",
            type: 'post'
        }
        console.log(orderData)
        console.log(JSON.parse(config.data))
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    showToast(response.message)
                    props.navigation.navigate("MainDrawer", { screen: "HomeScreen" })
                } else {
                    console.log("Error", response)
                    showToast(response.message)
                }
            }).catch(err => {

            }).finally(() => {
                setLoading(false)

            })
    }

    const getDistanceApi = (to, from) => {
        fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${to.latitude}%2C${to.longitude}&origins=${from.latitude}%2C${from.longitude}&key=AIzaSyA8vPYceBJX2Mt43IKubB1Gpa2EcZ6Mg_g`).then(res => {
            return res.json()
        }).then(res => {
            if (res?.rows[0]) {
                let element = res.rows[0].elements[0]
                // alert(element?.distance?.value)
                if (element?.distance?.value >= 0) {
                    setTotalDistance(element?.distance?.value * 0.000621371)
                }
                console.log("Element", element)
            }
        }).catch(err => {
            console.error(err)
        })
    }


    React.useEffect(() => {
        // alert(JSON.stringify(toCoordinates))
        getDistanceApi(toCoordinates, fromCoordinates)
    }, [toCoordinates, fromCoordinates])

    const submit = () => {
        if (reorder) {
            if (date.trim() == "") {
                setTimeout(() => {
                    showToast("Please select date")
                }, 100)

                return
            } else if (moment(startTime).toString() === moment(endTime).toString()) {
                setTimeout(() => {
                    showToast("Start Time and End Time Cannot Be Same")
                }, 100)

                return
            }
            // else if (moment(startTime).date() >  moment(endTime).date()) {
            //     showToast("Start Time and End Time Cannot Be Same")
            //     return
            // }

            reOrder(moment(date).format("YYYY-MM-DD") + " " + moment(startTime).format('HH:mm') + ":00", moment(date).format("YYYY-MM-DD") + " " + moment(endTime).format('HH:mm') + ":00")
            return
        }
        let arr = []
        servicedata.forEach(element => {
            arr.push(element.item_id)
        });
        let data = {
            "user_id": user.id,
            "json_data": JSON.stringify({
                "items": arr,
                "products": servicedata[0].products
            }),
            "order_placed_address": toAddress,
            "order_placed_lat": toCoordinates.latitude,
            "order_placed_long": toCoordinates.longitude,
            "order_start_time": moment(date).format("YYYY-MM-DD") + " " + moment(startTime).format('HH:mm') + ":00",
            "order_end_time": moment(date).format("YYYY-MM-DD") + " " + moment(endTime).format('HH:mm') + ":00",
            "order_from_lat": fromCoordinates.latitude,
            "order_from_long": fromCoordinates.longitude,
            "order_from_address": fromAddress,
            "mile_distance": total_distance
        }
        if (subService.location_type == 2 && data.order_from_address.trim() == "") {
            showToast("Please add from address")
        } else if (data.order_placed_address.trim() == "") {
            showToast("Please add to address")
        }
        else if (date.trim() == "") {
            setTimeout(() => {
                showToast("Please select date")
            }, 200)
        } else if (moment(startTime).toString() === moment(endTime).toString()) {
            setTimeout(() => {
                showToast("Start Time and End Time Cannot Be Same")
            }, 200)
        } else if (moment(startTime).toDate() > moment(endTime).toDate()) {
            setTimeout(() => {
                showToast("Start Time must be grater than End Time. ")
            }, 200)
        } else {
            props.navigation.navigate("Mechanics", { data: data, subService: subService, extraData })
        }
    }

    const handleConfirm = (d) => {
        const moment1 = moment(d).format("HH:mm")
        // const dateNow=new Date()
        // if(date1<dateNow){
        //     showToast("Please choose valid start time") 
        //     setDatePickerVisibility(false);
        //     return
        // }
        if (date == "") {
            showToast("Please select date first.")
            setDatePickerVisibility(false);
            return

        }
        if (moment().toDate() > moment(moment(date).format("MM-DD-YYYY") + " " + moment1, "MM-DD-YYYY HH:mm").toDate()) {
            showToast("Please select valid start time")
            setDatePickerVisibility(false);
            return
        }
        setStartTime(d)
        setDatePickerVisibility(false);

    };

    const handleConfirm1 = (d) => {
        setDatePickerVisibility1(false);
        if (moment(d).toDate() > moment(startTime).toDate()) {
            setEndTime(d)
        } else {
            showToast("End time must be greater than start time.")
        }
        setDatePickerVisibility1(false);

    };

    const onLocation = (location, coords) => {
        setFromAddress(location)
        setFromCoordinates({
            ...coords,
            latitudeDelta: 0.25,
            longitudeDelta: 0.012134,
        })
    }

    const onLocation1 = (location, coords) => {
        setToAddress(location)
        setToCoordinates({
            ...coords,
            latitudeDelta: 0.25,
            longitudeDelta: 0.012134,
        })
    }

    useEffect(()=>{
        if(date!=""){
            if(startTime){
                if (moment().toDate() > moment(moment(date).format("MM-DD-YYYY") + " " + moment(startTime).format("HH:mm"), "MM-DD-YYYY HH:mm").toDate()) {
                    setStartTime(moment())
                    setEndTime(moment())
                }
            }
        }    
    },[date])

    const renderView = () => {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} bounces={false} >
                    <SureModal
                        pressHandler={() => {
                            setOpen(!open);
                        }}
                        visible={open}
                        action1={() => {
                            setOpen(!open);
                        }}
                    />
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            region={{
                                ...activeCoordinates,
                                latitudeDelta: 0.015,
                                longitudeDelta: 0.0121,
                            }}>
                            <Marker
                                coordinate={{ ...activeCoordinates }}
                            />
                        </MapView>
                    </View>
                    {/* <View style={{ height: 45, width: "90%", marginTop: 20, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 6, borderColor: LS_COLORS.global.green }}>
                        <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>Other Location</Text>
                    </View> */}
                    <View style={{ marginTop: 20 }}>
                        {subService.location_type == 2 && <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, marginLeft: 24 }}>From</Text>}
                        {subService.location_type == 2 && <TouchableOpacity
                            onPress={() => {
                                props.navigation.navigate('MapScreen', { onConfirm: onLocation.bind(this), coords: fromCoordinates })
                            }}
                            style={styles.fromContainer}>
                            <Text maxFontSizeMultiplier={1.5} style={{ flex: 1, }} numberOfLines={1}>
                                {fromAddress == "" ? "Select Address" : fromAddress}
                            </Text>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate('MapScreen', { onConfirm: onLocation.bind(this), coords: fromCoordinates })}
                                style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: "flex-end", paddingHorizontal: 10 }}
                                activeOpacity={0.7}>
                                <Image
                                    style={{ height: 15, width: 20, resizeMode: "contain" }}
                                    source={require("../../../assets/location.png")}
                                />
                            </TouchableOpacity>
                        </TouchableOpacity>}
                        {(subService.location_type == 1 || subService.location_type == 2) && <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, marginLeft: 24, marginTop: 20 }}>To</Text>}
                        {(subService.location_type == 1 || subService.location_type == 2) && <TouchableOpacity
                            onPress={() => props.navigation.navigate('MapScreen', { onConfirm: onLocation1.bind(this), coords: toCoordinates })}
                            style={styles.fromContainer}>
                            <Text maxFontSizeMultiplier={1.5} style={{ flex: 1, }} numberOfLines={1}>{toAddress == "" ? "Select Address" : toAddress}</Text>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate('MapScreen', { onConfirm: onLocation1.bind(this), coords: toCoordinates })}
                                style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: "flex-end", paddingHorizontal: 10 }}
                                activeOpacity={0.7}>
                                <Image
                                    style={{ height: 15, width: 20, resizeMode: "contain" }}
                                    source={require("../../../assets/location.png")}
                                />
                            </TouchableOpacity>
                        </TouchableOpacity>}
                        <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, marginLeft: 24, marginTop: 20 }}>Add Date</Text>
                        <View style={styles.fromContainer}>
                            <TextInput
                                maxFontSizeMultiplier={1.5}
                                style={styles.inputStyle}
                                color="black"
                                value={date != "" ? moment(date).format("MM-DD-YYYY") : "Select Date"}
                                editable={false}
                                placeholder="Select date"
                                placeholderTextColor={LS_COLORS.global.placeholder}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    props.navigation.navigate("Calendar", { setDate: setDate.bind(this), service: subService?.name })
                                }}
                                style={{ alignSelf: "center", height: '100%', aspectRatio: 1, justifyContent: 'center' }}
                                activeOpacity={0.7}
                            >
                                <Image
                                    style={{ height: 15, width: 20, resizeMode: "contain" }}
                                    source={require("../../../assets/datePicker.png")}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text maxFontSizeMultiplier={1.5} style={{ marginTop: "5%", marginLeft: 24, fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium, marginBottom: 10 }}>My available start time between:</Text>
                    <View style={{ flexDirection: 'row', justifyContent: "space-around", marginTop: "1%" }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium, marginBottom: 10 }}>Start Time</Text>
                            <TouchableOpacity style={{ padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 6, borderColor: LS_COLORS.global.grey }} activeOpacity={0.7} onPress={() => setDatePickerVisibility(true)} >
                                <Text maxFontSizeMultiplier={1.5}>{moment(startTime).format('hh:mm A')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }} >
                            <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium, marginBottom: 10 }}>End Time</Text>
                            <TouchableOpacity style={{ padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 6, borderColor: LS_COLORS.global.grey }} activeOpacity={0.7} onPress={() => setDatePickerVisibility1(true)} >
                                <Text maxFontSizeMultiplier={1.5}>{moment(endTime).format('hh:mm A')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ height: 30 }}></View>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="time"
                        date={moment(startTime).toDate()}
                        onConfirm={handleConfirm}
                        onCancel={() => setDatePickerVisibility(false)}
                    />
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible1}
                        mode="time"
                        date={moment(endTime).toDate()}
                        onConfirm={handleConfirm1}
                        onCancel={() => setDatePickerVisibility1(false)}
                    />
                </ScrollView>
                <TouchableOpacity
                    style={styles.save}
                    activeOpacity={0.7}
                    onPress={() => submit()}>
                    <Text maxFontSizeMultiplier={1.5} style={styles.saveText}>Submit</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <>
            <StatusBar
                // translucent 
                // backgroundColor={"transparent"} 
                backgroundColor={LS_COLORS.global.green}
                barStyle="light-content" />
            <View style={{ width: '100%', height: '30%' }}>
                <ImageBackground
                    resizeMode="cover"
                    source={{ uri: BASE_URL + subService?.image }}
                    style={styles.image}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                            <View style={{ height: "22%", justifyContent: 'flex-end' }}>
                                <Header
                                    imageUrl={require("../../../assets/backWhite.png")}
                                    action={() => {
                                        props.navigation.goBack()
                                    }}
                                    imageUrl1={require("../../../assets/homeWhite.png")}
                                    action1={() => {
                                        props.navigation.navigate("HomeScreen")
                                    }}
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
                    {renderView()}
                </View>
            </SafeAreaView >
            {loading && <Loader />}
        </>
    )
}

export default MechanicLocation;

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
        width: 174,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 6,
        alignSelf: 'center',
        marginTop: 10
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
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
        width: "88%",
        alignSelf: 'center',
        alignItems: "center",
        borderColor: LS_COLORS.global.lightTextColor,
        borderRadius: 3,
        flexDirection: 'row',
        justifyContent: "space-between",
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
})





