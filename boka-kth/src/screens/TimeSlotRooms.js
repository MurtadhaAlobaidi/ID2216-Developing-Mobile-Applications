import {
  View,
  Text,
  Button,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { auth, db } from "../config/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  getDocs,
  setDoc,
  doc,
  orderBy,
  where,
} from "firebase/firestore";
import MyBookingsStyles from "../styles/MyBookingsStyles";
import NavBarStyles from "../styles/NavBarStyles";
import { useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import TimeSlotStyles from "../styles/TimeSlotStyles";

export default function TimeSlotRooms({ navigation }) {
  const roomId = useRoute().params.id;

  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [bookingUser, setBookingUser] = useState([]);



 
    const fetchRoomData = async () => {
      console.log('fetching room data for ' + roomId);
      const q = query(collection(db, "rooms"), orderBy("roomId", "asc"));
      const querySnapshot = await getDocs(q);
      const rooms = []

      querySnapshot.forEach((doc) => {
        const roomData = doc.data();
        console.log('roomData', roomData);

        roomData.id = doc.id;
        rooms.push(roomData);
      });
      // setBookedTimeSlots(rooms);
   
    };
    //Hämta alla data
     fetchRoomData();






  // useEffect(() => {
  //   const fetchRoomData = async () => {
  //     console.log('fetching room data for ' + roomId);
  //     roomId
  //     const q = query(
  //       collection(db, "rooms"),
  //       where("id", "==", roomId)
  //     );
  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((doc) => {
  //       const roomData = doc.data();
  //       console.log('roomData', roomData);
  //       setBookedTimeSlots(roomData.bookedTimeSlots);
  //       console.log('bookedTimeSlots', bookedTimeSlots);
  //       setBookingUser(roomData.bookingUser);
  //       console.log('bookingUser', bookingUser);
  //     });
  //   };
  //   fetchRoomData();
  // }, [roomId]);

  // useEffect(() => {
  //   console.log(bookedTimeSlots);
  // }, [bookedTimeSlots]);
  
  // useEffect(() => {
  //   console.log(bookingUser);
  // }, [bookingUser]);

  // let book = async (room, start, end, itemId, timeSlotId) => {
  //   let bookedTimeSlots = [];
  //   let bookingUser = [];

  //   if (nrBookedHours < 2) {
  //     console.log(roomAv[room - 301]);
  //     if (roomAv[room - 301][timeSlotId]) {
  //       setErrorMessage(
  //         "Room is already booked, pleaase choose another room that is available"
  //       );
  //     } else {
  //       //creating a booking in hte database
  //       const docRef = await addDoc(collection(db, "bookings"), {
  //         roomId: room,
  //         start: start,
  //         end: end,
  //         date: new Date().toLocaleString(),
  //         user: auth.currentUser.email,
  //         timeSlotId: timeSlotId,
  //       });
  //       //updating the values of the room in the database
  //       const q = query(collection(db, "rooms"), where("roomId", "==", room));
  //       const querySnapshot = await getDocs(q);

  //       querySnapshot.forEach((doc) => {
  //         let item = doc.data();
  //         bookedTimeSlots = item.bookedTimeSlots;
  //         bookingUser = item.bookingUser;
  //       });
  //       bookedTimeSlots[timeSlotId] = true;
  //       bookingUser[timeSlotId] = auth.currentUser.email;
  //       const ref = doc(db, "rooms", itemId);
  //       setDoc(ref, { bookedTimeSlots: bookedTimeSlots }, { merge: true });
  //       setDoc(ref, { bookingUser: bookingUser }, { merge: true });
  //       //updateing the booker's bookedHours-field in the database
  //       const ref2 = doc(db, "Users", userId);
  //       setDoc(ref2, { bookedHours: nrBookedHours + 1 }, { merge: true });
  //       console.log(nrBookedHours);
  //       setNrBookedHours(nrBookedHours + 1);
  //       setIsLoading(false);
  //       refresh(500);
  //     }
  //   } else {
  //     setErrorMessage(
  //       "Maximum number of booked hours has been reached, Please cancel or change your current booking!"
  //     );
  //   }

  const handleTimeSlotPress = (index) => {
    console.log("Room has been booked by YOU!");
    // Do something when a time slot is clicked
    // You can use the `bookingUser` array to check if the slot is available
    // For example:
    if (bookingUser[index] === "") {
      console.log(`Time slot ${index} is available`);
    } else {
      console.log(
        `Time slot ${index} is already booked by ${bookingUser[index]}`
      );
    }
  };

  let logout = () => {
    signOut(auth).then(() => {
      navigation.navigate("Login");
    });
  };

  return (
    // <SafeAreaView style={AppStyles.container}>
    //   <View style={NavBarStyles.buttonContainer}>
    //     <TouchableOpacity
    //       style={NavBarStyles.bookButton}
    //       onPress={() => {
    //         navigation.navigate("Home");
    //       }}
    //     >
    //       <Text style={NavBarStyles.bookButtonText}>Tillbaka till Hem</Text>
    //     </TouchableOpacity>
    //     <TouchableOpacity
    //       style={NavBarStyles.logoutButton}
    //       onPress={logout}
    //     >
    //       <Text style={NavBarStyles.logoutButtonText}>Logga ut</Text>
    //     </TouchableOpacity>
    //   </View>
    //   <Text style={MyBookingsStyles.bookingInfoTitle}>Boka KTH</Text>
    //   <Text>Time slots for room "{roomId}"</Text>
    // </SafeAreaView>

<<<<<<< Updated upstream
    <View style={TimeSlotStyles.container}>
      <Text style={TimeSlotStyles.title}>Room {roomId}</Text>
      <View style={TimeSlotStyles.buttonContainer}>
        {bookedTimeSlots.map((isBooked, index) => (
          <TouchableOpacity
            key={index}
            style={[
              TimeSlotStyles.button,
              isBooked
                ? TimeSlotStyles.bookedButton
                : TimeSlotStyles.availableButton,
            ]}
            onPress={() => handleTimeSlotPress(index)}
            disabled={bookingUser[index] !== ""}
          >
            <Text style={TimeSlotStyles.buttonText}>{index}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
=======








    const onTimeSlotPress = (timeSlot) => {
        setSelectedTimeSlot(timeSlot);

        // Add your code to book the room here
        console.log("Soso 1: " + timeSlot);

        let book = async (room, start, end, itemId, timeSlotId, setTimeSlotRooms) => {
            let bookedTimeSlots = [];
            let bookingUser = [];

            if (nrBookedHours < 2) {
                const roomIndex = room - 301;
                const timeSlotRoomsCopy = [...TimeSlotRooms];

                if (timeSlotRoomsCopy[roomIndex].slots[timeSlotId].booked) {
                    setErrorMessage("Room is already booked, please choose another room that is available");
                } else {
                    //creating a booking in the database
                    const docRef = await addDoc(collection(db, "bookings"), {
                        roomId: room,
                        start: start,
                        end: end,
                        date: new Date().toLocaleString(),
                        user: auth.currentUser.email,
                        timeSlotId: timeSlotId
                    });

                    //updating the values of the room in the database
                    const q = query(collection(db, "rooms"), where("roomId", "==", room));
                    const querySnapshot = await getDocs(q);

                    querySnapshot.forEach((doc) => {
                        let item = doc.data()
                        bookedTimeSlots = item.bookedTimeSlots;
                        bookingUser = item.bookingUser;
                    });
                    bookedTimeSlots[timeSlotId] = true;
                    bookingUser[timeSlotId] = auth.currentUser.email;
                    const ref = doc(db, "rooms", itemId);
                    setDoc(ref, { bookedTimeSlots: bookedTimeSlots }, { merge: true });
                    setDoc(ref, { bookingUser: bookingUser }, { merge: true });

                    //updating TimeSlotRooms state to reflect the booking
                    timeSlotRoomsCopy[roomIndex].slots[timeSlotId] = {
                        booked: true,
                        user: auth.currentUser.email
                    };
                    setTimeSlotRooms(timeSlotRoomsCopy);

                    /*
                    //updateing the booker's bookedHours-field in the database
                    const ref2 = doc(db, "Users", userId)
                    setDoc(ref2, { bookedHours: (nrBookedHours + 1) }, { merge: true })
                    console.log(nrBookedHours)
                    setNrBookedHours(nrBookedHours + 1)
                    setIsLoading(false);
    
                    refresh(500);*/
                }
            } else {
                setErrorMessage("Maximum number of booked hours has been reached, Please cancel or change your current booking!");
            };
        };




















        /*******/
    };

    const renderTimeSlots = () => {
    const timeSlots = [];
    for (let i = 0; i < 10; i++) {
        const timeSlotId = i;
        const startTime = `${i + 8 < 10 ? '0' : ''}${i + 8}:00`;
        const endTime = `${i + 9 < 10 ? '0' : ''}${i + 9}:00`;
        const timeSlot = `${startTime} - ${endTime}`;
        timeSlots.push({
            id: timeSlotId,
            timeSlot: timeSlot,
            startTime: startTime,
            endTime: endTime,
        });
    }
    return (
        <View style={TimeSlotRoomsStyles.timeSlotsContainer}>
            {timeSlots.map(timeSlot => (
                <TouchableOpacity
                    key={timeSlot.id}
                    onPress={() => onTimeSlotPress(timeSlot)}
                    style={selectedTimeSlot === timeSlot.id ? TimeSlotRoomsStyles.selectedTimeSlot : TimeSlotRoomsStyles.timeSlot}>
                    <Text>{timeSlot.timeSlot}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

    // const renderTimeSlot = (timeSlot) => {
    //     return (
    //         <TouchableOpacity
    //             key={timeSlot}
    //             onPress={() => onTimeSlotPress(timeSlot)}
    //             style={selectedTimeSlot === timeSlot ? TimeSlotRoomsStyles.selectedTimeSlot : TimeSlotRoomsStyles.timeSlot}>
    //             <Text>{timeSlot}</Text>
    //         </TouchableOpacity>
    //     );
    // };

    // const generateTimeSlots = () => {
    //     const timeSlots = [];
    //     for (let i = 8; i <= 18; i++) {
    //         const timeSlot = `${i < 10 ? '0' : ''}${i}:00`;
    //         timeSlots.push(timeSlot);
    //     }
    //     return timeSlots;
    // };

    // const renderTimeSlots = () => {
    //     const timeSlots = generateTimeSlots();
    //     return (
    //         <View style={TimeSlotRoomsStyles.timeSlotsContainer}>
    //             {timeSlots.map(timeSlot => renderTimeSlot(timeSlot))}
    //         </View>
    //     );
    // };

    let logout = () => {
        signOut(auth).then(() => {
            navigation.navigate('Login');
        });
    }

    return (
        <SafeAreaView style={AppStyles.container}>


            <View style={NavBarStyles.buttonContainer}>
                <TouchableOpacity style={NavBarStyles.bookButton} onPress={() => { navigation.goBack() }}>
                    <Text style={NavBarStyles.bookButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={NavBarStyles.logoutButton} onPress={logout}>
                    <Text style={NavBarStyles.logoutButtonText}>Logga ut</Text>
                </TouchableOpacity>
            </View>

            {/* <View style={TimeSlotRoomsStyles.roomHeaderContainer}>
                <Text style={TimeSlotRoomsStyles.roomHeaderText}>Room {roomId}</Text>
            </View> */}

            <View style={MyBookingsStyles.bookingInfo}>
                <Text style={MyBookingsStyles.bookingInfoText}> Room {roomId}</Text>
            </View>

            {renderTimeSlots()}
        </SafeAreaView>
    );
>>>>>>> Stashed changes
}
