import { Text, View, TextInput, Button } from 'react-native';
import AppStyles from '../styles/AppStyles';
import React from 'react';
import InlineTextButton from '../components/InlineTextButton';
import { auth } from '../config/firebase'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

export default function Login({ navigation }) {

  // if (auth.currentUser) {
  //   navigation.navigate("Home");
  // } 
  // else {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       navigation.navigate("Home")
  //     }
  //   });
  // }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigation.navigate("Home")
    }
  });


  let [email, setEmail] = React.useState("");
  let [password, setPassword] = React.useState("");
  let [errorMessage, setErrorMessage] = React.useState("");

  let signIn = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
         navigation.navigate("Home", {user: userCredential.user});
        })
        .catch((error) => {
          setErrorMessage(error.message)
        });
    }
  }

  return (
    <View style={AppStyles.container}>
      <Text style={ AppStyles.header }>Sign in to book a room</Text>
      <Text style={AppStyles.errorMessage}>{errorMessage}</Text>
      <TextInput 
        placeholder='exempel@kth.se' 
        style={[AppStyles.textInput, AppStyles.lightTextInput, AppStyles.lightText]} 
        placeholderTextColor="#BEBEBE"
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
      />
      <TextInput 
        placeholder='Lösenord' 
        style={[AppStyles.textInput, AppStyles.lightTextInput, AppStyles.lightText]} 
        placeholderTextColor="#BEBEBE" 
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={signIn} color="#f7b267" style={AppStyles.loginButton} />
      <View style={[AppStyles.rowContainer, AppStyles.topMargin]}>
        <Text style={AppStyles.lightText}>Forgot your password?</Text>
        <InlineTextButton text="Reset" onPress={() => navigation.navigate("ForgotPassword")} />
      </View>
    </View>
  );
};