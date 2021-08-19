import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Dimensions, SafeAreaView, StatusBar, TouchableOpacity, Platform } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import CalendarPicker from 'react-native-calendar-picker';
import moment from "moment";
import TextInputMask from 'react-native-text-input-mask';

/* Components */
import Header from '../../../components/header';
import CustomButton from "../../../components/customButton"
import { TextInput } from 'react-native';
import Loader from '../../../components/loader';
import { useSelector } from 'react-redux';
import { getApi } from '../../../api/api';

const AddTimeFrame = (props) => {
    const [selectedDates, setSelectedDates] = useState([])
    const user = useSelector(state => state.authenticate.user)
    const [customDatesStyles, setCustomDatesStyles] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getTimeFrames()
    }, [])

    const onDateChange = (date) => {
        let dates = [...selectedDates]
        let styles = [...customDatesStyles];
        if (!dates.includes(moment(date).format("DD/MM/YYYY"))) {
            dates.push(moment(date).format("DD/MM/YYYY"))
            styles.push({
                date: date,
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
        dates = dates.filter(item => item !== frame)
        styles = styles.filter(item => moment(item.date).format("DD/MM/YYYY") !== frame)
        setSelectedDates([...dates])
        setCustomDatesStyles([...styles])
    }

    const setTextData = (index, text, type) => {
        let styles = [...customDatesStyles];
        if (type == "from") {
            styles[index].from_time = text
        } else {
            styles[index].to_time = text
        }
        setCustomDatesStyles([...styles])
    }

    const save = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
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

        setLoading(false)

        let user_data = {
            "user_id": user.id,
            "json_data": JSON.stringify(data)
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: '/api/addTimeFrames',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setLoading(false)
                    getTimeFrames()
                }
                else {
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    const getTimeFrames = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
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
                    let dates = []
                    response.data.forEach(element => {
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
                    });
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

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title="Add Time Frames"
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.goBack()
                }}
            />
            <View style={styles.container}>
                <View style={styles.calendar}>
                    <CalendarPicker
                        date
                        onDateChange={onDateChange}
                        previousTitle="<"
                        nextTitle=">"
                        scaleFactor={375}
                        weekdays={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
                        monthYearHeaderWrapperStyle={{
                            fontSize: 18
                        }}
                        onMonthChange={(res) => console.log("OnMonthChange",res)}
                        selectedDayColor={LS_COLORS.global.green}
                        selectedDayTextColor={LS_COLORS.global.white}
                        textStyle={{
                            fontFamily: LS_FONTS.PoppinsLight,
                        }}
                        customDatesStyles={customDatesStyles}
                    />
                </View>
                <View style={{ marginVertical: 5 }}>
                    {selectedDates.map((item, index) => {
                        return (
                            <View key={index} style={{ paddingHorizontal: '5%', paddingVertical: 5 }}>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 14, color: LS_COLORS.global.darkBlack }}>{item}</Text>
                                <View style={{ flexDirection: 'row', marginTop: 5, height: 50, alignItems: 'center' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.darkBlack }}>From</Text>
                                        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5 }}>
                                            {/* <TextInput value={customDatesStyles[index].from_time} style={{ width: '85%', paddingHorizontal: 10 }} /> */}
                                            <TextInputMask
                                                onChangeText={(formatted, extracted) => {
                                                    console.log(formatted)
                                                    setTextData(index, formatted, "from")
                                                }}
                                                style={{ width: '85%', paddingHorizontal: 10 }}
                                                mask={"[00]:[00]"}
                                            />
                                            <View style={{ height: 11, aspectRatio: 1 }}>
                                                <Image source={require('../../../assets/time.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.darkBlack }}>To</Text>
                                        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: LS_COLORS.global.frameBg, alignItems: 'center', width: '90%', marginTop: 5 }}>
                                            {/* <TextInput value={customDatesStyles[index].to_time} style={{ width: '85%' }} /> */}
                                            <TextInputMask
                                                onChangeText={(formatted, extracted) => {
                                                    console.log(formatted)
                                                    setTextData(index, formatted, "to")
                                                }}
                                                style={{ width: '85%', paddingHorizontal: 10 }}
                                                mask={"[00]:[00]"}
                                            />
                                            <View style={{ height: 11, aspectRatio: 1 }}>
                                                <Image source={require('../../../assets/time.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                            </View>
                                        </View>
                                    </View>
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => removeTimeFrame(item)} style={{ height: '100%', aspectRatio: 1, padding: '4%' }}>
                                        <Image source={require('../../../assets/delete.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })}
                </View>
                {selectedDates.length > 0 && <CustomButton title={"SAVE"} customTextStyles={{}} customStyles={{ width: '50%', height: 45, marginTop: 10 }} action={() => save()} />}
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

