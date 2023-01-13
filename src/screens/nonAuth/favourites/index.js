import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, SafeAreaView, FlatList, Dimensions, Pressable } from 'react-native'

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
import { setAddServiceMode } from '../../../redux/features/services';
import { role } from '../../../constants/globals';
import { setFavList } from '../../../redux/features/favorites';
import lodash from 'lodash'
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
            endPoint: user.user_role == 2 ? '/api/customerServiceAddFavourite' : '/api/providerServiceAddFavourite',
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
            endPoint: user.user_role == 2 ? '/api/customerFavouriteServices' : '/api/providerFavouriteServices',
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
                    dispatch(setFavList([...response.data]))
                }
                else {
                    setLoading(false)
                    setProvider([])
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    const onItemPress = (item) => {
        dispatch(setAddServiceMode({ data: true }))
        if(user?.user_role==role.customer){
            navigation.navigate("HomeScreen",{screen:"ServicesProvided",params:{ subService: item, items: [] }})
        }else{
            navigation.navigate("ServicesProvided",{ subService: item, items: [] })
        }
    }

    const goBack = () => {
        dispatch(setAddServiceMode({ data: false }))
        navigation.navigate("HomeScreen",{screen:"HomeScreen"})

    }

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title="Favorites"
                imageUrl={require("../../../assets/back.png")}
                action={() => goBack()}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => {
                    navigation.navigate("HomeScreen",{screen:"HomeScreen"})
                }}
                containerStyle={{backgroundColor:LS_COLORS.global.cyan}}

            />
            <Container style={styles.container}>
                {user.user_role == 2 &&
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
                            <Text maxFontSizeMultiplier={1.4} style={{ fontFamily: LS_FONTS.PoppinsBold, fontSize: 12, color: LS_COLORS.global.darkBlack }}>Service</Text>
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
                            <Text maxFontSizeMultiplier={1.4} style={{ fontFamily: LS_FONTS.PoppinsBold, fontSize: 12, color: LS_COLORS.global.darkBlack }}>Service Provider</Text>
                        </TouchableOpacity>
                    </View>}

                {activeTab == 0
                    ?
                    <FlatList
                        data={services}
                        numColumns={3}
                        contentContainerStyle={{ paddingTop: user.user_role == 2 ? 0 : '5%' }}
                        columnWrapperStyle={{ justifyContent: 'flex-start' }}
                        renderItem={({ item, index }) => {
                            return (
                                <Cards
                                    title1={item.name}
                                    title2="SERVICES"
                                    imageUrl={{ uri: BASE_URL + item.image }}
                                    action={() => onItemPress(item)}
                                    showLeft
                                    customContainerStyle={{ width: '30%', marginLeft: '2.5%' }}
                                    favorite={() => { like(item.id) }}
                                />
                            )
                        }}
                        keyExtractor={(item, index) => index}
                        ListEmptyComponent={() => {
                            return (<View style={{ flex: 1, width: '100%', height: Dimensions.get('screen').height / 1.25, alignItems: 'center', justifyContent: 'center' }}>
                                <Text maxFontSizeMultiplier={1.4}>No Favourites</Text>
                            </View>)

                        }}
                    />
                    :
                    <Content showsVerticalScrollIndicator={false} >
                        {provider.map((item, index) => {
                            return (
                                <Pressable key={index+""+item?.id} onPress={()=>{
                                    // navigation.navigate("UserStack",{screen:"ProviderDetail",params:{providerId:item.id}})
                                    navigation.navigate("OrderHistoryCustomer", { user1: item.id })

                                }}>
                                <Card  style={{ flexDirection: 'row', marginBottom: 20, alignItems: 'center', height: 70, paddingHorizontal: 10, borderRadius: 12 }}>
                                    <Pressable onPress={()=>{
                                        navigation.navigate("UserStack",{screen:"ProviderDetail",params:{providerId:item.id}})
                                    }} style={{ height: 40, aspectRatio: 1, borderRadius: 20, overflow: 'hidden' }}>
                                        <Image source={item.profile_image !== null ? { uri: BASE_URL + item.profile_image } : require('../../../assets/user.png')} style={{ height: '100%', width: '100%' }} resizeMode="contain" />
                                    </Pressable>
                                    <Pressable 
                                    onPress={()=>{
                                        navigation.navigate("UserStack",{screen:"ProviderDetail",params:{providerId:item.id}})

                                    }}
                                    style={{  paddingLeft: 10, justifyContent: 'center' }}>
                                        <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 16, color: LS_COLORS.global.darkBlack }}>{item.first_name}</Text>
                                        <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.darkBlack }}>{item.last_name}</Text>
                                    </Pressable>
                                    <View style={{flex:1}} />
                                    <View>
                                        {/* <Text maxFontSizeMultiplier={1.5}>Price: $25/hr</Text> */}
                                        <Text maxFontSizeMultiplier={1.5}>Rating: {lodash.round(item.rating,2)}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => { providerLike(item.id) }} activeOpacity={0.7} style={{ height: 50, justifyContent: 'center', alignItems: "center", marginLeft: 10 }}>
                                        <Image source={require('../../../assets/heartGreen.png')} style={{ height: 25, width: 25 }} resizeMode="contain" />
                                    </TouchableOpacity>
                                </Card>
                                </Pressable>
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
