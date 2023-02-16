//import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput, Button } from 'react-native';
import AppStyles from '../styles/AppStyles';
import { auth, currentUser } from '../config/firebase'
import { sendPasswordResetEmail } from 'firebase/auth';
import React from 'react';
import InlineTextButton from '../components/InlineTextButton';


export default function ForgotPassword({ navigation }) {

  let [email, setEmail] = React.useState("");
  let [errorMessage, setErrorMessage] = React.useState("");


  let reset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }

  return (
    <View style={AppStyles.container}>
      <Text style={ AppStyles.header }>Reset your password</Text>
      <Text style={AppStyles.errorMessage}>{errorMessage}</Text>
      <TextInput 
        placeholder='exempel@kth.se' 
        style={[AppStyles.textInput, AppStyles.lightTextInput, AppStyles.lightText]} 
        placeholderTextColor="#BEBEBE"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Reset" onPress={reset} color="#f7b267" style={AppStyles.resetButton} />
      <InlineTextButton text="Back to login page" onPress={() => navigation.popToTop()} />
    </View>
  );
};