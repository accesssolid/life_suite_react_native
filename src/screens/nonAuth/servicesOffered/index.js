import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, Dimensions, Modal, TouchableOpacity, ScrollView, Alert, Pressable } from 'react-native'

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
import { BASE_URL, getApi } from '../../../api/api';
import CustomButton from '../../../components/customButton';
import services, { setAddServiceData } from '../../../redux/features/services';
import { showToast } from '../../../components/validators';
import ServiceItem from '../../../components/serviceItem';
import _, { remove } from 'lodash';
import { getMyJobsThunk } from '../../../redux/features/provider';
const { width } = Dimensions.get("window")
import CustomInput from '../../../components/textInput'
import messagging from '@react-native-firebase/messaging'
import { addUpdateQuestionaire } from '../../../redux/features/questionaire.model';
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
    const [variants, setVariants] = useState([])
    const [selectedVariant, setSelectedVariant] = useState(null)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [activeIndex, setActiveIndex] = useState(null)
    const [activeItem, setActiveItem] = useState(null)
    const [newServices, setNewServices] = useState([])
    const [newServicesMaster, setNewServicesMaster] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const itemRef = useRef(null)

    useEffect(() => {
        console.log("subService", subService)
        setServicesData([])
        getServiceItems()
    }, [])

    useEffect(() => {
        let unsubscriber = messagging().onMessage((remoteMessage) => {
            console.log("Remote Message", remoteMessage, subService.id)
            if (remoteMessage?.data?.refresh_sub_service == subService.id) {
                getServiceItems()
            }
        })
        return () => {
            unsubscriber()
        }
    }, [])

    useEffect(() => {
        setInitialServiceData()
    }, [itemList, itemListMaster, newServicesMaster, newServices])

    useEffect(() => {
        filterVariants()
    }, [selectedVariant, itemListMaster])

    useEffect(() => {
        console.log(selectedItems, "Selected Items")
        console.log(servicesData, "Services Data")
        console.log(productsData, "Products")
        console.log(newProductsData, "New Products Data")
    }, [selectedItems, servicesData, productsData, newProductsData])

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
                console.log(response)
                if (response.status == true) {
                    setLoading(false)
                    setItemListMaster([...response.data])
                    console.log("checking", response.data)
                    if (response.variant_data) {
                        setVariants(response.variant_data)
                        if(!selectedVariant){
                            setSelectedVariant(response.variant_data[0].id)
                        }
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

    React.useEffect(() => {
        console.log("Services data", JSON.stringify(servicesData))
    }, [servicesData])

    const setInitialServiceData = () => {
        // #liahs changes
        let servicesData1 = _.cloneDeep(servicesData)
        if (!selectedItems.length > 0) {
            let newArr = itemListMaster.concat(newServicesMaster).map((item, index) => {
                if (variants.length > 0) {
                    return {
                        "item_id": item.id,
                        "price": "",
                        "time_duration_h": "",
                        "time_duration_m": "",
                        "variant_data": item.variant_data
                    }
                } else {
                    return {
                        "item_id": item.id,
                        "price": "",
                        "time_duration_h": "",
                        "time_duration_m": "",
                    }
                }
            })
            let d = newArr.map(x => {
                let data = servicesData1.find(y => y.item_id == x.item_id)
                if (data) {
                    return { ...x, ...data }
                }
                return x
            })
            setServicesData(d)
        }

        // if (!isAddServiceMode) {
        let arr = []
        let selected = []
        if (variants.length > 0) {
            itemListMaster.concat(newServicesMaster).forEach((item, index) => {
                subService?.items?.forEach((ele, ind) => {
                    if (item.id == ele.id && item.variant_data == ele.variant_data) {
                        let hours =ele.time_duration==""?"": toHoursAndMinutes(ele.time_duration, 'hours')
                        let minutes =ele.time_duration==""?"": toHoursAndMinutes(ele.time_duration, 'minutes')
                        arr.push({
                            "item_id": item.id,
                            "price": ele.price==""?"":("$" + ele.price),
                            "time_duration_h": String(hours),
                            "time_duration_m": String(minutes),
                            "variant_data": item.variant_data
                        })
                        selected.push(ele.id)
                    }
                });
            });

            itemListMaster.concat(newServicesMaster).forEach(item => {
                if (!selected.includes(item.id)) {
                    arr.push({
                        "item_id": item.id,
                        "price": "",
                        "time_duration_h": "",
                        "time_duration_m": "",
                        "variant_data": item.variant_data
                    })
                }
            })
        } else {
            itemListMaster.concat(newServicesMaster).forEach((item, index) => {
                subService?.items?.forEach((ele, ind) => {
                    if (item.id == ele.id) {
                        let hours = ele.time_duration==""?"":toHoursAndMinutes(ele.time_duration, 'hours')
                        let minutes =ele.time_duration==""?"": toHoursAndMinutes(ele.time_duration, 'minutes')
                        arr.push({
                            "item_id": item.id,
                            "price": ele.price==""?"":("$" + ele.price),
                            "time_duration_h": String(hours),
                            "time_duration_m": String(minutes),
                        })
                        selected.push(ele.id)
                    }
                });
            });
            itemListMaster.concat(newServicesMaster).forEach(item => {
                if (!selected.includes(item.id)) {
                    arr.push({
                        "item_id": item.id,
                        "price": item.price ?? "",
                        "time_duration_h": "",
                        "time_duration_m": "",
                    })
                }
            })
        }
        // #liahs get previous added service data and union based on item_id
        console.log(servicesData1, "DDDDDDDDDDD")
        let d = arr.map(x => {
            let data = servicesData1.find(y => y.item_id == x.item_id)
            if (data) {
                return { ...x, ...data }
            }
            return x
        })
        console.log(d, "D")
        setServicesData(d)
        //    selected Save Data from Liahs
        const setData = new Set([...selected, ...selectedItems])
        // setData is the ids from selected Items
        setSelectedItems([...setData])
        // }
        setInitialProductsData()

    }

useEffect(()=>{
    console.log("ITemListMast",itemListMaster)
},[itemListMaster])

    const setInitialProductsData = () => {
        if (!selectedProducts.length > 0 && !selectedNewProducts.length > 0) {
            let newArr = []
            let selected = []
            itemListMaster.map((item, index) => {
                item.products.forEach(element => {
                    console.log("New Array", element)
                    newArr.push({
                        "id": element.id,
                        "name": element.name,
                        "price": !isAddServiceMode ? (getPrice(element.item_id, element.id)=="$"?"":getPrice(element.item_id, element.id) ): "",
                        "item_id": element.item_id,
                        list_type: element?.list_type
                    })
                    if (getPrice(element.item_id, element.id) !== "") {
                        selected.push({
                            "id": element.id,
                            "name": element.name,
                            "price": !isAddServiceMode ? (getPrice(element.item_id, element.id)=="$"?"":getPrice(element.item_id, element.id) ): "",
                            "item_id": element.item_id,
                            list_type: element?.list_type
                        })
                    }
                });
            })

            setProductsData([...newArr])
            setSelectedProducts([...selected])
        }
    }

    const getPrice = (item_id, id) => {
        let price = ""
        if (subService.items) {
            subService.items.forEach(element => {
                element.products.forEach(prod => {
                    if (prod.id == id && prod.item_id == item_id) {
                        price = prod.price.startsWith("$") ? prod.price : "$" + prod.price
                    }
                });
            });
        }

        return price
    }

    const next = () => {
        dispatch(setAddServiceData({
            data: {
                ...addServiceData,
                user_id: user.id,
                service_id: subService.id,
                json_data: {
                    ...addServiceData.json_data,
                    products: [],
                    new_products: [],
                    services: [],
                    new_services: []
                }
            }
        }))

        let services = []
        let new_services = []
        servicesData.forEach((itemm, index) => {
            if (selectedItems.includes(itemm.item_id)) {
                var hoursDotMinutes = `${itemm.time_duration_h}:${itemm.time_duration_m}`;
                var fieldArray = hoursDotMinutes.split(":");
                var minutes =(itemm.time_duration_m==""&&itemm.time_duration_h=="")?"": Number(itemm.time_duration_m) + 60 * Number(itemm.time_duration_h);
                let obj = {
                    "item_id": itemm.item_id,
                    "price":(itemm.price?.trim()==""||itemm.price=="$")?"": Number(itemm.price.replace('$', '')),
                    "time_duration": minutes
                }
                if (String(itemm.item_id).startsWith("new")) {
                    let newServiceItem = newServicesMaster.find(x => x.id == itemm.item_id)
                    let productsofItems = newProductsData.filter(x => x.item_id == itemm.item_id).filter(x => x.name != "").map(x=>({...x,price:x?.price=="$"?"":x?.price}))
                    new_services.push({ ...obj, item_name: newServiceItem.name, variant_data: newServiceItem.variant_data, products: productsofItems })
                } else {
                    services.push(obj)
                }

            }
        })

        dispatch(setAddServiceData({
            data: {
                ...addServiceData,
                user_id: user.id,
                service_id: subService.id,
                json_data: {
                    ...addServiceData.json_data,
                    products: [...productsData].filter(x => x.name != "").map(x=>({...x,price:x?.price=="$"?"":x?.price})).filter(x=>selectedProducts?.map(x=>x.id)?.includes(x.id)),
                    new_products: [...newProductsData].filter(x => !String(x.item_id).startsWith("new")).filter(x => x.name != "")?.map(x=>({...x,price:x?.price=="$"?"":x?.price})),
                    services: [...services],
                    new_services: [...new_services]
                }
            }
        }))
        console.log("JSON DATA", JSON.stringify({
            data: {
                ...addServiceData,
                user_id: user.id,
                service_id: subService.id,
                json_data: {
                    ...addServiceData.json_data,
                    products: [...productsData].filter(x => x.name != "").map(x=>({...x,price:x?.price=="$"?"":x?.price})).filter(x=>selectedProducts?.map(x=>x.id)?.includes(x.id)),
                    new_products: [...newProductsData].filter(x => !String(x.item_id).startsWith("new")).filter(x => x.name != "").map(x=>({...x,price:x?.price=="$"?"":x?.price})),
                    services: [...services],
                    new_services: [...new_services]
                }
            }
        }))
        verifyNewProducts(services, new_services)
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
        if (variants.length > 0) {
            let temp = [...servicesData.filter(item => item.variant_data == selectedVariant)]
            let otherItems = [...servicesData.filter(item => item.variant_data !== selectedVariant)]
            temp.forEach((ele, index) => {
                if (ele.item_id == incomingItem?.item_id) {
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

        } else {
            let temp = [...servicesData]
            let item = temp.filter(item => item.item_id == incomingItem?.item_id)[0]

            if (key == "price") {
                let parsed = conTwoDecDigit(text.replace('$', ''))
                if (text == '') {
                    item['price'] = ''
                } else {
                    item['price'] = '$' + String(parsed)
                }
            } else if (key == 'time_duration_h') {
                item['time_duration_h'] = text
            } else {
                item['time_duration_m'] = text
            }

            temp.forEach((element, index) => {
                if (element.item_id == incomingItem?.item_id) {
                    temp[index] = item
                }
            });

            setServicesData([...temp])
        }
    }

    const conTwoDecDigit = (digit) => {
        return digit.indexOf(".") > 0 ?
            digit.split(".").length >= 2 ?
                digit.split(".")[0] + "." + digit.split(".")[1].substring(-1, 2)
                : digit
            : digit
    }

    const verifyNewProducts = (services, new_services = []) => {
        if (addServiceData.json_data.new_products.length > 0) {
            setLoading(true)
            let headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
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
                    } else {
                        showToast(response.message)
                        setLoading(false)
                    }
                }).catch(err => {
                    setLoading(false)
                })
        } else {
            if (services.length > 0 || new_services.length > 0) {
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
            let filtered = selectedNewProducts.filter(itemm => itemm.item_id == item.id)
            if (filtered.length > 0) {
                setIsOtherSelected(true)
            } else {
                setIsOtherSelected(false)
            }
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
    const onPressItem1 = (index, item) => {
        if (!selectedItems.includes(item.id)) {
            setCheckedData(null, item)
        }
        if (activeItem == null) {
            setActiveIndex(index)
            setActiveItem(item)
            let filtered = selectedNewProducts.filter(itemm => itemm.item_id == item.id)
            if (filtered?.length > 0) {
                setIsOtherSelected(true)
            } else {
                setIsOtherSelected(false)
            }
        } else {
            let filtered = selectedNewProducts.filter(itemm => itemm.item_id == item.id)
            if (getSelectedNewProducts().length > 0 || filtered?.length > 0) {
                Alert.alert(
                    "Lifesuite",
                    "Do you like to remove new selected item?",
                    [
                        {
                            text: "Cancel",
                            onPress: () => { },
                            style: "cancel"
                        },
                        {
                            text: "OK", onPress: () => {
                                discardItem1(item)
                            }
                        }
                    ]
                );
            } else {
                if (getSelectedProducts().length == 0) {
                    setCheckedData(null, item)
                }
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
        let newArr = []
        itemListMaster.map((item, index) => {
            item.products.forEach(element => {
                if (element.item_id == item.id) {
                    newArr.push({
                        "id": element.id,
                        "name": element.name,
                        "price": element.price ?? "",
                        "item_id": element.item_id,
                        list_type: element?.list_type ?? "private"
                    })
                } else {
                    newArr.push({
                        "id": element.id,
                        "name": element.name,
                        "price": !isAddServiceMode ? getPrice(element.item_id, element.id) : "",
                        "item_id": element.item_id,
                        list_type: element?.list_type ?? "private"
                    })
                }
            });
        })
        setProductsData([...newArr])

        let temp = []
        temp.forEach((element, index) => {
            if (element.item_id == item.id) {
                if (type == "name") {
                    temp[index].name = ''
                    temp[index].price = ''
                }
            }
        })
        setNewProductsData([...temp])

        let arr = itemListMaster.map((ele, index) => {
            if (ele.id == item.id) {
                return {
                    "item_id": item.id,
                    "price": item.price ?? "",
                    "time_duration_h": item.time_duration_h ?? "",
                    "time_duration_m": item.time_duration_m ?? "",
                    "variant_data": item.variant_data
                }
            } else {
                return ele
            }
        })
        setServicesData([...arr])
        setIsOtherSelected(false)
        setActiveItem(null)
        setActiveIndex(null)
        setCheckedData(null, item)
    }
    const discardItem1 = (item) => {
        let pdataNew = selectedNewProducts.filter(itemm => itemm.item_id !== item.id)
        let pdata = selectedProducts.filter(element => element.item_id === item.id)
        setSelectedNewProducts([...pdataNew])
        let temp = []
        temp.forEach((element, index) => {
            if (element.item_id == item.id) {
                if (type == "name") {
                    temp[index].name = ''
                    temp[index].price = ''
                }
            }
        })
        setNewProductsData([...temp])
        setIsOtherSelected(false)
        setActiveItem(null)
        setActiveIndex(null)
        if (pdata.length == 0) {
            setCheckedData(null, item)
        }

    }
    const saveRequest = () => {
        let hasSubProducts = false
        const selectedItemsss = itemListMaster?.filter(item => selectedItems?.includes(item.id))
        let isLessThan=false
        selectedItemsss.forEach(element => {
            if (element?.products?.length > 0 && String(element?.is_product_mandatory) == "1") {
                hasSubProducts = true
            }
        });

        if (hasSubProducts && selectedProducts?.length == 0 && selectedNewProducts?.length == 0) {
            return showToast("Please select at least one item")
        }

        let isValidData = false
        let validhrmm=true
        if (variants.length > 0) {
            servicesData?.filter(item => item?.variant_data == selectedVariant).forEach((itemm, index) => {
                if (selectedItems?.includes(itemm?.item_id)) {
                    if (itemm?.price?.trim() !== ""
                        // && itemm.time_duration_h.trim() !== "" 
                        && itemm?.time_duration_m?.trim() !== "") {
                        isValidData = true
                    } else {
                        isValidData = true
                    }
                    if((itemm?.time_duration_m?.trim()=="00"||itemm?.time_duration_m?.trim()=="")&&(itemm?.time_duration_h?.trim()=="00"||itemm?.time_duration_h?.trim()=="")){
                        validhrmm = false
                    }
                    if(Number(String(itemm?.price)?.match(/[\d.]+/,""))<0.5){
                        isLessThan=true
                    }
                }
            })

        } else {
            servicesData?.forEach((itemm, index) => {
                if (selectedItems?.includes(itemm?.item_id)) {
                    console.log("itemm =>> ", itemm)
                    if (itemm?.price.trim() !== ""
                        // && itemm.time_duration_h.trim() !== "" 
                        && itemm?.time_duration_m.trim() !== "") {
                        isValidData = true
                    } else {
                        isValidData = true
                    }
                    if((itemm?.time_duration_m?.trim()=="00"||itemm?.time_duration_m?.trim()=="")&&(itemm?.time_duration_h?.trim()=="00"||itemm?.time_duration_h?.trim()=="")){
                        validhrmm = false
                    }
                    if(Number(String(itemm?.price).match(/[\d.]+/,""))<0.5){
                        isLessThan=true
                    }
                }
            })
        }
        setServicesData(servicesData?.map(item => {
            if (item?.time_duration_h?.trim() == "" && selectedItems?.includes(item?.item_id)) {
                return ({
                    ...item,
                    time_duration_h: "",
                    
                })
            }
            return item
        }))
        let selected = getSelectedProducts()
        productsData?.filter(item => selected?.includes(item?.id))?.forEach(element => {
            if (element?.price?.trim() == "") {
                // isValidData = false
            }
            if(Number(String(element?.price).match(/[\d.]+/,""))<0.5){
                isLessThan=true
            }
        });

        let selectedNew = getSelectedNewProducts()
       
        newProductsData?.filter(item => selectedNew?.includes(item?.id))?.forEach(element => {
            if (element?.price?.trim() == "" || element?.name?.trim() == "") {
                // isValidData = false
            }
            if(Number(String(element?.price)?.match(/[\d.]+/,""))<0.5){
                isLessThan=true
            }
        });

        // if(isLessThan){
        //     return showToast("Minimum be at least $.50")
        // }
        // if(!validhrmm){
        //     return showToast("please enter time")
        // }
        if (!isValidData) {
            return showToast("Please enter data for selected services")
        } else {
            setActiveItem(null)
            setActiveIndex(null)
        }
    }

    const filterVariants = () => {
        let data = itemListMaster.filter(item => item.variant_data == selectedVariant)
        let data1 = newServicesMaster.filter(item => item.variant_data == selectedVariant)
        console.log("Data", JSON.stringify(data))
        setNewServices([...data1])
        setItemList([...data])
    }

    const addNewService = (text) => {
        let totalNewServicesLength = newServicesMaster.length
        let newService = {
            "id": "new-" + totalNewServicesLength,
            "is_product_mandatory": 0,
            "service_id": "new-" + totalNewServicesLength,
            "name": text,
            "list_type": "global",
            "request_status": "",
            "added_by_provider": null,
            "variant_data": selectedVariant,
            "status": 1,
            "created_at": "2021-08-12T08:38:23.000000Z",
            "updated_at": "2021-08-12T08:38:23.000000Z",
            "variant_data_name": "Car",
            "products": [
            ]
        }
        setNewServicesMaster([...newServicesMaster, newService])
    }

    const removeNewService = (item) => {
        let f = newServicesMaster.filter(x => x.id != item.id)
        setNewServicesMaster(f)
        let z = newServices.filter(x => x.id != item.id)
        setNewServices(z)
    }

    const removeServiceData = async (id) => {
        try {
            setLoading(true)
            let headers = {
                "Authorization": `Bearer ${access_token}`
            }
            let formdata = new FormData()
            formdata.append("item_id", id)
            const config = {
                headers: headers,
                data: formdata,
                type: "post",
                endPoint: "/api/deleteNotGlobalItem"
            }
            let res = await getApi(config)
            if (res.status) {
                let data = itemListMaster.filter(item => item.id != id)
                setItemListMaster(data)
                showToast(res.message)
                getServiceItems()
            } else {
                showToast(res.message)
            }
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    const removeNonGlobalItem = async (id) => {
        try {
            // return
            setLoading(true)
            let headers = {
                "Authorization": `Bearer ${access_token}`
            }
            let formdata = new FormData()
            formdata.append("product_id", id)

            const config = {
                headers: headers,
                data: formdata,
                type: "post",
                endPoint: "/api/deleteNotGlobalProduct"
            }
            console.log(id)
            let res = await getApi(config)
            console.log(res)
            if (res.status) {
                showToast(res.message)
                let newArr = []
                let newData = []
                itemListMaster.map((item, index) => {
                    
                    let products = item.products.map(element => {
                        let prods=productsData.find(x=>x.id==element.id)
                        if (element.item_id == item.id) {
                            newArr.push({
                                "id": element.id,
                                "name": element.name,
                                "price":prods?prods?.price:(element.price ?? ""),
                                "item_id": element.item_id,
                                list_type: element?.list_type ?? "private"
                            })
                        } else  {
                            newArr.push({
                                "id": element.id,
                                "name": element.name,
                                "price": !isAddServiceMode ? getPrice(element.item_id, element.id) : "",
                                "item_id": element.item_id,
                                list_type: element?.list_type ?? "private"
                            })
                        }
                        return element
                    });

                    newData.push({ ...item, products: products.filter(x => x.id != id) })
                })

                console.log(newArr)
                setProductsData([...newArr].filter(x => x.id !== id))
                setItemListMaster(newData)
            } else {
                showToast(res.message)
            }
        } catch (err) {
            console.log(err)
        } finally {
            getServiceItems()
            setLoading(false)
        }
    }

    useEffect(() => {
        let data1 = newServicesMaster.filter(item => item.variant_data == selectedVariant)
        setNewServices([...data1])
    }, [newServicesMaster])
    const toggleVariant = (variant) => {
        if (activeItem !== null) {
            showToast("Please save or discard current selection")
        } else {
            setActiveItem(null)
            setActiveIndex(null)
            setSelectedVariant(variant.id)
            setIsOtherSelected(false)
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
        let filtered = newProductsData.filter(item => item.item_id == activeItem.id)
        if (filtered.length === 0) {
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
        let filtered = arr.filter(item => item.item_id == activeItem.id)
        if (filtered.length == 1) {
            onPressNewProduct(filtered[0])
        }
    }

    const onBackPress = () => {
        if (activeItem !== null) {
            if (isAddServiceMode) {
                onPressItem(activeIndex, activeItem)
            } else {
                onPressItem1(activeIndex, activeItem)
            }
        } else {
            props.navigation.goBack()
        }
    }

    const saveData = async () => {
        try {
            setLoading(true)
            let headers = {
                "Authorization": `Bearer ${access_token}`
            }
            let formdata = new FormData()
            let services = []
            let new_services = []

            servicesData.forEach((itemm, index) => {
                if (selectedItems.includes(itemm.item_id)) {
                    var hoursDotMinutes = `${itemm.time_duration_h}:${itemm.time_duration_m}`;
                    var fieldArray = hoursDotMinutes.split(":");
                    var minutes =(itemm.time_duration_m==""&&itemm.time_duration_h=="")?"":Number(itemm.time_duration_m) + 60 * Number(itemm.time_duration_h);
                    let obj = {
                        "item_id": itemm.item_id,
                        "price":(itemm.price?.trim()==""||itemm.price=="$")?"": Number(itemm.price.replace('$', '')),
                        "time_duration": minutes
                    }
                    if (String(itemm.item_id).startsWith("new")) {
                        let newServiceItem = newServicesMaster.find(x => x.id == itemm.item_id)
                        let productsofItems = newProductsData.filter(x => x.item_id == itemm.item_id).map(x => ({
                            name: x.name,
                            price:x.price=="$"?"":x.price
                        })).filter(x => x.name != "")
                        new_services.push({ ...obj, item_name: newServiceItem.name, variant_data: newServiceItem.variant_data, products: productsofItems })
                    } else {
                        services.push(obj)
                    }

                }
            })
            console.log(selectedProducts)
            let json_data = {
                products: [...productsData].filter(x => x.name != "").map(x => ({ item_product_id: x.id, price:x.price=="$"?"":x.price })).filter(x=>selectedProducts?.map(x=>x.id).includes(x.item_product_id)),
                new_products: [...newProductsData].filter(x => !String(x?.item_id).startsWith("new")).filter(x => x.name != "").map(x=>({...x,price:x.price=="$"?"":x.price})),
                services: [...services],
                new_services: [...new_services]
            }
            // console.log(JSON.stringify(json_data))
            // setLoading(false)
            // return 


            formdata.append("service_id", subService.id)
            formdata.append("json_data", JSON.stringify(json_data))
            const config = {
                headers: headers,
                data: formdata,
                type: "post",
                endPoint: "/api/providerServicesSaveIndividually"
            }
            let res = await getApi(config)

            if (res.status) {
                dispatch(getMyJobsThunk(user.id, access_token))
                showToast(res.message)
                setTimeout(()=>{
                    props.navigation.navigate("HomeScreen")
                    dispatch(addUpdateQuestionaire())
                    setLoading(false)
                },1500)
               
            } else {
                showToast(res.message)
                setLoading(false)
            }
        } catch (err) {
            console.error(err)
            setLoading(false)
        } finally {
           
        }
    }

    return (
        <>
            <StatusBar
                // translucent 
                // backgroundColor={"transparent"} 
                backgroundColor={LS_COLORS.global.green}
                barStyle="light-content" />
            <View style={{ width: '100%', height: '18%' }}>
                <ImageBackground
                    resizeMode="cover"
                    source={{ uri: BASE_URL + subService?.image }}
                    style={styles.image}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                            {/* <View style={{ height: "22%", justifyContent: 'flex-end', paddingTop: StatusBar.currentHeight + 10 }}> */}
                            <Header
                                imageUrl={require("../../../assets/backWhite.png")}
                                action={() => onBackPress()}
                                imageUrl1={require("../../../assets/homeWhite.png")}
                                action1={() => props.navigation.navigate("HomeScreen")}
                                title={subService?.name}
                                titleStyle={{ color: "white", fontSize: 22 }}
                            />
                            {/* </View> */}
                            {/* <View style={{ justifyContent: 'center', alignItems: "center", height: "33%" }}>
                                <Text style={{ fontSize: 29, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.white }}>{subService?.name}</Text>
                            </View> */}
                        </SafeAreaView>
                    </View>
                </ImageBackground>
            </View>
            <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
                <Container>
                    <Text maxFontSizeMultiplier={1.5} style={styles.service}>SERVICES</Text>
                    {variants.length > 0 && <View style={{ height: 70 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10, marginHorizontal: 15, height: 70 }}>
                            {variants.map((item, index) => {
                                return (
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => toggleVariant(item)} key={index}
                                        style={{
                                            backgroundColor: selectedVariant == item.id ? LS_COLORS.global.green : LS_COLORS.global.white,
                                            marginHorizontal: 10,
                                            paddingHorizontal: 15,
                                            paddingVertical: 5,
                                            borderRadius: 100,
                                            height: 40,
                                            borderWidth: selectedVariant == item.id ? 1 : 1,
                                            borderColor: selectedVariant == item.id ? LS_COLORS.global.green : LS_COLORS.global.green
                                        }}>
                                        <Text style={{
                                            fontFamily: LS_FONTS.PoppinsMedium,
                                            fontSize: 14,
                                            textTransform: 'uppercase',
                                            color: selectedVariant == item.id ? LS_COLORS.global.white : LS_COLORS.global.black,
                                        }} maxFontSizeMultiplier={1.5} >
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>}
                    {activeItem !== null && <View style={{ flexDirection: 'row', width: '98%', alignSelf: "center", marginBottom: '2%' }}>
                        <View style={{ flex: 1 }} />
                        <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                            <View style={{ alignItems: 'center', marginRight: 15 }}>
                                <Text maxFontSizeMultiplier={1.2} style={{ ...styles.priceTime, }}>Estimated Time</Text>
                            </View>
                            <View style={{ alignItems: "center", marginRight: 10 }}>
                                <Text maxFontSizeMultiplier={1.2} style={styles.priceTime}>Price</Text>
                            </View>
                        </View>
                    </View>}
                    <Content showsVerticalScrollIndicator={false}>
                        {activeItem !== null && <ServiceItem
                            ref={itemRef}
                            item={activeItem}
                            index={activeIndex}
                            onCheckPress={() => onPressItem(activeIndex, activeItem)}
                            isSelected={selectedItems.includes(activeItem.id)}
                            setText={setText}
                            setProductText={setProductText}
                            setNewProductText={setNewProductText}
                            serviceItem={variants.length > 0 ? servicesData.find(item => item?.variant_data == selectedVariant && item?.item_id == activeItem?.id) : servicesData.find(item => item?.item_id == activeItem?.id)}
                            subService={subService}
                            showInputs
                            products={productsData?.filter(item => item?.item_id == activeItem?.id)}
                            newProducts={newProductsData?.filter(item => item?.item_id == activeItem?.id)}
                            selectedProducts={getSelectedProducts()}
                            selectedNewProducts={getSelectedNewProducts()}
                            onPressProduct={(item) => onPressProduct(item)}
                            onPressNewProduct={(item) => onPressNewProduct(item)}
                            onSelectOther={onSelectOther}
                            isOtherSelected={isOtherSelected}
                            removeNewproduct={removeNewproduct}
                            addNewProduct={addNewProduct}
                            removeNonGlobalItem={removeNonGlobalItem}
                        />}
                        {activeItem == null && itemList && itemList.length > 0 &&
                            <>
                                {itemList.map(((item, index) => {
                                    return (
                                        <View style={{ flexDirection: "row", width: width * 0.75, marginLeft: 5, alignItems: "center" }}>
                                            <View style={{ width: width * 0.70 }}>
                                                <ServiceItem
                                                    key={index}
                                                    item={item}
                                                    index={index}
                                                    onCheckPress={() => {
                                                        onPressItem(index, item)
                                                    }}
                                                    isSelected={selectedItems.includes(item.id)}
                                                />
                                            </View>
                                            {item.list_type == "private" && <Text
                                                maxFontSizeMultiplier={1.2}
                                                style={{ fontFamily: LS_FONTS.PoppinsRegular, color: "red", fontSize: 12, paddingHorizontal: 10, borderRadius: 5, borderWidth: 1, borderColor: "red", paddingVertical: 5 }}
                                                onPress={() => {
                                                    removeServiceData(item.id)
                                                }}>Remove</Text>}
                                        </View>)
                                }))}
                                {newServices.map((item, index) => {
                                    return (
                                        <View style={{ flexDirection: "row", width: width * 0.75, marginLeft: 5, alignItems: "center" }}>
                                            <View style={{ width: width * 0.70 }}>
                                                <ServiceItem
                                                    key={index}
                                                    item={item}
                                                    index={index}
                                                    onCheckPress={() => {
                                                        onPressItem(index, item)
                                                    }}
                                                    isSelected={selectedItems.includes(item.id)}
                                                />
                                            </View>
                                            <Text maxFontSizeMultiplier={1.2} style={{ fontFamily: LS_FONTS.PoppinsRegular, color: "red", fontSize: 12, paddingHorizontal: 10, borderRadius: 5, borderWidth: 1, borderColor: "red", paddingVertical: 5 }} onPress={() => {
                                                removeNewService(item)
                                            }}>Remove</Text>
                                        </View>
                                    )
                                })}
                                <CustomButton title="Add Service"
                                    action={() => {
                                        setOpenModal(true)
                                    }}
                                    maxFont={1.2}
                                    customStyles={{
                                        height: 40,
                                        width: "35%",
                                        borderRadius: 5,
                                        marginBottom: 15
                                    }}
                                    customTextStyles={{
                                        fontSize: 13,
                                        fontFamily: LS_FONTS.PoppinsRegular
                                    }}
                                />
                                {/* <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, color: "black", fontSize: 14,  alignSelf: "center" }}>Add Service +</Text> */}
                            </>
                        }
                    </Content>
                    <View style={{ paddingBottom: '2.5%' }}>
                        {activeItem == null
                            ?
                            selectedItems.length > 0 && (isAddServiceMode ? <CustomButton title={"Next"} action={() => next()} /> : <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                                <CustomButton maxFont={1.2} title={"Save"} action={() => { saveData() }} customStyles={{ width: width * 0.45 }} />
                                <CustomButton maxFont={1.2} title={"Next"} action={() => next()} customStyles={{ width: width * 0.45 }} />
                            </View>)
                            :
                            <CustomButton maxFont={1.2} title={"Save"} action={() => saveRequest()} />
                        }
                    </View>
                </Container>
                {loading && <Loader />}
                <CheckServiceNameModal addNewService={addNewService} visible={openModal} setVisible={setOpenModal} />
            </SafeAreaView >
        </>
    )
}

const CheckServiceNameModal = ({ visible, setVisible, addNewService }) => {
    const [service_name, setServiceName] = React.useState("")
    React.useEffect(() => {
        if (visible) {
            setServiceName("")
        }
    }, [visible])
    return (
        <Modal
            visible={visible}
            transparent={true}
        >
            <Pressable onPress={() => setVisible(false)} style={{ flex: 1, justifyContent: "center", backgroundColor: "#0005" }}>
                <Pressable style={{ backgroundColor: "white", padding: 10, borderRadius: 10, marginHorizontal: 15 }}>
                    <Text maxFontSizeMultiplier={1.5} style={{ textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular, color: "black", fontSize: 16 }}>Enter Service name</Text>
                    <CustomInput
                        text="Service Name"
                        customContainerStyles={{ marginTop: 20 }}
                        value={service_name}
                        onChangeText={t => setServiceName(t)}
                    />
                    <CustomButton
                        title="Submit"
                        action={() => {
                            addNewService(service_name)
                            setVisible(false)
                        }}
                        customStyles={{ width: "35%", borderRadius: 5, marginTop: 20 }}
                        customTextStyles={{ fontSize: 12 }}
                    />
                </Pressable>
            </Pressable>
        </Modal>
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





