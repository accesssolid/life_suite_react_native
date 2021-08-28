import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, ScrollView, Alert } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';
import Loader from '../../../components/loader';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from "react-native-safe-area-context"

/* Components */;
import Header from '../../../components/header';
import { Container, Content, InputGroup, Row, } from 'native-base'
import { TextInput } from 'react-native-gesture-handler';
import { BASE_URL, getApi } from '../../../api/api';
import CustomButton from '../../../components/customButton';
import services, { setAddServiceData } from '../../../redux/features/services';
import { showToast } from '../../../components/validators';
import ServiceItem from '../../../components/serviceItem';
import _ from 'lodash';

const ServicesProvided = (props) => {
    const dispatch = useDispatch()
    const { subService } = props.route.params
    const user = useSelector(state => state.authenticate.user)
    const isAddServiceMode = useSelector(state => state.services.isAddServiceMode)
    const addServiceData = useSelector(state => state.services.addServiceData)
    const [itemListMaster, setItemListMaster] = useState([])
    const [itemList, setItemList] = useState([])
    const [loading, setLoading] = useState(false)

    const [selectedItems, setSelectedItems] = useState([])
    const [servicesData, setServicesData] = useState([])
    const [productsData, setProductsData] = useState([])
    const [newProductsData, setNewProductsData] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([])
    const [selectedNewProducts, setSelectedNewProducts] = useState([])
    const [isOtherSelected, setIsOtherSelected] = useState(false)

    const [isUpdated, setIsUpdated] = useState(false)
    const [variants, setVariants] = useState([])
    const [selectedVariant, setSelectedVariant] = useState(null)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [activeIndex, setActiveIndex] = useState(null)
    const [activeItem, setActiveItem] = useState(null)
    const itemRef = useRef(null)

    useEffect(() => {
        getServiceItems()
    }, [])

    useEffect(() => {
        setInitialServiceData()
    }, [itemList])

    useEffect(() => {
        filterVariants()
    }, [selectedVariant, itemListMaster])

    useEffect(() => {
        if (!isAddServiceMode && subService && subService.items && subService.items.length > 0 && servicesData.length > 0 && !isUpdated) {
            setPreviousData(servicesData)
        }
    }, [servicesData])

    const getServiceItems = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }

        let user_data = {
            "service_id": subService.id,
            "user_id": user.id
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: '/api/providerSubServicesItemList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setLoading(false)
                    setItemListMaster([...response.data])
                    if (response.variant_data) {
                        setVariants(response.variant_data)
                        setSelectedVariant(response.variant_data[0].id)
                    }
                }
                else {
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    const setCheckedData = (index, item) => {
        let arr = [...selectedItems]

        if (arr.includes(item.id)) {
            arr.splice(arr.indexOf(item.id), 1)
        } else {
            arr.push(item.id)
        }

        setSelectedItems([...arr])
    }

    const setInitialServiceData = () => {
        if (!selectedItems.length > 0) {
            let newArr = itemListMaster.map((item, index) => {
                return {
                    "item_id": item.id,
                    "price": item.price ? item.price : "",
                    "time_duration_h": "",
                    "time_duration_m": "",
                    "variant_data": item.variant_data
                }
            })
            setServicesData([...newArr])
        }

        setInitialProductsData()
    }

    const setInitialProductsData = () => {
        if (!selectedProducts.length > 0 && !selectedNewProducts.length > 0) {
            let newArr = []
            itemListMaster.map((item, index) => {
                item.products.forEach(element => {
                    newArr.push({
                        "id": element.id,
                        "name": element.name,
                        "price": element.price ? element.price : "",
                        "item_id": element.item_id
                    })
                });
            })
            setProductsData([...newArr])
        }
    }

    const setPreviousData = (arr) => {
        let temp = [...arr]
        let selected = []

        arr.forEach((serviceElement, serviceIndex) => {
            subService.items.forEach((subElement) => {
                if (serviceElement.item_id == subElement.id) {
                    let hours = toHoursAndMinutes(subElement.time_duration, 'hours')
                    let minutes = toHoursAndMinutes(subElement.time_duration, 'minutes')
                    temp[serviceIndex] = {
                        "item_id": serviceElement.item_id,
                        "price": "$" + subElement.price,
                        "time_duration_h": String(minutes),
                        "time_duration_m": String(hours),
                    }
                    if (!isAddServiceMode) {
                        selected.push(subElement.id)
                    }
                }
            });
        });

        setSelectedItems([...selected])
        setServicesData([...temp])
        setIsUpdated(true)
    }

    const next = () => {
        let services = []

        servicesData.forEach((itemm, index) => {
            if (selectedItems.includes(itemm.item_id)) {
                var hoursDotMinutes = `${itemm.time_duration_h}:${itemm.time_duration_m}`;
                var fieldArray = hoursDotMinutes.split(":");
                var minutes = Number(fieldArray[0]) + 60 * Number(fieldArray[1]);

                let obj = {
                    "item_id": itemm.item_id,
                    "price": Number(itemm.price.replace('$', '')),
                    "time_duration": minutes
                }
                services.push(obj)
            }
        })

        dispatch(setAddServiceData({
            data: {
                ...addServiceData,
                user_id: user.id,
                service_id: subService.id,
                json_data: {
                    ...addServiceData.json_data,
                    services: [...services],

                }
            }
        }))

        dispatch(setAddServiceData({
            data: {
                ...addServiceData,
                user_id: user.id,
                service_id: subService.id,
                json_data: {
                    ...addServiceData.json_data,
                    products: [...productsData],
                    new_products: [...newProductsData]
                }
            }
        }))

        verifyNewProducts(services)
    }

    function toHoursAndMinutes(minutes, type) {
        var mins = minutes % 60;
        var hrs = (minutes - mins) / 60;
        // alert(hrs + ":" + mins);
        if (type == 'hours') {
            return hrs
        } else {
            return mins
        }
    }

    const setText = (key, text, indexx, incomingItem) => {
        let temp = [...servicesData.filter(item => item.variant_data == selectedVariant)]
        let otherItems = [...servicesData.filter(item => item.variant_data !== selectedVariant)]
        temp.forEach((ele, index) => {
            if (ele.item_id == incomingItem.item_id) {
                if (key == "price") {
                    let parsed = conTwoDecDigit(text.replace('$', ''))
                    if (text == '') {
                        temp[index].price = ''
                    } else {
                        temp[index].price = '$' + String(parsed)
                    }
                } else if (key == 'time_duration_h') {
                    temp[index].time_duration_h = text
                } else {
                    temp[index].time_duration_m = text
                }
            }
        })

        setServicesData([...temp, ...otherItems])
    }

    const conTwoDecDigit = (digit) => {
        return digit.indexOf(".") > 0 ?
            digit.split(".").length >= 2 ?
                digit.split(".")[0] + "." + digit.split(".")[1].substring(-1, 2)
                : digit
            : digit
    }

    const verifyNewProducts = (services) => {
        const products = addServiceData.json_data.new_products.map((item, index) => {
            return {
                "item_id": item.item_id,
                "name": item.name,
                "price": item.price
            }
        })

        if (addServiceData.json_data.new_products.length > 0) {
            setLoading(true)
            let headers = {
                Accept: "application/json",
                "Content-Type": "application/json"
            }

            let user_data = {
                "user_id": user.id,
                "new_products": JSON.stringify([...addServiceData.json_data.new_products])
            }

            let config = {
                headers: headers,
                data: JSON.stringify({ ...user_data }),
                endPoint: '/api/newProductExist',
                type: 'post'
            }

            getApi(config)
                .then((response) => {
                    if (response.status == true) {
                        setLoading(false)
                        if (services.length > 0) {
                            props.navigation.navigate('AddLicense', { subService: subService })
                        } else {
                            showToast("Select Service first")
                        }
                    }
                    else {
                        setLoading(false)
                    }
                }).catch(err => {
                    setLoading(false)
                })
        } else {
            if (services.length > 0) {
                props.navigation.navigate('AddLicense', { subService: subService })
            } else {
                showToast("Select Service first")
            }
        }
    }

    const onPressItem = (index, item) => {
        if (!selectedItems.includes(item.id)) {
            setCheckedData(null, item)
        }
        if (activeItem == null) {
            setActiveIndex(index)
            setActiveItem(item)
        } else {
            if (getSelectedProducts().length > 0 || getSelectedNewProducts().length > 0) {
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
            } else {
                setCheckedData(null, item)
                setActiveIndex(null)
                setActiveItem(null)
            }
        }
    }

    const discardItem = (item) => {
        let pdata = selectedProducts.filter(element => element.item_id !== item.id)
        let pdataNew = selectedNewProducts.filter(itemm => itemm.item_id !== item.id)

        setSelectedProducts([...pdata])
        setSelectedNewProducts([...pdataNew])

        setActiveItem(null)
        setActiveIndex(null)
        setCheckedData(null, item)
    }

    const saveRequest = () => {
        if (selectedProducts.length > 0 || selectedNewProducts.length > 0) {
            let isValidData = false
            servicesData.filter(item => item.variant_data == selectedVariant).forEach((itemm, index) => {
                if (selectedItems.includes(itemm.item_id)) {
                    if (itemm.price.trim() !== "" && itemm.time_duration_h.trim() !== "" && itemm.time_duration_m.trim() !== "") {
                        isValidData = true
                    } else {
                        isValidData = false
                    }
                }
            })

            let selected = getSelectedProducts()
            productsData.filter(item => selected.includes(item.id)).forEach(element => {
                if (element.price.trim() == "") {
                    isValidData = false
                }
            });

            let selectedNew = getSelectedNewProducts()
            newProductsData.filter(item => selectedNew.includes(item.id)).forEach(element => {
                if (element.price.trim() == "" || element.name.trim() == "") {
                    isValidData = false
                }
            });

            if (!isValidData) {
                return showToast("Please enter data for selected services")
            } else {
                setActiveItem(null)
                setActiveIndex(null)
            }
        } else {
            showToast("Please select at least one item")
        }
    }

    const filterVariants = () => {
        let data = itemListMaster.filter(item => item.variant_data == selectedVariant)

        setItemList([...data])
    }

    const toggleVariant = (variant) => {
        if (activeItem !== null) {
            showToast("Please save or discard current selection")
        } else {
            setActiveItem(null)
            setActiveIndex(null)
            setSelectedVariant(variant.id)
        }
    }

    const onPressProduct = (item) => {
        let arr = [...selectedProducts]
        let selectedIndex = null
        arr.forEach((element, index) => {
            if (element.id == item.id) {
                selectedIndex = index
            }
        });
        if (selectedIndex !== null) {
            arr.splice(selectedIndex, 1)
        } else {
            arr.push(item)
        }
        setSelectedProducts([...arr])
    }

    const onPressNewProduct = (item) => {
        let arr = [...selectedNewProducts]
        let selectedIndex = null
        arr.forEach((element, index) => {
            if (element.temp_id == item.temp_id) {
                selectedIndex = index
            }
        });
        if (selectedIndex !== null) {
            arr.splice(selectedIndex, 1)
        } else {
            arr.push(item)
        }
        setSelectedNewProducts([...arr])
    }

    const getSelectedProducts = () => {
        let arr = selectedProducts.filter(item => item.item_id == activeItem.id)
        let selected = arr.map(item => item.id)
        return selected;
    }

    const getSelectedNewProducts = () => {
        let arr = selectedNewProducts.filter(item => item.item_id == activeItem.id)
        let selected = arr.map(item => item.temp_id)
        return selected;
    }

    const setProductText = (item, text) => {
        let temp = _.cloneDeep(productsData)
        temp.forEach((element, index) => {
            if (element.id == item.id && element.item_id == item.item_id) {
                let parsed = conTwoDecDigit(text.replace('$', ''))
                if (text == '') {
                    temp[index].price = ''
                } else {
                    temp[index].price = '$' + String(parsed)
                }
            }
        })

        setProductsData([...temp])
    }

    const setNewProductText = (item, text, type) => {
        let temp = _.cloneDeep(newProductsData)

        temp.forEach((element, index) => {
            if (element.temp_id == item.temp_id && element.item_id == item.item_id) {
                if (type == "name") {
                    temp[index].name = text
                } else {
                    let parsed = conTwoDecDigit(text.replace('$', ''))
                    if (text == '') {
                        temp[index].price = ''
                    } else {
                        temp[index].price = '$' + String(parsed)
                    }
                }
            }
        })

        setNewProductsData([...temp])
    }

    const onSelectOther = () => {
        setIsOtherSelected(!isOtherSelected)
        if (newProductsData.length === 0) {
            addNewProduct()
        }
    }

    const removeNewproduct = (item) => {
        let temp = _.cloneDeep(newProductsData)

        temp.forEach((element, index) => {
            if (element.temp_id == item.temp_id && element.item_id == item.item_id) {
                temp.splice(index, 1)
            }
        })

        if (temp.length == 0) {
            setIsOtherSelected(false)
        }
        setNewProductsData([...temp])
    }

    const addNewProduct = () => {
        let arr = [...newProductsData]
        arr.push({
            "item_id": activeItem.id,
            "name": "",
            "price": "",
            "temp_id": String(Math.floor((Math.random() * 10000000) + 1000))
        })
        setNewProductsData([...arr])
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
                            <View style={{ height: "22%", justifyContent: 'flex-end', paddingTop: StatusBar.currentHeight + 10 }}>
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
                    <Content showsVerticalScrollIndicator={false}>
                        <Text style={styles.service}>SERVICES</Text>
                        <View style={{ marginVertical: 10, flexDirection: 'row', overflow: 'scroll', paddingHorizontal: '5%', justifyContent: 'center' }}>
                            {variants.length > 0 && variants.map((item, index) => {
                                return (
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => toggleVariant(item)} key={index}
                                        style={{
                                            backgroundColor: selectedVariant == item.id ? LS_COLORS.global.green : LS_COLORS.global.white,
                                            marginHorizontal: 10,
                                            paddingHorizontal: 15,
                                            paddingVertical: 5,
                                            borderRadius: 100,
                                            borderWidth: selectedVariant == item.id ? 1 : 1,
                                            borderColor: selectedVariant == item.id ? LS_COLORS.global.green : LS_COLORS.global.green
                                        }}>
                                        <Text style={{
                                            fontFamily: LS_FONTS.PoppinsMedium,
                                            fontSize: 14,
                                            textTransform: 'uppercase',
                                            color: selectedVariant == item.id ? LS_COLORS.global.white : LS_COLORS.global.black,
                                        }}>
                                            {item.name}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        {activeItem !== null && <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginBottom: '2%' }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ ...styles.priceTime, marginRight: '20%' }}>Time</Text>
                            </View>
                            <View style={{ marginLeft: '5%' }}>
                                <Text style={styles.priceTime}>Price</Text>
                            </View>
                        </View>}

                        {activeItem !== null
                            ?
                            <>
                                <ServiceItem
                                    ref={itemRef}
                                    item={activeItem}
                                    index={activeIndex}
                                    onCheckPress={() => onPressItem(activeIndex, activeItem)}
                                    isSelected={selectedItems.includes(activeItem.id)}
                                    setText={setText}
                                    setProductText={setProductText}
                                    setNewProductText={setNewProductText}
                                    serviceItem={servicesData.filter(item => item.variant_data == selectedVariant)[activeIndex]}
                                    subService={subService}
                                    showInputs
                                    products={productsData.filter(item => item.item_id == activeItem.id)}
                                    newProducts={newProductsData.filter(item => item.item_id == activeItem.id)}
                                    selectedProducts={getSelectedProducts()}
                                    selectedNewProducts={getSelectedNewProducts()}
                                    onPressProduct={(item) => onPressProduct(item)}
                                    onPressNewProduct={(item) => onPressNewProduct(item)}
                                    onSelectOther={onSelectOther}
                                    isOtherSelected={isOtherSelected}
                                    removeNewproduct={removeNewproduct}
                                    addNewProduct={addNewProduct}
                                />
                            </>
                            :
                            isAddServiceMode
                                ?
                                itemList && itemList.length > 0
                                    ?
                                    itemList.map(((item, index) => {
                                        return (
                                            <ServiceItem
                                                key={index}
                                                item={item}
                                                index={index}
                                                onCheckPress={() => { onPressItem(index, item) }}
                                                isSelected={selectedItems.includes(item.id)}
                                            />
                                        )
                                    }))
                                    :
                                    null
                                :
                                subService && subService.items
                                    ?
                                    subService.items.map(((item, index) => {
                                        return (
                                            <ServiceItem
                                                key={index}
                                                item={item}
                                                index={index}
                                                onCheckPress={() => setCheckedData(index, item)}
                                                isSelected={selectedItems.includes(item.id)}
                                                setText={setText}
                                                serviceItem={servicesData[index]}
                                                subService={subService}
                                            />
                                        )
                                    }))
                                    :
                                    null
                        }
                    </Content>
                    <View style={{ paddingBottom: '2.5%' }}>
                        {activeItem == null
                            ?
                            <CustomButton title={isAddServiceMode ? "Next" : selectedItems.length > 0 ? "Next" : "Edit"} action={() => next()} />
                            :
                            <CustomButton title={"Save"} action={() => saveRequest()} />
                        }
                    </View>
                </Container>
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
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
    },
    mechanic: {
        fontSize: 29,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },
    price: {
        width: '100%',
        alignSelf: 'center',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    priceTime: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: "black",
        marginRight: '13%'
    },
    service: {
        fontSize: 18,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: "black",
        alignSelf: 'center',
        paddingVertical: '3%'
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 45,
        width: 174,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 6,
        alignSelf: 'center',
        marginTop: 40
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },
    fromContainer: {
        height: 40,
        width: 75,
        alignItems: 'center',
        borderColor: LS_COLORS.global.lightTextColor,
        justifyContent: "center",
        backgroundColor: '#ECECEC',
        paddingHorizontal: 5,
        marginRight: '10%'
    },
    inputStyle: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        textAlign: 'center'
    },
})





