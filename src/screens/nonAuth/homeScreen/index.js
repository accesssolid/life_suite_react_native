import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, Touchable, TouchableOpacity, FlatList } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import SortableGrid from 'react-native-sortable-grid-with-fixed'

/* Components */
import Cards from '../../../components/cards';
import UserCards from '../../../components/userCards';
import { BASE_URL, getApi } from '../../../api/api';
import { setServices } from '../../../redux/features/loginReducer';
import Loader from '../../../components/loader';
import { setMyJobs } from '../../../redux/features/provider';
import { showToast } from '../../../components/validators';
import { TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { setAddServiceMode } from '../../../redux/features/services';

const HomeScreen = (props) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.authenticate.user)
    const services = useSelector(state => state.authenticate.services)
    const myJobs = useSelector(state => state.provider.myJobs)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [isAddJobActive, setIsAddJobActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([...services])
    const [search, setSearch] = useState('')

    useEffect(() => {
        getServices()
        if (user.user_role == 3) {
            getMyJobs()
        }
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            dispatch(setAddServiceMode({ data: false }))
        }, [])
    );

    const getServices = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }

        let user_data = {
            "user_id": user.id
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: user.user_role == 2 ? '/api/servicesList' : '/api/providerServicesList',
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
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }

        let user_data = {
            "user_id": user.id
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: '/api/providerAddedServicesList',
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

    const goToItems = (item) => {
        dispatch(setAddServiceMode({ data: true })),
            props.navigation.navigate("ServicesProvided", { subService: item, items: [...item.itemsData] })
    }

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={{ ...styles.image, overflow: 'hidden', /* TEMP -> */ borderRadius: 0, width: 30 /* <- TEMP */ }}
                        onPress={() => { props.navigation.openDrawer() /* props.navigation.navigate("Profile") */ }}>
                        <Image
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"
                            source={require('../../../assets/menu.png') /* user.profile_image ? { uri: BASE_URL + user.profile_image } : require("../../../assets/user.png") */}
                        />
                    </TouchableOpacity>
                    <View style={{ flex: 1, paddingHorizontal: '5%' }}>
                    </View>
                    {
                        user.user_role == 2
                            ?
                            <TouchableOpacity style={styles.search}
                                activeOpacity={0.7}
                                onPress={() => { props.navigation.navigate('Search') }}>
                                <Image
                                    style={styles.searchImage}
                                    source={require("../../../assets/search.png")}
                                />
                            </TouchableOpacity>
                            :
                            null
                    }
                    {/* {user.user_role == 3 && <TouchableOpacity activeOpacity={0.7} onPress={() => props.navigation.navigate('AddTimeFrame')} style={{ height: 35, aspectRatio: 1 }}>
                        <Image source={require('../../../assets/wall-clock.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                    </TouchableOpacity>} */}
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
                                                    goToItems(item)
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
                                {!loading && <Text style={{ fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 16 }}>No Jobs Added Yet</Text>}
                            </View>
                    :
                    <View style={{ flex: 1, paddingTop: '5%' }}>
                        <SortableGrid
                            blockTransitionDuration={200}
                            activeBlockCenteringDuration={200}
                            itemsPerRow={2}
                            dragActivationTreshold={200}
                            onDragRelease={(itemOrder) => console.log("Drag was released, the blocks are in the following order: ", itemOrder)}
                            onDragStart={() => console.log("Some block is being dragged now!")}>
                            {items.map((item, index) =>
                                <View key={index}
                                    style={{ alignItems: 'center', justifyContent: 'center' }}
                                    onTap={() => {
                                        item.itemsData.length > 0
                                            ?
                                            props.navigation.navigate("ServicesProvided", { subService: item, items: [...item.itemsData] })
                                            :
                                            props.navigation.navigate("SubServices", { service: item })
                                    }}>
                                    <UserCards
                                        title1={item.name}
                                        title2="SERVICES"
                                        imageUrl={{ uri: BASE_URL + item.image }}
                                    />
                                </View>
                            )}
                        </SortableGrid>
                    </View>}
                {!loading && <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={styles.orderContainer}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => user.user_role == 3 ? props.navigation.navigate("OrderHistory1") : props.navigation.navigate("OrderHistory")}>
                            <Text style={styles.order}>
                                ORDER
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {user.user_role == 3 && <View style={styles.orderContainer}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => showToast("WORK IN PROGRESS")}>
                            <Text style={styles.order}>
                                LOCATION
                            </Text>
                        </TouchableOpacity>
                    </View>}
                    {user.user_role == 3 && <View style={styles.orderContainer}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => props.navigation.navigate('AddTimeFrame', { serviceData: {} })}>
                            <Text style={styles.order}>
                                SCHEDULE
                            </Text>
                        </TouchableOpacity>
                    </View>}
                </View>}
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
        // height: 44,
        aspectRatio: 1,
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
        // position: 'absolute',
        // bottom: "4%",
        height: 32,
        width: 111,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 28,
        alignSelf: 'center', width: '30%'
    },
    order: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    }
})


