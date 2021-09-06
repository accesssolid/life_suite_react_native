import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, PermissionsAndroid } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import RNGooglePlaces from 'react-native-google-places';

/* Components */;
import Header from '../../../components/header';
import { Container, Content } from 'native-base'
import { BASE_URL } from '../../../api/api';
import CustomButton from '../../../components/customButton';
import Loader from '../../../components/loader';
import { showToast } from '../../../components/validators';
import { Dimensions } from 'react-native';
import CustomTextInput from '../../../components/customTextInput';

const SelectLocation = (props) => {
    const dispatch = useDispatch()
    const { subService } = props.route.params
    const user = useSelector(state => state.authenticate.user)
    const [loading, setLoading] = useState(false)
    const isAddServiceMode = useSelector(state => state.services.isAddServiceMode)
    const addServiceData = useSelector(state => state.services.addServiceData)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [address, setAddress] = useState('')
    const [travelDistance, setTravelDistance] = useState('')

    const [coordinates, setCoordinates] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.25,
        longitudeDelta: 0.012134,
    })

    useEffect(() => {
        setCoordinates({
            ...coordinates,
            latitudeDelta: 0.25,
            longitudeDelta: 0.012134,
        })
    }, [travelDistance])

    useEffect(() => {
        getLocationPermission()
    }, [])

    const setInitialData = () => {
        let coords = {
            latitude: Number(subService.travel_data.lat),
            longitude: Number(subService.travel_data.long),
        }
        setAddress(subService.travel_data?.address_text)
        setCoordinates({ ...coordinates, ...coords })
        setTravelDistance(String(subService.travel_data?.travel_distance))
    }

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
        if (isAddServiceMode) {
            if (hasLocationPermission) {
                Geolocation.getCurrentPosition(
                    (position) => {
                        console.log("position =>>", position);
                        getCurrentPlace()
                    },
                    (error) => {
                        console.log("getCurrentPosition error =>>", error.code, error.message);
                    },
                    { /* enableHighAccuracy: true, */ timeout: 15000, /* maximumAge: 10000 */ }
                );
            } else {
                showToast("Location permission not granted")
            }
        } else {
            setInitialData()
            setPreviousAddress()
        }
    }

    const getCurrentPlace = () => {
        RNGooglePlaces.getCurrentPlace(['placeID', 'location', 'name', 'address'])
            .then((results) => {
                console.log("getCurrentPlace =>>", results);
                setAddress(results[0].address)
                setCoordinates({ ...coordinates, latitude: results[0].location.latitude, longitude: results[0].location.longitude })
            })
            .catch((error) => console.log(error.message));
    }

    const setPreviousAddress = () => {
        if (!isAddServiceMode && subService.travel_data.address_text) {
            setAddress(subService.travel_data.address_text)
            setTravelDistance(subService.travel_data.travel_distance)
            setCoordinates({ ...coordinates, latitude: Number(subService.travel_data.lat), longitude: Number(subService.travel_data.long) })
        }
    }

    const next = () => {
        let travel_distance = {
            "travel_distance": travelDistance,
            "address_text": address,
            "lat": coordinates.latitude,
            "long": coordinates.longitude
        }
        if (travelDistance.trim() == "") {
            showToast("Please enter travel distance")
        } else if (address.trim() == "") {
            showToast("Please enter or select address")
        } else {
            try {
                setLoading(true)
                let headers = {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": `Bearer ${access_token}`
                }

                let newProd = addServiceData.json_data.new_products.map(item => {
                    return {
                        "item_id": item.item_id,
                        "name": item.name,
                        "price": item.price
                    }
                })

                let products = addServiceData.json_data.products.map(item => {
                    return {
                        "item_product_id": item.id,
                        "price": item.price.replace("$", '')
                    }
                })

                let json_data = JSON.stringify({
                    "services": addServiceData.json_data.services,
                    "products": [...products.filter(item => item.price !== '')],
                    "travel_distance": travel_distance,
                    "new_products": [...newProd],
                    "time_frame": []
                })

                var formdata = new FormData();
                formdata.append("user_id", user.id);
                formdata.append("service_id", addServiceData.service_id);

                addServiceData.images.forEach((item, index) => {
                    let PATH_TO_THE_FILE = Platform.OS == "ios" ? item.uri.replace('file:///', '') : item.uri
                    if (!item.uri.startsWith(BASE_URL)) {
                        formdata.append('license_file[]', {
                            uri: PATH_TO_THE_FILE,
                            name: item.name,
                            type: item.type,
                        })
                    }
                })

                return props.navigation.navigate('AddTimeFrame', { serviceData: { json_data, formdata, subService } })
            } catch (error) {

            } finally {
                setLoading(false)
            }
        }
    }

    const onLocation = (location, coords) => {
        setAddress(location)
        setCoordinates({
            ...coords,
            latitudeDelta: 0.25,
            longitudeDelta: 0.012134,
        })
    }

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={{ width: '100%', height: '30%' }}>
                <ImageBackground
                    resizeMode="stretch"
                    source={{ uri: BASE_URL + subService.image }}
                    style={styles.image}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                            <View style={{ height: "22%", justifyContent: 'flex-end', marginTop: StatusBar.currentHeight + 20 }}>
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
                <Container>
                    <Content contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                region={{
                                    ...coordinates,
                                }}>
                                {travelDistance !== '' && <MapView.Circle
                                    key={(coordinates.latitude + coordinates.longitude).toString()}
                                    center={coordinates}
                                    radius={Number(travelDistance * 1.60934) * 1000}
                                    strokeWidth={1}
                                    strokeColor={'red'}
                                    fillColor={'rgba(230,238,255,0.1)'}
                                />}
                                <Marker
                                    coordinate={{ ...coordinates }}
                                />
                            </MapView>
                        </View>
                        <View style={{ flex: 1, padding: 20 }}>
                            <TouchableOpacity
                                style={{
                                    marginBottom: 30,
                                    marginHorizontal: '10%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '100%',
                                    backgroundColor: LS_COLORS.global.lightGrey,
                                    borderRadius: 28,
                                    alignSelf: 'center',
                                    paddingVertical: 15,
                                    paddingHorizontal: '10%',
                                }}
                                activeOpacity={0.7}
                                onPress={() => props.navigation.navigate('MapScreen', { onConfirm: onLocation.bind(this), coords: coordinates })}>
                                <Text numberOfLines={1} style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular, }}>{address}</Text>
                                <View style={{ aspectRatio: 1, position: 'absolute', right: '5%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={require('../../../assets/location.png')} resizeMode="contain" style={{ height: '70%', width: '100%', backgroundColor: LS_COLORS.global.lightGrey }} />
                                </View>
                            </TouchableOpacity>
                            <Text style={{ fontFamily: LS_FONTS.PoppinsMedium }}>Travel Distance to provide service(Miles)</Text>
                            <CustomTextInput
                                placeholder="Travel Distance"
                                value={travelDistance}
                                keyboardType="numeric"
                                onChangeText={setTravelDistance}
                                customContainerStyle={{ marginHorizontal: '0%' }}
                                customInputStyle={{ paddingHorizontal: '7%' }}
                            />
                        </View>
                        <View style={{ paddingBottom: '2.5%' }}>
                            <CustomButton
                                title={"Next"}
                                customStyles={{ width: '50%', borderRadius: 6 }}
                                action={() => next()}
                            />
                        </View>
                    </Content>
                </Container>
                {loading && <Loader />}
            </SafeAreaView >
        </>
    )
}

export default SelectLocation;

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
    mapContainer: {
        height: Dimensions.get('screen').height / 4,
        width: Dimensions.get('screen').width,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
})