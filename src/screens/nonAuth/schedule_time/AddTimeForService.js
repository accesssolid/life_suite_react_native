import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Alert,ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { Calendar } from 'react-native-calendars';


import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from "react-native-modal-datetime-picker";

/* Components */
import Header from '../../../components/header';
import CustomButton from "../../../components/customButton"
import Loader from '../../../components/loader';
import { useDispatch, useSelector } from 'react-redux';
import { getApi } from '../../../api/api';
import { showToast } from '../../../components/validators';
import { setMyJobs } from '../../../redux/features/provider';
import { setAddServiceMode, clearCleanData } from '../../../redux/features/services';

const Moment = require("moment")
const MomentRange = require("moment-range")
const moment = MomentRange.extendMoment(Moment)

const AddTimeFrame = (props) => {
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
    const [current_month, setCurrentMonth] = useState(moment().format("YYYY-MM"))

    useEffect(() => {
        if (!isAddServiceMode) {
            getTimeFrames()
        }

    }, [])




    const onDateChange = (date) => {
        let marked = markedDates
        if (marked[date.dateString]) {
            delete marked[date.dateString]
        }
        else {
            let propOwn = Object.getOwnPropertyNames(marked);
            if (propOwn.length == 2) {
                delete marked[propOwn[1]]
                marked[date.dateString] = { selected: true, selectedColor: LS_COLORS.global.green }
            }
            else {
                marked[date.dateString] = { selected: true, selectedColor: LS_COLORS.global.green }
            }
        }
        let propOwn = Object.getOwnPropertyNames(marked);
        if (propOwn.length > 1 && moment(propOwn[0]).unix() > moment(propOwn[1]).unix()) {
            marked = {}
            propOwn = []
        }

        if (propOwn.length == 1 || propOwn.length == 2) {
            let d = moment(date.dateString).format("MM")
            let f_d = moment(propOwn[0], "YYYY-MM-DD").format("MM")
            if (d != f_d) {
                marked = {}
                propOwn = []
            }
        }
        setMarkedDates({ ...marked })
        let stylesCopy = customDatesStyles.filter(x => x.from_time == "" || x.to_time == "")
        if (stylesCopy.length >= 1 && propOwn.length == 0) {
            let d = [...customDatesStyles]
            d.splice(0,1)
            setCustomDatesStyles(d)
        }


        if (propOwn.length == 1 || propOwn.length == 2) {
            let dates = [...selectedDates]
            let styles = customDatesStyles.filter(x => x.from_time !== "" || x.to_time !== "")
            dates.push(moment(date.dateString).format("DD/MM/YYYY"))
            styles.unshift({
                id: '',
                start_date: moment(propOwn[0]).format("YYYY-MM-DD"),
                end_date: moment(propOwn[1] ?? propOwn[0]).format("YYYY-MM-DD"),
                style: { backgroundColor: LS_COLORS.global.green },
                textStyle: { color: LS_COLORS.global.white },
                containerStyle: [],
                allowDisabled: true,
                from_time: "",
                to_time: ""
            });

            setSelectedDates([...dates])
            setCustomDatesStyles([...styles])
        }
    }






    React.useEffect(() => {
        if (customDatesStyles.length == 0) {
            setMarkedDates({})
        }
    }, [customDatesStyles])

    const removeTimeFrame = (frame, index) => {
        if (frame.id == '') {
            let dates = [...selectedDates]
            let styles = [...customDatesStyles]
            dates = dates.filter(item => item.start_date !== moment(frame.start_date).format('DD/MM/YYYY'))
            styles = styles.filter((item, id) => !(item.start_date == frame.start_date && item.end_date == frame.end_date && index == id))
            setSelectedDates([...dates])
            setCustomDatesStyles([...styles])
            setMarkedDates({})
            // calendarRef.current.resetSelections()
        } else {
            deleteFrame(frame)
        }

    }

    const save = () => {
        setLoading(true)
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
                    "id":item.id,
                    "start_date": moment(item.start_date).format("YYYY-MM-DD"),
                    "end_date": moment(item.end_date).format("YYYY-MM-DD"),
                    "from_time": convertedFrom,
                    "to_time": convertedTo
                })
            }
        })
        let d={}
        d={
            add_data:data.filter(x => x.id == "").map(x => {
                let dx = { ...x }
                delete dx.id
                return dx
            }),
            update_data:data.filter(x=>x.id!="").filter(x=>{
                if(moment(x.start_date+" "+x.from_time,"YYYY-MM-DD HH:mm").toDate()>moment().toDate()){
                    return true
                }else{
                    return false
                }
            })
        }
        const formdata = new FormData()
        formdata.append("service_id", serviceData.subService?.id)
        formdata.append("json_data", JSON.stringify(d))
        formdata.append("current_time",moment().format("YYYY-MM-DD HH:mm:ss"))
        console.log("Formdata", serviceData.subService?.id)

        const config = {
            headers: headers,
            data: formdata,
            endPoint: '/api/addTimeFramesNew',
            type: 'post'
        }
        if (data.length == 0) {
            setLoading(false)
            return showToast("Invalid time frame data")
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    showToast(response.message)
                    props.navigation.goBack()
                }
                else {
                    showToast(response.message)
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
                console.error(err)
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
                    console.warn(dates)
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
                            "time_frame_id": frame.id,
                            "current_time":moment().format("YYYY-MM-DD HH:mm:ss")
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
                // title={serviceData?.subService ? serviceData?.subService?.name : "Time Frames"}
                title={(serviceData?.subService ? serviceData?.subService?.name : "Time Frames") + ` (${moment(current_month, "YYYY-MM").format("MMM YYYY")})`}

                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.goBack()
                }}
                containerStyle={{ backgroundColor: LS_COLORS.global.cyan }}

            />
            <View style={styles.container}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.calendar}>
                        <Calendar
                            current={new Date()}
                            onDayPress={(day) => {
                                onDateChange(day)
                            }}
                            markingType={Object.keys(markedDates).length == 2 ? "period" : 'custom'}
                            hideArrows={false}
                            hideExtraDays={true}
                            disableMonthChange={false}
                            firstDay={0}
                            hideDayNames={false}
                            showWeekNumbers={false}
                            onPressArrowLeft={subtractMonth => subtractMonth()}
                            onPressArrowRight={addMonth => addMonth()}
                            disableArrowLeft={false}
                            disableArrowRight={false}
                            disableAllTouchEventsForDisabledDays={true}
                            enableSwipeMonths={false}
                            onMonthChange={(date) => {
                                console.log(date)
                                setCurrentMonth(moment(date.dateString, "YYYY-MM-DD").format("YYYY-MM"))
                            }}
                            markedDates={getAllMarkedDates(markedDates)}
                            minDate={new Date()}
                        />
                    </View>

                    <View style={{ marginVertical: 5 }}>
                        {customDatesStyles.map((item, index) => {
                            const fromTime = moment(item.from_time, ["HH.mm a"]).format("hh:mm A");
                            const toTime = moment(item.to_time, ["HH.mm a"]).format("hh:mm A");
                            const start_date = moment(item.start_date).format("MM-DD-YYYY")
                            const end_date = moment(item.end_date).format("MM-DD-YYYY")
                            const isSameDate = start_date === end_date
                            if (moment(item.start_date).format("YYYY-MM") != current_month) {
                                return null
                            }
                            const showDateRangeText = isSameDate ? start_date : start_date + " to " + end_date
                            return (
                                <View key={index} style={{ paddingHorizontal: '5%', paddingVertical: 5 }}>
                                    <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 14, color: LS_COLORS.global.darkBlack }}>{showDateRangeText}</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 5, height: 60, alignItems: 'center' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text maxFontSizeMultiplier={1.5}  style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.darkBlack }}>From</Text>
                                            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5, justifyContent: 'center' }}>
                                                <TouchableOpacity style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} activeOpacity={0.7} onPress={() => setTime("from", index)}>
                                                    <Text maxFontSizeMultiplier={1.5} >{fromTime === "Invalid date" ? "" : fromTime}</Text>
                                                    <View style={{ height: 11, aspectRatio: 1 }}>
                                                        <Image source={require('../../../assets/time.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text maxFontSizeMultiplier={1.5}  style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.darkBlack }}>To</Text>
                                            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5 }}>
                                                <TouchableOpacity style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} activeOpacity={0.7} onPress={() => fromTime !== "Invalid date" && setTime("to", index)}>
                                                    <Text maxFontSizeMultiplier={1.5} >{toTime === "Invalid date" ? "" : toTime}</Text>
                                                    <View style={{ height: 11, aspectRatio: 1 }}>
                                                        <Image source={require('../../../assets/time.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: "center", margin: 10, marginTop: 26 }}>
                                            <TouchableOpacity activeOpacity={0.7} onPress={() => removeTimeFrame(item, index)} style={{ height: 25, aspectRatio: 1, }}>
                                                <Image source={require('../../../assets/delete.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
                <DateTimePickerModal
                    date={initialDate}
                    isVisible={isDatePickerVisible}
                    mode="time"
                    onConfirm={handleConfirm}
                    onCancel={() => setDatePickerVisibility(false)}
                />
                {selectedDates.length > 0 && <CustomButton title={"SAVE"} customTextStyles={{}} customStyles={{ width: '50%', height: 45, marginVertical: 10 }} action={() => save()} />}
            </View>
            {loading && <Loader />}
        </SafeAreaView>
    )
}

export default AddTimeFrame;

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

