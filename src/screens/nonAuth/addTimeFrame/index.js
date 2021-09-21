import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Alert } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import CalendarPicker from 'react-native-calendar-picker';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import moment from "moment";
import TextInputMask from 'react-native-text-input-mask';
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
import { setAddServiceMode } from '../../../redux/features/services';
import { ScrollView } from 'react-native-gesture-handler';
import { indexOf } from 'lodash';

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
    const [initialDate, setInitialDate] = useState(moment(new Date()).unix())
    const [markedDates, setMarkedDates] = useState({})

    useEffect(() => {
        if (!isAddServiceMode)
            getTimeFrames()
    }, [])

    // "start_date" : "2021-07-16",  
    // "end_date" : "2021-07-16", 
    // "from_time" : "10:05",
    // "to_time" : "23:00"

    const onDateChange = (date) => {
        let marked = markedDates
        if (marked[date.dateString]) {
            delete marked[date.dateString]
        }
        else {
            const propOwn = Object.getOwnPropertyNames(marked);
            if (propOwn.length == 2) {
                delete marked[propOwn[1]]
                marked[date.dateString] = { selected: true, selectedColor: LS_COLORS.global.green }
            }
            else {
                marked[date.dateString] = { selected: true, selectedColor: LS_COLORS.global.green }
            }
        }
        const propOwn = Object.getOwnPropertyNames(marked);
        if (propOwn.length > 1 && moment(propOwn[0]).unix() > moment(propOwn[1]).unix()) {
            marked = {}
        }
        setMarkedDates({ ...marked })
        if (propOwn.length == 2) {
            let dates = [...selectedDates]
            let styles = [...customDatesStyles];
            dates.push(moment(date.dateString).format("DD/MM/YYYY"))
            styles.push({
                id: '',
                start_date: moment(propOwn[0]).format("YYYY-MM-DD"),
                end_date: moment(propOwn[1]).format("YYYY-MM-DD"),
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

    const removeTimeFrame = (frame) => {
        if (frame.id == '') {
            let dates = [...selectedDates]
            let styles = [...customDatesStyles]
            dates = dates.filter(item => item.start_date !== moment(frame.start_date).format('DD/MM/YYYY'))
            styles = styles.filter(item => item.start_date !== frame.start_date  || item.end_date !== frame.end_date )
            setSelectedDates([...dates])
            setCustomDatesStyles([...styles])
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
            "user_id": user.id
        }
        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
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
                        response.data[ele].forEach(element => {
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
                        });
                    })
                    setSelectedDates([...dates])
                    setCustomDatesStyles([...styles])
                }
                else {
                    setLoading(false)
                }
            }).catch(err => {
                console.log("err =>. ", err)
                setLoading(false)
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
                    setLoading(false)
                    if (shouldNavigate) {
                        props.navigation.navigate('HomeScreen')
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
            styles[activeIndex].to_time = moment(date).format('hh:mm a')
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

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title={serviceData?.subService ? serviceData?.subService?.name : "Time Frames"}
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.goBack()
                }}
            />
            <View style={styles.container}>
                <View style={styles.calendar}>
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
                        markedDates={{ ...markedDates }}
                        minDate={new Date()}
                    // markingType={'period'}
                    />
                </View>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ marginVertical: 5 }}>
                        {customDatesStyles.map((item, index) => {
                            const fromTime = moment(item.from_time, ["HH.mm"]).format("hh:mm");
                            const toTime = moment(item.to_time, ["HH.mm"]).format("hh:mm");
                            return (
                                <View key={index} style={{ paddingHorizontal: '5%', paddingVertical: 5 }}>
                                    <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 14, color: LS_COLORS.global.darkBlack }}>{moment(item.start_date).format("MM-DD-YYYY") + " to " + moment(item.end_date).format("MM-DD-YYYY")}</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 5, height: 60, alignItems: 'center' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.darkBlack }}>From</Text>
                                            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5, justifyContent: 'center' }}>
                                                <TouchableOpacity style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} disabled={serviceData.formdata == undefined} activeOpacity={0.7} onPress={() => setTime("from", index)}>
                                                    <Text>{fromTime === "Invalid date" ? "" : fromTime}</Text>
                                                    <View style={{ height: 11, aspectRatio: 1 }}>
                                                        <Image source={require('../../../assets/time.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.darkBlack }}>To</Text>
                                            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5 }}>
                                                <TouchableOpacity style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} disabled={serviceData.formdata == undefined} activeOpacity={0.7} onPress={() => setTime("to", index)}>
                                                    <Text>{toTime === "Invalid date" ? "" : toTime}</Text>
                                                    <View style={{ height: 11, aspectRatio: 1 }}>
                                                        <Image source={require('../../../assets/time.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <TouchableOpacity activeOpacity={0.7} onPress={() => removeTimeFrame(item)} style={{ height: '100%', aspectRatio: 1, padding: 20, marginTop: 15 }}>
                                            <Image source={require('../../../assets/delete.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                        </TouchableOpacity>
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
                {selectedDates.length > 0 && serviceData.formdata && <CustomButton title={"SAVE"} customTextStyles={{}} customStyles={{ width: '50%', height: 45, marginVertical: 10 }} action={() => save()} />}
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

