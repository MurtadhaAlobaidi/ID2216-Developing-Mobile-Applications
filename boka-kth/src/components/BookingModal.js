import { View, Text, TextInput, Button } from 'react-native';
import React from 'react';
import AppStyles from '../styles/AppStyles';

export default function BookingModal(props) {
  let [room, setRoom] = React.useState("");
  let [start, setStart] = React.useState("");
  let [end, setEnd] = React.useState("");
  let [errorMessage, setErrorMessage] = React.useState("");
  return (
    <View style={AppStyles.container}>
      <Text style={AppStyles.header}>Boka nu</Text>
      <Text style={AppStyles.errorMessage}>{errorMessage}</Text>
      <TextInput 
          style={[AppStyles.textInput, AppStyles.lightTextInput]} 
          placeholder='Room'
          value={room}
          onChangeText={setRoom}
          maxLength={3}
      />
       <TextInput 
          style={[AppStyles.textInput, AppStyles.lightTextInput]} 
          placeholder='00:00'
          value={start}
          onChangeText={setStart}
          keyboardType="numeric"
          maxLength={5}
      />
      <TextInput 
          style={[AppStyles.textInput, AppStyles.lightTextInput]} 
          placeholder='00:00'
          value={end}
          onChangeText={setEnd}
          keyboardType="numeric"
          maxLength={5}
      /> 
      <View style={[AppStyles.rowContainer, AppStyles.rightAligned, AppStyles.rightMargin]}>
        <Button title="Avbryt" onPress={props.onClose} />
        <Button title="Bekräfta" onPress={() => {
          const x = start.replace(':', '');
          const y = end.replace(':', '');
          const z = y-x;
          if (z > 0 && z < 201 && (x%100 == 0) && (y%100 == 0)) {
            props.room(room,start,end);
            setRoom("");
            setStart("");
            setEnd("");
            props.onClose();
          }
          else if (z === 0) {
            setErrorMessage("Invalid input, end time should be later than start time");
          }
          else if (!(z > 0 && z < 201)) {
            setErrorMessage("Maximum allowed time is exceeded, you can only book a room up to 2 hours/day" + "\n" + start +"\n"+ end);
          } 
          else {
            setErrorMessage("A booking can only be started and ended at XX:00 or XX:30");
          }
        }} />
      </View>
    </View>
  );
}