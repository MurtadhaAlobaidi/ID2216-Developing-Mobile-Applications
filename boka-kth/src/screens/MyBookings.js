import { View, Text, Button, SafeAreaView, Modal, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import MyBookingsStyles from '../styles/MyBookingsStyles';
import NavBarStyles from '../styles/NavBarStyles';
import AppStyles from '../styles/AppStyles';

import { auth, db } from '../config/firebase'
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import ChangeModal from '../components/ChangeModal';
import React from 'react';

export default function MyBookings({ navigation }) {

    let [modalVisible, setModalVisible] = React.useState(false);
    let [isLoading, setIsLoading] = React.useState(true);
    let [isAdmin, setIsAdmin] = React.useState(false);
    let [isRefreshing, setIsRefreshing] = React.useState(false);
    let [bookings, setBookings] = React.useState([]);
    let [ref, setRef] = React.useState(null);
    let [userId, setUserId] = React.useState('');
    let [nrBookedHours, setNrBookedHours] = React.useState(0);
    let [newTimeSlot, setNewTimeSlot] = React.useState();


    let getBookedHours = async () => {
        const q2 = query(collection(db, "Users"), where("email", "==", auth.currentUser.email));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc2) => {
            let item = doc2.data();
            setUserId(doc2.id);
            setNrBookedHours(item.bookedHours);
        });
    };

    let refresh = (time) => {
        setTimeout(() => {
            window.location.reload(false);
        }, time);
    }


    let loadBookings = async () => {
        const q = query(collection(db, "bookings"), where("user", "==", auth.currentUser.email));

        const querySnapshot = await getDocs(q);
        let bookings = [];
        querySnapshot.forEach((doc) => {
            let booking = doc.data();
            booking.id = doc.id;
            bookings.push(booking);
        });
        setBookings(bookings);
        setIsLoading(false);
    };

    if (isLoading) {
        loadBookings();
        getBookedHours();
    };

    if (auth.currentUser.email === "abdtra@kth.se") {
        isAdmin = true;
    };



    let cleanOldBooking = async (item) => {
        let bookedTimeSlots = [];
        let bookingUser = [];
        let roomId = "";
        const q = query(collection(db, "rooms"), where("roomId", "==", item.roomId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let newItem = doc.data();
            bookedTimeSlots = newItem.bookedTimeSlots;
            bookingUser = newItem.bookingUser;
            roomId = doc.id
        });
        bookedTimeSlots[item.timeSlotId] = false;
        bookingUser[item.timeSlotId] = "";
        const ref2 = doc(db, "rooms", roomId);
        setDoc(ref2, { bookedTimeSlots: bookedTimeSlots }, { merge: true });
        setDoc(ref2, { bookingUser: bookingUser }, { merge: true });
    };


    // Delete a selected booking
    let deleteBooking = async (item) => {
        console.log(item);

        await deleteDoc(doc(db, "bookings", item.id));

        let updatedBookings = [...bookings].filter((el) => el.id != item.id);
        setBookings(updatedBookings);

        const ref2 = doc(db, "Users", userId);
        setDoc(ref2, { bookedHours: nrBookedHours - 1 }, { merge: true });
        getBookedHours();
        cleanOldBooking(item);
    };






    let changeBooking = (item) => {
        const ref = doc(db, "bookings", item.id);
        setRef(ref);
        deleteBooking(item);
        navigation.navigate('Home');
    };

    let rebook = async (room, start, end) => {
        console
        const z = end.replace(':', '');
        let x = z - 800;
        let y = x / 100;
        let w = y - 1;
        setNewTimeSlot(w);

        setDoc(ref, { roomId: room }, { merge: true });
        setDoc(ref, { start: start }, { merge: true });
        setDoc(ref, { end: end }, { merge: true });
        setDoc(ref, { timeSlotId: w }, { merge: true });

        console.log(newTimeSlot);
        console.log(w);


        let bookedTimeSlots = [];
        let bookingUser = [];
        let newRoomId = "";
        const q = query(collection(db, "rooms"), where("roomId", "==", room));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let newItem = doc.data();
            console.log(doc);
            bookedTimeSlots = newItem.bookedTimeSlots;
            bookingUser = newItem.bookingUser;
            newRoomId = doc.id;
        });
        console.log(newTimeSlot);
        console.log(w);
        bookedTimeSlots[w] = true;
        bookingUser[w] = auth.currentUser.email;
        const ref2 = doc(db, "rooms", newRoomId);
        setDoc(ref2, { bookedTimeSlots: bookedTimeSlots }, { merge: true });
        setDoc(ref2, { bookingUser: bookingUser }, { merge: true });


        setIsLoading(true);

    };





    let renderBooking = ({ item }) => {
        return (
            <View style={MyBookingsStyles.bookingContainer}>
                <View style={MyBookingsStyles.infoContainer}>
                    <Text style={MyBookingsStyles.infoHeader}>Rum</Text>
                    <Text style={MyBookingsStyles.infoText}>{item.roomId}</Text>
                </View>
                <View style={MyBookingsStyles.infoContainer}>
                    <Text style={MyBookingsStyles.infoHeader}>Starttid</Text>
                    <Text style={MyBookingsStyles.infoText}>{item.start}</Text>
                </View>
                <View style={MyBookingsStyles.infoContainer}>
                    <Text style={MyBookingsStyles.infoHeader}>Sluttid</Text>
                    <Text style={MyBookingsStyles.infoText}>{item.end}</Text>
                </View>
                <View style={MyBookingsStyles.infoContainer}>
                    <Text style={MyBookingsStyles.infoHeader}>Skapad av</Text>
                    <Text style={MyBookingsStyles.infoText}>{item.user}</Text>
                </View>
                <View style={MyBookingsStyles.buttonContainer}>
                    <TouchableOpacity style={MyBookingsStyles.editButton} onPress={() => { changeBooking(item); refresh(500) }}>
                        <Text style={MyBookingsStyles.buttonText}>Ändra</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={MyBookingsStyles.deleteButton} onPress={() => deleteBooking(item)}>
                        <Text style={MyBookingsStyles.buttonText}>Avboka</Text>
                    </TouchableOpacity>
                </View>
            </View>

        );
    };


    let showBookings = () => {
        return (
            <FlatList
                data={bookings}
                refreshing={isRefreshing}
                onRefresh={() => {
                    loadBookings();
                    setIsRefreshing(true);
                }}
                renderItem={renderBooking}
                keyExtractor={booking => booking.id}
            />
        );
    };


    let showContent = () => {
        return (
            <View style={AppStyles.container}>
                {isLoading ? <ActivityIndicator size="large" /> : showBookings()}
            </View>
        );
    };

    let logout = () => {
        signOut(auth).then(() => {
            navigation.navigate('Login');
        });
    }


    return (
        <SafeAreaView style={MyBookingsStyles.container}>
            
            <View style={NavBarStyles.buttonContainer}>
                <TouchableOpacity style={NavBarStyles.bookButton} onPress={() => { navigation.navigate("Home"); refresh(500) }}>
                    <Text style={NavBarStyles.bookButtonText}>Till bokningen</Text>
                </TouchableOpacity>
                <TouchableOpacity style={NavBarStyles.logoutButton} onPress={logout}>
                    <Text style={NavBarStyles.logoutButtonText}>Sign Out</Text>
                </TouchableOpacity>
            </View>

            <View style={MyBookingsStyles.bookingInfoContainer}></View>
            <Text style={MyBookingsStyles.bookingInfoTitle}>Mina bokningar</Text>
            <View style={MyBookingsStyles.bookingInfo}>
                <Text style={MyBookingsStyles.bookingInfoText}> Du är inloggad som: {auth.currentUser.email}</Text>
            </View>



            {auth.currentUser ? showContent() : null}
        </SafeAreaView >
    )
}