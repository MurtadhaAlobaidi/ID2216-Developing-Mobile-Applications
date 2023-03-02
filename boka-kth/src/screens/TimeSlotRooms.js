import { View, Text, Button, SafeAreaView, ActivityIndicator, FlatList, Alert, TouchableOpacity } from 'react-native';
import AppStyles from '../styles/AppStyles';
import { auth, db } from '../config/firebase'
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, getDocs, setDoc, doc, orderBy, where } from 'firebase/firestore';
import InlineTextButton from '../components/InlineTextButton';
import React from 'react';
import TimeSlot from '../components/TimeSlot';
import MyBookingsStyles from '../styles/MyBookingsStyles';
import NavBarStyles from '../styles/NavBarStyles';

import TimeSlotRoomsStyles from '../styles/TimeSlotRoomsStyles';

export default function TimeSlotRooms({ navigation, route }) {
    const { roomId, roomDocId } = route.params;//hämta from home 
    const [selectedTimeSlot, setSelectedTimeSlot] = React.useState('');


    console.log("Soso roomId : " + roomId);
    console.log("Soso doc.id : " + roomDocId);


    const [roomsNew, setRooms] = React.useState([]);

    let loadRooms = async () => {
        const q = query(collection(db, "rooms"), orderBy("roomId", "asc"));
        const querySnapshot = await getDocs(q);
        const rooms = [];
        querySnapshot.forEach((doc) => {
            const room = doc.data();
            room.id = doc.id;

            // check if the room with this id already exists in the array
            const existingRoomIndex = rooms.findIndex((r) => r.id === doc.id);
            if (existingRoomIndex !== -1) {
                // update the existing room's data in the array
                rooms[existingRoomIndex] = room;
            } else {
                // add the new room to the array
                rooms.push(room);
            }
        });
        setRooms(rooms); // Update the state with the retrieved rooms

    };

    React.useEffect(() => {
        loadRooms();
    }, []); // Run this effect only once after component mounts

    //console.log(roomsNew);

    const roomIdSo = roomsNew.find((room) => room.roomId === roomId);
    if (roomIdSo) {
        console.log(roomIdSo); // log the room with roomId = '305'
    } else {
        console.log('Room with roomId = 305 not found.');
    }











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

    const renderTimeSlot = (timeSlot) => {
        return (
            <TouchableOpacity
                key={timeSlot}
                onPress={() => onTimeSlotPress(timeSlot)}
                style={selectedTimeSlot === timeSlot ? TimeSlotRoomsStyles.selectedTimeSlot : TimeSlotRoomsStyles.timeSlot}>
                <Text>{timeSlot}</Text>
            </TouchableOpacity>
        );
    };

    const generateTimeSlots = () => {
        const timeSlots = [];
        for (let i = 8; i <= 18; i++) {
            const timeSlot = `${i < 10 ? '0' : ''}${i}:00`;
            timeSlots.push(timeSlot);
        }
        return timeSlots;
    };

    const renderTimeSlots = () => {
        const timeSlots = generateTimeSlots();
        return (
            <View style={TimeSlotRoomsStyles.timeSlotsContainer}>
                {timeSlots.map(timeSlot => renderTimeSlot(timeSlot))}
            </View>
        );
    };

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
}



