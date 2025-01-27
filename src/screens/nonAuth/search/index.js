import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, Dimensions, SafeAreaView, FlatList, Text, TouchableOpacity } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from "lodash";

/* Components */
import Header from '../../../components/header';
import { BASE_URL, getApi } from '../../../api/api';
import Loader from '../../../components/loader';
import LS_FONTS from '../../../constants/fonts';
import CustomTextInput from '../../../components/customTextInput';
import { showToast } from '../../../components/validators';

const Search = (props) => {
    const [services, setServices] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const access_token = useSelector(state => state.authenticate.access_token)
    const userType=useSelector(state=>state.authenticate?.type)
    const onChange = (text) => {
        setSearch(text)
        setLoading(true)
        handler(text);
    };

    const handler = useCallback(debounce((search) => getSearchResults(search), 2000), []);

    function getSearchResults(text) {
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let search_data = {
            "search_text": text
        }
        let config = {
            headers: headers,
            data: JSON.stringify({ ...search_data }),
            endPoint: userType=="guest"?"/api/guestCustomerFilterServices":'/api/filterServices',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setLoading(false)
                    let x = []
                    let z = []
                    for (let index = 0; index < response.data.length; index++) {
                        const element = response.data[index];
                        if (!x.includes(element.search_title)) {
                            x.push(element.search_title)
                            z.push(element)
                        }

                    }
                    setServices([...z])
                    console.log(response.data)
                }
                else {
                    setServices([])
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            })
    }


    const navigate = (item) => {
        if (item.data_type == "service") {
            props.navigation.navigate("SubServices", { service: { ...item, name: item.search_title, id: item.search_id } });
        } else if (item.data_type == "sub_service") {
            console.log(item)
            props.navigation.navigate("ServicesProvided", { subService: { ...item, name: item.search_title,location_type:item.services_location_type, id: item.search_id, items: [], image: item.search_image, service_parent_id: item.search_parent_id } });
        } else if (item.data_type == "service_item") {
            props.navigation.navigate("ServicesProvided", { subService: { ...item, name: item.parent_name,location_type:item.services_location_type, id: item.search_parent_id, items: [], image: item.parent_image, service_parent_id: item.search_parent_id } });
        } else {
        }
    }

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title={"Search"}
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.goBack()
                }}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => {
                    props.navigation.navigate("HomeScreen")
                }}
                containerStyle={{backgroundColor:LS_COLORS.global.cyan}}
            />
            <View style={styles.container}>
                <CustomTextInput placeholder="I need help with" value={search} onChangeText={onChange} />
                {
                    loading && <View style={{ height: 50 }}>
                        <Loader />
                    </View>
                }
                {
                    services.length > 0
                        ?
                        <FlatList
                            data={[...services]}
                            renderItem={({ item, index }) => {
                                if (item.data_type !== "item_product") {
                                    return (
                                        <TouchableOpacity onPress={() => navigate(item)} activeOpacity={0.7} style={{ marginBottom: 10, paddingHorizontal: '5%', paddingVertical: 5 }}>
                                            <Text style={{ fontFamily: LS_FONTS.PoppinsMedium }}>{item.search_title}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            }}
                            keyExtractor={(item, index) => index}
                        />
                        :
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            {!loading && <Text style={{ fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 16 }}>No Services Available</Text>}
                        </View>
                }
            </View>
            {/* {loading && <Loader />} */}
        </SafeAreaView>
    )
}

export default Search;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
        paddingTop: 10
    },
})
