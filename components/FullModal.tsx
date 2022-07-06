import React, { FunctionComponent } from 'react';
import { StyleSheet, View, Modal, ModalProps } from 'react-native';
import * as Styles from '../constants/Styles';

interface FullModalProps extends ModalProps {
  visible: boolean;
}

export const FullModal: FunctionComponent<FullModalProps> = ({ visible, children }) => {
  return (
    <Modal visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    padding: 20,
    backgroundColor: Styles.BACKGROUND_LIGHT,
    width: '115%',
    height: '115%',
  },
});

export default FullModal;
