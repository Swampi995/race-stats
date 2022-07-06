import React from 'react';
import { Text, StyleSheet } from 'react-native';
import * as Styles from '../constants/Styles';

type Colors = 'dark' | 'light' | 'blue' | 'yellow' | 'red' |
  'green' | 'paleBlue' | 'paleYellow' | 'paleRed' | 'paleGreen';

interface TextBoldProps {
  label: string | number;
  bold?: boolean;
  color?: Colors;
  size?: number;
}

export function CustomText({ label, size = 18, bold = false, color = 'light' }: TextBoldProps) {
  return (
    <Text style={styles(size, bold, color).text}>
      {label}
    </Text>
  );
}

const getColor = (color?: Colors) => {
  switch (color) {
    case 'dark': return Styles.TEXT_DARK;
    case 'light': return Styles.TEXT_LIGHT;
    case 'blue': return Styles.ACCENT_BLUE;
    case 'yellow': return Styles.ACCENT_YELLOW;
    case 'red': return Styles.ACCENT_RED;
    case 'green': return Styles.ACCENT_GREEN;
    case 'paleBlue': return Styles.PALE_BLUE;
    case 'paleYellow': return Styles.PALE_YELLOW;
    case 'paleRed': return Styles.PALE_RED;
    case 'paleGreen': return Styles.PALE_GREEN;
  }
}

const styles = (size: number, bold: boolean, color?: Colors) =>
  StyleSheet.create({
    text: {
      color: getColor(color),
      fontSize: size,
      fontFamily: bold ? 'Roboto-Bold' : 'Roboto-Medium',
    }
  });
