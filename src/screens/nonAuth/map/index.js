import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Platform, Image, TouchableOpacity, PermissionsAndroid } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import RNGooglePlaces from 'react-native-google-places';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

/* Components */;
import { Container } from 'native-base'
import CustomButton from '../../../components/customButton';
import Loader from '../../../components/loader';

const MapScreen = (props) => {
    const dispatch = useDispatch()
    const queryString = require('query-string');
    const { onConfirm } = props.route.params
    const placesRef = useRef();
    const user = useSelector(state => state.authenticate.user)
    const [loading, setLoading] = useState(false)
    const isAddServiceMode = useSelector(state => state.services.isAddServiceMode)
    const [address, setAddress] = useState('')
    const [coordinates, setCoordinates] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
    })

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
            getCurrentPlace()
        } else {
            alert("Location permission denied")
        }
    }

    const getCurrentPlace = () => {
        setLoading(true)
        RNGooglePlaces.getCurrentPlace(['placeID', 'location', 'name', 'address'])
            .then((results) => {
                setAddress(results[0].address)
                placesRef.current.setAddressText(results[0].address)
                setCoordinates({ ...coordinates, latitude: results[0].location.latitude, longitude: results[0].location.longitude })
            })
            .catch((error) => console.log("results error => ", error.message))
            .finally(() => {
                setLoading(false)
            })
    }

    const reverseGeocode = (lat, lng) => {
        let params = {
            key: 'AIzaSyBRpW8iA1sYpuNb_gzYKKVtvaVbI-wZpTM',
            latlng: `${lat},${lng}`,
        };
        let qs = queryString.stringify(params);
        return fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?${qs}`)
            .then((res) => res.json())
            .then((json) => {
                console.log("reverseGeocode =>> ", json)
                if (json.status !== 'OK') {
                    // throw new Error(`Geocode error: ${json.status}`);
                }
                return json;
            });
    }

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                <Container style={{ zIndex: 0 }}>
                    <View style={{ backgroundColor: LS_COLORS.global.cyan, flexDirection: 'row', height: 60, paddingHorizontal: '5%', paddingVertical: 10, justifyContent: 'space-between', zIndex: 100 }}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => props.navigation.goBack()} style={{ height: '100%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ height: '70%', width: '70%' }} resizeMode="contain" source={require('../../../assets/backWhite.png')} />
                        </TouchableOpacity>
                        <View style={{ flex: 1, width: '90%', position: 'absolute', right: '5%', top: '20%' }}>
                            <GooglePlacesAutocomplete
                                ref={placesRef}
                                styles={{
                                    container: { borderColor: "green", zIndex: 10000000 },
                                    listView: { paddingVertical: 5, zIndex: 10000 },
                                    separator: {}
                                }}
                                placeholder='Search'
                                fetchDetails={true}
                                onPress={(data, details) => {
                                    setCoordinates({
                                        ...coordinates,
                                        latitude: details?.geometry?.location?.lat,
                                        longitude: details.geometry?.location?.lng
                                    })
                                    placesRef.current.blur()
                                }}
                                query={{
                                    key: 'AIzaSyBRpW8iA1sYpuNb_gzYKKVtvaVbI-wZpTM',
                                    language: 'en',
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.mapContainer}>
                        <View style={{ position: 'absolute', width: '100%', height: 60, flexDirection: 'row', justifyContent: 'space-around', top: 0, zIndex: 100000000, alignItems: 'center', paddingHorizontal: '10%' }}>
                            <CustomButton
                                title={user.user_role == 2 ? "Home" : "Permanent"}
                                customTextStyles={{ fontSize: 14, color: LS_COLORS.global.white }}
                                customStyles={{
                                    width: '100%',
                                    height: 40,
                                    paddingHorizontal: '5%',
                                    backgroundColor: LS_COLORS.global.green,
                                }}
                                action={() => {
                                    setAddress(`${user.address[0].address_line_1}, ${user.address[0].city_name}, ${user.address[0].state_name}, ${user.address[0].zip_code}, ${user.address[0].country_name}`)
                                    placesRef.current.setAddressText(`${user.address[0].address_line_1}, ${user.address[0].city_name}, ${user.address[0].state_name}, ${user.address[0].zip_code}, ${user.address[0].country_name}`)
                                }}
                            />
                            <CustomButton
                                title={user.user_role == 2 ? "Work" : "Mailing"}
                                customTextStyles={{ fontSize: 14, color: LS_COLORS.global.white }}
                                customStyles={{
                                    width: '100%',
                                    height: 40,
                                    paddingHorizontal: '5%',
                                    backgroundColor: LS_COLORS.global.green,
                                }}
                                action={() => {
                                    setAddress(`${user.address[1].address_line_1}, ${user.address[1].city_name}, ${user.address[1].state_name}, ${user.address[1].zip_code}, ${user.address[1].country_name}`)
                                    placesRef.current.setAddressText(`${user.address[1].address_line_1}, ${user.address[1].city_name}, ${user.address[1].state_name}, ${user.address[1].zip_code}, ${user.address[1].country_name}`)
                                }}
                            />
                        </View>
                        <MapView
                            style={styles.map}
                            onRegionChangeComplete={(reg) => { setCoordinates({ ...reg }), reverseGeocode(reg.latitude, reg.longitude) }}
                            region={{
                                ...coordinates,
                                latitudeDelta: 0.015,
                                longitudeDelta: 0.0121,
                            }}>
                        </MapView>
                        <View pointerEvents="none" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
                            <Image pointerEvents="none" style={{ height: 40, aspectRatio: 1 }} source={require('../../../assets/pin.png')} />
                        </View>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => getLocationPermission()} style={{ position: 'absolute', height: 50, aspectRatio: 1, bottom: '5%', right: '5%' }}>
                            <Image style={{ height: '100%', aspectRatio: 1 }} source={require('../../../assets/gps.png')} resizeMode="contain" />
                        </TouchableOpacity>
                        <View style={{ paddingBottom: '5%', position: 'absolute', bottom: 0, width: '100%' }}>
                            <CustomButton
                                title={"Submit"}
                                customStyles={{ width: '50%', borderRadius: 6 }}
                                action={() => { onConfirm(address), props.navigation.goBack() }}
                            />
                        </View>
                    </View>
                </Container>
                {loading && <Loader />}
            </SafeAreaView >
        </>
    )
}

export default MapScreen;

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
        // height: Dimensions.get('window').height,
        // width: Dimensions.get('window').width,
        zIndex: 50,
        flex: 1
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
})