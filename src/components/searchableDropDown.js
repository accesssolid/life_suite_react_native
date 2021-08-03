import React from 'react';
import { View, StyleSheet } from 'react-native'
import SearchableDropdown from 'react-native-searchable-dropdown';

/* Constants */
import LS_COLORS from '../constants/colors';
import LS_FONTS from '../constants/fonts';

const SearchableDropDown = props => {
    return (
        <View style={styles.screen}>
            <SearchableDropdown

                onItemSelect={props.onItemSelect}
                containerStyle={styles.containerStyle}
                itemStyle={styles.itemStyle}
                itemTextStyle={styles.itemTextStyle}
                itemsContainerStyle={{ maxHeight: 140 }}
                items={props.items}
                textInputProps={{
                    placeholder: "City",
                    style: styles.inputStyle,
                    onTextChange: props.onTextChange,
                    placeholderTextColor: LS_COLORS.global.placeholder,
                    value: props.value,
                    ref: props.dropRef
                }}
                listProps={
                    {
                        nestedScrollEnabled: true,
                    }
                }
                render
            />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        marginBottom: 30,
        paddingHorizontal: '10%'
    },
    inputStyle: {
        paddingHorizontal: 35,
        borderRadius: 50,
        height: 50,
        backgroundColor: LS_COLORS.global.lightGrey,
        fontFamily: LS_FONTS.PoppinsRegular,
        paddingHorizontal: '13%',
        color: LS_COLORS.global.darkBlack
    },
    itemTextStyle: {
        fontSize: 14,
        fontFamily: LS_FONTS.PoppinsRegular,
        color: LS_COLORS.global.darkGray
    },
    itemStyle: {
        padding: 10,
        borderColor: LS_COLORS.global.lightGrey,
        borderWidth: 1,
    },
    containerStyle: {
        width: '100%',
    }
})

export default SearchableDropDown