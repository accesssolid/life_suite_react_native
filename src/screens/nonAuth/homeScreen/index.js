import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, Touchable, TouchableOpacity, FlatList } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import Cards from '../../../components/cards';
import { BASE_URL, getApi } from '../../../api/api';
import { setServices } from '../../../redux/features/loginReducer';
import Loader from '../../../components/loader';
import { setMyJobs } from '../../../redux/features/provider';
import { showToast } from '../../../components/validators';
import { TextInput } from 'react-native';

const HomeScreen = (props) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.authenticate.user)
    const services = useSelector(state => state.authenticate.services)
    const myJobs = useSelector(state => state.provider.myJobs)
    const [isAddJobActive, setIsAddJobActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isSearchActive, setSearchActive] = useState(false)
    const [items, setItems] = useState([...services])
    const [search, setSearch] = useState('')

    useEffect(() => {
        getServices()
        if (user.user_role == 3) {
            getMyJobs()
        }
    }, [])

    const getServices = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        }

        let user_data = {}

        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: '/api/servicesList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    dispatch(setServices({ data: [...response.data] }))
                    setItems([...response.data])
                    setLoading(false)
                }
                else {
                    showToast(response.message, 'danger')
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    const getMyJobs = () => {
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
                    setLoading(false)
                }
                else {
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    const searchFilterFunction = (text) => {
        if (text) {
            const newData = services.filter(
                function (item) {
                    const itemData = item.name
                        ? item.name.toUpperCase()
                        : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                }
            );
            setItems(newData);
            setSearch(text);
        } else {
            setItems(services);
            setSearch(text);
        }
    };

    const cancelSearch = () => {
        setSearchActive(false)
        searchFilterFunction('')
    }

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={{ ...styles.image, overflow: 'hidden' }}
                        onPress={() => { props.navigation.navigate("Profile") }}>
                        <Image
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"
                            source={user.profile_image ? { uri: BASE_URL + user.profile_image } : require("../../../assets/andrea.png")}
                        />
                    </TouchableOpacity>
                    <View style={{ flex: 1, paddingHorizontal: '5%' }}>
                        {isSearchActive && <TextInput
                            style={{ backgroundColor: LS_COLORS.global.lightGrey, height: 40, borderRadius: 50, paddingHorizontal: '10%', fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.black }}
                            placeholder="Search ..."
                            placeholderTextColor={LS_COLORS.global.placeholder}
                            onChangeText={searchFilterFunction}
                            value={search}
                        />}
                    </View>
                    {user.user_role == 2
                        ?
                        <TouchableOpacity style={styles.search}
                            activeOpacity={0.7}
                            onPress={() => !isSearchActive ? setSearchActive(true) : cancelSearch()}>
                            <Image
                                style={styles.searchImage}
                                source={require("../../../assets/search.png")}
                            />
                        </TouchableOpacity>
                        :
                        user.user_role == 3 && isAddJobActive
                            ?
                            <TouchableOpacity style={styles.search}
                                activeOpacity={0.7}
                                onPress={() => !isSearchActive ? setSearchActive(true) : cancelSearch()}>
                                <Image
                                    style={styles.searchImage}
                                    source={require("../../../assets/search.png")}
                                />
                            </TouchableOpacity>
                            :
                            null
                    }

                </View>
                {user.user_role == 3 && <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 25, marginBottom: 15, backgroundColor: isAddJobActive ? 'rgba(0,0,0,0.2)' : LS_COLORS.global.white, alignSelf: 'flex-start', padding: 5, borderRadius: 8 }} activeOpacity={0.7} onPress={() => setIsAddJobActive(!isAddJobActive)}>
                    <View style={{ height: 30, aspectRatio: 1 }}>
                        <Image source={require('../../../assets/addgreen.png')} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
                    </View>
                    <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 18, letterSpacing: 0.36, color: LS_COLORS.global.black, marginLeft: 11 }}>ADD JOB</Text>
                </TouchableOpacity>}
                {user.user_role == 3
                    ?
                    isAddJobActive
                        ?
                        <View style={{ flex: 1, paddingTop: '5%' }}>
                            <FlatList
                                data={items}
                                numColumns={2}
                                columnWrapperStyle={{ justifyContent: 'space-between' }}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Cards
                                            title1={item.name}
                                            title2="SERVICES"
                                            imageUrl={{ uri: BASE_URL + item.image }}
                                            action={() => {
                                                item.itemsData.length > 0
                                                    ?
                                                    props.navigation.navigate("ServicesProvided", { subService: item, items: [...item.itemsData] })
                                                    :
                                                    props.navigation.navigate("SubServices", { service: item })
                                            }}
                                        />
                                    )
                                }}
                                keyExtractor={(item, index) => index}
                            />
                        </View>
                        :
                        myJobs.length > 0
                            ?
                            <FlatList
                                data={[...myJobs]}
                                numColumns={2}
                                columnWrapperStyle={{ justifyContent: 'space-between' }}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Cards
                                            title1={item.name}
                                            imageUrl={{ uri: BASE_URL + item.image }}
                                            action={() => {
                                                props.navigation.navigate("ServicesProvided", { subService: item });
                                            }}
                                        />
                                    )
                                }}
                                keyExtractor={(item, index) => index}
                            />
                            :
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 16 }}>No Jobs Added Yet</Text>
                            </View>
                    :
                    <View style={{ flex: 1, paddingTop: '5%' }}>
                        <FlatList
                            data={items}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            renderItem={({ item, index }) => {
                                return (
                                    <Cards
                                        title1={item.name}
                                        title2="SERVICES"
                                        imageUrl={{ uri: BASE_URL + item.image }}
                                        action={() => {
                                            item.itemsData.length > 0
                                                ?
                                                props.navigation.navigate("ServicesProvided", { subService: item, items: [...item.itemsData] })
                                                :
                                                props.navigation.navigate("SubServices", { service: item })
                                        }}
                                    />
                                )
                            }}
                            keyExtractor={(item, index) => index}
                        />
                    </View>}
                <View style={styles.orderContainer}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            user.user_role == 3
                                ?
                                props.navigation.navigate("OrderHistory1")
                                :
                                props.navigation.navigate("OrderHistory")
                        }}>
                        <Text style={styles.order}>
                            ORDER
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {loading && <Loader />}
        </SafeAreaView>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
        padding: 20
    },
    image: {
        resizeMode: 'contain',
        width: 44,
        height: 44,
        borderRadius: 50
    },
    search: {
        width: 44,
        height: 44,
        borderRadius: 100,
        borderColor: LS_COLORS.global.lightGrey,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchImage: {
        resizeMode: 'contain',
        width: 17,
        height: 17,
    },
    orderContainer: {
        justifyContent: "center",
        alignItems: 'center',
        position: 'absolute',
        bottom: "4%",
        height: 32,
        width: 111,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 28,
        alignSelf: 'center'
    },
    order: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    }
})


