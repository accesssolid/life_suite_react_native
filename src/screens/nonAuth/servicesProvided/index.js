import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, Platform, KeyboardAvoidingView, TouchableOpacity, ScrollView, Alert } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

/* Components */;
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Container, Content } from 'native-base'
import { BASE_URL, getApi } from '../../../api/api';
import Loader from '../../../components/loader';
import { showToast } from '../../../components/validators';
import ServiceItemUser from '../../../components/serviceItemUser';

import _ from 'lodash'
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
    // vehicle
    const [makeList, setMakeList] = React.useState([])
    const [modelList, setModelList] = React.useState([])
    const [yearList, setYearList] = React.useState([])
    // 
    const [selectedMake, setSelectedMake] = React.useState("")
    const [selectedModel, setSelectedModel] = React.useState("")
    const [selectedYear, setSelectedYear] = React.useState("")



    const getMakeList = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }

        let config = {
            headers: headers,
            data: JSON.stringify({}),
            endPoint: '/api/makeList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setMakeList(response.data)
                }
                else {
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            }).finally(() => {
                setLoading(false)

            })
    }

    React.useEffect(() => {
        getMakeList()
    }, [])

    React.useEffect(() => {
        if (selectedMake && selectedMake != "") {
            getModelsList(selectedMake)
            setSelectedModel("")
            setSelectedYear("")
            setYearList([])
        }
    }, [selectedMake])

    const getModelsList = async (selectedMake) => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ make_id: selectedMake }),
            endPoint: '/api/modelList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setModelList(response.data)
                    // setSelectedModel(response.data)
                }
                else {
                    setModelList([])

                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            }).finally(() => {
                setLoading(false)

            })
    }

    React.useEffect(() => {
        if (selectedModel && selectedModel != "") {
            getYear(selectedModel)
            setSelectedYear("")
        }
    }, [selectedModel])

    const getYear = async (id) => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ model_id: id }),
            endPoint: '/api/yearList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setYearList(response.data)
                }
                else {
                    setYearList([])
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            }).finally(() => {
                setLoading(false)
            })
    }

 

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
                console.log("Response",JSON.stringify(response))
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

        props.navigation.navigate("MechanicLocation", { servicedata: servicedata, subService: subService, extraData: extraData })
    }

    const onPressItem = (item) => {
        if (!selectedItems.includes(item.id)) {
            setCheckedData(item)
        }
        if (activeItem == null) {
            setActiveItem(item)
        } else {
            Alert.alert(
                "Lifesuite",
                "Remove selected items ?",
                [
                    {
                        text: "Cancel",
                        onPress: () => { },
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => discardItem(item) }
                ]
            );
        }
    }

    const discardItem = (item) => {
        setActiveItem(null)
        setCheckedData(item)
        item.products.forEach(element => {
            if (selectedProducts.includes(element.id)) {
                selectedProducts.splice(selectedProducts.indexOf(element.id), 1)
            }
        });
    }

    const saveRequest = () => {
        console.log(activeItem,selectedProducts)
        let isSelected = false
       
        activeItem.products.forEach(element => {
            if (selectedProducts.includes(element.id)) {
                isSelected = true
            }
        });

        if (activeItem.products.length == 0) {
            isSelected = true
        }
        if(activeItem.is_product_mandatory=="0"){
            isSelected=true
        }
        
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
        let temp = _.cloneDeep(extraData)
        if (temp.length == 0) {
            temp.push(obj)
        } else {
            let index = temp.findIndex(x => x.parent_id == item.id)
            if (index >= 0) {
                temp[index] = obj
            } else {
                temp.push(obj)
            }
            // extraData.forEach((element, index) => {
            //     if (element.id == item.id) {
            //         temp[index] = obj
            //     }
            // });
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

    const onChangeVehicleType = (value) => {
        if (selectedItems.length > 0 && vehicleType !== value) {
            Alert.alert(
                "Are you sure ?",
                "All selected items will be lost.",
                [
                    {
                        text: "Cancel",
                        onPress: () => { },
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => resetSelection(value) }
                ]
            );
        } else {
            setVehicleType(value)
        }
    }

    const resetSelection = (value) => {
        setVehicleType(value)
        setSelectedItems([])
        setSelectedProducts([])
        setExtraDataa([])
    }

    return (
        <>
            <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content" />
            <View style={{ width: '100%', height: '25%' }}>
                <ImageBackground
                    resizeMode="cover"
                    source={{ uri: BASE_URL + subService.image }}
                    style={styles.image}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                            <Header
                                imageUrl={require("../../../assets/backWhite.png")}
                                action={() => {
                                    if (activeItem !== null) {
                                        onPressItem(activeItem)
                                    } else {
                                        props.navigation.goBack()
                                    }

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
                    {subService.id == 14 && activeItem == null && <View style={{}}>
                        <DropDown
                            title="Vehicle Type"
                            item={['Car', 'Truck', 'Suv', 'Van']}
                            value={vehicleType}
                            onChangeValue={(index, value) => onChangeVehicleType(value)}
                            containerStyle={{ width: '90%', alignSelf: 'center', borderRadius: 5, backgroundColor: LS_COLORS.global.white, marginBottom: 15, borderWidth: 1, borderColor: LS_COLORS.global.grey }}
                            dropdownStyle={{ maxHeight: 300 }}
                        />
                        <View style={{ flexDirection: 'row', paddingHorizontal: '3.5%' }}>
                            <View style={{ flex: 1 }}>
                                <DropDown
                                    title="Make"
                                    handleTextValue={true}
                                    item={makeList.map(x => x.title) ?? []}
                                    onChangeValue={(index, value) => {
                                        setSelectedMake(makeList[index].id)
                                    }}
                                    value={makeList.find(x => x.id == selectedMake)?.title ?? "Make"}
                                    containerStyle={{ width: '80%', alignSelf: 'center', borderRadius: 5, backgroundColor: LS_COLORS.global.white, marginBottom: 15, borderWidth: 1, borderColor: LS_COLORS.global.grey, flexDirection: 'column' }}
                                    dropdownStyle={{ maxHeight: 300 }}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <DropDown
                                    handleTextValue={true}
                                    title="Model"
                                    item={modelList.map(x => x.title) ?? []}
                                    value={modelList.find(x => x.id == selectedModel)?.title ?? "Model"}
                                    onChangeValue={(index, value) => {
                                        setSelectedModel(modelList[index].id)
                                    }}
                                    containerStyle={{ width: '80%', alignSelf: 'center', borderRadius: 5, backgroundColor: LS_COLORS.global.white, marginBottom: 15, borderWidth: 1, borderColor: LS_COLORS.global.grey }}
                                    dropdownStyle={{ maxHeight: 300 }}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <DropDown
                                    title="Year"
                                    handleTextValue={true}
                                    item={yearList.map(x => "\t" + x.title + "\t") ?? []}
                                    value={yearList.find(x => x.id == selectedYear)?.title ?? "Year"}
                                    onChangeValue={(index, value) => {
                                        setSelectedYear(yearList[index].id)
                                    }}
                                    containerStyle={{ width: '80%', alignSelf: 'center', borderRadius: 5, backgroundColor: LS_COLORS.global.white, marginBottom: 15, borderWidth: 1, borderColor: LS_COLORS.global.grey }}
                                    dropdownStyle={{ maxHeight: 300 }}
                                />
                            </View>
                        </View>
                    </View>}
                    <Text style={{ paddingLeft: '5%', fontFamily: LS_FONTS.PoppinsMedium, fontSize: 16, marginBottom: 10 }}>Select Services and Products</Text>
                    <Container>
                        <Content>
                            {
                                activeItem !== null
                                    ?
                                    <>
                                        <ServiceItemUser
                                            item={activeItem}
                                            onCheckPress={() => onPressItem(activeItem)}
                                            isSelected={selectedItems.includes(activeItem.id)}
                                            selectedProducts={selectedProducts}
                                            onSelectProduct={(product) => setCheckedDataProducts(product)}
                                            activeMode
                                            extraData={extraData}
                                            setExtraData={setExtraData}
                                        />
                                    </>
                                    :
                                    itemListMaster.length > 0
                                        ?
                                        <>
                                            {/* <Content removeClippedSubviews={true} style={{ flex: 1 }}> */}
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
                                            {/* </Content> */}
                                        </>
                                        :
                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            {!loading && <Text style={{ fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 16 }}>No Services Available</Text>}
                                        </View>
                            }
                        </Content>
                    </Container>
                    {/* <KeyboardAvoidingView behavior={Platform.OS=="ios"?"padding":undefined}  /> */}
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
                    <View style={{ height: 10 }}></View>

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
        marginTop: 5
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





