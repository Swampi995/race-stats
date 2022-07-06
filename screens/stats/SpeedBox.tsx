import React from 'react'
import {View, Dimensions, StyleProp, ViewStyle, TextStyle, Text} from 'react-native';

interface SpeedBoxProps {
  speed: number;
  isMetric: boolean;
}

export default function SpeedBox({ speed, isMetric }: SpeedBoxProps) {
  const elements = Array.from(Array(54).keys());
  const { height, width } = Dimensions.get('window');
  const ratio = height / width;
  let top: number;
  if (ratio < 1.8) {
    top = 50;
  } else if (ratio < 2) {
    top = 20;
  } else {
    if (ratio > 2) {
      top = 25;
    }
  }

  const maxSpeed = isMetric ? 200 : 124
  const speedIndex = 54 * speed / maxSpeed;

  return (
    <View style={{ flex: 1 }}>
      <View style={textContainer(width)}>
        <Text style={descStyle}>{isMetric ? 'km/h' : 'mph'}</Text>
        <Text style={speedStyle}>{speed}</Text>
      </View>
      <View style={{ height: width, width: width, transform: [{ rotate: `137deg` }],
        left: - (width / 1.46), bottom: top }}>
        {elements.map((_, index) => {
          return (
            <View key={index} style={style(index, height, speedIndex)}/>
          )
        })}
      </View>
    </View>
  )
}

const style = (index: number, height: number, speedIndex: number): StyleProp<ViewStyle> => ({
  position: 'absolute',
  transform: [{ rotate: `${index * 5}deg` },
    { translateX: height / 6 }],
  width: 20,
  height: 3,
  shadowColor: index >= speedIndex ? '#969CAD' : colorGenerator(index),
  shadowOffset: {
  	width: 0,
  	height: index >= speedIndex ? 0 : 12,
  },
  shadowOpacity: index >= speedIndex ? 0 : 0.58,
  shadowRadius: index >= speedIndex ? 0 : 16,
  elevation: index >= speedIndex ? 0 : 24,
  backgroundColor: index >= speedIndex ? '#969CAD' : colorGenerator(index),
})

const colorGenerator = (index: number) => {
  return `hsl(${190 + index * 4}, 70%, 50%)`;
}

const textContainer = (width: number): StyleProp<TextStyle> => ({
  position: 'absolute',
  alignItems: 'center',
  justifyContent: 'center',
  width: width,
  top: '50%',
})

const descStyle: StyleProp<TextStyle> = {
  fontFamily: 'Roboto-Medium',
  color: '#969CAD',
  fontSize: 18,
}

const speedStyle: StyleProp<TextStyle> = {
  fontFamily: 'Roboto-Regular',
  fontSize: 72,
  color: '#E7EBEE',
}
