import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, FlatList, Alert, Pressable, Dimensions, TouchableOpacity } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import CalendarPicker from 'react-native-calendar-picker';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';


import TextInputMask from 'react-native-text-input-mask';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from "react-native-modal-datetime-picker";

/* Components */
import Header from '../../../components/header';
import CustomButton from "../../../components/customButton"
import Loader from '../../../components/loader';
import { useDispatch, useSelector } from 'react-redux';
import { getApi, BASE_URL } from '../../../api/api';
import { showToast } from '../../../components/validators';
import { setMyJobs } from '../../../redux/features/provider';
import { setAddServiceMode, clearCleanData } from '../../../redux/features/services';
import { ScrollView } from 'react-native-gesture-handler';
import Cards from '../../../components/cards';
import { useNavigation } from '@react-navigation/native';
const Moment = require("moment")
const MomentRange = require("moment-range")
const moment = MomentRange.extendMoment(Moment)
const window_width = Dimensions.get("window").width

const ScheduleTime = (props) => {
    const dispatch = useDispatch()
    const { serviceData } = props.route.params
    const calendarRef = useRef(null)
    const [selectedDates, setSelectedDates] = useState([])
    const user = useSelector(state => state.authenticate.user)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [customDatesStyles, setCustomDatesStyles] = useState([])
    const [loading, setLoading] = useState(false)
    const isAddServiceMode = useSelector(state => state.services.isAddServiceMode)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [dateType, setDateType] = useState(null)
    const [activeIndex, setActiveIndex] = useState(null)
    const [initialDate, setInitialDate] = useState(new Date())
    const [markedDates, setMarkedDates] = useState({})
    const [currentTab, setCurrentTab] = React.useState(1)
    const [currentDate,setCurrentDate]=React.useState(new Date())
    useEffect(() => {
        if (!isAddServiceMode) {
            getTimeFrames()
        }

    }, [])


    // "start_date" : "2021-07-16",  
    // "end_date" : "2021-07-16", 
    // "from_time" : "10:05",
    // "to_time" : "23:00"

    const onDateChange = (date) => {
        console.log(date)
    }





    React.useEffect(() => {
        if (customDatesStyles.length == 0) {
            setMarkedDates({})
        }
    }, [customDatesStyles])


    const save = () => {
        // setLoading(true)
        let headers = {
            Accept: "application/json",
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${access_token}`
        }
        let data = []

        customDatesStyles.map((item) => {
            if (item.from_time.trim() !== '' && item.to_time.trim() !== '') {
                var convertedFrom = moment(item.from_time, 'hh:mm A').format('HH:mm')
                var convertedTo = moment(item.to_time, 'hh:mm A').format('HH:mm')
                data.push({
                    "start_date": moment(item.start_date).format("YYYY-MM-DD"),
                    "end_date": moment(item.end_date).format("YYYY-MM-DD"),
                    "from_time": convertedFrom,
                    "to_time": convertedTo
                })
            }
        })

        if (data.length == 0) {
            setLoading(false)
            return showToast("Invalid time frame data")
        }
        let { json_data, formdata } = serviceData
        json_data = JSON.parse(json_data)
        json_data['time_frame'] = data
        formdata.append("json_data", JSON.stringify(json_data));
        let config = {
            headers: headers,
            data: formdata,
            endPoint: '/api/providerServicesAdd',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setLoading(false)
                    showToast(response.message, 'success')
                    data = []
                    getMyJobs(true)
                }
                else {
                    setLoading(false)
                    showToast(response.message, 'danger')
                }
            })
            .catch(err => {
                setLoading(false)
                console.log("error =>", err)
            }
            )
    }

    const getTimeFrames = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let user_data = {
            "user_id": user.id,
            "service_id": serviceData?.subService?.id
        }
        let config = {
            headers: headers,
            data: JSON.stringify(user_data),
            endPoint: '/api/timeFramesList',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                console.log("response", response)
                if (response.status == true) {
                    setLoading(false)
                    let styles = [];
                    let dates = [];
                    Object.keys(response.data).forEach((ele) => {
                        let element = response.data[`${ele}`]
                        dates.push(moment(element.start_time).format("DD/MM/YYYY"))
                        styles.push({
                            id: element.id,
                            start_date: element.start_time,
                            end_date: element.end_time,
                            style: { backgroundColor: LS_COLORS.global.green },
                            textStyle: { color: LS_COLORS.global.white },
                            containerStyle: [],
                            allowDisabled: true,
                            from_time: element.from_time,
                            to_time: element.to_time
                        });

                    })
                    setSelectedDates([...dates])
                    setCustomDatesStyles(styles)
                }
                else {
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
                console.error(err)
            })
    }

    const getMyJobs = (shouldNavigate) => {
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
                    dispatch(setAddServiceMode({ data: false }))
                    dispatch(clearCleanData())
                    setLoading(false)
                    if (shouldNavigate) {
                        props.navigation.navigate('HomeScreen', { addJobClear: true })
                    }
                }
                else {
                    setLoading(false)
                    showToast(response.message, 'success')
                }
            }).catch(err => {
                setLoading(false)
            }
            )
    }



    const setTime = (type, index) => {
        setDateType(type)
        setActiveIndex(index)
        setDatePickerVisibility(true)
        // setInitialDate(new Date(moment(`${customDatesStyles[index].date} ${type == "from" ? customDatesStyles[index].from_time : customDatesStyles[index].to_time}`)))
    }


    const handleConfirm = (date) => {
        let styles = [...customDatesStyles];
        setDatePickerVisibility(false)
        if (dateType == "from") {
            styles[activeIndex].from_time = moment(date).format('hh:mm a')
        } else {
            let styleDate = styles[activeIndex]
            const start_date = moment(styleDate.start_date).format("MM-DD-YYYY")
            const end_date = moment(styleDate.end_date).format("MM-DD-YYYY")
            const toTime = moment(date).format('hh:mm a')
            if (start_date !== end_date) {
                const fromTime = moment(styleDate.from_time, 'hh:mm a').toDate();
                const toTime1 = moment(toTime, 'hh:mm a').toDate();
                if (fromTime < toTime1) {
                    setMarkedDates({})
                    styles[activeIndex].to_time = toTime
                } else {
                    setTimeout(() => {
                        showToast("End time can not be smaller than start time.", 'warn')
                    }, 500)
                }
            } else {
                const fromTime = moment(styleDate.from_time, 'hh:mm a').toDate();
                const toTime1 = moment(toTime, 'hh:mm a').toDate();
                if (fromTime < toTime1) {
                    setMarkedDates({})
                    styles[activeIndex].to_time = toTime
                } else {
                    setTimeout(() => {
                        showToast("End time can not be smaller than start time.", 'warn')
                    }, 500)
                }
            }

        }
        setCustomDatesStyles([...styles])
    };


    const deleteFrame = (frame) => {
        Alert.alert(
            "Delete Time Frame",
            "Are you sure ?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        setMarkedDates({})
                        setLoading(true)
                        let headers = {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${access_token}`
                        }
                        let data = {
                            "time_frame_id": frame.id
                        }
                        let config = {
                            headers: headers,
                            data: JSON.stringify({ ...data }),
                            endPoint: '/api/timeFramesDelete',
                            type: 'post'
                        }
                        getApi(config)
                            .then((response) => {
                                if (response.status == true) {
                                    let dates = [...selectedDates]
                                    let styles = [...customDatesStyles];
                                    dates = dates.filter(item => item !== moment(frame.date).format('DD/MM/YYYY'))
                                    styles = styles.filter(item => item.id !== frame.id)
                                    setSelectedDates([...dates])
                                    setCustomDatesStyles([...styles])
                                    calendarRef.current.resetSelections()
                                } else {
                                    showToast(response.message, 'success')
                                }
                            }).catch(err => {
                            }).finally(() => {
                                setLoading(false)
                            })
                    }
                }
            ]
        );
    }



    const getAllMarkedDates = (markedObject) => {
        let keys = Object.keys(markedObject)
        if (keys.length == 2) {
            let range = moment().range(keys[0], keys[1])
            let array = Array.from(range.by("days")).map((x, i) => ({ date: moment(x).format("YYYY-MM-DD"), index: i }))
            // {"selected": true, "selectedColor": "#1AB8AA"}
            let data = array.reduce((a, b) => ({ ...a, [b.date]: { "selected": true, "color": "#1AB8AA", startingDay: b.index == 0 ? true : false, endingDay: b.index == array.length - 1 ? true : false } }), {})
            return data
        } else {
            let data = keys.reduce((a, b) => ({
                ...a, [b]: {
                    customStyles: {
                        container: {
                            backgroundColor: '#1AB8AA'
                        },
                        text: {
                            color: 'white'
                        }
                    }
                }
            }), {})
            return data
        }
    }

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title={"Schedule"}
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.goBack()
                }}
            />
            <View style={styles.container}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20 }}>
                    <CustomButton title={"View Calendar"} customTextStyles={{ fontSize: 12 }} customStyles={{ width: window_width * 0.35, height: 45, marginVertical: 10 }} action={() => {
                        setCurrentTab(1)
                    }} />
                    <CustomButton title={"Add Time Frame"} customTextStyles={{ fontSize: 12 }} customStyles={{ width: window_width * 0.35, height: 45, marginVertical: 10 }} action={() => {
                        setCurrentTab(2)

                    }} />
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {currentTab == 1 ? <View style={styles.calendar}>
                        <Calendar
                            current={new Date()}
                            onDayPress={(day) => {
                                onDateChange(day)
                            }}
                            hideArrows={false}
                            hideExtraDays={true}
                            disableMonthChange={false}
                            firstDay={1}
                            hideDayNames={false}
                            showWeekNumbers={false}
                            onPressArrowLeft={subtractMonth => subtractMonth()}
                            onPressArrowRight={addMonth => addMonth()}
                            disableArrowLeft={false}
                            disableArrowRight={false}
                            disableAllTouchEventsForDisabledDays={true}
                            enableSwipeMonths={false}
                            dayComponent={({ date, state }) => {
                                const isToday = state == "today"
                                const isSelected = date.dateString == currentDate
                                let marked_dates = []
                                const isThereAnyData = marked_dates.includes(date.dateString)

                                return (
                                    <TouchableOpacity onPress={() => {
                                        if (state !== "disabled") {
                                            setCurrentDate(date.dateString)
                                        }
                                    }} style={{ position: "relative", padding: 5, width: 40,height:40, borderRadius: 20, justifyContent: "center", backgroundColor: isSelected ? "#0007" : (isThereAnyData && state !== 'disabled' ? "green" : "white") }}>
                                        <Text style={{ textAlign: 'center', fontSize: 14, color: state === 'disabled' ? 'gray' : (isThereAnyData ? 'white' : 'black'), fontFamily:LS_FONTS.PoppinsRegular }}>
                                            {date.day}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                            minDate={new Date()}
                        />
                        <OrderList title="Mechanic" />
                        <OrderList title="PhotoGrapher" />

                    </View> :
                        <ServiceList title="" />
                    }
                </ScrollView>
                <DateTimePickerModal
                    date={initialDate}
                    isVisible={isDatePickerVisible}
                    mode="time"
                    onConfirm={handleConfirm}
                    onCancel={() => setDatePickerVisibility(false)}
                />
                {selectedDates.length > 0 && serviceData.formdata && <CustomButton title={"SAVE"} customTextStyles={{}} customStyles={{ width: '50%', height: 45, marginVertical: 10 }} action={() => save()} />}
            </View>
            {loading && <Loader />}
        </SafeAreaView>
    )
}

export default ScheduleTime;

const ServiceList = ({ title }) => {
    const myJobs = useSelector(state => state.provider.myJobs)
    const navigation = useNavigation()
    return (
        <FlatList
            data={[...myJobs]}
            style={{ marginTop: 20 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
                return (
                    <Cards
                        titleStyle={{ fontSize: 13, textAlign: "center", width: "100%" }}
                        customContainerStyle={{ width: "90%", alignSelf: "center", aspectRatio: 2 }}
                        title1={item.name}
                        imageUrl={{ uri: BASE_URL + item.image }}
                        action={() => {
                            navigation.navigate("AddTimeFrameForService", { service_id: item.id, title: item.name, serviceData: { subService: item } })
                        }}
                    />
                )
            }}
            keyExtractor={(item, index) => index}
        />
    )
}

const OrderList = ({ title }) => {
    const [showOrder, setShowOrders] = React.useState(false)
    return (
        <View style={{ marginHorizontal: 20, marginTop: 30 }}>
            <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 14 }}>7/12/2021</Text>
            <Pressable onPress={() => setShowOrders(!showOrder)} style={{ paddingVertical: 13, paddingHorizontal: 10, borderWidth: 1, borderColor: LS_COLORS.global.divider, borderRadius: 10, marginTop: 7 }}>
                <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsBold }}>{title} (2)</Text>
                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.darkBlack }}>From</Text>
                        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5, justifyContent: 'center' }}>
                            <TouchableOpacity style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} activeOpacity={0.7} >
                                <Text>8:00 AM</Text>
                                <View style={{ height: 11, aspectRatio: 1 }}>
                                    <Image source={require('../../../assets/time.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.darkBlack }}>To</Text>
                        <View style={{ flex: 1, flexDirection: 'row', height: 32, backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5 }}>
                            <TouchableOpacity style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} activeOpacity={0.7} >
                                <Text>11:00 AM</Text>
                                <View style={{ height: 11, aspectRatio: 1 }}>
                                    <Image source={require('../../../assets/time.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Pressable>
            {showOrder && <>
                <Pressable style={{ paddingVertical: 13, paddingHorizontal: 10, borderWidth: 1, borderColor: "#1AB8AA", backgroundColor: "#C8E9A2", borderRadius: 10, marginTop: 7 }}>
                    <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsSemiBold }}>{title} (SARAH)</Text>
                    <View style={{ flexDirection: "row" ,justifyContent:"space-between",marginTop:10}}>
                        <Text style={{fontFamily:LS_FONTS.PoppinsRegular}}>Start Time : 8:00 AM</Text>
                        <Text style={{fontFamily:LS_FONTS.PoppinsRegular}}>Est. End Time : 9:00 AM</Text>
                    </View>
                </Pressable>
                <Pressable style={{ paddingVertical: 13, paddingHorizontal: 10, borderWidth: 1, borderColor: "#1AB8AA", backgroundColor: "#C8E9A2", borderRadius: 10, marginTop: 7 }}>
                    <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsSemiBold }}>{title} (KAIRA)</Text>
                    <View style={{ flexDirection: "row" ,justifyContent:"space-between",marginTop:10}}>
                        <Text style={{fontFamily:LS_FONTS.PoppinsRegular}}>Start Time : 10:00 AM</Text>
                        <Text style={{fontFamily:LS_FONTS.PoppinsRegular}}>Est. End Time : 12:00 AM</Text>
                    </View>
                </Pressable>
            </>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
    },
    calendar: {
        backgroundColor: '#FFFFFF',
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 45,
        width: 122,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 6,
        alignSelf: 'center',
        marginTop: 50
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    }
})

