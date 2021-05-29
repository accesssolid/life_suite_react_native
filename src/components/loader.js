import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native'

const Loader = (props) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator />
        </View>
    )
}

export default Loader;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20
    },
})
