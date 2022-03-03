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

export default function BookedSlotsModal({ visible,booked, setVisible }) {
    console.log("Modal",JSON.stringify(booked))
    return (
        <Modal
            visible={visible}
            // visible={true}
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
                        {booked.length==0&&<Text style={{ fontFamily: LS_FONTS.PoppinsRegular ,textAlign:"center"}}>No Booked list</Text>}
                        <ScrollView>
                            {booked.map(x => {
                                return (
                                    <>
                                    <Card.Divider />
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={{ fontFamily: LS_FONTS.PoppinsRegular }}>{x.customers_first_name} {x.customers_last_name} ({(x.sub_services_name=='null'||x.sub_services_name==null||x.sub_services_name==undefined)?x.services_name:x.sub_services_name})</Text>
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