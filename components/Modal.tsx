import React, { FunctionComponent } from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import * as Styles from '../constants/Styles';

interface ModalProps extends React.Props<{}> {
  visible: boolean;
}

export const ConfirmationModal: FunctionComponent<ModalProps> = ({ visible, children }) => {
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
    marginTop: 22,
  },
  modalView: {
    padding: 20,
    backgroundColor: Styles.BACKGROUND_LIGHT,
    width: '95%',
    height: '30%',
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#131417",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
});

export default ConfirmationModal;
