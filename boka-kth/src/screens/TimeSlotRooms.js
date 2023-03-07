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



