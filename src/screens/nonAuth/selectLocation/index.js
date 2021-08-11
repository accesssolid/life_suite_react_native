import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ImageBackground, StatusBar, Platform, Image, TouchableOpacity } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import MapView, { Marker } from 'react-native-maps';

/* Components */;
import Header from '../../../components/header';
import { Container, Content, Row, } from 'native-base'
import { BASE_URL, getApi } from '../../../api/api';
import CustomButton from '../../../components/customButton';
import Loader from '../../../components/loader';
import { showToast } from '../../../components/validators';
import { setMyJobs } from '../../../redux/features/provider';
import { setAddServiceData, setAddServiceMode } from '../../../redux/features/services';
import { Alert } from 'react-native';
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

    const next = () => {
        // showToast("Service Added successfully")
        // props.navigation.navigate('HomeScreen')
        saveNewService()
    }

    const saveNewService = () => {
        try {
            setLoading(true)
            let headers = {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${access_token}`
            }

            const travel_distance = {
                "travel_distance": "2800",
                "address_text": "Test location",
                "lat": "30.00",
                "long": "70.76"
            }

            var formdata = new FormData();
            formdata.append("user_id", user.id);
            formdata.append("service_id", addServiceData.service_id);
            formdata.append("json_data", JSON.stringify({ ...addServiceData.json_data, products: [], travel_distance: travel_distance }));

            addServiceData.images.forEach((item, index) => {
                if (!item.uri.startsWith(BASE_URL)) {
                    formdata.append('license_file[]', {
                        uri: Platform.OS == "ios" ? item.uri.replace('file:///', '') : item.uri,
                        name: item.name,
                        type: item.type,
                    })
                }
            })

            let config = {
                headers: headers,
                data: formdata,
                endPoint: '/api/providerServicesAdd',
                type: 'post'
            }

            getApi(config)
                .then((response) => {
                    if (response.status == true) {
                        setLoading(false)
                        showToast(response.message, 'success')
                        getMyJobs(true)
                    }
                    else {
                        setLoading(false)
                        showToast(response.message, 'danger')
                    }
                })
                .catch(err => {
                    setLoading(false)
                    console.log("error =>", err)
                })
        } catch (error) {

        } finally {
            setLoading(false)
        }

    }

    const getMyJobs = (shouldNavigate) => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        }

        let user_data = {
            "user_id": user.id
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: '/api/providerServicesList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    dispatch(setMyJobs({ data: [...response.data] }))
                    dispatch(setAddServiceMode({ data: false }))
                    setLoading(false)
                    if (shouldNavigate) {
                        props.navigation.navigate('HomeScreen')
                    }
                }
                else {
                    setLoading(false)
                    if (shouldNavigate) {
                        props.navigation.navigate('HomeScreen')
                    }
                }
            }).catch(err => {
                setLoading(false)
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
                                        props.navigation.pop()
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
                                    latitude: 37.78825,
                                    longitude: -122.4324,
                                    latitudeDelta: 0.015,
                                    longitudeDelta: 0.0121,
                                }}>
                                <Marker
                                    coordinate={{
                                        latitude: 37.78825,
                                        longitude: -122.4324,
                                    }}
                                    title={"Title"}
                                    description={"Description"}
                                />
                            </MapView>
                        </View>
                        <View style={{ flex: 1, padding: 20 }}>
                            <Text style={{ fontFamily: LS_FONTS.PoppinsMedium }}>Travel Distance to provide service</Text>
                            <CustomTextInput
                                placeholder="Travel Distance"
                            />

                        </View>
                        <View style={{ paddingBottom: '2.5%' }}>
                            <CustomButton
                                title={"Save"}
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