import { View, Text, Button, SafeAreaView, ActivityIndicator, FlatList, Alert, TouchableOpacity } from 'react-native';
import AppStyles from '../styles/AppStyles';
import { auth, db } from '../config/firebase'
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, getDocs, setDoc, doc, orderBy, where } from 'firebase/firestore';
import React from 'react';
import MyBookingsStyles from '../styles/MyBookingsStyles';
import NavBarStyles from '../styles/NavBarStyles';
import HomeStyles from '../styles/HomeStyles';
import { useNavigation } from '@react-navigation/native';

export default function Home({ navigation }) {

    let [isLoading, setIsLoading] = React.useState(true);
    let [rooms, setRooms] = React.useState([]);
    let [errorMessage, setErrorMessage] = React.useState("");

    

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
        console.log(rooms);
        setIsLoading(false);
    };

    if (isLoading) {
        loadRooms();
    };

    

    let renderRoom = ({ item }) => {
        const id = item.id;
        return (
            <View style={AppStyles.rowContainer}>
                <View style={HomeStyles.container}>
                    <Button
                        title={item.roomId}
                        style={HomeStyles.button}
                        color='#000000'
                        onPress={() => navigation.navigate('TimeSlotRooms', {id})}
                    />
                </View>
            </View>
        );
    };



    let showRooms = () => {
        return (
            <FlatList
                data={rooms}
                renderItem={renderRoom}
                refreshing={true}
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
            navigation.navigate('Login');
        });
    }


    return (
        <SafeAreaView style={AppStyles.container}>
            <View style={NavBarStyles.buttonContainer}>
                <TouchableOpacity style={NavBarStyles.bookButton} onPress={() => { navigation.navigate("MyBookings") }}>
                    <Text style={NavBarStyles.bookButtonText}>Min bokning</Text>
                </TouchableOpacity>
                <TouchableOpacity style={NavBarStyles.logoutButton} onPress={logout}>
                    <Text style={NavBarStyles.logoutButtonText}>Logga ut</Text>
                </TouchableOpacity>
            </View>
            <View style={MyBookingsStyles.bookingInfoContainer}></View>
            <Text style={MyBookingsStyles.bookingInfoTitle}>Boka KTH</Text>
            <View style={MyBookingsStyles.bookingInfo}>
                <Text style={MyBookingsStyles.bookingInfoText}> Du är inloggad som: {auth.currentUser.email}</Text>
            </View>
            <Text style={AppStyles.errorMessage}>{errorMessage}</Text>
            {auth.currentUser ? showContent() : null}
        </SafeAreaView>
    )
}