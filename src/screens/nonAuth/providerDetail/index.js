import React from 'react'
import { View, Text, Dimensions, ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/header';
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
const { width, height } = Dimensions.get("window")
import { AirbnbRating } from 'react-native-ratings';

export default function ProviderDetail(props) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <Header
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.goBack()
                }}
                title={""}
                containerStyle={{ backgroundColor: LS_COLORS.global.cyan }}
                imageUrl1={require("../../../assets/homeWhite.png")}
                action1={() => {
                    props.navigation.navigate("HomeScreen")
                }}
            />
            <Image
                resizeMode='cover'
                source={{ uri: "https://www.pngkit.com/png/detail/911-9115516_avatar-icon-deadpool.png" }}
                style={{ width: 90, height: 90, borderWidth: 1, borderColor: LS_COLORS.global.green, zIndex: 1000, elevation: 10, top: -45, left: (width / 2) - 45, borderRadius: 45, backgroundColor: "gray" }}
            />
            <View style={{ marginTop: -40 }}>
                <Text style={{ textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular, fontSize: 16, color: LS_COLORS.global.green }}>Alexi</Text>
                <Text style={{ textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular, fontSize: 14, color: LS_COLORS.global.black }}>Mechanism</Text>
            </View>
            <ScrollView >
                <View style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    backgroundColor: "white",
                    elevation: 5,
                    padding: 10,
                    marginHorizontal: 15,
                    marginTop: 10,
                    borderRadius: 10
                }}>
                    <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 14, color: LS_COLORS.global.black }}>Personal Information</Text>
                    <CustomInputViews title="Bio" text={"I am a Proffesional Mechanic having 4 year experaienc lorem ipsum uba hjgh aytuew dbc qiow apx."} />
                    <CustomInputViews title="Phone Number" text={"+1 (800) 919 1000"} />
                    <CustomInputViews title="Home Address" text={"123 lake side, LA"} />
                    <CustomInputViews title="Business Name" text={"Top Class Machines"} />
                    <CustomInputViews title="Experience" text={"10 year"} />
                    <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 16, marginTop: 30 }}>Certifications</Text>
                    <CustomInputViews text={"Lorem ipsum dolor sit ama"} />
                    <CustomInputViews text={"Lorem ipsum dolor sit ama"} />
                    <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 16, marginTop: 30 }}>Pictures</Text>
                    {[[1, 2, 3], [3, 2, 1]].map(x => {
                        return (
                            <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "space-between" }}>
                                <Image
                                    style={{ width: (width / 3) - 20, borderRadius: 5, aspectRatio: 1, backgroundColor: LS_COLORS.global.grey }}
                                />
                                <Image
                                    style={{ width: (width / 3) - 20, borderRadius: 5, aspectRatio: 1, backgroundColor: LS_COLORS.global.grey }}
                                />
                                <Image
                                    style={{ width: (width / 3) - 20, borderRadius: 5, aspectRatio: 1, backgroundColor: LS_COLORS.global.grey }}
                                />
                            </View>
                        )
                    })}
                </View>
                <View style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    backgroundColor: "white",
                    elevation: 5,
                    padding: 10,
                    marginHorizontal: 15,
                    marginTop: 10,
                    borderRadius: 10
                }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ width: 50 }}>

                        </View>
                        <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, textAlign: "center", fontSize: 16, marginTop: 30 }}>Customer Rating</Text>
                        <View style={{ width: 50 }}>

                        </View>
                    </View>
                    <AirbnbRating
                        count={5}
                        defaultRating={4}
                        selectedColor={LS_COLORS.global.green}
                        showRating={false}
                        size={20}
                    />
                    {[{ date: "12/04/2020", msg: "lorem ipsum shj asdgjh ajgsdw guyic hjgdd xnb qw ewgjhgjk.", title: "Jenna Miles" }, { date: "12/04/2020", msg: "lorem ipsum shj asdgjh ajgsdw guyic hjgdd xnb qw ewgjhgjk.", title: "Jenna Miles" }].map(x => {
                        return (
                            <View style={{marginTop:20}}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 16, color: "black" }}>{x.title}</Text>
                                        <AirbnbRating
                                            count={5}
                                            defaultRating={4}
                                            selectedColor={LS_COLORS.global.green}
                                            showRating={false}
                                            size={14}
                                        />
                                    </View>
                                    <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 14, color: LS_COLORS.global.grey }}>{x.date}</Text>
                                </View>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsRegular,marginTop:10, fontSize: 14, color: LS_COLORS.global.grey }}>{x.msg}</Text>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

const CustomInputViews = ({ title, text }) => {
    return (
        <View style={{ position: "relative", padding: 10, borderWidth: 1, marginTop: 20, borderColor: LS_COLORS.global.lightTextColor, borderRadius: 7 }}>
            <Text style={{ fontSize: 12, color: LS_COLORS.global.lightTextColor, marginHorizontal: 10, position: "absolute", top: -10, backgroundColor: "white" }}>{title}</Text>
            <Text style={{ fontSize: 14, color: "black", fontFamily: LS_FONTS.PoppinsRegular }}>{text}</Text>
        </View>
    )
}