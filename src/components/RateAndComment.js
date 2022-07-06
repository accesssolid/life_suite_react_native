import React from 'react'
import { View, Text, StyleSheet, TextInput, Modal, TouchableOpacity, Pressable, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
/* Constants */
import LS_COLORS from '../constants/colors';
import LS_FONTS from '../constants/fonts';
import { globalStyles, showToast } from '../utils';
import { Content, Container } from 'native-base'
import { getApi } from '../api/api';
import { useSelector } from 'react-redux';
/* Components */
import { Rating } from 'react-native-ratings';
import Loader from '../components/loader';


export default function RateAndCommentModal({ data, visible, setVisible, handleAddUpdate, handleDelete }) {
    const access_token = useSelector(state => state.authenticate.access_token)
    const [rating, setRating] = React.useState("0")
    const [reason, setReason] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [id, setID] = React.useState(null)
    React.useEffect(() => {
        if (data?.id >= 0 || data?.id) {
            setID(data.id)
        } else {
            setID(null)
        }
        if (data?.rating) {
            setRating(data.rating)
        } else {
            setRating("0")
        }
        if (data?.comment) {
            setReason(data.comment)
        } else {
            setReason("")
        }
    }, [data, visible])



    return (

        <Modal
            visible={visible}
            transparent={true}

        >
            <Pressable onPress={()=>{Keyboard.dismiss() }} style={{ flex: 1, backgroundColor: "#0005", justifyContent: "center" }}>
                <View style={{ paddingVertical: 10, backgroundColor: "white", marginHorizontal: 20, borderRadius: 20 }}>
                    <Text  maxFontSizeMultiplier={1.5} style={{ textAlign: "center", fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 15, marginVertical: 10 }}>{id ? "Update" : "Add"} Rate and Comment</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20 }}>
                        <Text  maxFontSizeMultiplier={1.5} style={[styles.textStyle, { fontSize: 14 }]}>Rate: </Text>
                        <Rating
                            imageSize={25}
                            type="custom"
                            ratingBackgroundColor="gray"
                            ratingColor="#04BFBF"
                            tintColor="white"
                            onFinishRating={(rating) => {
                                setRating(rating)
                            }}
                            startingValue={rating}
                        />
                    </View>
                    <View style={{ width: "90%", alignSelf: "center", marginTop: 20, borderRadius: 6, height: 150, marginBottom: 0, backgroundColor: LS_COLORS.global.lightGrey }}>
                        <TextInput  maxFontSizeMultiplier={1.5} value={reason} multiline={true} onChangeText={t => setReason(t)} textAlignVertical="top" placeholder={"Your Comments"} placeholderTextColor="gray" style={{ height: 200, padding: 10, color: "black" }} />
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "center" }}>
                        <TouchableOpacity onPress={() => {
                            setVisible(false)
                        }} style={{ backgroundColor: LS_COLORS.global.green, borderRadius: 5, padding: 10 }}>
                            <Text  maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, color: "white" }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                handleAddUpdate(id, { rating, comment: reason })
                            }}
                            style={{ backgroundColor: LS_COLORS.global.green, borderRadius: 5, marginLeft: 20, padding: 10 }}>
                            <Text  maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, color: "white" }}>{id ? "Update" : "Add"}</Text>
                        </TouchableOpacity>
                    </View>
                    {(id || id > 0) && <View style={{ flexDirection: "row", marginTop: 20, justifyContent: "center" }}>
                        <TouchableOpacity
                            onPress={() => {
                                setVisible(false)
                                handleDelete(id)
                            }}
                            style={{ backgroundColor: LS_COLORS.global.danger, borderRadius: 5, padding: 10 }}>
                            <Text  maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, color: "white" }}>Delete</Text>
                        </TouchableOpacity>
                    </View>}
                </View>
            </Pressable>
        </Modal>

    )
}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        alignSelf: 'center',
        textAlign: "center"
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 45,
        width: "40%",
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 6,
        alignSelf: 'center',
        marginTop: 40
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },

})