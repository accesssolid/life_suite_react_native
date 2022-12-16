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
import { updateSignupModal } from '../../../redux/features/signupModal';
import { setVariantData } from '../../../redux/features/variantData';
const ServicesProvided = (props) => {
    const dispatch = useDispatch()
    const { subService } = props.route.params
    const [itemList, setItemList] = useState([])
    const [itemListMaster, setItemListMaster] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([])
    const access_token = useSelector(state => state.authenticate.access_token)
    const userType = useSelector(state => state.authenticate.type)

    const [activeItem, setActiveItem] = useState(null)
    const [extraData, setExtraDataa] = useState([])
    const [vehicleType, setVehicleType] = useState({
        "created_at": "",
        "id": 3,
        "name": "",
        "service_variants_name": "",
        "status": 1,
        "updated_at": "2021-11-29 08:24:07",
        "variant_id": 4
    })
    // vehicle
    const [makeList, setMakeList] = React.useState([])
    const [modelList, setModelList] = React.useState([])
    const [yearList, setYearList] = React.useState([])
    // 
    const [selectedMake, setSelectedMake] = React.useState("")
    const [selectedModel, setSelectedModel] = React.useState("")
    const [selectedYear, setSelectedYear] = React.useState("")
    const [vehicle_types, setVehicleTypes] = React.useState([])

    React.useEffect(() => {
        let data = {
            "variant_title": vehicleType?.service_variants_name??"",
            "variant": vehicleType?.name??"",
            "variant_id": vehicleType?.variant_id??"",
            "make": makeList.find(x => x.id == selectedMake)?.title??"",
            "model":  modelList.find(x => x.id == selectedModel)?.title??"",
            "year":  yearList.find(x => x.id == selectedYear)?.title??""
        }
        console.log(data)
        dispatch(setVariantData(data))
    }, [selectedMake, selectedModel, selectedYear, vehicleType])

    const getMakeList = () => {
        setLoading(true)
        let headers = {
            "Authorization": `Bearer ${access_token}`
        }
        const formdata = new FormData()

        formdata.append("variant_data_id", vehicleType.id)
        let config = {
            headers: headers,
            data: formdata,
            endPoint: '/api/makeList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                console.log("reponse makelist", response)
                if (response.status == true) {
                    setMakeList(response.data?.filter(x => x.status == "1"))
                }
                else {
                    setMakeList([])
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            }).finally(() => {
                setLoading(false)

            })
    }

    const getVariantData = () => {
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ service_id: subService?.id }),
            endPoint: '/api/variantData',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                console.log("Variant Data", response.data)
                if (response.status == true) {
                    if (response.data?.length > 0) {
                        setVehicleTypes(response.data)
                        setVehicleType(response.data[0])
                    } else {
                        setVehicleTypes([])
                    }
                }
                else {

                }
            }).catch(err => {

            }).finally(() => {


            })
    }

    React.useEffect(() => {
        getMakeList()
    }, [vehicleType])

    useEffect(() => {
        getVariantData()
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
                    console.log("Make LISt", response.data)
                    setModelList(response.data?.filter(x => x.status == "1"))
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
        if (subService.id == 14 || vehicle_types?.length > 0) {
            filterServices()
        }
    }, [vehicleType, itemListMaster])

    useEffect(() => {
        if (subService.id == 14 || vehicle_types?.length > 0) {
            filterServices()
        }
        if (userType == "guest") {
            getGuestServiceItems()
        } else {
            getServiceItems()
        }

    }, [])

    const getGuestServiceItems = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        }

        let user_data = {
            "service_id": subService.id
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: '/api/guestCustomerSubServicesItemList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                console.log("Response", JSON.stringify(response))
                if (response.status == true) {
                    setLoading(false)
                    setItemList([...response.data])
                    setItemListMaster([...response.data])
                    if (subService.id == 14 || vehicle_types?.length > 0) {
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
                console.log("Response", JSON.stringify(response))
                if (response.status == true) {
                    setLoading(false)
                    setItemList([...response.data])
                    setItemListMaster([...response.data])
                    if (subService.id == 14 || vehicle_types?.length > 0) {
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
        if (userType == "guest") {
            dispatch(updateSignupModal(true))
            return
        }
        let servicedata = []
        itemList.forEach(element => {
            if (selectedItems.includes(element.id)) {
                servicedata.push({
                    "item_id": element.id,
                    "products": selectedProducts
                })
            }
        });

        console.log(subService)
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
        console.log(activeItem)
        console.log(extraData)

        let isSelected = false

        activeItem.products.forEach(element => {
            if (selectedProducts.includes(element.id)) {
                isSelected = true
            }
        });

        if (activeItem.products.length == 0) {
            isSelected = true
        }
        if (activeItem.is_product_mandatory == "0") {
            isSelected = true
        }
        let extra_product = extraData.find(x => x?.parent_id == activeItem.id)
        if (extra_product) {
            if (extra_product?.need_recommendation || String(extra_product?.have_own).trim() != "" || String(extra_product?.other).trim() != "") {
                isSelected = true
            }
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



    const filterServices = () => {
        const filtered = itemListMaster.filter(item => item.variant_data == vehicleType.id)
        setItemList([...filtered])
    }

    const onChangeVehicleType = (value) => {
        if (selectedItems.length > 0 && vehicleType.id !== value.id) {
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
            <StatusBar
                // translucent={true} 
                // backgroundColor="transparent"
                backgroundColor={LS_COLORS.global.green}
                barStyle="light-content" />
            <View style={{ width: '100%', height: '14%' }}>
                <ImageBackground
                    resizeMode="cover"
                    source={{ uri: BASE_URL + subService?.image }}
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
                                titleStyle={{ color: "white", fontSize: 22 }}
                                title={subService?.name}
                                imageUrl1={require("../../../assets/homeWhite.png")}
                                action1={() => {
                                    props.navigation.navigate("HomeScreen")
                                }}
                            />
                            {/* <View style={{ justifyContent: 'center', alignItems: "center", height: "33%" }}>
                                <Text style={{ fontSize: 29, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.white }}>{subService?.name}</Text>
                            </View> */}
                        </SafeAreaView>
                    </View>
                </ImageBackground>
            </View>
            <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
                <View style={styles.container}>
                    {activeItem == null && vehicle_types?.length > 0 && <View style={{}}>
                        <DropDown
                            handleTextValue={true}
                            title={vehicleType?.service_variants_name}
                            item={vehicle_types.map(x => x.name)}
                            value={vehicleType.name}
                            onChangeValue={(index, value) => onChangeVehicleType(vehicle_types[index])}
                            containerStyle={{ width: '90%', alignSelf: 'center', borderRadius: 5, backgroundColor: LS_COLORS.global.white, marginBottom: 15, borderWidth: 1, borderColor: LS_COLORS.global.grey }}
                            dropdownStyle={{ maxHeight: 300 }}
                        />
                        {subService.id == 14 && <View style={{ flexDirection: 'row', paddingHorizontal: "2.5%" }}>
                            <View style={{ flex: 1 }}>
                                <DropDown
                                    title="Make"
                                    handleTextValue={true}
                                    handleTextValueStyle={{ paddingLeft: 5 }}
                                    item={makeList.map(x => x.title) ?? []}
                                    onChangeValue={(index, value) => {
                                        setSelectedMake(makeList[index].id)
                                    }}
                                    value={makeList.find(x => x.id == selectedMake)?.title ?? "Make"}
                                    containerStyle={{ width: '90%', alignSelf: 'center', borderRadius: 5, backgroundColor: LS_COLORS.global.white, marginBottom: 15, borderWidth: 1, borderColor: LS_COLORS.global.grey, flexDirection: 'column' }}
                                    dropdownStyle={{ maxHeight: 300 }}
                                    textValueProps={{
                                        maxFontSizeMultiplier: 1.3
                                    }}
                                />
                            </View>
                            <View style={{ flex: 0.8 }}>
                                <DropDown
                                    handleTextValue={true}
                                    title="Model"
                                    handleTextValueStyle={{ paddingLeft: 5 }}
                                    item={modelList.map(x => x.title) ?? []}
                                    value={modelList.find(x => x.id == selectedModel)?.title ?? "Model"}
                                    onChangeValue={(index, value) => {
                                        setSelectedModel(modelList[index].id)
                                    }}
                                    containerStyle={{ width: '80%', alignSelf: 'center', borderRadius: 5, backgroundColor: LS_COLORS.global.white, marginBottom: 15, borderWidth: 1, borderColor: LS_COLORS.global.grey }}
                                    dropdownStyle={{ maxHeight: 300 }}
                                    textValueProps={{
                                        maxFontSizeMultiplier: 1.3
                                    }}
                                />
                            </View>
                            <View style={{ flex: 0.8 }}>
                                <DropDown
                                    title="Year"
                                    handleTextValue={true}
                                    handleTextValueStyle={{ paddingLeft: 5 }}
                                    item={yearList.map(x => "\t" + x.title + "\t") ?? []}
                                    value={yearList.find(x => x.id == selectedYear)?.title ?? "Year"}
                                    onChangeValue={(index, value) => {
                                        setSelectedYear(yearList[index].id)
                                    }}
                                    containerStyle={{ width: '80%', alignSelf: 'center', borderRadius: 5, backgroundColor: LS_COLORS.global.white, marginBottom: 15, borderWidth: 1, borderColor: LS_COLORS.global.grey }}
                                    dropdownStyle={{ maxHeight: 300 }}
                                    textValueProps={{
                                        maxFontSizeMultiplier: 1.3
                                    }}
                                />
                            </View>
                        </View>}
                    </View>
                        // :<View style={{maxHeight:60}}>
                        //     <ScrollView showsHorizontalScrollIndicator={false} horizontal >
                        //     {vehicle_types.map(x=>{
                        //         let isSelected=vehicleType.id==x.id
                        //         return(
                        //         <TouchableOpacity onPress={()=>setVehicleType(x)} style={{marginLeft:10,backgroundColor:isSelected?LS_COLORS.global.green:"white",borderColor:LS_COLORS.global.green,padding:5,margin:5,borderWidth:1,borderRadius:10}}>
                        //             <Text style={{color:isSelected?"white":"black",fontFamily:LS_FONTS.PoppinsRegular}}>{x.name}</Text>
                        //         </TouchableOpacity>
                        //         )
                        //     })}
                        //     </ScrollView>
                        //     </View>)
                    }
                    <Text maxFontSizeMultiplier={1.4} style={{ paddingLeft: '5%', fontFamily: LS_FONTS.PoppinsMedium, fontSize: 16, marginBottom: 10 }}>Select Services and Products</Text>
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
                                            {!loading && <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 16 }}>No Services Available</Text>}
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
                        <Text maxFontSizeMultiplier={1.5} style={styles.saveText}>{activeItem !== null ? 'Save Request' : 'Next'}</Text>
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





