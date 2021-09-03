import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import CalendarPicker from 'react-native-calendar-picker';
import moment from "moment";
import TextInputMask from 'react-native-text-input-mask';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from "react-native-modal-datetime-picker";

/* Components */
import Header from '../../../components/header';
import CustomButton from "../../../components/customButton"
import { TextInput } from 'react-native';
import Loader from '../../../components/loader';
import { useDispatch, useSelector } from 'react-redux';
import { getApi } from '../../../api/api';
import { showToast } from '../../../components/validators';
import { setMyJobs } from '../../../redux/features/provider';
import { setAddServiceMode } from '../../../redux/features/services';
import { ScrollView } from 'react-native-gesture-handler';

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

    useEffect(() => {
        if (!isAddServiceMode)
            getTimeFrames()
    }, [])

    const onDateChange = (date) => {
        let dates = [...selectedDates]
        let styles = [...customDatesStyles];
        if (!dates.includes(moment(date).format("DD/MM/YYYY"))) {
            dates.push(moment(date).format("DD/MM/YYYY"))
            styles.push({
                date: moment(date).format("YYYY-MM-DD"),
                style: { backgroundColor: LS_COLORS.global.green },
                textStyle: { color: LS_COLORS.global.white },
                containerStyle: [],
                allowDisabled: true,
                from_time: "",
                to_time: ""
            });
        }
        setSelectedDates([...dates])
        setCustomDatesStyles([...styles])
    }

    const removeTimeFrame = (frame) => {
        let dates = [...selectedDates]
        let styles = [...customDatesStyles];
        dates = dates.filter(item => item !== moment(frame.date).format('DD/MM/YYYY'))
        styles = styles.filter(item => item.date !== frame.date)
        setSelectedDates([...dates])
        setCustomDatesStyles([...styles])
        calendarRef.current.resetSelections()
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
                data.push({
                    "date": moment(item.date).format("YYYY-MM-DD"),
                    "from_time": item.from_time,
                    "to_time": item.to_time
                })
            }
        })

        if (data.length == 0) {
            setLoading(false)
            return showToast("Invalid time frames data")
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
                            if (element.service_id == serviceData.formdata._parts[1][1]) {
                                dates.push(moment(element.date).format("DD/MM/YYYY"))
                                styles.push({
                                    date: element.date,
                                    style: { backgroundColor: LS_COLORS.global.green },
                                    textStyle: { color: LS_COLORS.global.white },
                                    containerStyle: [],
                                    allowDisabled: true,
                                    from_time: element.from_time,
                                    to_time: element.to_time
                                });
                            }
                        });
                    })
                    console.log("dates =>> ", dates)
                    setSelectedDates([...dates])
                    setCustomDatesStyles([...styles])
                }
                else {
                    setLoading(false)
                }
            }).catch(err => {
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
                } else {
                    setLoading(false)
                    showToast(response.message, 'success')
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    const setTime = (type, index) => {
        setDateType(type)
        setActiveIndex(index)
        setDatePickerVisibility(true)
    }

    const handleConfirm = (date) => {
        setDatePickerVisibility(false)
        let styles = [...customDatesStyles];
        if (dateType == "from") {
            styles[activeIndex].from_time = moment(date).format('HH:mm')
        } else {
            styles[activeIndex].to_time = moment(date).format('HH:mm')
        }
        setCustomDatesStyles([...styles])
    };

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title="Time Frames"
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.goBack()
                }}
            />
            <View style={styles.container}>
                <View style={styles.calendar}>
                    <CalendarPicker
                        ref={calendarRef}
                        onDateChange={onDateChange}
                        previousTitle="<"
                        nextTitle=">"
                        scaleFactor={375}
                        weekdays={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
                        monthYearHeaderWrapperStyle={{
                            fontSize: 18
                        }}
                        onMonthChange={(res) => console.log("OnMonthChange", res)}
                        selectedDayColor={LS_COLORS.global.green}
                        selectedDayTextColor={LS_COLORS.global.white}
                        textStyle={{
                            fontFamily: LS_FONTS.PoppinsLight,
                        }}
                        customDatesStyles={customDatesStyles}
                    />
                </View>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ marginVertical: 5 }}>
                        {customDatesStyles.map((item, index) => {
                            return (
                                <View key={index} style={{ paddingHorizontal: '5%', paddingVertical: 5 }}>
                                    <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 14, color: LS_COLORS.global.darkBlack }}>{item.date}</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 5, height: 60, alignItems: 'center' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.darkBlack }}>From</Text>
                                            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5, justifyContent: 'center' }}>
                                                <TouchableOpacity style={{ width: '85%', paddingHorizontal: 10 }} disabled={serviceData.formdata == undefined} activeOpacity={0.7} onPress={() => setTime("from", index)}>
                                                    {/* <TextInputMask
                                                        onChangeText={(formatted, extracted) => {
                                                            setTextData(index, formatted, "from")
                                                        }}
                                                        style={{ width: '100%' }}
                                                        mask={"[00]:[00]"}
                                                        value={}
                                                        editable={false}
                                                    /> */}
                                                    <Text>{item.from_time}</Text>
                                                </TouchableOpacity>
                                                <View style={{ height: 11, aspectRatio: 1 }}>
                                                    <Image source={require('../../../assets/time.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.darkBlack }}>To</Text>
                                            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5 }}>
                                                <TouchableOpacity style={{ width: '85%', paddingHorizontal: 10 }} disabled={serviceData.formdata == undefined} activeOpacity={0.7} onPress={() => setTime("to", index)}>
                                                    {/* <TextInputMask
                                                        onChangeText={(formatted, extracted) => {
                                                            setTextData(index, formatted, "to")
                                                        }}
                                                        style={{ width: '100%' }}
                                                        mask={"[00]:[00]"}
                                                        value={item.to_time}
                                                        editable={false}
                                                    /> */}
                                                    <Text>{item.to_time}</Text>
                                                </TouchableOpacity>
                                                <View style={{ height: 11, aspectRatio: 1 }}>
                                                    <Image source={require('../../../assets/time.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                                </View>
                                            </View>
                                        </View>
                                        <TouchableOpacity activeOpacity={0.7} onPress={() => removeTimeFrame(item)} style={{ height: '100%', aspectRatio: 1, padding: 15 }}>
                                            <Image source={require('../../../assets/delete.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
                <DateTimePickerModal
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

