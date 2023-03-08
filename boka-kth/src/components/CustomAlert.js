import React, { useState } from 'react';
import { View, Text, Modal, Button } from 'react-native';
import styles from '../styles/CustomAlertStyles';

const CustomAlert = ({ title, message, onConfirm, onCancel }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleConfirm = () => {
    setIsVisible(false);
    onConfirm();
  };

  const handleCancel = () => {
    setIsVisible(false);
    onCancel();
  };

  return (
    <Modal visible={isVisible} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.alertContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.messageText}>{message}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Avbryt" onPress={handleCancel} style={styles.buttonStyle} />
            <Button title="OK" onPress={handleConfirm} style={styles.buttonStyle} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
