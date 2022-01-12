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
    const [currentDate, setCurrentDate] = React.useState(new Date())
    const [orderData, setOrderData] = React.useState({})
    const [timeFrameData, setTimeFrameData] = React.useState([])
    useEffect(() => {
        if (!isAddServiceMode) {
            getTimeFrames()
        }
        getScheduleRange()
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


    const getScheduleRange = () => {
        let headers = {
            Accept: "application/json",
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${access_token}`
        }
        let data = JSON.stringify({
            start_time: moment().format("YYYY-MM-01")
        })

        let config = {
            headers: headers,
            data: data,
            endPoint: '/api/scheduleDataList',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status) {
                    let os = response.ordersData
                    if (os.length > 0) {
                        let z = {}
                        for (let oitem of os) {
                            let o_start_time = moment(oitem.order_start_time, "YYYY-MM-DD HH:mm").format("MM/DD/YYYY")
                            if (z[o_start_time]) {
                                z[o_start_time].push(oitem)
                            } else {
                                z[o_start_time] = [oitem]
                            }
                        }
                        let clonez = Object.keys(z)
                        clonez = clonez.sort((a, b) => moment(a, "MM/DD/YYYY") - moment(b, "MM/DD/YYYY"))
                        let newz = {}
                        for (let x of clonez) {
                            newz[x] = z[x]
                        }
                        setOrderData(newz)
                    } else {
                        setOrderData({})
                    }

                    let ts = response.timeFrameData
                    if (ts.length > 0) {
                        setTimeFrameData(response.ordersData)
                    } else {
                        setTimeFrameData([])
                    }
                }
                else {
                    setLoading(false)
                    // showToast(response.message, 'danger')
                }
            })
            .catch(err => {
                setLoading(false)
                console.error(err)
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
                                    }} style={{ position: "relative", padding: 5, width: 40, height: 40, borderRadius: 20, justifyContent: "center", backgroundColor: isSelected ? "#0007" : (isThereAnyData && state !== 'disabled' ? "green" : "white") }}>
                                        <Text style={{ textAlign: 'center', fontSize: 14, color: state === 'disabled' ? 'gray' : (isThereAnyData ? 'white' : 'black'), fontFamily: LS_FONTS.PoppinsRegular }}>
                                            {date.day}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                            minDate={new Date()}
                        />
                        {
                            Object.keys(orderData).map(x => {
                                let new_data = {}
                                for (let order of orderData[x]) {
                                    let s_title=order.sub_services_name??order.services_name
                                    if (new_data[s_title]) {
                                        new_data[s_title]?.push(order)
                                    } else {
                                        new_data[s_title] = [order]
                                    }
                                }
                                return (
                                    <>
                                        <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 14, marginHorizontal: 20, marginTop: 20 }}>{x}</Text>
                                        {Object.keys(new_data)?.map(y => {
                                            return (<OrderList data={new_data[y]} title={y}  timeFrameData={timeFrameData}/>)
                                        })}
                                    </>
                                )
                            })
                        }



                    </View> :
                        <ServiceList title="" />
                    }
                </ScrollView>

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

const OrderList = ({ title, data ,timeFrameData}) => {
    const [showOrder, setShowOrders] = React.useState(false)
    const navigation = useNavigation()
    console.log(timeFrameData.length)
    let frames=timeFrameData.filter(x=>x.services_name?.toUpperCase()===title?.toUpperCase())
    console.log("frames",frames)
    return (
        <View style={{ marginHorizontal: 20, }}>
            <Pressable onPress={() => setShowOrders(!showOrder)} style={{ paddingVertical: 13, paddingHorizontal: 10, borderWidth: 1, borderColor: LS_COLORS.global.divider, borderRadius: 10, marginTop: 7 }}>
                <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsBold }}>{title} ({data?.length ?? 0})</Text>
                {frames.map(f=><View style={{ flexDirection: "row", marginBottom: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.darkBlack }}>From</Text>
                        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5, justifyContent: 'center' }}>
                            <TouchableOpacity style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} activeOpacity={0.7} >
                                <Text>{f.from_time}</Text>
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
                            <Text>{f.to_time}</Text>
                                <View style={{ height: 11, aspectRatio: 1 }}>
                                    <Image source={require('../../../assets/time.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>)}
            </Pressable>
            {showOrder && <>
                {data?.map(o => {
                    return (
                        <Pressable onPress={() => {
                            navigation.navigate("ProviderStack", { screen: "OrderDetail", params: { item: { id: o.id } } })
                        }} style={{ paddingVertical: 13, paddingHorizontal: 10, borderWidth: 1, borderColor: "#1AB8AA", backgroundColor: "#C8E9A2", borderRadius: 10, marginTop: 7 }}>
                             <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                            <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsSemiBold }}>{title} ({o.customers_first_name})</Text>
                            <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular }}>#{o.id}</Text>

                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsRegular }}>Start Time : {moment(o.order_start_time, "YYYY-MM-DD HH:mm").format("hh:mm a")}</Text>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsRegular }}>Est. End Time : {moment(o.order_end_time, "YYYY-MM-DD HH:mm").format("hh:mm a")}</Text>
                            </View>
                        </Pressable>
                    )
                })}

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

