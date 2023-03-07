import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import LoginStyles from '../styles/LoginStyles';
import React from 'react';
import { auth } from '../config/firebase'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

export default function Login({ navigation }) {

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
          navigation.navigate("Home", { user: userCredential.user });
        })
        .catch((error) => {
          setErrorMessage(error.message)
        });
    }
  }

  return (
    <View style={LoginStyles.container}>
      <View style={LoginStyles.loginContainer}>
        <Text style={LoginStyles.header}>Sign in to book a room</Text>
        <TextInput
          placeholder='Email'
          style={LoginStyles.textInput}
          placeholderTextColor="#BEBEBE"
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
        />
        <TextInput
          placeholder='Password'
          style={LoginStyles.textInput}
          placeholderTextColor="#BEBEBE"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={LoginStyles.loginButton} onPress={signIn}>
          <Text style={LoginStyles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={LoginStyles.forgotPasswordText} onPress={() => navigation.navigate("ForgotPassword")}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};