import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, SafeAreaView, FlatList, Text } from 'react-native'

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

const SubServices = (props) => {
    const { service } = props.route.params
    const dispatch = useDispatch()
    const user = useSelector(state => state.authenticate.user)
    const [subServices, setSubServices] = useState([])
    const [loading, setLoading] = useState(false)
    const access_token = useSelector(state => state.authenticate.access_token)

    useEffect(() => {
        getSubServices()
    }, [])

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
                console.log(response)
                if (response.status == true) {
                    console.log(response)
                    showToast(response.message)
                    getSubServices()
                }
                else {
                    
                }
            }).catch(err => {
            })
    }

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
                    props.navigation.navigate("HomeScreen")
                }}
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
                                            props.navigation.navigate("ServicesProvided", { subService: item, items: [] })
                                        }}
                                        favorite = {() => {like(item.id)}}
                                        favStatus = {item.isFavourite}
                                    />
                                )
                            }}
                            keyExtractor={(item, index) => index}
                        />
                        :
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            {!loading && <Text style={{ fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 16 }}>No Services Available</Text>}
                        </View>
                }
            </View>
            {loading && <Loader />}
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
