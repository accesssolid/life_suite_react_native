import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'

/* Components */;
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Container, Content, Row, } from 'native-base'
import { TextInput } from 'react-native-gesture-handler';
import { BASE_URL, getApi } from '../../../api/api';
import Loader from '../../../components/loader';
import { showToast } from '../../../components/validators';
import ServiceItemUser from '../../../components/serviceItemUser';
import { indexOf } from 'lodash';

const ServicesProvided = (props) => {
    const dispatch = useDispatch()
    const { subService } = props.route.params
    const [itemList, setItemList] = useState([])
    const [itemListMaster, setItemListMaster] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([])
    const access_token = useSelector(state => state.authenticate.access_token)
    const [activeItem, setActiveItem] = useState(null)
    const [extraData, setExtraDataa] = useState([])
    const [vehicleType, setVehicleType] = useState('Car')

    useEffect(() => {
        if (subService.id == 14) {
            filterServices()
        }
    }, [vehicleType, itemListMaster])

    useEffect(() => {
        if (subService.id == 14) {
            filterServices()
        }
        getServiceItems()
    }, [])

    const getServiceItems = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }

        let user_data = {
            "service_id": subService.id
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: '/api/subServicesItemList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setLoading(false)
                    setItemList([...response.data])
                    setItemListMaster([...response.data])
                    if (subService.id == 14) {
                        filterServices()
                    }
                }
                else {
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    const setCheckedData = (item) => {
        let arr = [...selectedItems]
        if (arr.includes(item.id)) {
            arr.splice(arr.indexOf(item.id), 1)
            setActiveItem(null)
        } else {
            arr.push(item.id)
        }
        setSelectedItems([...arr])
    }

    const setCheckedDataProducts = (item) => {
        let arr = [...selectedProducts]
        if (arr.includes(item.id)) {
            arr.splice(arr.indexOf(item.id), 1)
        } else {
            arr.push(item.id)
        }
        setSelectedProducts([...arr])
    }

    const next = () => {
        let servicedata = []
        itemList.forEach(element => {
            if (selectedItems.includes(element.id)) {
                servicedata.push({
                    "item_id": element.id,
                    "products": selectedProducts
                })
            }
        });
        props.navigation.navigate("MechanicLocation", { servicedata: servicedata, subService: subService })
    }

    const onPressItem = (item, index) => {
        if (!selectedItems.includes(item.id)) {
            setCheckedData(item)
        }
        if (activeItem == null) {
            setActiveItem(item)
        } else {
            setActiveItem(null)
        }
    }

    const saveRequest = () => {
        let isSelected = false
        activeItem.products.forEach(element => {
            if (selectedProducts.includes(element.id)) {
                isSelected = true
            }
        });

        if (isSelected) {
            setActiveItem(null)
        } else {
            alert("Please select atleast one item")
        }
    }

    const setExtraData = (data, item) => {
        let obj = {
            parent_id: item.id,
        }

        if (data.isOtherSelected) {
            obj['other'] = data.other
        } else {
            obj['other'] = ''
        }
        if (data.isHaveOwnSelected) {
            obj['have_own'] = data.have_own
        } else {
            obj['have_own'] = ''
        }
        obj['need_recommendation'] = data.need_recommendation

        let temp = [...extraData]
        if (temp.length == 0) {
            temp.push(obj)
        } else {
            extraData.forEach((element, index) => {
                if (element.id == item.id) {
                    temp[index] = obj
                }
            });
        }

        setExtraDataa([...temp])
    }

    const getVariantId = (name) => {
        switch (name) {
            case 'Car':
                return 3
            case 'Truck':
                return 4
            case 'Suv':
                return 5
            case 'Van':
                return 6
        }
    }

    const filterServices = () => {
        const filtered = itemListMaster.filter(item => item.variant_data == getVariantId(vehicleType))
        setItemList([...filtered])
    }

    return (
        <>
            <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content" />
            <View style={{ width: '100%', height: '30%' }}>
                <ImageBackground
                    resizeMode="stretch"
                    source={{ uri: BASE_URL + subService.image }}
                    style={styles.image}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
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
                            <View style={{ justifyContent: 'center', alignItems: "center", height: "33%" }}>
                                <Text style={{ fontSize: 29, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.white }}>{subService.name}</Text>
                            </View>
                        </SafeAreaView>
                    </View>
                </ImageBackground>
            </View>
            <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
                <View style={styles.container}>
                    <Container style={{ marginTop: 26 }}>
                        <Text style={{ paddingLeft: '5%', fontFamily: LS_FONTS.PoppinsMedium, fontSize: 16, marginBottom: 10 }}>Select Services</Text>

                        {
                            activeItem !== null
                                ?
                                <>
                                    <ServiceItemUser
                                        item={activeItem}
                                        onCheckPress={() => setCheckedData(activeItem)}
                                        isSelected={selectedItems.includes(activeItem.id)}
                                        selectedProducts={selectedProducts}
                                        onSelectProduct={(product) => setCheckedDataProducts(product)}
                                        activeMode
                                        setExtraData={setExtraData}
                                    />
                                </>
                                :
                                itemListMaster.length > 0
                                    ?
                                    <Content style={{ flex: 1 }}>
                                        {subService.id == 14 && <View style={{}}>
                                            <DropDown
                                                title="Vehicle Type"
                                                item={['Car', 'Truck', 'Suv', 'Van']}
                                                value={vehicleType}
                                                onChangeValue={(index, value) => setVehicleType(value)}
                                                containerStyle={{ width: '90%', alignSelf: 'center', borderRadius: 5, backgroundColor: LS_COLORS.global.white, marginBottom: 15, borderWidth: 1, borderColor: LS_COLORS.global.grey }}
                                                dropdownStyle={{ maxHeight: 300 }}
                                            />
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: '3.5%' }}>
                                                <View style={{ flex: 1 }}>
                                                    <DropDown
                                                        title="Make"
                                                        item={['1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021']}
                                                        value={'1990'}
                                                        onChangeValue={(index, value) => { }}
                                                        containerStyle={{ width: '80%', alignSelf: 'center', borderRadius: 5, backgroundColor: LS_COLORS.global.white, marginBottom: 15, borderWidth: 1, borderColor: LS_COLORS.global.grey, flexDirection: 'column' }}
                                                        dropdownStyle={{ maxHeight: 300 }}
                                                    />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <DropDown
                                                        title="Model"
                                                        item={['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10']}
                                                        value={'A1'}
                                                        onChangeValue={(index, value) => { }}
                                                        containerStyle={{ width: '80%', alignSelf: 'center', borderRadius: 5, backgroundColor: LS_COLORS.global.white, marginBottom: 15, borderWidth: 1, borderColor: LS_COLORS.global.grey }}
                                                        dropdownStyle={{ maxHeight: 300 }}
                                                    />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <DropDown
                                                        title="Year"
                                                        item={['1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021']}
                                                        value={'2001'}
                                                        onChangeValue={(index, value) => { }}
                                                        containerStyle={{ width: '80%', alignSelf: 'center', borderRadius: 5, backgroundColor: LS_COLORS.global.white, marginBottom: 15, borderWidth: 1, borderColor: LS_COLORS.global.grey }}
                                                        dropdownStyle={{ maxHeight: 300 }}
                                                    />
                                                </View>
                                            </View>
                                        </View>}
                                        {itemList && itemList.length > 0
                                            ?
                                            itemList.map((item, index) => {
                                                return (<ServiceItemUser
                                                    key={index}
                                                    item={item}
                                                    index={index}
                                                    onCheckPress={() => onPressItem(item, index)}
                                                    isSelected={selectedItems.includes(item.id)}
                                                    setExtraData={setExtraData}
                                                />)
                                            })
                                            :
                                            null}
                                    </Content>
                                    :
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        {!loading && <Text style={{ fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 16 }}>No Services Available</Text>}
                                    </View>
                        }
                        <TouchableOpacity
                            style={styles.save}
                            activeOpacity={0.7}
                            onPress={() => {
                                activeItem !== null
                                    ?
                                    saveRequest()
                                    :
                                    selectedItems.length > 0
                                        ?
                                        next()
                                        :
                                        showToast("Select service first")
                            }}>
                            <Text style={styles.saveText}>{activeItem !== null ? 'Save Request' : 'Next'}</Text>
                        </TouchableOpacity>
                        <View style={{ height: 30 }}></View>
                    </Container>
                </View>
                {loading && <Loader />}
            </SafeAreaView >
        </>
    )
}

export default ServicesProvided;

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
        marginTop: 20
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
        height: 40,
        width: 75,
        alignItems: 'center',
        borderColor: LS_COLORS.global.lightTextColor,
        justifyContent: "center",
        backgroundColor: '#ECECEC',
        paddingHorizontal: 5,
        // marginRight: '10%'
    },
    inputStyle: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        // textAlign: 'center'
    },
})





