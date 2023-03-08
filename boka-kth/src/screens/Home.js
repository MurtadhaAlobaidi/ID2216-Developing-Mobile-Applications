import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { auth, db } from "../config/firebase";
import { signOut } from "firebase/auth";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import AppStyles from "../styles/AppStyles";
import HomeStyles from "../styles/HomeStyles";
import NavBarStyles from "../styles/NavBarStyles";
import MyBookingsStyles from "../styles/MyBookingsStyles";

export default function Home({ navigation, route }) {
  const message  = route.params; // hämta from MyBookings


  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // const myObjStr = JSON.stringify(message);
  // alert(myObjStr);
  // console.log(myObjStr);

  const loadRooms = async () => {
    try {
      const q = query(collection(db, "rooms"), orderBy("roomId", "asc"));
      const querySnapshot = await getDocs(q);
      let rooms = [];
      querySnapshot.forEach((doc) => {
        let room = doc.data();
        room.id = doc.id;
        rooms.push(room);
      });
      setRooms(rooms);
      console.log(rooms);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to load rooms.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const renderRoom = ({ item }) => {
    console.log(item.id);
    console.log(item.roomId);

    return (
      <View style={AppStyles.rowContainer}>
        <View style={HomeStyles.container}>
          <Button
            title={item.roomId.toString()}
            style={HomeStyles.button}
            color="#000000"
            onPress={() =>
              navigation.navigate("TimeSlotRooms", {
                roomId: item.roomId,
                roomDocId: item.id,
              })
            }
          />
        </View>
      </View>
    );
  };

  const showRooms = () => {
    return (
      <FlatList
        data={rooms}
        renderItem={renderRoom}
        refreshing={isLoading}
        onRefresh={loadRooms}
        keyExtractor={(room) => room.id}
      />
    );
  };

  const showContent = () => {
    return (
      <View style={AppStyles.container}>
        {isLoading ? <ActivityIndicator size="large" /> : showRooms()}
      </View>
    );
  };

  const logout = () => {
    signOut(auth).then(() => {
      navigation.navigate("Login");
    });
  };

  return (
    <SafeAreaView style={AppStyles.container5}>
      <View style={NavBarStyles.buttonContainer}>
        <TouchableOpacity
          style={NavBarStyles.bookButton}
          onPress={() => {
            navigation.navigate("MyBookings");
          }}
        >
          <Text style={NavBarStyles.bookButtonText}>Min bokning</Text>
        </TouchableOpacity>
        <TouchableOpacity style={NavBarStyles.logoutButton} onPress={logout}>
          <Text style={NavBarStyles.logoutButtonText}>Logga ut</Text>
        </TouchableOpacity>
      </View>

      <View style={AppStyles.container5}>
        <Text style={AppStyles.errorMessage}>{errorMessage}</Text>
        <Text style={MyBookingsStyles.bookingInfoTitle}>Boka KTH-Rum</Text>
        <View style={MyBookingsStyles.bookingInfo}>
          <Text style={MyBookingsStyles.bookingInfoText}>
            {" "}
            Du är inloggad som:{" "}
            {auth.currentUser ? auth.currentUser.email : null}
          </Text>

        </View>
        {auth.currentUser ? showContent() : null}
      </View>
    </SafeAreaView>
  );
}
