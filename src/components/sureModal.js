import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Pressable,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Card, Container, Content } from 'native-base';

import LS_FONTS from '../constants/fonts';
import LS_COLORS from '../constants/colors';

const SureModal = props => {
  const [search, setSearch] = useState('');
  return (
    <Modal
      visible={props.visible}
      animationType="fade"
      transparent={true}
      {...props}>
      <Pressable onPress={props.pressHandler} style={styles.modalScreen}>
        <View
          style={{
            height: "50%",
            backgroundColor: 'white',
            width: "80%",
            borderRadius: 10,
            padding: 20,
          }}>
          <Text maxFontSizeMultiplier={1.5} style={styles.sure}>Are You Sure?</Text>
          <View style={{ height: 2, width: 42, backgroundColor: LS_COLORS.global.green, alignSelf: 'center', marginTop: 4 }}></View>
          <View style={{ marginTop: '10%' }}>
            <TouchableOpacity
              style={styles.save}
              activeOpacity={0.7}
              onPress={props.action}>
              <Text maxFontSizeMultiplier={1.5} style={styles.saveText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.save1}
              activeOpacity={0.7}
              onPress = {props.action1}
            >
              <Text maxFontSizeMultiplier={1.5} style={styles.saveText1}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalScreen: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    alignItems: 'center',
    paddingTop: '50%'
  },

  searchBar: {
    height: 48,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  searchIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  textInput: {
    color: 'black',
    fontFamily: LS_FONTS.PoppinsMedium,
    width: '90%',
    marginLeft: 5,
  },
  sure: {
    color: 'black',
    fontSize: 16,
    fontFamily: LS_FONTS.PoppinsBold,
    textAlign: "center"
  },
  save: {
    justifyContent: "center",
    alignItems: 'center',
    height: 50,
    width: 238,
    backgroundColor: LS_COLORS.global.green,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: "15%"
  },
  saveText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: LS_FONTS.PoppinsRegular,
    color: LS_COLORS.global.white
  },
  saveText1: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: LS_FONTS.PoppinsMedium,
    color: LS_COLORS.global.green
  },
  save1: {
    justifyContent: "center",
    alignItems: 'center',
    height: 50,
    width: 238,
    backgroundColor: LS_COLORS.global.white,
    borderRadius: 100,
    borderColor: LS_COLORS.global.green,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 20
  },
});

export default SureModal;
