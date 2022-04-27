import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Platform, ActivityIndicator, FlatList } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles, showToast } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
/* Components */
import Header from '../../../components/header';
import { Card, Container, Content } from 'native-base';
import DropDown from '../../../components/dropDown';
import CustomTextInput from '../../../components/customTextInput';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import { BASE_URL, getApi } from '../../../api/api';
import moment from 'moment';
import Loader from '../../../components/loader'
// placeholder image
const placeholder_image = require("../../../assets/user.png")
// order status types
// pending
// future
// inprogress
// completed
// rejected
import { Rating } from 'react-native-ratings';
import CancelModal from '../../../components/cancelModal';

const order_types = [
    { id: 1, title: "Requested" },
    { id: 3, title: "Upcoming" },
    { id: 7, title: "InProgress" },
    { id: 8, title: "Completed" },
    { id: 2, title: "Cancelled" },
    { id: undefined, title: "All" },
]
const notification_color = [
    {
        title: "Requesting",
        ids: [1],
        color: "orange"
    },
    {
        title: "Upcoming",
        ids: [3, 4, 6, 5, 12, 9, 10, 11],
        color: "#02a4ea"
    },
    {
        title: "InProgress",
        ids: [7, 15],
        color: "#fdca0d"
    },
    {
        title: "Completed",
        ids: [8],
        color: "#23b14d"
    },
    {
        title: "Cancelled",
        ids: [2, 14, 16, 13, 17],
        color: "#ec1c25"
    }
]

const OrderHistory1 = (props) => {
    const [reason, setReason] = useState("")
    const { user1 } = props.route.params
    const [open, setOpen] = useState(false)
    const [reason1, setReason1] = useState("")
    const [open1, setOpen1] = useState(false)
    const dispatch = useDispatch()
    const [selected, setselected] = useState(order_types[1])
    const access_token = useSelector(state => state.authenticate.access_token)
    const user = useSelector(state => state.authenticate.user)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [done, setDone] = useState('')
    const [orderId, setOrderId] = useState(0)
    const [providerId, setProviderId] = useState(0)
    const [searchData, setSearchData] = useState({
        text: "",
        data: []
    })
    const [loader, setLoader] = useState(false)
    const [pageData, setPageData] = React.useState({
        current_page: 1,
        total: 0
    })
    useEffect(() => {
        getOrders(selected.id)
    }, [selected])

    function filterwithNameAndService(item) {
        let serviceNames = [...new Set(item.order_items?.map(x => x.services_name))]
        if (`${item.providers_first_name} ${item.providers_last_name}`?.toLowerCase().includes(searchData.text?.toLowerCase()) || serviceNames.filter(x => x?.toLowerCase()?.includes(searchData.text?.toLowerCase()))?.length > 0) {
            return true
        }
        return false
    }
    useEffect(() => {
        if (searchData.text?.trim() !== "") {
            let dataCopy = data.filter(filterwithNameAndService)
            setSearchData(state => ({ ...state, data: dataCopy }))
        } else {
            setSearchData(state => ({ ...state, data: data }))
        }
    }, [searchData.text])

    useEffect(() => {
        setSearchData(state => ({ ...state, data: data }))
    }, [data])

    const getOrders = async (order_status, page = 1) => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            data: JSON.stringify({ order_status, page, provider_id: user1 }),
            endPoint: '/api/ordersWithProvider',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                console.log(response)
                if (response.status == true) {
                    if (response.data?.data) {
                        if (page == 1) {
                            setData(response.data.data)
                        } else {
                            setData(state => ([...state, ...response.data.data]))
                        }
                        setPageData({
                            current_page: response.data?.current_page,
                            total: response?.data?.total
                        })
                    } else {
                        setData([])
                        setPageData({
                            total: 0,
                            current_page: 1
                        })
                    }
                }
                else {
                    setData([])
                    setPageData({
                        total: 0,
                        current_page: 1
                    })
                    showToast(response.message)
                }
            }).catch(err => {
            }).finally(() => {
                setLoading(false)
            })
    }

    const cancelOrder = async () => {
        setLoader(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let user_data = {
            "order_id": orderId,
            "order_status": 2,
            "reason": reason
        }

        let config = {
            headers: headers,
            data: JSON.stringify(user_data),
            endPoint: "/api/customerOrderStatusUpdate",
            type: 'post'
        }
        console.log(config)
        getApi(config)
            .then((response) => {
                console.log(response)
                if (response.status == true) {
                    showToast(response.message)
                    getOrders(1, 1)
                    setLoader(false)
                }
                else {
                    showToast(response.message)
                    setLoader(false)
                }
            }).catch(err => {
            }).finally(() => {
                setLoader(false)
            })
    }
    const blockUser = async () => {
        setLoader(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let user_data = {
            "provider_id": providerId,
            "reason_description": reason1,
        }

        let config = {
            headers: headers,
            data: JSON.stringify(user_data),
            endPoint: "/api/blockProvider",
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                console.log(response)
                if (response.status == true) {
                    showToast(response.message)
                    getOrders(1, 1)
                    setLoader(false)
                }
                else {
                    showToast(response.message)
                    setLoader(false)
                }
            }).catch(err => {
            }).finally(() => {
                setLoader(false)
            })
    }

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <CancelModal
                title="Kindly fill the reason for cancellation"
                visible={open}
                value={reason}
                onChangeText={(t) => { setReason(t) }}
                action={() => {
                    if (!reason) {
                        showToast("Reason cannot be empty!")
                    }
                    else {
                        setOpen(!open)
                        setReason('')
                        cancelOrder()
                    }
                }}
                action1={() => {
                    setOpen(!open)
                }}
            />
            <CancelModal
                title="Kindly fill the reason for block"
                visible={open1}
                value={reason1}
                onChangeText={(t) => { setReason1(t) }}
                action={() => {
                    if (!reason1) {
                        showToast("Reason cannot be empty!")
                    }
                    else {
                        setOpen1(!open1)
                        setReason1('')
                        blockUser()
                    }
                }}
                action1={() => {
                    setOpen1(!open1)
                }}
            />
            <Header
                title="MY ORDER"
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.goBack()
                }}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => {
                    props.navigation.navigate("HomeScreen")
                }}
                containerStyle={{backgroundColor:LS_COLORS.global.cyan}}

            />
            <Container style={styles.container}>
                <Content
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    <CustomTextInput
                        placeholder="Search"
                        value={searchData.text}
                        onChangeText={t => { setSearchData(state => ({ ...state, text: t })) }}
                        customContainerStyle={{ marginHorizontal: '5%', marginBottom: 0, marginTop: 20 }}
                        customInputStyle={{ borderRadius: 6, paddingHorizontal: '8%', }}
                    />
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
                        <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 16, marginLeft: 15, fontFamily: LS_FONTS.PoppinsMedium }}>Filter by</Text>
                        <View style={{ flex: 0.8, alignSelf: "flex-end", marginRight: 20, alignItems: "flex-end" }}>
                            <DropDown
                                handleTextValue={true}
                                item={order_types.map(x => x.title)}
                                value={selected.title}
                                onChangeValue={(index, value) => { setselected(order_types[index]) }}
                                containerStyle={{ marginLeft: 20, borderRadius: 6, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 10, borderWidth: 0 }}
                                dropdownStyle={{ height: order_types.length * 40 }}
                            />
                        </View>
                    </View>
                    <FlatList
                        data={searchData.data}
                        ListFooterComponent={loading && <ActivityIndicator color={LS_COLORS.global.green} />}
                        keyExtractor={(item, index) => item.id + "" + index}
                        onEndReached={e => {
                            if (data.length < pageData.total) {
                                getOrders(selected.id, pageData.current_page + 1)
                            }
                        }}
                        renderItem={({ item, index }) => {
                            console.log(item)
                            let serviceNames = [...new Set(item.order_items?.map(x => x.services_name))]
                            let backgroundColor = "#5CBFBF"
                            let oType=""
                            for (let c of notification_color) {
                                if (c.ids.includes(item.order_status)) {
                                    backgroundColor = c.color
                                    oType=c.title
                                    break
                                }
                            }
                            return (
                                <TouchableOpacity key={index} activeOpacity={0.7} onPress={() => {
                                    props.navigation.navigate("UserStack", { screen: "OrderDetailCustomer", params: { item } })
                                }} style={{ width: "95%", marginTop: 15,overflow:"hidden", padding: 10, alignSelf: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#F3F3F3' }}>
                                    <View style={{ width: 6,height:2000,position:"absolute", borderRadius: 12,left:0,backgroundColor: backgroundColor }}></View>
                                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
                                    <View>
                                        <Image
                                            style={{ height: 50, width: 50, resizeMode: 'contain', borderRadius: 100 }}
                                            source={user.user_role === 3 ? item?.customers_profile_image ? { uri: BASE_URL + item?.customers_profile_image } : placeholder_image : item?.providers_profile_image ? { uri: BASE_URL + item?.providers_profile_image } : placeholder_image}
                                        />
                                    </View>
                                    <View style={{ justifyContent: 'center', paddingLeft: 10,flex:1 }}>
                                        <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>{user.user_role === 3 ? item.customers_first_name : item.providers_first_name} {user.user_role === 3 ? item.customers_last_name : item.providers_last_name}</Text>
                                        <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>{serviceNames}</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'flex-end', flex: 1 }}>
                                        <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsSemiBold, color: LS_COLORS.global.green, }}>Start Time</Text>
                                        <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, textAlign: "right", fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.darkBlack }}>{moment(item.order_start_time).format("MMMM DD [at] hh:mm A")}</Text>
                                        {selected?.id==undefined&&<Text maxFontSizeMultiplier={1.2}  style={{ fontSize: 11,textAlign:"right", fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.darkBlack }}>{oType}</Text>}
                                    </View>
                                </View>
                                  
                                </TouchableOpacity>
                            )
                        }}
                    />
                    <View style={{ height: 1, width: '95%', alignSelf: 'center', borderWidth: 0.7, borderColor: "#00000029", marginTop: 20 }}></View>
                    <View style={{ height: 30 }}></View>
                </Content>
                {loader && <Loader />}
            </Container>
        </SafeAreaView>
    )
}

export default OrderHistory1;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
        paddingHorizontal: 10,
        paddingBottom: 10
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
    },
    greenTextStyle: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.green
    },
    baseTextStyle: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: "black"
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 45,
        width: 122,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 6,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 33
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: 'white'
    }
})
