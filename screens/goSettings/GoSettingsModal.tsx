import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import * as basic from '../../components';

interface ModalProps {
  visible: boolean;
  text: string;
  close: () => void;
  submit: () => void;
}

export const GoToSettingsModal: FunctionComponent<ModalProps> = ({ visible, close, submit, text }) => {
  return (
    <basic.Modal visible={visible}>
      <View style={styles.container}>
        <basic.CustomText label={text} />
      </View>
      <View style={styles.bottomContainer}>
        <basic.SecondaryButton onPress={close} size={35} textSize={14} bottomLabel={'Cancel'} />
        <basic.PrimaryButton onPress={submit} size={35} textSize={14} bottomLabel={'Go to Settings'} />
      </View>
    </basic.Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});
