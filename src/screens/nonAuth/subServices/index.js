import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, SafeAreaView, FlatList, Text } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';

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

    useEffect(() => {
        getSubServices()
    }, [])

    const getSubServices = () => {
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
            endPoint: '/api/subServicesList',
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

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title={service.name}
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.pop()
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
                                            props.navigation.navigate("ServicesProvided", { subService: item, items:[] })
                                        }}
                                    />
                                )
                            }}
                            keyExtractor={(item, index) => index}
                        />
                        :
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 16 }}>No Services Available</Text>
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
        paddingLeft:'4%'
    },
})
