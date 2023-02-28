import React, { useRef, useState } from 'react';
import {
    Modal,
    StyleSheet,
    Pressable,
    View,
    TouchableOpacity,
    Text,
    Image,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Card } from 'native-base';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LS_FONTS from '../constants/fonts';
import LS_COLORS from '../constants/colors';
import moment from 'moment';
import _ from 'lodash'
import { showToast } from '../utils';
import { Rating } from 'react-native-ratings';
import { CheckBox } from 'react-native-elements';
import lodash from 'lodash'

const TimeFrame = props => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [data, setData] = React.useState([])
    const [jsonData, setJsonData] = React.useState([])
    const [orderPreviousData, setOrderPreviousData] = React.useState(null)
    // selected DAta
    const [selectedDate, setSelectedDate] = React.useState(new Date())
    const [type, setType] = React.useState("start")
    const [selectedIndex, setSelectedIndex] = React.useState(null)
    const [mile_distanceP, setMileDistanceP] = React.useState({})
    // const 
    const handleConfirm = (date) => {
        console.log(date, selectedIndex, type)
        if (typeof selectedIndex == "number") {
            let d = _.cloneDeep(jsonData)
            const start_time = moment(props.starting_time, "YYYY-MM-DD HH:mm:[00]")
            const end_time = moment(props.ending_time, "YYYY-MM-DD HH:mm:[00]")
            let dDate = moment(date)
            if (type == "start") {
                if (dDate.toDate() < start_time.toDate() || dDate.toDate() > end_time.toDate()) {
                    setTimeout(() => {
                        showToast(`order start time must be within ${start_time.format("hh:mm a")} &  ${end_time.format("hh:mm a")}`)
                    }, 500)
                } else {
                    d[selectedIndex].order_start_time = moment(date).format("YYYY-MM-DD HH:mm:[00]")
                }
            } else {
                if (moment(d[selectedIndex].order_start_time).toDate() < moment(date).toDate()) {
                    if (dDate.toDate() > end_time.toDate() || dDate.toDate() < start_time.toDate()) {
                        setTimeout(() => {
                            showToast(`order end time must be within ${start_time.format("hh:mm a")} &  ${end_time.format("hh:mm a")}`)
                        }, 500)
                    } else {
                        d[selectedIndex].order_end_time = moment(date).format("YYYY-MM-DD HH:mm:[00]")
                    }

                } else {
                    setTimeout(() => {
                        showToast("order end time must be greater than start time")
                    }, 500)
                }
            }
            setDatePickerVisibility(false)
            console.log(d)
            setJsonData(d)
        }
        setDatePickerVisibility(false)
    };


    React.useEffect(() => {
        if (props.data && props.orderPreviousData) {
            setData(props.data)
            setOrderPreviousData(props.orderPreviousData)
        }
        if (props.mile_distanceP) {
            setMileDistanceP(props.mile_distanceP)
        }
    }, [props])

    React.useEffect(() => {
        if (orderPreviousData && data) {
            let d = _.cloneDeep(data)
            let z = []
            for (let p of d) {
                let selectedServices = []
                let selectedProducts = []
                let selectedServicesName = []
                let otherOptions = []
                let duration = 0
                let showTBD=true
                for (let i of p.item_list) {
                    let data = {
                        "item_id": i.service_item_id,
                        "product_id": "",
                        "other": "",
                        "have_own": "",
                        "need_recommendation": ""
                    }
                    if (i.checked) {
                        selectedServices.push(i.service_item_id)
                        selectedServicesName.push(i.service_items_name)
                        if(i?.time_duration==""||i?.time_duration==null||i?.time_duration==undefined){

                        }else{
                            showTBD=false
                            duration += Number(i.time_duration)
                        }
                    }
                    for (let pr of i.products) {
                        if (pr.checked && !pr.type) {
                            selectedProducts.push(pr.item_product_id)
                        }
                        if (pr.type && pr.checked) {
                            if (pr.type == "other") {
                                data.other = pr.other
                            }
                            if (pr.type == "have_own") {
                                data.have_own = pr.have_own
                            }
                            if (pr.type == "need_recommendation") {
                                data.need_recommendation = "true"
                            }
                        }
                    }
                    otherOptions.push(data)
                }
                if (selectedServices.length == 0) {

                } else {
                    z.push({
                        "provider_id": p.id,
                        "provider_name": p.first_name + " " + p.last_name, //need to removed when order hited
                        "duration":showTBD?"": duration, //need to removed when order hited
                        "estimated_reached_time": "0",
                        "order_start_time": orderPreviousData?.order_start_time,
                        "order_end_time": orderPreviousData?.order_end_time,
                        "items": [...new Set(selectedServices)],
                        "itemsName": [...selectedServicesName], //need to removed when order hited
                        "products": [...new Set(selectedProducts)],
                        "other_options": otherOptions,
                        "service_is_at_address": p.service_is_at_address,
                        "mile_distance": Boolean(Number(p?.service_is_at_address)) ? mile_distanceP[`${p.id}`] : orderPreviousData?.mile_distance,
                        "order_placed_address": Boolean(Number(p?.service_is_at_address)) ? p?.address?.address_line_1 : orderPreviousData?.order_placed_address,
                        "order_placed_lat": Boolean(Number(p?.service_is_at_address)) ? p?.address?.lat : orderPreviousData?.order_placed_lat,
                        "order_placed_long": Boolean(Number(p?.service_is_at_address)) ? p?.address?.long : orderPreviousData?.order_placed_long,
                    })
                }
            }
            console.log("JSON", z)

            setJsonData(_.cloneDeep(z))
        }
    }, [data, mile_distanceP])
    const getTimeInHours = (minute) => {
        let d = parseInt(minute / 60)==0?"":parseInt(minute / 60)+" Hr"
        if (minute % 60 !== 0) {
            d += ` ${parseInt(minute % 60)} Mins`
        }
        if (Number(minute) == 0) {
            return "0 Mins"

        }
        return `${d}`
    }
    return (
        <Modal
            visible={props.visible}
            animationType="fade"
            transparent={true}
            {...props}
        >
            <Pressable onPress={props.pressHandler} style={styles.modalScreen}>
                <Card style={{
                    backgroundColor: 'white',
                    width: "95%",
                    borderRadius: 10,
                    padding: 10,
                }}>
                    <Pressable>
                        {/* <Text  maxFontSizeMultiplier={1.5} style={{ textAlign: "center", color: LS_COLORS.global.green, fontSize: 16, fontFamily: LS_FONTS.PoppinsSemiBold, marginTop: 10 }}>Select Time Frame</Text> */}
                        <Text maxFontSizeMultiplier={1.5} style={{ textAlign: "center", color: LS_COLORS.global.green, fontSize: 16, fontFamily: LS_FONTS.PoppinsSemiBold, marginTop: 10 }}>Summary</Text>
                        <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, marginTop: 5 }}>Selected Date: {moment(props.starting_time, "YYYY-MM-DD HH:mm:[00]").format("YYYY-MM-DD")}</Text>

                        {jsonData.length > 1 && <Text maxFontSizeMultiplier={1.5} style={{ textAlign: "center", fontSize: 13, fontFamily: LS_FONTS.PoppinsRegular }}>Select time frame for each service provider</Text>}
                        {jsonData && jsonData.map((i, index) => {
                            let time_format = ""
                            if(i.duration==""){
                                time_format="TBD"
                            }else{
                                time_format=getTimeInHours(i.duration)
                            }
                            let estimated_price = 0.5
                            if (props.provider_prices) {
                                let obj = props.provider_prices?.find(x => x.id == i.provider_id)
                                // _price
                                let products = i.products
                                let provider = data?.find(x => x?.id == i.provider_id)
                                console.log(products)
                                console.log(provider?.item_list)
                                if (obj) {
                                    estimated_price += obj?.price
                                    if (provider) {
                                        estimated_price = 0.5
                                        for (let item of provider?.item_list) {
                                            if (item.checked) {
                                                estimated_price += Number(item.price)
                                                for (let product of item?.products) {
                                                    if (product.checked) {
                                                        if (product?.item_products_is_per_mile == "1") {
                                                            estimated_price += Number(product.price) * lodash.round(Number(orderPreviousData?.mile_distance), 2)
                                                        } else {
                                                            estimated_price += Number(product.price)
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            let p_obj = data?.find(x => x.id == i.provider_id)
                            let location = props?.location
                            if (p_obj) {
                                if (p_obj?.service_is_at_address == "1") {
                                    location = p_obj?.address?.address_line_1
                                }
                            }
                            return <View style={{ marginTop: "5%" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsMedium }}>{i.provider_name}</Text>
                                </View>
                                <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: "black" }}>({i.itemsName.join(", ")})</Text>
                                <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 11, color: LS_COLORS.global.green }}>Estimated Time: {time_format}</Text>
                                <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 11, color: LS_COLORS.global.green }}>Location: {location}</Text>
                                <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 11, color: LS_COLORS.global.green }}>Estimated Cost: ${Number(estimated_price).toFixed(2)}</Text>
                                {/* <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 11, color: LS_COLORS.global.green }}>Distance: {lodash.round(orderPreviousData?.mile_distance, 2)}</Text> */}

                                <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 13, marginTop: "5%" }}>My available start time between:</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }}>
                                    <View style={{ width: "50%", minHeight: 60 }} >
                                        <Text maxFontSizeMultiplier={1.5}>From</Text>
                                        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5 }}>
                                            <TouchableOpacity
                                                disabled={jsonData.length <= 1}
                                                style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} activeOpacity={0.7}
                                                onPress={() => {
                                                    setType("start")
                                                    setSelectedDate(moment(i.order_start_time).toDate())
                                                    setSelectedIndex(index)
                                                    setDatePickerVisibility(!isDatePickerVisible)
                                                }}>
                                                <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12 }}>{moment(i.order_start_time).format("hh : mm A")}</Text>
                                                <View style={{ height: 11, aspectRatio: 1 }}>
                                                    <Image source={require('../assets/time.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ width: "50%", justifyContent: 'center' }}>
                                        <Text maxFontSizeMultiplier={1.5}>To</Text>
                                        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5 }}>
                                            <TouchableOpacity
                                                disabled={jsonData.length <= 1}
                                                style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} activeOpacity={0.7}
                                                onPress={() => {
                                                    setType("end")
                                                    setSelectedDate(moment(i.order_end_time).toDate())
                                                    setSelectedIndex(index)
                                                    setDatePickerVisibility(!isDatePickerVisible)
                                                }}>
                                                <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12 }}>{moment(i.order_end_time).format("hh:mm A")}</Text>
                                                <View style={{ height: 11, aspectRatio: 1 }}>
                                                    <Image source={require('../assets/time.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        })}
                        <View style={{ marginTop: '20%' }}>
                            <TouchableOpacity
                                style={styles.save}
                                activeOpacity={0.7}
                                onPress={() => {
                                    props.action(jsonData.map(x => {
                                        return ({
                                            "provider_id": String(x.provider_id),
                                            "estimated_reached_time": x.estimated_reached_time,
                                            "order_start_time": x.order_start_time,
                                            "order_end_time": x.order_end_time,
                                            "items": x.items.map(String),
                                            "products": x.products.map(String),
                                            "other_options": x.other_options,
                                            "order_placed_address": x?.order_placed_address,
                                            "order_placed_lat": x?.order_placed_lat,
                                            "order_placed_long": x?.order_placed_long,
                                            "order_from_address": orderPreviousData?.order_from_address,
                                            "order_from_lat": orderPreviousData?.order_from_lat,
                                            "order_from_long": orderPreviousData?.order_from_long,
                                            "mile_distance": x?.mile_distance,
                                            "service_is_at_address": x?.service_is_at_address
                                        })
                                    }))
                                }}>
                                <Text maxFontSizeMultiplier={1.5} style={styles.saveText}>Send Request</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Card>
                <DateTimePickerModal
                    date={selectedDate}
                    isVisible={isDatePickerVisible}
                    mode="time"
                    onConfirm={handleConfirm}
                    onCancel={() => setDatePickerVisibility(false)}
                />
            </Pressable>
        </Modal>
    );
};

export const FilterModal = ({ visible, setVisible, getFilteredData }) => {
    const [rating, setRating] = React.useState({
        "range_start_rating": "",
        "range_end_rating": ""
    })
    const [price, setPrice] = React.useState({
        "range_start_price": "",
        "range_end_price": ""
    })
    const [time, setTime] = React.useState({
        "range_start_time": "",
        "range_end_time": ""
    })
    const [my_location, setMyLocation] = React.useState(false)
    const handleSave = () => {
        getFilteredData({ ...rating, ...time, ...price }, my_location)
        setVisible(false)
    }
    const scrollRef = useRef(null)
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
        >
            <Pressable onPress={() => setVisible(false)} style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior={Platform.OS == "android" ? "none" : "padding"} style={styles.modalScreen}>
                    <Card style={{
                        backgroundColor: 'white',
                        width: "95%",
                        borderRadius: 10,
                        padding: 10,
                        // maxHeight:"80%"
                    }}>
                        <Pressable>
                            <ScrollView ref={scrollRef}>
                                <Text maxFontSizeMultiplier={1.5} style={{ textAlign: "center", color: LS_COLORS.global.green, fontSize: 16, fontFamily: LS_FONTS.PoppinsSemiBold, marginTop: 10 }}>Filter</Text>
                                <View style={{ marginTop: "10%" }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.green }}>I want services at my location:</Text>
                                        <CheckBox
                                            checked={my_location}
                                            onPress={() => {
                                                setMyLocation(!my_location)
                                            }}
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                        />
                                    </View>
                                    <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.green }}>Rating:</Text>
                                    {[4, 3, 2, 1].map(x => <TouchableOpacity onPress={() => {
                                        setRating({
                                            range_start_rating: "" + x,
                                            range_end_rating: ""
                                        })
                                    }} style={{ flexDirection: "row", justifyContent: "space-between" }} ><View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                                            <Rating
                                                type='custom'
                                                ratingColor='gold'
                                                ratingBackgroundColor='white'
                                                ratingCount={5}
                                                imageSize={20}
                                                startingValue={x ?? 0}
                                                readonly={true}
                                            />
                                            <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.black }}> & Up</Text>
                                        </View>
                                        <CheckBox
                                            checked={x == Number(rating.range_start_rating)}
                                            onPress={() => {
                                                setRating({
                                                    range_start_rating: "" + x,
                                                    range_end_rating: ""
                                                })
                                            }}
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                        // checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/checked.png")} />}
                                        // uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/unchecked.png")} />}
                                        />
                                    </TouchableOpacity>)}
                                    <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.green, marginTop: 10 }}>Price : </Text>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", borderColor: "gray", borderRadius: 5, borderWidth: 1, paddingHorizontal: 10 }}>
                                            <Text maxFontSizeMultiplier={1.5}>$</Text>
                                            <TextInput maxFontSizeMultiplier={1.5} value={price.range_start_price} onChangeText={t => {
                                                setPrice({
                                                    range_start_price: t,
                                                    range_end_price: price.range_end_price
                                                })
                                            }} onFocus={() => {
                                                scrollRef?.current?.scrollToEnd({ animated: true })
                                                setTimeout(() => {
                                                    scrollRef?.current?.scrollToEnd({ animated: true })
                                                }, 1000)

                                            }} keyboardType="numeric" returnKeyType="done" style={{ color: "black", paddingVertical: 5 }} placeholder="Min" placeholderTextColor="gray" />
                                        </View>
                                        <Text maxFontSizeMultiplier={1.5}>  -  </Text>
                                        <View style={{ flexDirection: "row", alignItems: "center", borderColor: "gray", borderRadius: 5, borderWidth: 1, paddingHorizontal: 10 }}>
                                            <Text maxFontSizeMultiplier={1.5}>$</Text>
                                            <TextInput onFocus={() => {
                                                scrollRef?.current?.scrollToEnd({ animated: true })
                                                setTimeout(() => {
                                                    scrollRef?.current?.scrollToEnd({ animated: true })
                                                }, 1000)

                                            }} maxFontSizeMultiplier={1.5} value={price.range_end_price} onChangeText={t => {
                                                setPrice({
                                                    range_start_price: price.range_start_price,
                                                    range_end_price: t
                                                })
                                            }} keyboardType="numeric" returnKeyType="done" style={{ color: "black", paddingVertical: 5 }} placeholder="Max" placeholderTextColor="gray" />
                                        </View>
                                    </View>
                                    <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.green, marginTop: 10, marginBottom: 5 }}>Time (minute): </Text>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", borderColor: "gray", borderRadius: 5, borderWidth: 1, paddingHorizontal: 10 }}>
                                            <TextInput onFocus={() => {
                                                scrollRef?.current?.scrollToEnd({ animated: true })
                                                setTimeout(() => {
                                                    scrollRef?.current?.scrollToEnd({ animated: true })
                                                }, 1000)

                                            }} maxFontSizeMultiplier={1.5} value={time.range_start_time} onChangeText={t => {
                                                setTime({
                                                    range_start_time: t,
                                                    range_end_time: time.range_end_time
                                                })
                                            }} keyboardType="number-pad" returnKeyType='done' style={{ color: "black", paddingVertical: 5 }} placeholder="Min" placeholderTextColor="gray" />
                                        </View>
                                        <Text maxFontSizeMultiplier={1.5}>  -  </Text>
                                        <View style={{ flexDirection: "row", alignItems: "center", borderColor: "gray", borderRadius: 5, borderWidth: 1, paddingHorizontal: 10 }}>
                                            <TextInput onFocus={() => {
                                                scrollRef?.current?.scrollToEnd({ animated: true })
                                                setTimeout(() => {
                                                    scrollRef?.current?.scrollToEnd({ animated: true })
                                                }, 1000)

                                            }} maxFontSizeMultiplier={1.5} value={time.range_end_time} onChangeText={t => {
                                                setTime({
                                                    range_start_time: time.range_start_time,
                                                    range_end_time: t
                                                })
                                            }} keyboardType="number-pad" returnKeyType="done" style={{ color: "black", paddingVertical: 5 }} placeholder="Max" placeholderTextColor="gray" />

                                        </View>

                                    </View>
                                </View>

                                <View style={{ marginTop: '10%', flexDirection: "row", justifyContent: "space-between" }}>
                                    <TouchableOpacity
                                        style={styles.save}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            setRating({
                                                "range_start_rating": "",
                                                "range_end_rating": ""
                                            })
                                            setPrice({
                                                "range_start_price": "",
                                                "range_end_price": ""
                                            })
                                            setTime({
                                                "range_start_time": "",
                                                "range_end_time": ""
                                            })
                                            setMyLocation(false)
                                        }}>
                                        <Text maxFontSizeMultiplier={1.5} style={styles.saveText}>Clear</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.save}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            handleSave()
                                        }}>
                                        <Text maxFontSizeMultiplier={1.5} style={styles.saveText}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>

                        </Pressable>
                    </Card>

                </KeyboardAvoidingView>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalScreen: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        alignItems: 'center',
        justifyContent: "center"
    },
    sure: {
        color: 'black',
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsBold,
        textAlign: "center"
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 45,
        paddingHorizontal: "10%",
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 6,
        alignSelf: 'center',
    },
    saveText: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsRegular,
        color: LS_COLORS.global.white
    },

});

export default TimeFrame;
