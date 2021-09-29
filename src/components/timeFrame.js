import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Pressable,
    View,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';
import { Card } from 'native-base';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LS_FONTS from '../constants/fonts';
import LS_COLORS from '../constants/colors';
import moment from 'moment';
import _ from 'lodash'
import { showToast } from '../utils';
const TimeFrame = props => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [data, setData] = React.useState([])
    const [jsonData, setJsonData] = React.useState([])
    const [orderPreviousData, setOrderPreviousData] = React.useState(null)
    // selected DAta
    const [selectedDate, setSelectedDate] = React.useState(new Date())
    const [type, setType] = React.useState("start")
    const [selectedIndex, setSelectedIndex] = React.useState(null)
    // const 
    const handleConfirm = (date) => {
        console.log(date, selectedIndex, type)
        if (typeof selectedIndex == "number") {
            let d = _.cloneDeep(jsonData)
            if (type == "start") {
                d[selectedIndex].order_start_time = moment(date).format("YYYY-MM-DD HH:mm:[00]")
            } else {
                if (moment(d[selectedIndex].order_start_time).toDate() < moment(date).toDate()) {
                    d[selectedIndex].order_end_time = moment(date).format("YYYY-MM-DD HH:mm:[00]")
                } else {
                    showToast("order end time must be greater than start time")
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
    }, [props])

    React.useEffect(() => {
        if (orderPreviousData && data) {
            let d = _.cloneDeep(data)
            let z = []
            for (let p of d) {
                let selectedServices = []
                let selectedProducts = []
                let selectedServicesName = []
                let duration = 0

                for (let i of p.item_list) {
                    if (i.checked) {
                        selectedServices.push(i.service_item_id)
                        selectedServicesName.push(i.service_items_name)
                        duration += Number(i.time_duration)
                    }
                    for (let pr of i.products) {
                        if (pr.checked) {
                            selectedProducts.push(pr.item_product_id)
                        }
                    }
                }
                if (selectedServices.length == 0) {

                } else {
                    z.push({
                        "provider_id": p.id,
                        "provider_name": p.first_name + " " + p.last_name, //need to removed when order hited
                        "duration": duration, //need to removed when order hited
                        "estimated_reached_time": "0",
                        "order_start_time": orderPreviousData?.order_start_time,
                        "order_end_time": orderPreviousData?.order_end_time,
                        "items": [...new Set(selectedServices)],
                        "itemsName": [...selectedServicesName], //need to removed when order hited
                        "products": [...new Set(selectedProducts)],
                        "other_options": []
                    })
                }
            }
            setJsonData(_.cloneDeep(z))

        }
    }, [data])

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
                        <Text style={{ textAlign: "center", color: LS_COLORS.global.green, fontSize: 16, fontFamily: LS_FONTS.PoppinsSemiBold, marginTop: 10 }}>Select Time Frame</Text>
                        {jsonData.map((i, index) => {
                            console.log(i)
                            let x = i.duration / 60
                            let time_format = ""
                            if (x > 1) {
                                time_format = parseInt(x) + " hr " + i.duration % 60 + " mins"
                            } else {
                                time_format = i.duration + " mins"
                            }
                            return <View style={{ marginTop: "10%" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ fontFamily: LS_FONTS.PoppinsMedium }}>{i.provider_name}</Text>
                                </View>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: "black" }}>({i.itemsName.join(", ")})</Text>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 11, color: LS_COLORS.global.green }}>Estimated Time: {time_format}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%", marginTop: "5%" }}>
                                    <View style={{ width: "50%", height: 50, }} >
                                        <Text>From</Text>
                                        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5 }}>
                                            <TouchableOpacity style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} activeOpacity={0.7}
                                                onPress={() => {
                                                    setType("start")
                                                    setSelectedDate(moment(i.order_start_time).toDate())
                                                    setSelectedIndex(index)
                                                    setDatePickerVisibility(!isDatePickerVisible)
                                                }}>
                                                <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12 }}>{moment(i.order_start_time).format("hh : mm A")}</Text>
                                                <View style={{ height: 11, aspectRatio: 1 }}>
                                                    <Image source={require('../assets/time.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ width: "50%", height: 50, justifyContent: 'center' }}>
                                        <Text>To</Text>
                                        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5 }}>
                                            <TouchableOpacity style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} activeOpacity={0.7}
                                                onPress={() => {
                                                    setType("end")
                                                    setSelectedDate(moment(i.order_end_time).toDate())
                                                    setSelectedIndex(index)
                                                    setDatePickerVisibility(!isDatePickerVisible)
                                                }}>
                                                <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12 }}>{moment(i.order_end_time).format("hh:mm A")}</Text>
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
                                            "other_options": []
                                        })
                                    }))
                                }}>
                                <Text style={styles.saveText}>Send Request</Text>
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
