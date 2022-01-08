import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator, FlatList ,Dimensions} from 'react-native'

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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import { BASE_URL, getApi } from '../../../api/api';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/core';
// placeholder image
const placeholder_image = require("../../../assets/user.png")
// order status types
// pending
// future
// inprogress
// completed
// rejected

const {height,width}=Dimensions.get("window")

const order_types = [
    { id: 1, title: "Pending" },
    { id: 3, title: "Future" },
    { id: 7, title: "InProgress" },
    { id: 8, title: "Completed" },
    { id: 2, title: "Cancelled" },
]

const OrderHistory = (props) => {
    const dispatch = useDispatch()
    const [selected, setselected] = useState(order_types[0])
    const access_token = useSelector(state => state.authenticate.access_token)
    const user = useSelector(state => state.authenticate.user)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    console.log(data)
    const [searchData, setSearchData] = useState({
        text: "",
        data: []
    })


    const [pageData, setPageData] = React.useState({
        current_page: 1,
        total: 0
    })

    useFocusEffect(React.useCallback(() => {
        getOrders(selected.id)
    }, [selected]))

  
    function filterwithNameAndService(item){
        let serviceNames=[...new Set(item.order_items?.map(x=>x.services_name))]
        if(`${item.customers_first_name} ${item.customers_last_name}`?.toLowerCase().includes(searchData.text?.toLowerCase())||serviceNames.filter(x=>x?.toLowerCase()?.includes(searchData.text?.toLowerCase()))?.length>0){
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
            data: JSON.stringify({ order_status, page }),
            endPoint: user.user_role == 3 ? '/api/providerOrderHistory' : "/api/customerOrderHistory",
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

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title="ORDER HISTORY"
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.goBack()
                }}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => {
                    props.navigation.navigate("HomeScreen")
                }}
            />
            <Container style={styles.container}>
                <Content
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    <View style={{ marginTop: 10 }}></View>
                    <CustomTextInput
                        placeholder="Search"
                        value={searchData.text}
                        onChangeText={t => { setSearchData(state => ({ ...state, text: t })) }}
                        customContainerStyle={{ marginHorizontal: '5%', marginBottom: 0 }}
                        customInputStyle={{ borderRadius: 6, paddingHorizontal: '8%', }}
                    />
                  <View style={{ flexDirection: "row", alignItems: "center",justifyContent:"space-between", marginTop: 20 }}>
                        <Text style={{ fontSize: 16, marginLeft: 15, fontFamily: LS_FONTS.PoppinsMedium }}>List of orders</Text>
                        <View style={{ flex: 0.8,alignSelf:"flex-end", marginRight: 20, alignItems: "flex-end" }}>
                           <DropDown
                               item={order_types.map(x => x.title)}
                               value={selected.title}
                               onChangeValue={(index, value) => { setselected(order_types[index]) }}
                               containerStyle={{ marginLeft:20, borderRadius: 6, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 10,borderWidth: 0 }}
                               dropdownStyle={{height:order_types.length*40}}
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
                            let serviceNames=[...new Set(item.order_items?.map(x=>x.services_name))]
                            if(item?.hide_order>0){
                                return null
                            }

                            return (<TouchableOpacity key={index} activeOpacity={0.7} onPress={() => {
                                props.navigation.navigate("ProviderStack", { screen: "OrderDetail", params: { item } })
                            }} style={{ height: 72, width: "95%", marginTop: 15, padding: 10, alignSelf: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#F3F3F3' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View>
                                        <Image
                                            style={{ height: 50, width: 50, resizeMode: 'contain', borderRadius: 100 }}
                                            source={user.user_role === 3 ? item?.customers_profile_image ? { uri: BASE_URL + item?.customers_profile_image } : placeholder_image : item?.providers_profile_image ? { uri: BASE_URL + item?.providers_profile_image } : placeholder_image}
                                        />
                                    </View>
                                    <View style={{ justifyContent: 'center', paddingLeft: 10, flex: 1 }}>
                                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>{user.user_role === 3 ? item.customers_first_name : item.providers_first_name} {user.user_role === 3 ? item.customers_last_name : item.providers_last_name}</Text>
                                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium }}>{serviceNames}</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsSemiBold, color: LS_COLORS.global.green, }}>Start Time</Text>
                                        <Text style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.darkBlack }}>{moment(item.order_start_time).format("MMMM DD [at] hh:mm A")}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>)
                        }}
                    />
                    <View style={{ height: 1, width: '95%', alignSelf: 'center', borderWidth: 0.7, borderColor: "#00000029", marginTop: 20 }}></View>
                    <View style={{ height: 30 }}></View>
                </Content>
            </Container>
        </SafeAreaView>
    )
}

export default OrderHistory;

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
    }
})
