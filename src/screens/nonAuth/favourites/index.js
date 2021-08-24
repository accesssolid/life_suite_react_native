import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Components */
import Header from '../../../components/header';
import { Card, Container, Content } from 'native-base';
import DropDown from '../../../components/dropDown';
import CustomTextInput from '../../../components/customTextInput';
import Cards from '../../../components/cards';

const Favourites = (props) => {
    const dispatch = useDispatch()
    const [selected, setselected] = useState(null)
    const [activeTab, setActivetab] = useState(0)

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title="Favorites"
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    props.navigation.goBack()
                }}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => {
                    props.navigation.navigate("HomeScreen")
                }}
            />
            <Container style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 30 }}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => setActivetab(0)} style={{
                        backgroundColor: activeTab === 0 ? LS_COLORS.global.cyan : LS_COLORS.global.transparent,
                        borderRadius: 21,
                        paddingVertical: 12,
                        alignItems: 'center',
                        width: '40%'
                    }}>
                        <Text style={{ fontFamily: LS_FONTS.PoppinsBold, fontSize: 12, color: LS_COLORS.global.darkBlack }}>Service</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => setActivetab(1)} style={{
                        backgroundColor: activeTab === 1 ? LS_COLORS.global.cyan : LS_COLORS.global.transparent,
                        borderRadius: 21,
                        paddingVertical: 12,
                        alignItems: 'center',
                        width: '40%'
                    }}>
                        <Text style={{ fontFamily: LS_FONTS.PoppinsBold, fontSize: 12, color: LS_COLORS.global.darkBlack }}>Service Provider</Text>
                    </TouchableOpacity>
                </View>
                {
                    activeTab == 0
                        ?
                        <FlatList
                            data={[1, 2, 3, 4, 5]}
                            numColumns={3}
                            columnWrapperStyle={{ justifyContent: 'flex-start' }}
                            renderItem={({ item, index }) => {
                                return (
                                    <Cards
                                        title1={"Plumbing"}
                                        title2="SERVICES"
                                        imageUrl={{ uri: 'https://picsum.photos/300/300' }}
                                        action={() => { }}
                                        showLeft
                                        customContainerStyle={{ width: '30%', marginLeft: '2.5%' }}
                                    />
                                )
                            }}
                            keyExtractor={(item, index) => index}
                        />
                        :
                        <Content>
                            {[1, 2, 3, 4, 5].map((item, index) => {
                                return (
                                    <View key={index} style={{ flexDirection: 'row', marginBottom: 30, height: 50, alignItems: 'center' }}>
                                        <View style={{ height: 40, aspectRatio: 1, borderRadius: 20, overflow: 'hidden' }}>
                                            <Image source={{ uri: 'https://picsum.photos/300/300' }} style={{ height: '100%', width: '100%' }} resizeMode="contain" />
                                        </View>
                                        <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'center' }}>
                                            <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 16, color: LS_COLORS.global.darkBlack }}>Carlos</Text>
                                            <Text style={{ fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.darkBlack }}>Plumber</Text>
                                        </View>
                                        <View>
                                            <Text>Price: $25/hr</Text>
                                            <Text>Ratings: 4.2</Text>
                                        </View>
                                        <TouchableOpacity activeOpacity={0.7} onPress={() => { }} style={{ height: '100%', aspectRatio: 1, padding: '4%' }}>
                                            <Image source={require('../../../assets/heartGreen.png')} style={{ height: '100%', width: '100%' }} resizeMode="contain" />
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </Content>

                }
                <View style={{ height: 30 }}></View>
            </Container>
        </SafeAreaView>
    )
}

export default Favourites;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
        paddingHorizontal: 10,
        paddingBottom: 10,
        paddingHorizontal: 20
    },
    alexiContainer: {
        maxHeight: '100%',
        width: "95%",
        alignSelf: 'center',
        borderRadius: 6,
        padding: 10
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 32,
        width: 111,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 28,
        alignSelf: 'center',
        marginTop: 20
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    }
})
