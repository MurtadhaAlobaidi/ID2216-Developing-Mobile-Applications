import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const TimeSlotRoomsStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  timeSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  timeSlotText: {
    fontSize: 16,
    textAlign: 'center',
  },
  bookedTimeSlot: {
    backgroundColor: '#FFCCCB',
    borderColor: '#A52A2A',
  },
  bookedTimeSlotText: {
    color: '#A52A2A',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  bookButton: {
    backgroundColor: '#000000',
    padding: 10,
    borderRadius: 10,
    width: windowWidth * 0.5,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeSlotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeSlotWrapper: {
    flex: 0.48,
    marginBottom: 5,
  },
  bookButtonWrapper: {
    flex: 1,
  },
  darkButton: {
    backgroundColor: '#000000',
  },
});

export default TimeSlotRoomsStyles;
