import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomText } from './CustomText';
import * as Styles from '../constants/Styles';

interface ButtonProps {
  bottomLabel?: string;
  topLabel?: string;
  size?: number;
  textSize?: number;
  onPress: () => void;
}

export default function PrimaryButton({ bottomLabel, size = 50, textSize = 16, onPress }: ButtonProps) {
  const onPressButton = () => {
    onPress?.();
  }

  return (
    <View style={style().component}>
      <TouchableOpacity onPress={onPressButton} accessibilityRole={'none'} style={style(size).button}>
        <View style={style(size).buttonShaddow}>
          <LinearGradient style={style(size).buttonContent}
            colors={['#bd9e25', '#d5b533', '#f0d254', '#eed46a']}
            start={[0, 0.4]} />
        </View>
      </TouchableOpacity>
      {bottomLabel && <View style={style(size).text}>
        <CustomText label={bottomLabel} size={textSize} />
      </View>}
    </View>
  );
}

const style = (size: number = 0) => StyleSheet.create({
  component: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    shadowColor: "#3b4047",
    shadowOffset: {
      width: - (size / 10),
      height: - (size / 10),
    },
    shadowOpacity: 1,
    shadowRadius: size / 14,
    elevation: 24,
  },
  buttonShaddow: {
    shadowColor: "black",
    shadowOffset: {
      width: (size / 10),
      height: (size / 10),
    },
    shadowOpacity: 1,
    shadowRadius: size / 14,
    elevation: 24,
  },
  buttonContent: {
    height: size,
    width: size,
    borderRadius: size / 2,
    borderWidth: size / 28,
    borderColor: Styles.ACCENT_YELLOW,
  },
  text: {
    marginTop: 5,
  },
});
