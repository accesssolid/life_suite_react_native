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

/* Components */;
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Row } from 'native-base'
import { TextInput } from 'react-native-gesture-handler';
import { BASE_URL } from '../../../api/api';
import { Dimensions } from 'react-native';
import { showToast } from '../../../components/validators';
import { PermissionsAndroid } from 'react-native';
import { useSelector } from 'react-redux';

const MechanicLocation = (props) => {
    const fromInputRef = useRef(null)
    const toInputRef = useRef(null)
    const { servicedata, subService } = props.route.params
    const user = useSelector(state => state.authenticate.user)
    const category_array = ['01:00', '02:00', '03:00', '4:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00']
    const [startTime, setStartTime] = useState('01:00')
    const [endTime, setEndTime] = useState('01:00')
    const [fromAddress, setFromAddress] = useState("")
    const [toAddress, setToAddress] = useState("")
    const [date, setDate] = useState("")
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

    useEffect(() => {
        setActiveCoordinates(fromCoordinates)
    }, [fromCoordinates])

    useEffect(() => {
        setActiveCoordinates(toCoordinates)
    }, [toCoordinates])

    useEffect(() => {
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
            })
            .catch((error) => console.log(error.message));
    }

    const openSearchModal = (type) => {
        RNGooglePlaces.openAutocompleteModal({
            type: 'address'
        }, ['placeID', 'location', 'name', 'address'])
            .then((place) => {
                if (type == 'from') {
                    fromInputRef.current.blur()
                    setFromAddress(place.address)
                    setFromCoordinates({ ...fromCoordinates, latitude: results[0].location.latitude, longitude: results[0].location.longitude })
                } else {
                    toInputRef.current.blur()
                    setToAddress(place.address)
                    setToCoordinates({ ...toCoordinates, latitude: results[0].location.latitude, longitude: results[0].location.longitude })
                }
            })
            .catch(error => console.log("openSearchModal error => ", error.message));
    }

    const submit = () => {
        let data = {
            "user_id": user.id,
            "json_data": JSON.stringify({
                "items": [...servicedata]
            }),
            "order_placed_address": toAddress,
            "order_placed_lat": toCoordinates.latitude,
            "order_placed_long": toCoordinates.longitude,
            "order_start_time": date + " " + startTime+":00",
            "order_from_lat": fromCoordinates.latitude,
            "order_from_long": fromCoordinates.longitude,
            "order_from_address": fromAddress
        }

        if (data.order_placed_address.trim() == "") {
            showToast("Please add from address")
        } else if (data.order_from_address.trim() == "") {
            showToast("Please add to address")
        } else if (date.trim() == "") {
            showToast("Please select date")
        } else {
            props.navigation.navigate("Mechanics", { data: data, subService: subService })
        }
    }

    const renderView = () => {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='handled'>
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
                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, marginLeft: 24 }}>From</Text>
                        <View style={styles.fromContainer}>
                            <TextInput
                                style={styles.inputStyle}
                                color="black"
                                value={fromAddress}
                                onChangeText={setFromAddress}
                                placeholder="From Address"
                                placeholderTextColor={LS_COLORS.global.placeholder}
                                onChangeText={() => openSearchModal('from')}
                                ref={fromInputRef}
                            />
                            <TouchableOpacity
                                onPress={() => openSearchModal('from')}
                                style={{ alignSelf: "center", height: '100%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}
                                activeOpacity={0.7}>
                                <Image
                                    style={{ height: 15, width: 20, resizeMode: "contain", alignSelf: 'center' }}
                                    source={require("../../../assets/location.png")}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, marginLeft: 24, marginTop: 20 }}>To</Text>
                        <View style={styles.fromContainer}>
                            <TextInput
                                style={styles.inputStyle}
                                color="black"
                                value={toAddress}
                                onChangeText={setToAddress}
                                placeholder="To Address"
                                placeholderTextColor={LS_COLORS.global.placeholder}
                                onChangeText={() => openSearchModal('to')}
                                ref={toInputRef}
                            />
                            <TouchableOpacity
                                onPress={() => openSearchModal('to')}
                                style={{ alignSelf: "center", height: '100%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}
                                activeOpacity={0.7}>
                                <Image
                                    style={{ height: 15, width: 20, resizeMode: "contain", alignSelf: 'center' }}
                                    source={require("../../../assets/location.png")}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, marginLeft: 24, marginTop: 20 }}>Add Date</Text>
                        <View style={styles.fromContainer}>
                            <TextInput
                                style={styles.inputStyle}
                                color="black"
                                value={date}
                                editable={false}
                                placeholder="Select date"
                                placeholderTextColor={LS_COLORS.global.placeholder}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    props.navigation.navigate("Calendar", { setDate: setDate.bind(this) })
                                }}
                                style={{ alignSelf: "center", height: '100%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}
                                activeOpacity={0.7}>
                                <Image
                                    style={{ height: 15, width: 20, resizeMode: "contain", alignSelf: 'center' }}
                                    source={require("../../../assets/datePicker.png")}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: "space-around", marginTop: "5%" }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium }}>Start Time</Text>
                            <Row style={{ width: widthPercentageToDP(30), justifyContent: 'space-between', marginTop: 10, alignSelf: "center" }}>
                                <DropDown
                                    item={category_array}
                                    value={startTime}
                                    width={widthPercentageToDP(30)}
                                    onChangeItem={(t) => setStartTime(t)}
                                    placeholder="Car"
                                    dropdownStyle={{ width: '30%', alignItems: 'center' }}
                                />
                            </Row>
                        </View>
                        {/* <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium }}>End Time</Text>
                            <Row style={{ width: widthPercentageToDP(30), justifyContent: 'space-between', marginTop: 10 }}>
                                <DropDown
                                    item={category_array}
                                    value={endTime}
                                    width={widthPercentageToDP(30)}
                                    onChangeItem={(t) => setEndTime(t)}
                                    placeholder="Car"
                                    dropdownStyle={{ width: '30%', alignItems: 'center' }}
                                />
                            </Row>
                        </View> */}
                    </View>
                    <TouchableOpacity
                        style={styles.save}
                        activeOpacity={0.7}
                        onPress={() => submit()}>
                        <Text style={styles.saveText}>Submit</Text>
                    </TouchableOpacity>
                    <View style={{ height: 30 }}></View>
                </ScrollView>
            </View>
        )
    }

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={{ width: '100%', height: '30%' }}>
                <ImageBackground
                    resizeMode="cover"
                    source={{ uri: BASE_URL + subService.image }}
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
                                <Text style={{ fontSize: 29, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.white }}>{subService.name}</Text>
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
        marginTop: 40
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
    },
    mapContainer: {
        height: Dimensions.get('screen').height / 4,
        width: Dimensions.get('screen').width,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
})





