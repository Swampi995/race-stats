import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomText } from './CustomText';

interface ButtonProps {
  bottomLabel?: string;
  size?: number;
  textSize?: number;
  onPress: () => void;
}

export default function SecondaryButton({ bottomLabel, size = 50, textSize = 12, onPress }: ButtonProps) {
  return (
    <View style={style().component}>
      <TouchableOpacity onPress={onPress} style={style(size).button}>
        <View style={style(size).buttonShaddow}>
          <LinearGradient style={style(size).buttonContent}
            colors={[ '#2d3239', '#1c2024']}
            start={[0, 0.4]}/>
        </View>
      </TouchableOpacity>
      {bottomLabel && <View style={style(size).text}>
        <CustomText label={bottomLabel} size={textSize}/>
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
    shadowColor: "#484d53",
    shadowOffset: {
      width: - (size / 10),
      height: - (size / 10),
    },
    shadowOpacity: 1,
    shadowRadius: size / 14,
    elevation: 24,
  },
  buttonShaddow: {
    shadowColor: "#272c31",
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
    borderColor: '#2b2f36',
  },
  text: {
    marginTop: 5,
  },
});
