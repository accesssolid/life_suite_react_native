import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles, showToast } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import Header from '../../../components/header';
import { Card, Container, Content } from 'native-base';
import DropDown from '../../../components/dropDown';
import CustomTextInput from '../../../components/customTextInput';
import Cards from '../../../components/cards';
import { BASE_URL, getApi } from '../../../api/api';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';

const Favourites = (props) => {
    const dispatch = useDispatch()
    const [selected, setselected] = useState(null)
    const [activeTab, setActivetab] = useState(0)
    const user = useSelector(state => state.authenticate.user)
    const [loading, setLoading] = useState(false)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [services, setServices] = useState([])
    const [provider, setProvider] = useState([])

    const navigation = useNavigation()

    useFocusEffect(useCallback(() => {
        getService()
        getServiceProvider()
    }, []))

    const like = (id) => {
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }

        let user_data = {
            "service_id": id,
        }
        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: user.user_role == 2 ? '/api/customerServiceAddFavourite' : '/api/customerServiceAddFavourite',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    showToast(response.message)
                    getService()
                }
                else {
                }
            }).catch(err => {
            })
    }

    const providerLike = (id) => {
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let user_data = {
            "provider_id": id,
        }
        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: user.user_role == 2 ? '/api/favouriteProviderAdd' : '/api/favouriteProviderAdd',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                console.log(response)
                if (response.status == true) {
                    showToast(response.message)
                    getServiceProvider()
                }
                else {

                }
            }).catch(err => {
            })
    }

    const getService = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }

        let config = {
            headers: headers,
            endPoint: user.user_role == 2 ? '/api/customerFavouriteServices' : '/api/customerFavouriteServices',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setLoading(false)
                    setServices([...response.data])
                }
                else {
                    setLoading(false)
                    setServices([])
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    const getServiceProvider = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            endPoint: user.user_role == 2 ? '/api/favouriteProviders' : '/api/favouriteProviders',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                console.log(response)
                if (response.status == true) {
                    setLoading(false)
                    setProvider([...response.data])
                }
                else {
                    setLoading(false)
                    setProvider([])
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title="Favorites"
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.goBack()
                }}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => {
                    navigation.navigate("HomeScreen")
                }}
            />
            <Container style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginVertical: 30 }}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => setActivetab(0)} style={{
                        backgroundColor: activeTab === 0 ? LS_COLORS.global.cyan : LS_COLORS.global.transparent,
                        borderRadius: 21,
                        paddingVertical: 12,
                        alignItems: 'center',
                        width: '40%',
                        borderWidth: 1,
                        borderColor: LS_COLORS.global.cyan
                    }}>
                        <Text style={{ fontFamily: LS_FONTS.PoppinsBold, fontSize: 12, color: LS_COLORS.global.darkBlack }}>Service</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => setActivetab(1)} style={{
                        backgroundColor: activeTab === 1 ? LS_COLORS.global.cyan : LS_COLORS.global.transparent,
                        borderRadius: 21,
                        paddingVertical: 12,
                        alignItems: 'center',
                        width: '40%',
                        borderWidth: 1,
                        borderColor: LS_COLORS.global.cyan
                    }}>
                        <Text style={{ fontFamily: LS_FONTS.PoppinsBold, fontSize: 12, color: LS_COLORS.global.darkBlack }}>Service Provider</Text>
                    </TouchableOpacity>
                </View>
                {
                    activeTab == 0
                        ?
                        <FlatList
                            data={services}
                            numColumns={3}
                            columnWrapperStyle={{ justifyContent: 'flex-start' }}
                            renderItem={({ item, index }) => {
                                return (
                                    <Cards
                                        title1={item.name}
                                        title2="SERVICES"
                                        imageUrl={{ uri: BASE_URL + item.image }}
                                        action={() => { navigation.navigate("ServicesProvided", { subService: item, items: [] }) }}
                                        showLeft
                                        customContainerStyle={{ width: '30%', marginLeft: '2.5%' }}
                                        favorite={() => { like(item.id) }}
                                    />
                                )
                            }}
                            keyExtractor={(item, index) => index}
                        />
                        :
                        <Content showsVerticalScrollIndicator={false} >
                            {provider.map((item, index) => {
                                console.log(item)
                                return (
                                    <View key={index} style={{ flexDirection: 'row', marginBottom: 30, height: 50, alignItems: 'center' }}>
                                        <View style={{ height: 40, aspectRatio: 1, borderRadius: 20, overflow: 'hidden' }}>
                                            <Image source={item.profile_image !== null ? { uri: BASE_URL + item.profile_image } : require('../../../assets/user.png')} style={{ height: '100%', width: '100%' }} resizeMode="contain" />
                                        </View>
                                        <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'center' }}>
                                            <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 16, color: LS_COLORS.global.darkBlack }}>{item.first_name}</Text>
                                            <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.darkBlack }}>{item.last_name}</Text>
                                        </View>
                                        <View>
                                            {/* <Text>Price: $25/hr</Text> */}
                                            <Text>Rating: {parseInt(item.rating)}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => { providerLike(item.id) }} activeOpacity={0.7} style={{ height: '100%', aspectRatio: 1, padding: '4%' }}>
                                            <Image source={require('../../../assets/heartGreen.png')} style={{ height: '100%', width: '100%' }} resizeMode="contain" />
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </Content>

                }
                <View style={{ height: 30 }}></View>
            </Container>
        </SafeAreaView>
    )
}

export default Favourites;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
        paddingHorizontal: 10,
        paddingBottom: 10,
        paddingHorizontal: 20
    },
    alexiContainer: {
        maxHeight: '100%',
        width: "95%",
        alignSelf: 'center',
        borderRadius: 6,
        padding: 10
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 32,
        width: 111,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 28,
        alignSelf: 'center',
        marginTop: 20
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    }
})
