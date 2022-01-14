import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, FlatList, Alert, Pressable, Dimensions, TouchableOpacity, ImageBackground } from 'react-native'

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
import { set } from 'lodash';
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
    const [currentMonth, setCurrentMonth] = React.useState(moment().format("MM"))
    const [markedDates, setMarkedDates] = useState({})
    const [currentTab, setCurrentTab] = React.useState(1)
    const [currentDate, setCurrentDate] = React.useState(null)
    const [g_data, setGdata] = React.useState({})
    const [orderData, setOrderData] = React.useState({})
    const [timeFrameData, setTimeFrameData] = React.useState([])
    const [currentDateFrames, setCurrentDateFrames] = React.useState({})

    useEffect(() => {
        if (!isAddServiceMode) {
            getTimeFrames()
        }
        getScheduleRange()
    }, [])

    React.useEffect(() => {
        if (currentDate) {
            let newFrames = {}
            for (let x of timeFrameData) {
                let start_time = moment(x.start_time, "YYYY-MM-DD HH:mm:[00]")
                let end_time = moment(x.end_time, "YYYY-MM-DD HH:mm:[00]")
                let check_date = moment(currentDate, "YYYY-MM-DD")
                if (start_time >= check_date && check_date <= end_time) {
                    if (newFrames[x.services_name]) {
                        newFrames[x.services_name].push(x)
                    } else {
                        newFrames[x.services_name] = [x]
                    }
                }
            }
            setCurrentDateFrames(newFrames)
        }
    }, [currentDate, timeFrameData])

    useEffect(() => {
        if (currentDate) {
            // getScheduleRange(currentDate)
            let d = moment(currentDate, "YYYY-MM-DD").format("MM/DD/YYYY")
            let newC = g_data[d]
            if (newC) {
                setOrderData({ [d]: newC })
            } else {
                setOrderData({})
            }

        } else {
            let all_ds = Object.keys(g_data).filter(x => moment(x, "MM/DD/YYYY").format("MM") == currentMonth)
            let z = {}
            for (let f of all_ds) {
                z[f] = g_data[f]
            }
            setOrderData(z)
        }
    }, [currentDate, currentMonth, g_data])



    React.useEffect(() => {
        if (customDatesStyles.length == 0) {
            setMarkedDates({})
        }
    }, [customDatesStyles])


    const getScheduleRange = (date = null) => {
        setLoading(true)
        let headers = {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            data: JSON.stringify({}),
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
                        setGdata(newz)
                    } else {
                        setOrderData({})
                        setGdata({})
                    }

                    let ts = response.timeFrameData
                    if (ts.length > 0) {
                        setTimeFrameData(ts)
                    } else {
                        setTimeFrameData([])
                    }
                }
                else {
                    setLoading(false)
                }
            })
            .catch(err => {
                setLoading(false)
                console.error(err)
            }
            ).finally(() => {
                setLoading(false)
            })
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


    const isTimeFrameAvialable = (date) => {
        for (let x of timeFrameData) {
            let start_time = moment(x.start_time, "YYYY-MM-DD HH:mm:[00]")
            let end_time = moment(x.end_time, "YYYY-MM-DD HH:mm:[00]")
            let check_date = moment(date, "YYYY-MM-DD")
            if (start_time >= check_date && check_date <= end_time) {
                return true
            }
        }
        return false
    }


    const isPartiallFunc = (date) => {
        let frames = {}
        for (let x of timeFrameData) {
            let start_time = moment(x.start_time, "YYYY-MM-DD HH:mm:[00]")
            let end_time = moment(x.end_time, "YYYY-MM-DD HH:mm:[00]")
            let check_date = moment(date, "YYYY-MM-DD")
            if (start_time >= check_date && check_date <= end_time) {
                if (frames[x.services_name]) {
                    frames[x.services_name].push(x)
                } else {
                    frames[x.services_name] = [x]
                }
            }
        }
        let orders = g_data[`${moment(date, "YYYY-MM-DD").format("MM/DD/YYYY")}`]
        let filterdOrders = []
        if (orders) {
            orders.map(x => {
                let s_title = x.sub_services_name ?? x.services_name
                if (Object.keys(frames).includes(s_title)) {
                    filterdOrders.push(s_title)
                }
            })
        }
        if(filterdOrders.length==0){
            return false
        }
        for(let z of Object.keys(frames)){
            
            if(!filterdOrders.includes(z)){
                return true
            }
        }
        return false
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
                            hideArrows={false}
                            hideExtraDays={true}
                            disableMonthChange={false}
                            firstDay={1}
                            hideDayNames={false}
                            onMonthChange={(e) => {
                                setCurrentDate(null)
                                setCurrentMonth(moment(e.dateString, "YYYY-MM-DD").format("MM"))
                            }}
                            renderHeader={(e) => {
                                return <Text onPress={() => {
                                    setCurrentDate(null);
                                    setCurrentMonth(moment(new Date(e)).format("MM"))
                                }}
                                    style={{ fontSize: 15, }}>{moment(new Date(e)).format("MMMM YYYY")}</Text>
                            }}

                            showWeekNumbers={false}
                            onPressArrowLeft={subtractMonth => subtractMonth()}
                            onPressArrowRight={addMonth => addMonth()}
                            disableArrowLeft={false}
                            disableArrowRight={false}
                            disableAllTouchEventsForDisabledDays={true}
                            enableSwipeMonths={false}
                            dayComponent={({ date, state }) => {
                                const isToday = state == "today"
                                let marked_dates = Object.keys(g_data)
                                const isOrderAvailable = marked_dates.includes(moment(date.dateString, "YYYY-MM-DD").format("MM/DD/YYYY"))
                                let backgroundColor = "white"
                                let textColor = "black"
                                let isFrame = isTimeFrameAvialable(date.dateString)

                                if (isFrame) {
                                    backgroundColor = LS_COLORS.global.green
                               
                                    textColor = "white"
                                }
                                if (isOrderAvailable) {
                                    backgroundColor = "#c8e9a2"
                                    textColor = "white"
                                }
                                let isPartiall = isPartiallFunc(date.dateString)
                                const isSelected = date.dateString == currentDate
                                if(isSelected){
                                    isPartiall=false
                                }

                                if (isPartiall) {
                                    return (
                                        <PartialComponent date={date} textColor={textColor} backgroundColor={backgroundColor} setCurrentDate={setCurrentDate} />
                                    )
                                }
                                return (
                                    <TouchableOpacity onPress={() => {
                                        setCurrentDate(date.dateString)
                                    }} style={{ position: "relative", padding: 5, width: 40, height: 40, borderRadius: 20, justifyContent: "center", backgroundColor: isSelected ? "#0007" : backgroundColor }}>
                                        <Text style={{ textAlign: 'center', fontSize: 14, color: textColor, fontFamily: LS_FONTS.PoppinsRegular }}>
                                            {date.day}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}

                        />
                        {
                            currentDate == null ?
                                Object.keys(orderData).map(x => {
                                    let new_data = {}
                                    for (let order of orderData[x]) {
                                        let s_title = order.sub_services_name ?? order.services_name
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
                                                return (<OrderList key={y} data={new_data[y]} title={y} timeFrameData={timeFrameData} />)
                                            })}
                                        </>
                                    )
                                })
                                :
                                <View>
                                    {
                                        Object.keys(currentDateFrames)?.map(y => {
                                            let orders = orderData[`${moment(currentDate, "YYYY-MM-DD").format("MM/DD/YYYY")}`]
                                            let filterdOrders = []
                                            if (orders) {
                                                filterdOrders = orders.filter(x => {
                                                    let s_title = x.sub_services_name ?? x.services_name
                                                    if (s_title == y) {
                                                        return true
                                                    }
                                                    return false
                                                })
                                            }
                                            return (
                                                <SingleFrameDataShow title={y} frames={currentDateFrames[y]} orderData={filterdOrders} />
                                            )
                                        })
                                    }
                                </View>
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


const PartialComponent=({date,setCurrentDate,textColor,backgroundColor})=>{
    return(
        <ImageBackground source={require("../../../assets/time_frame/circle_1.png")} style={{ width: 40, height: 40 }} resizeMode='cover'>
        <TouchableOpacity onPress={() => {
            setCurrentDate(date.dateString)
        }} style={{ position: "relative", padding: 5, width: 40, height: 40, borderRadius: 20, justifyContent: "center" }}>

            <Text style={{ textAlign: 'center', fontSize: 14, color: textColor, fontFamily: LS_FONTS.PoppinsRegular }}>
                {date.day}
            </Text>

        </TouchableOpacity>
    </ImageBackground>
    )
}


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


const SingleFrameDataShow = ({ orderData, frames, title }) => {
    const [showOrder, setShowOrders] = React.useState(false)
    const navigation = useNavigation()
    return (
        <>
            <Pressable onPress={() => setShowOrders(!showOrder)} style={{ paddingVertical: 13, paddingHorizontal: 10, marginHorizontal: 10, borderWidth: 1, borderColor: LS_COLORS.global.divider, borderRadius: 10, marginTop: 7 }}>
                <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsBold }}>{title} ({orderData?.length ?? 0})</Text>
                {frames.map((f, i) => <View key={i + "" + i} style={{ flexDirection: "row", marginBottom: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.darkBlack }}>From</Text>
                        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5, justifyContent: 'center' }}>
                            <TouchableOpacity style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} activeOpacity={0.7} >
                                <Text>{moment(f.from_time, "HH:mm").format("hh:mm a")}</Text>
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
                                <Text>{moment(f.to_time, "HH:mm").format("hh:mm a")}</Text>
                                <View style={{ height: 11, aspectRatio: 1 }}>
                                    <Image source={require('../../../assets/time.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>)}
            </Pressable>
            {showOrder && orderData.map(o => {
                return (
                    <Pressable onPress={() => {
                        navigation.navigate("ProviderStack", { screen: "OrderDetail", params: { item: { id: o.id } } })
                    }} style={{ paddingVertical: 13, paddingHorizontal: 10, marginHorizontal: 10, borderWidth: 1, borderColor: "#1AB8AA", backgroundColor: "#C8E9A2", borderRadius: 10, marginTop: 7 }}>
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
        </>
    )
}

const OrderList = ({ title, data, timeFrameData }) => {
    const [showOrder, setShowOrders] = React.useState(false)
    const navigation = useNavigation()
    let frames = timeFrameData.filter(x => x.services_name == title)
    return (
        <View style={{ marginHorizontal: 20, }}>
            <Pressable onPress={() => setShowOrders(!showOrder)} style={{ paddingVertical: 13, paddingHorizontal: 10, borderWidth: 1, borderColor: LS_COLORS.global.divider, borderRadius: 10, marginTop: 7 }}>
                <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsBold }}>{title} ({data?.length ?? 0})</Text>
                {frames.map((f, i) => <View key={i + "" + i} style={{ flexDirection: "row", marginBottom: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.darkBlack }}>From</Text>
                        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5, justifyContent: 'center' }}>
                            <TouchableOpacity style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} activeOpacity={0.7} >
                                <Text>{moment(f.from_time, "HH:mm").format("hh:mm a")}</Text>
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
                                <Text>{moment(f.to_time, "HH:mm").format("hh:mm a")}</Text>
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

