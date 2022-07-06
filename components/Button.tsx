import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import * as Styles from '../constants/Styles';
import { CustomText } from './CustomText';

interface ButtonProps {
  secondary?: boolean;
  label: string;
  onPress: () => void;
}

export default function Button({ label, onPress, secondary }: ButtonProps) {
  return (
    <TouchableOpacity
      style={{ ...style.touchableStyle, backgroundColor: !secondary ? '#44d3c3' : '#fb4a71' }}
      onPress={onPress}>
      <CustomText label={label} size={18} />
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  touchableStyle: {
    backgroundColor: '#44d3c3',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    minWidth: 150,
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    ...Styles.borderShadow,
  },
});
