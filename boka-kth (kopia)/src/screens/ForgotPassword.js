import { Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import ForgotPasswordStyles from '../styles/ForgotPasswordStyles';
import { auth } from '../config/firebase'
import { sendPasswordResetEmail } from 'firebase/auth';
import React from 'react';

export default function ForgotPassword({ navigation }) {

  let [email, setEmail] = React.useState("");
  let [errorMessage, setErrorMessage] = React.useState("");

  const resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigation.navigate('Login');
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <View style={ForgotPasswordStyles.container}>
      <Text style={ForgotPasswordStyles.header}>Reset your password</Text>
      <Text style={ForgotPasswordStyles.errorMessage}>{errorMessage}</Text>
      <TextInput
        style={[ForgotPasswordStyles.textInput, ForgotPasswordStyles.lightTextInput, ForgotPasswordStyles.lightText]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Button
        title="Reset Password"
        onPress={resetPassword}
        style={ForgotPasswordStyles.resetButton}
        color="#f7b267"
      />

      <TouchableOpacity>
        <Text style={ForgotPasswordStyles.backToLoginButton} onPress={() => navigation.popToTop()}>Back to login</Text>
      </TouchableOpacity>
    </View>
  );
};