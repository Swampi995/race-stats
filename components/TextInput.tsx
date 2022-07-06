import React from 'react';
import { TextInput, StyleSheet, Text, View } from 'react-native';

interface BasicTextInputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}

export default function BasicTextInput({ onChangeText, label, value }: BasicTextInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} onChangeText={onChangeText}
        value={value} autoCorrect={false} autoCapitalize={'none'}
        autoCompleteType={'off'}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  label: {
    color: '#8796d6',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginLeft: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#8796d6',
    color: '#fefefe',
    height: 30,
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    borderRadius: 20,
    paddingLeft: 10,
  }
});
