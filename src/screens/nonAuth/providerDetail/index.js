import React, { useEffect } from 'react'
import { View, Text, Dimensions, ScrollView, Image, Modal, Pressable, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/header';
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
const { width, height } = Dimensions.get("window")
import { AirbnbRating } from 'react-native-ratings';
import { useSelector } from 'react-redux';
import { BASE_URL, getApi } from '../../../api/api';
import Loader from '../../../components/loader';
import moment from 'moment';
import { FlatList } from 'react-native-gesture-handler';
import DropDown from '../../../components/dropDown';
const lodash = require("lodash")
export default function ProviderDetail(props) {
    const { providerId, service } = props.route?.params
    const access_token = useSelector(state => state.authenticate.access_token)
    const [loader, setLoader] = React.useState(false)
    const [provider, setProvider] = React.useState(null)
    const [pictures, setPictures] = React.useState([])
    const [ratings, setRatings] = React.useState([])
    const [totalRatings, setTotalRatings] = React.useState([])
    const [average_rating, setAverageRating] = React.useState(0)
    const [modalVisible, setModalVisible] = React.useState(false)
    const [currentSelectedImage, setCurrentSelectedImage] = React.useState(0)
    const [currentRating, setCurrentRating] = React.useState(0)
    const [sortBy, setSortBy] = React.useState(0)
    useEffect(() => {
        getProviderDetail()
        getRatings()
    }, [])

    useEffect(() => {
        let ratingsCopy = [...totalRatings]
        console.log(sortBy)
        if (sortBy == 0) {
            ratingsCopy.sort((a, b) => {
                let ac = moment(a.created_at, "YYYY-MM-DD HH:mm:ss").toDate()
                let bc = moment(b.created_at, "YYYY-MM-DD HH:mm:ss").toDate()
                console.log(ac, bc)
                if (ac < bc) {
                    return 1
                } else if (ac > bc) {
                    return -1
                }
                return 0
            })

        } else if (sortBy == 1) {
            ratingsCopy.sort((a, b) => {
                let ac = moment(a.created_at, "YYYY-MM-DD HH:mm:ss").toDate()
                let bc = moment(b.created_at, "YYYY-MM-DD HH:mm:ss").toDate()
                console.log(ac, bc)
                if (ac < bc) {
                    return -1
                } else if (ac > bc) {
                    return 1
                }
                return 0
            })

        }
        setRatings(ratingsCopy)
    }, [sortBy, totalRatings])

    useEffect(() => {
        if (provider?.pictures_data?.length > 0) {
            let new_arr = []
            while (provider?.pictures_data?.length) new_arr.push(provider?.pictures_data?.splice(0, 3));
            setPictures(new_arr)
        }
    }, [provider])
    useEffect(() => {
        if (ratings.length > 0) {
            let ratingCopy = ratings.map(x => x.rating).filter(x => x != "null").map(Number)
            let totalAverage = ratingCopy.reduce((a, b) => a + b, 0) / ratingCopy.length
            setAverageRating(totalAverage)
        }
    }, [ratings])

    const getProviderDetail = async () => {
        try {
            setLoader(true)
            let headers = {
                "Authorization": `Bearer ${access_token}`
            }
            let body = new FormData()
            body.append("provider_id", providerId)

            let config = {
                headers: headers,
                data: body,
                endPoint: "/api/providerDetail",
                type: 'post'
            }
            let res = await getApi(config)
            if (res.status) {
                setProvider(res.data)
            }
        } catch (err) {
            console.warn(err)
        } finally {
            setLoader(false)
        }
    }

    const getRatings = async () => {
        try {
            setLoader(true)
            let headers = {
                "Authorization": `Bearer ${access_token}`
            }
            let body = new FormData()
            body.append("provider_id", providerId)
            body.append("orderBy", 'desc')
            let config = {
                headers: headers,
                data: body,
                endPoint: "/api/providerRating",
                type: 'post'
            }
            let res = await getApi(config)
            console.log(JSON.stringify(res.data))
            if (res.status) {
                setRatings(res.data)
                setTotalRatings(res.data)
            }
        } catch (err) {
            console.warn(err)
        } finally {
            setLoader(false)
        }
    }
    const year = (t) => {
        if (Number(t) > 1) {
            return " years"
        } else {
            return ' year'
        }
    }

    function formatPhoneNumber(phoneNumberString) {
        if (phoneNumberString) {
            var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
            var match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
            if (match) {
                return "+" + match[1] + '(' + match[2] + ') ' + match[3] + '-' + match[4];
            }
        }
        return null;
    }

    const checkToShowInput = (value) => {
        if (value == "" || value == "null") {
            return false
        }
        return true
    }
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
                    props.navigation.navigate("MainDrawer", { screen: "HomeScreen" })
                }}
            />
            <Image
                resizeMode='cover'
                source={{ uri: BASE_URL + provider?.profile_image }}
                style={{ width: 90, height: 90, borderWidth: 1, borderColor: LS_COLORS.global.green, zIndex: 1000, elevation: 10, top: -45, left: (width / 2) - 45, borderRadius: 45, backgroundColor: "gray" }}
            />
            <View style={{ marginTop: -40 }}>
                <Text maxFontSizeMultiplier={1.5} style={{ textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular, fontSize: 16, color: LS_COLORS.global.green }}>{provider?.first_name}</Text>
                <Text maxFontSizeMultiplier={1.5} style={{ textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular, fontSize: 14, color: LS_COLORS.global.black }}>{provider?.tagline}</Text>
            </View>
            <ScrollView style={{ paddingBottom: 50 }}>
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
                    <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 14, color: LS_COLORS.global.black }}>Personal Information</Text>
                    {checkToShowInput(provider?.about) && <CustomInputViews title="Bio" text={provider?.about != "null" ? provider?.about : ""} />}
                    {Boolean(Number(provider?.phone_is_public)) && <Pressable
                        onPress={() => {
                            Linking.openURL("tel:" + formatPhoneNumber(provider?.phone_number))
                        }}
                    ><CustomInputViews title="Phone Number" text={formatPhoneNumber(provider?.phone_number)} /></Pressable>}
                    {Boolean(Number(provider?.address_is_public)) && <CustomInputViews title="Address" text={provider?.address[0]?.address_line_1} />}
                    {checkToShowInput(provider?.business_name) && <CustomInputViews title="Business Name" text={provider?.business_name != null ? provider?.business_name : ""} />}
                    {checkToShowInput(provider?.experience) && <CustomInputViews title="Experience" text={provider?.experience != "null" ? provider?.experience + year(provider?.experience) : ""} />}
                    <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 16, marginTop: 30 }}>Certifications</Text>
                    {provider?.certificate_data.map(x => {
                        if (checkToShowInput(x.certificate)) {
                            return <CustomInputViews text={x.certificate} />
                        }
                        return null
                    })}
                    <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 16, marginTop: 30 }}>Pictures</Text>
                    {pictures.map(x => {
                        return (
                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                {x.map((picture, index) => <Pressable style={{ marginHorizontal: index == 1 ? 5 : 0 }} onPress={() => {
                                    setCurrentSelectedImage(picture)
                                    setModalVisible(true)
                                }}><Image
                                        source={{ uri: BASE_URL + picture?.image }}
                                        style={{ width: (width / 3) - 20, borderRadius: 5, aspectRatio: 1, backgroundColor: LS_COLORS.global.grey }}
                                    /></Pressable>)}
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
                    borderRadius: 10,
                    marginBottom: 40
                }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ width: "48%" }}>
                            <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium }}>Filter rating</Text>
                            <DropDown
                                item={["1 Star", "2 Star", "3 Star", "4 Star", "5 Star", 'All']}
                                value={"Select"}
                                onChangeValue={(index, value) => {
                                    if (index == 5) {
                                        setCurrentRating(0)
                                    } else {
                                        setCurrentRating(index + 1)
                                    }

                                }}
                                handleTextValue={true}
                                containerStyle={{ borderRadius: 6, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 10, borderWidth: 0 }}
                                dropdownStyle={{ height: 6 * 40 }}
                            />

                        </View>
                        <View style={{ width: "48%" }}>
                            <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium }}>Sort by</Text>
                            <DropDown
                                item={["Latest", "Oldest"]}
                                value={["Latest", "Oldest"][sortBy]}
                                onChangeValue={(index, value) => {
                                    setSortBy(index)
                                }}

                                handleTextValue={true}
                                containerStyle={{ borderRadius: 6, backgroundColor: LS_COLORS.global.lightGrey, marginBottom: 10, borderWidth: 0 }}
                                dropdownStyle={{ height: 2 * 40, width: "48%" }}
                            />

                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ width: 50 }}>

                        </View>
                        <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsRegular, textAlign: "center", fontSize: 16, marginTop: 5 }}>Customer Rating</Text>
                        <View style={{ width: 50 }}>

                        </View>
                    </View>
                    <AirbnbRating
                        count={5}
                        defaultRating={average_rating}
                        selectedColor={LS_COLORS.global.green}
                        showRating={false}
                        size={20}

                        isDisabled={true}
                    />

                    {(ratings.length == 0 || ratings.filter(rate => {
                        if (currentRating != 0) {
                            if (Number(rate.rating) == currentRating) {
                                return true
                            }
                            return false
                        }
                        return true
                    }).length == 0) && <Text maxFontSizeMultiplier={1.5} style={{ color: "black", fontFamily: LS_FONTS.PoppinsRegular, textAlign: "center", marginTop: 20 }}>No rating found</Text>}
                    {ratings.map(x => {
                        if (currentRating) {
                            if (currentRating != Number(x.rating)) {
                                return null
                            }
                        }
                        return (
                            <View style={{ marginTop: 20 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" ,width:"100%"}}>
                                    <View style={{ flexDirection: "row", alignItems: "center",width:"50%" }}>
                                        <Text maxFontSizeMultiplier={1.3} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 16, color: "black" }}>{x.customers_first_name} {x.customers_last_name}</Text>
                                        <AirbnbRating
                                            count={1}
                                            defaultRating={1}
                                            selectedColor={LS_COLORS.global.green}
                                            showRating={false}
                                            size={14}
                                            isDisabled={true}
                                        />
                                        <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 16, color: "black" }} maxFontSizeMultiplier={1.3}>: {x?.rating != "null" ? Number(x.rating) : 0}</Text>
                                    </View>
                                    <Text maxFontSizeMultiplier={1.3} style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 14, color: LS_COLORS.global.grey }}>{moment(x.created_at, "YYYY-MM-DD HH:mm:ss").format("MM/DD/YYYY")}</Text>
                                </View>
                                <Text maxFontSizeMultiplier={1.3} style={{ fontFamily: LS_FONTS.PoppinsRegular, marginTop: 10, fontSize: 14, color: LS_COLORS.global.grey }}>{x.comment}</Text>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
            {loader && <Loader />}
            <ModalPictureView pictures={pictures} visible={modalVisible} setVisible={setModalVisible} currentImage={currentSelectedImage} />
        </SafeAreaView>
    )
}

const CustomInputViews = ({ title, text }) => {
    return (
        <View style={{ position: "relative", padding: 10, borderWidth: 1, marginTop: 20, borderColor: LS_COLORS.global.lightTextColor, borderRadius: 7 }}>
            <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, color: LS_COLORS.global.lightTextColor, marginHorizontal: 10, position: "absolute", top: -10, backgroundColor: "white" }}>{title}</Text>
            <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 14, color: "black", fontFamily: LS_FONTS.PoppinsRegular }}>{text}</Text>
        </View>
    )
}

const ModalPictureView = ({ pictures, visible, setVisible, currentImage }) => {
    const [pictures1, setPictures1] = React.useState([])
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const ref = React.useRef(null)
    React.useEffect(() => {
        if (pictures && currentImage) {
            let arr = []
            for (let p of pictures) {
                arr = [...arr, ...p]
            }
            arr = arr.filter(x => x.image != currentImage.image)
            setPictures1([currentImage, ...arr])
        }

    }, [pictures, currentImage])

    return (
        <Modal
            visible={visible}
            transparent={true}
        >
            <View style={{ flex: 1, backgroundColor: "#0006", justifyContent: "center", alignItems: "center" }}>
                <View style={{ height: height * 0.9, width: width * 0.9, backgroundColor: "transparent", borderRadius: 20 }}>
                    <FlatList
                        ref={ref}
                        pagingEnabled
                        horizontal
                        data={pictures1}


                        keyExtractor={(item) => item.image}
                        renderItem={({ item }) => {
                            return (
                                <Pressable onPress={() => {
                                    setVisible(false)
                                }}>
                                    <Image
                                        // key={x.image}
                                        source={{ uri: BASE_URL + item?.image }}
                                        style={{ height: height * 0.9, width: width * 0.9, borderRadius: 20, backgroundColor: "gray" }}
                                        resizeMode="cover"
                                    />
                                </Pressable>
                            )

                        }}
                    />


                </View>
            </View>

        </Modal>
    )
}