import { View, Text, Button, SafeAreaView, ActivityIndicator, FlatList, Alert, TouchableOpacity } from 'react-native';
import AppStyles from '../styles/AppStyles';
import { auth, db } from '../config/firebase'
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, getDocs, setDoc, doc, orderBy, where } from 'firebase/firestore';
import React from 'react';
import MyBookingsStyles from '../styles/MyBookingsStyles';
import NavBarStyles from '../styles/NavBarStyles';

import TimeSlotRoomsStyles from '../styles/TimeSlotRoomsStyles';

export default function TimeSlotRooms({ navigation, route }) {

    const { roomId, roomDocId } = route.params;//hämta from home 
    const [selectedTimeSlot, setSelectedTimeSlot] = React.useState('');
    const [nrBookedHours, setNrBookedHours] = React.useState(0);
    const [userId, setUserId] = React.useState("");
    // const [roomsNew, setRooms] = React.useState([]);
    const [roomAv, setRoomAv] = React.useState([]);
    const [roomUs, setRoomUs] = React.useState([]);
    const [errorMessage, setErrorMessage] = React.useState("");

    let refresh = (time) => {
        setTimeout(() => {
            window.location.reload(false);
        }, time);
    };




    console.log("Soso roomId : " + roomId);
    console.log("Soso doc.id : " + roomDocId);

    const loadRooms = async () => {
        const q = query(collection(db, "rooms"), where("roomId", "==", roomId));
        const querySnapshot = await getDocs(q);
        let roomAv = [];
        let roomUs = [];
        querySnapshot.forEach((doc) => {
            const room = doc.data();
            room.id = doc.id;
            roomAv = room.bookedTimeSlots;
            roomUs = room.bookingUser;
            // roomAv.push(room.bookedTimeSlots)
            // roomUs.push(room.bookingUser)
        });
        setRoomAv(roomAv);
        setRoomUs(roomUs);
    };

    React.useEffect(() => {
        loadRooms();
        getBookedHours();
    }, []); // Run this effect only once after component mounts

    
    // const roomIdSo = roomsNew.find((room) => room.roomId === roomId);
    // if (roomIdSo) {
    //     console.log(roomIdSo); // log the room with roomId = '305'
    // } else {
    //     console.log('Room with roomId = 305 not found.');
    // }

    let getBookedHours = async () => {
        const q2 = query(collection(db, "Users"), where("email", "==", auth.currentUser.email));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc2) => {
            let item = doc2.data();
            setUserId(doc2.id);
            setNrBookedHours(item.bookedHours);
        });
    };

    const onTimeSlotPress = async (timeSlotId, startTime, endTime) => {
        // let bookedTimeSlots = [];
        // let bookingUser = [];
        console.log(nrBookedHours);

        if (nrBookedHours < 3 && nrBookedHours > -1) {
            console.log(roomAv[timeSlotId]);
            console.log(roomUs[timeSlotId] + "test");


            if (roomAv[timeSlotId]) {
                setErrorMessage("Room is already booked, pleaase choose another room that is available");
            } else {
                //creating a booking in the database
                const docRef = await addDoc(collection(db, "bookings"), {
                    roomId: roomId,
                    start: startTime,
                    end: endTime,
                    date: new Date().toLocaleString(),
                    user: auth.currentUser.email,
                    timeSlotId: timeSlotId
                });

                // updating the values of the room in the database
                roomAv[timeSlotId] = true;
                roomUs[timeSlotId] = auth.currentUser.email;
                const ref = doc(db, "rooms", roomDocId);
                setDoc(ref, { bookedTimeSlots: roomAv }, { merge: true });
                setDoc(ref, { bookingUser: roomUs }, { merge: true });


                //updateing the booker's bookedHours-field in the database
                const ref2 = doc(db, "Users", userId)
                setDoc(ref2, { bookedHours: (nrBookedHours + 1) }, { merge: true })
                console.log(nrBookedHours)
                setNrBookedHours(nrBookedHours + 1)
                refresh(500);            
            }
        } else {
            setErrorMessage("Maximum number of booked hours has been reached, Please cancel or change your current booking!");
        };
    }


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
                        onPress={() => onTimeSlotPress(timeSlot.id, timeSlot.startTime, timeSlot.endTime)}
                        //style={selectedTimeSlot === timeSlot.id ? TimeSlotRoomsStyles.selectedTimeSlot : TimeSlotRoomsStyles.timeSlot}
                        style={[roomAv[timeSlot.id] ? AppStyles.disabledBookingButton : AppStyles.bookingButton]}
                        >
                        <Text>{timeSlot.timeSlot}</Text>
                    </TouchableOpacity>
                ))}
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

            <View style={MyBookingsStyles.bookingInfo}>
                <Text style={MyBookingsStyles.bookingInfoText}> Room {roomId}</Text>
                <Text style={AppStyles.errorMessage}>{errorMessage}</Text>
            </View>

            {renderTimeSlots()}
        </SafeAreaView>
    );
}



