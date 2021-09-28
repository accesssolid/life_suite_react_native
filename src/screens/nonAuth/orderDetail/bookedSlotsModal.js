import React from 'react'
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { Card } from 'react-native-elements'
import moment from 'moment';
import { useSelector } from 'react-redux';
import { showToast } from '../../../components/validators';
import { BASE_URL, getApi } from '../../../api/api';
/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

export default function BookedSlotsModal({ visible, setVisible }) {
    const [data, setData] = React.useState([])
    const access_token = useSelector(state => state.authenticate.access_token)
    const [loading, setLoading] = React.useState(false)
    React.useEffect(() => {
        if (access_token) {
            getBookedSlots()
        }
    }, [access_token])

    const getBookedSlots = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            data: JSON.stringify({ booking_date: moment().format("YYYY-MM-DD") }),
            endPoint: '/api/providerBookedServices',
            type: 'post'
        }
        console.log(config)
        getApi(config)
            .then((response) => {
                console.log("Booked Slots", response)
                if (response.status == true) {
                    if (response.data) {
                        setData(response.data)
                    } else {

                    }
                } else {

                }
            }).catch(err => {
            }).finally(() => {
                setLoading(false)
            })
    }
    return (
        <Modal
            visible={visible}
            transparent={true}
        >
            <Pressable
                onPress={() => {
                    setVisible(false)
                }}
                style={{ flex: 1, backgroundColor: "#0004", justifyContent: "center" }}>
                <Pressable>
                    <Card containerStyle={{ maxHeight: 300,borderRadius:5}}>
                        <Card.Title style={{ fontFamily: LS_FONTS.PoppinsBold }}>Booked Slots</Card.Title>
                        <ScrollView>
                            {data.map(x => {
                                return (
                                    <>
                                    <Card.Divider />
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={{ fontFamily: LS_FONTS.PoppinsRegular }}>{x.customers_first_name} {x.customers_last_name}</Text>
                                        <Text style={{ fontFamily: LS_FONTS.PoppinsRegular }}>{moment(x.order_start_time).format("hh:mm a")}-{moment(x.order_end_time).format("hh:mm a")}</Text>
                                    </View>
                                    </>
                                )
                            })}
                        </ScrollView>
                    </Card>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({

})