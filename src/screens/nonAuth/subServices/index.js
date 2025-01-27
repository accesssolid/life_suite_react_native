import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, SafeAreaView, FlatList, Text, Alert } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles, showToast } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import Header from '../../../components/header';
import SmallCards from '../../../components/smallCards';
import { BASE_URL, getApi } from '../../../api/api';
import Loader from '../../../components/loader';
import LS_FONTS from '../../../constants/fonts';
import { setAddServiceMode } from '../../../redux/features/services';
import { setQOpen, setQService, setQuestionTypes } from '../../../redux/features/questionaire.model';
import ReviewBusiness from '../../../components/ReviewBusiness';

const SubServices = (props) => {
    const { service } = props.route.params
    const dispatch = useDispatch()
    const user = useSelector(state => state.authenticate.user)
    const userType = useSelector(state => state.authenticate.type)

    const [subServices, setSubServices] = useState([])
    const [loading, setLoading] = useState(false)
    const access_token = useSelector(state => state.authenticate.access_token)

    useEffect(() => {
        if (userType == "guest") {
            getGuestSubServices()
        } else {
            getSubServices()
        }

    }, [userType])

    const getSubServices = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }

        let user_data = {
            "service_parent_id": service.id,
            "user_id": user.id,
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: user.user_role == 2 ? '/api/subServicesList' : '/api/providerSubServicesList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setLoading(false)
                    setSubServices([...response.data])
                }
                else {
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    const getGuestSubServices = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        }

        let user_data = {
            "service_parent_id": service.id
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: '/api/guestCustomerSubServicesList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setLoading(false)
                    setSubServices([...response.data])
                }
                else {
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    const like = (id) => {
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }

        let user_data = {
            "service_id": id,
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: user.user_role == 2 ? '/api/customerServiceAddFavourite' : '/api/providerServiceAddFavourite',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    showToast(response.message)
                    getSubServices()
                }
                else {

                }
            }).catch(err => {
            })
    }
const [selectedItem,setSelectedItem]=useState(null)
    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title={service.name}
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.goBack()
                }}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => {

                    props.navigation.navigate("HomeScreen", { screen: "HomeScreen" })
                }}
                containerStyle={{ backgroundColor: LS_COLORS.global.cyan }}

            />
            <View style={styles.container}>
                {
                    subServices.length > 0
                        ?
                        <FlatList
                            data={[...subServices]}
                            numColumns={3}
                            renderItem={({ item, index }) => {
                                return (
                                    <SmallCards
                                        title1={item.name}
                                        imageUrl={{ uri: BASE_URL + item.image }}
                                        action={() => {
                                            if (user.user_role == 3) {
                                                dispatch(setAddServiceMode({ data: true }))
                                            }
                                            setSelectedItem(item)
                                            if (user.user_role == 3&&(item?.is_certified == "1" || item?.is_insauranced == "1" || item?.is_business_licensed == "1")) {
                                                dispatch(setQService(item?.id))
                                                dispatch(setQuestionTypes({ is_certified: Number(item?.is_certified), is_insauranced: Number(item?.is_insauranced), is_business_licensed: Number(item?.is_business_licensed) }))
                                                dispatch(setQOpen(true))
                                            } else {
                                                props.navigation.navigate("ServicesProvided", { subService: item , items: []});
                                            }
                                            // props.navigation.navigate("ServicesProvided", { subService: item, items: [] })
                                        }}
                                        favorite={() => { like(item.id) }}
                                        favStatus={item.isFavourite}
                                    />
                                )
                            }}
                            keyExtractor={(item, index) => index}
                        />
                        :
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            {!loading && <Text maxFontSizeMultiplier={1.7} style={{ fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 16 }}>No Services Available</Text>}
                        </View>
                }
            </View>
            {loading && <Loader />}
            <ReviewBusiness
                pressHandler={() => {
                    dispatch(setQOpen(false))
                }}
                onPressNext={() => {
                    dispatch(setQOpen(false))
                    props.navigation.navigate("ServicesProvided", { subService: selectedItem , items: []});
                }} />
        </SafeAreaView>
    )
}

export default SubServices;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
        paddingVertical: 20,
        paddingLeft: '4%'
    },
})
