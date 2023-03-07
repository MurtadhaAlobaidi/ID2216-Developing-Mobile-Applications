import { Text, Pressable } from 'react-native';
import AppStyles from '../styles/AppStyles';

export default function TimeSlot(props) {
  let style = {};
  if (props.color) {
    style.color = props.color
  };
  return (
    <Pressable onPress={props.onPress}>
      {({ pressed }) => (
        <Text 
          //style={[pressed ? AppStyles.pressedBookingButton : AppStyles.bookingButton, style]}
          style={props.style}
          >
            {props.text}
        </Text>
      )}
    </Pressable>
  )
}