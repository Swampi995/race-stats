import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import * as Styles from '../../constants/Styles';

interface GForceProps {
  topPoint: number;
  leftPoint: number;
}

const LINES_WIDTH = 0.7;

export default function GForce({ topPoint, leftPoint }: GForceProps) {
  return (
    <View style={styles.meter}>
      <Svg height={'90%'} width={'90%'}
        viewBox="0 0 100 100"
      >
        <Circle
          cx="50"
          cy="50"
          r="40"
          stroke={Styles.UTIL_DARK}
          strokeWidth={LINES_WIDTH}
          fill={Styles.BACKGROUND_DARK}
        />
        <Circle
          cx="50"
          cy="50"
          r="20"
          stroke={Styles.UTIL_DARK}
          strokeWidth={LINES_WIDTH}
          fill={Styles.BACKGROUND_DARK}
        />
        <SvgText
          fill={Styles.TEXT_DARK}
          fontSize="4"
          fontWeight="bold"
          x="47.5"
          y="7"
        >
          1G
        </SvgText>
        <SvgText
          fill={Styles.TEXT_DARK}
          fontSize="4"
          fontWeight="bold"
          x="1.5"
          y="51.3"
        >
          1G
        </SvgText>
        <SvgText
          fill={Styles.TEXT_DARK}
          fontSize="4"
          fontWeight="bold"
          x="47.5"
          y="96"
        >
          1G
        </SvgText>
        <SvgText
          fill={Styles.TEXT_DARK}
          fontSize="4"
          fontWeight="bold"
          x="93"
          y="51.3"
        >
          1G
        </SvgText>
        <Line x={'50'} y={'0'} x1="0" y1="8" x2="0" y2="35"
          stroke={Styles.UTIL_DARK}
          strokeWidth={LINES_WIDTH}
        />
        <Line x={'50'} y={'0'} x1="0" y1="65" x2="0" y2="92"
          stroke={Styles.UTIL_DARK}
          strokeWidth={LINES_WIDTH}
        />
        <Line x={'0'} y={'50'} x1="35" y1="0" x2="8" y2="0"
          stroke={Styles.UTIL_DARK}
          strokeWidth={LINES_WIDTH}
        />
        <Line x={'0'} y={'50'} x1="65" y1="0" x2="92" y2="0"
          stroke={Styles.UTIL_DARK}
          strokeWidth={LINES_WIDTH}
        />
        <Circle cx={leftPoint} cy={topPoint} r="3" fill={Styles.ACCENT_YELLOW} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  meter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
