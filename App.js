import { StatusBar } from 'expo-status-bar';
import Login from './src/screens/Login';
import ForgotPassword from './src/screens/ForgotPassword';
import Home from './src/screens/Home';
import MyBookings from './src/screens/MyBookings';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();



export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}/>
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{headerShown: false}}/>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}/>
        <Stack.Screen
          name="MyBookings"
          component={MyBookings}
          options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};