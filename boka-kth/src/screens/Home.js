import { View, Text, Button, SafeAreaView, ActivityIndicator, FlatList, Alert } from 'react-native';
import AppStyles from '../styles/AppStyles';
import { auth, db } from '../config/firebase'
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, getDocs, setDoc, doc, orderBy, where } from 'firebase/firestore';
import InlineTextButton from '../components/InlineTextButton';
import React from 'react';
import TimeSlot from '../components/TimeSlot';


export default function Home({ navigation }) {

    let [isLoading, setIsLoading] = React.useState(true);
    let [rooms, setRooms] = React.useState([]);
    let [userId, setUserId] = React.useState("");
    let [nrBookedHours, setNrBookedHours] = React.useState(0);
    let [errorMessage, setErrorMessage] = React.useState("");
    let [totalBookings, setTotalBookings] = React.useState(0);


    let [roomAv, setRoomAv] = React.useState([]);

    let x = 301;

    let refresh = (time) => {
        setTimeout(() => {
            window.location.reload(false);
        }, time);
    }

    let getBookedHours = async () => {
        const q2 = query(collection(db, "Users"), where("email", "==", auth.currentUser.email));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc2) => {
            let item = doc2.data();
            setUserId(doc2.id);
            setNrBookedHours(item.bookedHours);
        });
    };


    let loadRooms = async () => {
        const q = query(collection(db, "rooms"), orderBy("roomId", "asc"));
        const querySnapshot = await getDocs(q);
        let rooms = []
        querySnapshot.forEach((doc) => {
            let room = doc.data();
            room.id = doc.id;
            rooms.push(room);
        });
        setRooms(rooms);

        rooms.forEach((room) => {
            roomAv.push(room.bookedTimeSlots);
        });
        setRoomAv(roomAv);
        console.log(roomAv);
        console.log(rooms);


        setIsLoading(false);

    };

    if (isLoading) {
        loadRooms();
        console.log(rooms);
        getBookedHours();
    };


    let book = async (room, start, end, itemId, timeSlotId) => {
        let bookedTimeSlots = [];
        let bookingUser = [];

        if (nrBookedHours < 2) {
            console.log(roomAv[room - 301]);
            if ((roomAv[room - 301][timeSlotId])) {
                setErrorMessage("Room is already booked, pleaase choose another room that is available");
            } else {
                //creating a booking in hte database
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



                //updateing the booker's bookedHours-field in the database
                const ref2 = doc(db, "Users", userId)
                setDoc(ref2, { bookedHours: (nrBookedHours + 1) }, { merge: true })
                console.log(nrBookedHours)
                setNrBookedHours(nrBookedHours + 1)
                setIsLoading(false)


                refresh(500);



            }
        } else {
            setErrorMessage("Maximum number of booked hours has been reached, Please cancel or change your current booking!");
        };

    };

    let renderRoom = ({ item }) => {
        console.log(item.roomId);
        return (
            <View style={AppStyles.rowContainer}>
                <Button title={item.roomId} style={AppStyles.roomButton} color='#000000' />
                <TimeSlot text="08.00 - 09.00" disabled={roomAv[item.roomId - 301][0]} onPress={() => { getBookedHours(); book(item.roomId, "08:00", "09:00", item.id, '0'); }}
                    style={[roomAv[item.roomId - 301][0] ? AppStyles.disabledBookingButton : AppStyles.bookingButton]} />
                <TimeSlot text="09.00 - 10.00" disabled={roomAv[item.roomId - 301][1]} onPress={() => { getBookedHours(); book(item.roomId, "09:00", "10:00", item.id, '1'); }}
                    style={[roomAv[item.roomId - 301][1] ? AppStyles.disabledBookingButton : AppStyles.bookingButton]} />
                <TimeSlot text="10.00 - 11.00" disabled={roomAv[item.roomId - 301][2]} onPress={() => { getBookedHours(); book(item.roomId, "10:00", "11:00", item.id, '2'); }}
                    style={[roomAv[item.roomId - 301][2] ? AppStyles.disabledBookingButton : AppStyles.bookingButton]} />
                <TimeSlot text="12.00 - 13.00" disabled={roomAv[item.roomId - 301][3]} onPress={() => { getBookedHours(); book(item.roomId, "11:00", "12:00", item.id, '3'); }}
                    style={[roomAv[item.roomId - 301][3] ? AppStyles.disabledBookingButton : AppStyles.bookingButton]} />
                <TimeSlot text="13.00 - 14.00" disabled={roomAv[item.roomId - 301][4]} onPress={() => { getBookedHours(); book(item.roomId, "12:00", "13:00", item.id, '4'); }}
                    style={[roomAv[item.roomId - 301][4] ? AppStyles.disabledBookingButton : AppStyles.bookingButton]} />
                <TimeSlot text="14.00 - 15.00" disabled={roomAv[item.roomId - 301][5]} onPress={() => { getBookedHours(); book(item.roomId, "13:00", "14:00", item.id, '5'); }}
                    style={[roomAv[item.roomId - 301][5] ? AppStyles.disabledBookingButton : AppStyles.bookingButton]} />
                <TimeSlot text="15.00 - 16.00" disabled={roomAv[item.roomId - 301][6]} onPress={() => { getBookedHours(); book(item.roomId, "14:00", "15:00", item.id, '6'); }}
                    style={[roomAv[item.roomId - 301][6] ? AppStyles.disabledBookingButton : AppStyles.bookingButton]} />
                <TimeSlot text="16.00 - 17.00" disabled={roomAv[item.roomId - 301][7]} onPress={() => { getBookedHours(); book(item.roomId, "15:00", "16:00", item.id, '7'); }}
                    style={[roomAv[item.roomId - 301][7] ? AppStyles.disabledBookingButton : AppStyles.bookingButton]} />
                <TimeSlot text="17.00 - 18.00" disabled={roomAv[item.roomId - 301][8]} onPress={() => { getBookedHours(); book(item.roomId, "16:00", "17:00", item.id, '8'); }}
                    style={[roomAv[item.roomId - 301][8] ? AppStyles.disabledBookingButton : AppStyles.bookingButton]} />
            </View>
        );
    };



    let showRooms = () => {
        return (
            <FlatList
                data={rooms}
                renderItem={renderRoom}
                refreshing={true}
                onRefresh={() => {
                    console.log('Im here');
                }}
                keyExtractor={room => room.id}
            />
        );
    };

    let showContent = () => {
        return (
            <View style={AppStyles.container}>
                {isLoading ? <ActivityIndicator size="large" /> : showRooms()}
            </View>
        );
    };

    let logout = () => {
        signOut(auth).then(() => {
            rooms = null;
            console.log(rooms);
            roomAv = null;
            console.log(roomAv);
            navigation.popToTop();
        });
    };


    return (
        <SafeAreaView style={AppStyles.container}>
            <View style={[AppStyles.rowContainer, AppStyles.rightAligned]}>
                <InlineTextButton text="Mina bokningar" onPress={() => navigation.navigate("MyBookings")} />

                <Button title='Sign out' onPress={logout} style={AppStyles.logoutButton} />
            </View>




            <Text style={AppStyles.header}>Boka KTH</Text>
            <Text style={AppStyles.lightText}>Current user: {auth.currentUser.email}</Text>
            <Text style={AppStyles.errorMessage}>{errorMessage}</Text>

            {auth.currentUser ? showContent() : null}
        </SafeAreaView>
    )
}