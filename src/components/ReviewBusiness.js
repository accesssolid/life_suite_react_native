import React, { useEffect, useState } from 'react';
import {
    Modal,
    StyleSheet,
    Pressable,
    View,
    TouchableOpacity,
    Text,
} from 'react-native';
import { Card, Container, Content } from 'native-base';
import { useNavigation } from '@react-navigation/core';
import LS_FONTS from '../constants/fonts';
import LS_COLORS from '../constants/colors';
import { useSelector, useDispatch } from 'react-redux';
import { setQuestionTypes, clearQuestionTypes, setSelectedValue, setOpenQuestionaire } from '../redux/features/questionaire.model'
import { CheckBox } from 'react-native-elements';
import { getApi } from '../api/api';
import Loader from './loader';

const ReviewBusiness = ({ onPressNext, pressHandler }) => {
    const [search, setSearch] = useState('');
    const questionaireModel = useSelector(state => state.questionaireModel)
    const access_token = useSelector(state => state.authenticate.access_token)

    const dispatch = useDispatch()
    const navigation = useNavigation()
    const [questions, setQuestions] = useState([])
    const [data, setData] = useState({
        is_certified: 0,
        is_insauranced: 0,
        is_business_licensed: 0
    })
    const [responseData,setResponseData]=useState(null)

    useEffect(() => {
        
        let l = []
        let d={
            is_certified: 0,
            is_insauranced: 0,
            is_business_licensed: 0
        }
        let list = questionaireModel?.list
        if (questionaireModel?.types?.is_certified == 1) {
            l.push(list[0])
            if(responseData?.is_certified){
                d.is_certified=responseData?.is_certified
            }
        }
        if (questionaireModel?.types?.is_business_licensed == 1) {
            l.push(list[1])
            if(responseData?.is_business_licensed){
                d.is_business_licensed=responseData?.is_business_licensed
            }
        }
        if (questionaireModel?.types?.is_insauranced == 1) {
            l.push(list[2])
            if(responseData?.is_insauranced){
                d.is_insauranced=responseData?.is_insauranced
            }
        }
       
        setData(d)
        setQuestions(l)
       
    }, [questionaireModel,responseData])

    useEffect(()=>{
        if (questionaireModel?.service_id >= 0) {
            getQuestionsList()
        }
    },[questionaireModel])

    const [loader, setLoader] = useState(false)
    const getQuestionsList = async () => {
        try {
            setLoader(true)
            let headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }
            let config = {
                headers: headers,
                data: JSON.stringify({ service_id: questionaireModel.service_id }),
                endPoint: "/api/serviceQuestionnaire",
                type: 'post'
            }
            let response = await getApi(config)
            console.log(response)
            if (response.status) {
                if (response.data) {
                    if (response.data[0]) {
                        setResponseData({
                            is_certified: response.data[0]?.is_certified == "0" ? 0 : 1,
                            is_insauranced: response.data[0]?.is_insauranced == "0" ? 0 : 1,
                            is_business_licensed: response.data[0]?.is_business_licensed == "0" ? 0 : 1
                        })
                    }
                }
            } else {
                setData({
                    is_certified: 0,
                    is_insauranced: 0,
                    is_business_licensed: 0
                })
            }
        } catch (Err) {

        } finally {
            setLoader(false)
        }
    }
    return (
        <Modal
            visible={questionaireModel?.open}
            // visible={true}
            animationType="fade"
            transparent={true}
        >
            <Pressable onPress={pressHandler} style={styles.modalScreen}>
                <Pressable
                    style={{
                        // height: 354,
                        backgroundColor: LS_COLORS.global.cyan,
                        width: 327,
                        borderRadius: 10,
                        overflow: "hidden"
                        // padding: 20,
                    }}>
                    <Text maxFontSizeMultiplier={1.4} style={[styles.sure, { padding: 20 }]}>Review Business Questionaire</Text>
                    {/* <View style={{ height: 2, width: 84, backgroundColor: LS_COLORS.global.green, alignSelf: 'center', marginTop: 4 }}></View> */}
                    <View style={{ backgroundColor: "white", padding: 20 }}>
                        {questions?.map((item,index) => {
                            return (
                                <View>
                                    <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.darkBlack }}>{index+1}. {item?.title}</Text>
                                    <View style={{ flexDirection: "row", marginVertical: 10 }}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <CheckBox
                                                style={{}}
                                                containerStyle={{ width: 25, padding: 0, marginLeft: 0, marginRight: 0 }}
                                                wrapperStyle={{}}
                                                checked={data[`${item?.type}`] == 1}
                                                onPress={() => {
                                                    setData({
                                                        ...data,
                                                        [`${item?.type}`]: 1
                                                    })
                                                }}
                                                checkedIcon={<View style={{ height: 20, width: 20, backgroundColor: LS_COLORS.global.cyan, borderRadius: 20, justifyContent: "center", alignItems: "center" }} >
                                                    <View style={{ height: 10, width: 10, borderRadius: 10, backgroundColor: "white" }} />
                                                </View>}
                                                uncheckedIcon={<View style={{ height: 20, width: 20, borderRadius: 20, borderWidth: 1, borderColor: LS_COLORS.global.darkGray }} />}
                                            />
                                            <Text maxFontSizeMultiplier={1.3} style={{ fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.darkBlack }}>Yes</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: "20%" }}>
                                            <CheckBox
                                                style={{}}
                                                containerStyle={{ width: 25, padding: 0, marginLeft: 0, marginRight: 0 }}
                                                wrapperStyle={{}}
                                                checked={data[`${item?.type}`] == 0}
                                                onPress={() => {
                                                    setData({
                                                        ...data,
                                                        [`${item?.type}`]: 0
                                                    })
                                                }}
                                                checkedIcon={<View style={{ height: 20, width: 20, backgroundColor: LS_COLORS.global.cyan, borderRadius: 20, justifyContent: "center", alignItems: "center" }} >
                                                    <View style={{ height: 10, width: 10, borderRadius: 10, backgroundColor: "white" }} />
                                                </View>}
                                                uncheckedIcon={<View style={{ height: 20, width: 20, borderRadius: 20, borderWidth: 1, borderColor: LS_COLORS.global.darkGray }} />}
                                            />
                                            <Text maxFontSizeMultiplier={1.3} style={{ fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.darkBlack }}>No</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                        <View style={{ marginTop: '10%' }}>
                            <TouchableOpacity
                                style={[styles.save, { marginTop: 20 }]}
                                activeOpacity={0.7}
                                onPress={() => {
                                    dispatch(setSelectedValue(data))
                                    onPressNext()
                                }}
                            ><Text maxFontSizeMultiplier={1.5} style={styles.saveText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </Pressable>
            {loader && <Loader />}
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalScreen: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        alignItems: 'center',
        paddingTop: '50%'
    },

    searchBar: {
        height: 48,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    searchIcon: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
    },
    textInput: {
        color: 'black',
        fontFamily: LS_FONTS.PoppinsMedium,
        width: '90%',
        marginLeft: 5,
    },
    sure: {
        color: 'white',
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsBold,
        textAlign: "center"
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 40,
        width: 100,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 100,
        alignSelf: 'center',
        marginTop: "15%"
    },
    saveText: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsRegular,
        color: LS_COLORS.global.white
    },
    saveText1: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.green
    },
    save1: {
        justifyContent: "center",
        alignItems: 'center',
        height: 50,
        width: 238,
        backgroundColor: LS_COLORS.global.white,
        borderRadius: 100,
        borderColor: LS_COLORS.global.green,
        borderWidth: 1,
        alignSelf: 'center',
        marginTop: 20
    },
    subtext: {
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsRegular,
        color: "black",
        alignSelf: 'center'
    }
});

export default ReviewBusiness;
