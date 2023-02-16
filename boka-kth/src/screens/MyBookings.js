import { View, Text, Button, SafeAreaView, Modal, ActivityIndicator, FlatList } from 'react-native';
import AppStyles from '../styles/AppStyles';
import { auth, db } from '../config/firebase'
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import InlineTextButton from '../components/InlineTextButton';
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

    // Reset the database, nollställa alla bokningar och relevanta fields från andra collections
    let resetEverything = async () => {
        const q = query(collection(db, "bookings"))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
            let x = doc.data()
            x.id = doc.id
            deleteBooking(x)
        });


        // clean bookedhours for all users in db
        let users = [];
        const q2 = query(collection(db, "Users"));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc) => {
            let y = doc.data();
            y.id = doc.id;
            users.push(y);
        });
        console.log(users);

        users.forEach((el) => {
            const ref2 = doc(db, "Users", el.id);
            setDoc(ref2, { bookedHours: 0 }, { merge: true });
        });

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
            <View style={AppStyles.rowContainer}>
                <InlineTextButton text="Ändra" onPress={() => { changeBooking(item); refresh(500) }} />
                <Button
                    style={AppStyles.loginButton}
                    title={
                        "Rum: " + item.roomId + " \n"
                        + "Starttid: " + item.start + " \n"
                        + "Sluttid: " + item.end + " \n"
                        + "Skapad av: " + item.user + " \n"
                    }
                >
                </Button>
                <InlineTextButton text="Avboka" onPress={() => deleteBooking(item)} />
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
        <SafeAreaView style={AppStyles.container}>
            <View style={[AppStyles.rowContainer, AppStyles.rightAligned]}>
                <InlineTextButton text="Boka nu" onPress={() => { navigation.navigate("Home"); refresh(500) }} />
                <Button title='Sign out' onPress={logout} style={AppStyles.logoutButton} />
            </View>
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <ChangeModal
                    onClose={() => setModalVisible(false)}
                    room={rebook}
                />
            </Modal>
            <Text style={AppStyles.header}>Mina bokningar</Text>
            <Text style={AppStyles.lightText}>{auth.currentUser.email}</Text>


            {/* <Button disabled={isAdmin ? true : false} 
            onPress={() => resetEverything()} title='Clean all bookings' /> */}
            {/* <Button onPress={() => {window.location.reload(false); navigation.navigate('MyBookings');}} title='Refresh page' /> */}

            {auth.currentUser ? showContent() : null}
        </SafeAreaView>
    )
}