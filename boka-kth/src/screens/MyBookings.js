import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import MyBookingsStyles from "../styles/MyBookingsStyles";
import NavBarStyles from "../styles/NavBarStyles";
import AppStyles from "../styles/AppStyles";
import CustomAlert from '../components/CustomAlert';

import { auth, db } from "../config/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import React from "react";
import { useState } from "react";

export default function MyBookings({ navigation }) {
  let [isLoading, setIsLoading] = React.useState(true);
  let [isRefreshing, setIsRefreshing] = React.useState(false);
  let [bookings, setBookings] = React.useState([]);
  let [ref, setRef] = React.useState(null);
  let [userId, setUserId] = React.useState("");
  let [nrBookedHours, setNrBookedHours] = React.useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [item, setItem] = useState();
  const [msg, setMsg] = useState("");
  const [title, setTitle] = useState("");
  const [isSure, setIsSure] = useState(false);





  const handleConfirm = () => {
    console.log('Confirmed');
    setShowAlert(false);
    if (isSure) {
      deleteBooking(item);
      setIsSure(false);
    } else {
      changeBooking(item);
    }
  };

  const handleCancel = () => {
    console.log('Cancelled');
    navigation.navigate("MyBookings");
    setShowAlert(false);
  };

  let getBookedHours = async () => {
    const q2 = query(
      collection(db, "Users"),
      where("email", "==", auth.currentUser.email)
    );
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach((doc2) => {
      let item = doc2.data();
      setUserId(doc2.id);
      setNrBookedHours(item.bookedHours);
    });
  };

  let loadBookings = async () => {
    try {
      const q = query(
        collection(db, "bookings"),
        where("user", "==", auth.currentUser.email)
      );
      const querySnapshot = await getDocs(q);
      let bookings = [];
      querySnapshot.forEach((doc) => {
        let booking = doc.data();
        booking.id = doc.id;
        bookings.push(booking);
      });
      setBookings(bookings);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to load rooms.");
      setIsLoading(false);
    }
    console.log(bookings);
  };

  if (isLoading) {
    loadBookings();
    getBookedHours();
  }

  if (bookings == null) {
    nrBookedHours = 0;
    setNrBookedHours(nrBookedHours);
  }

  let cleanOldBooking = async (item) => {
    let bookedTimeSlots = [];
    let bookingUser = [];
    let roomId = "";
    const q = query(
      collection(db, "rooms"),
      where("roomId", "==", item.roomId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let newItem = doc.data();
      bookedTimeSlots = newItem.bookedTimeSlots;
      bookingUser = newItem.bookingUser;
      roomId = doc.id;
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
    const msg = "Din gamla bokning har raderats, välj en ny tid för att boka den!";
    navigation.navigate("Home", { message:  msg});
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
          <TouchableOpacity
            style={MyBookingsStyles.editButton}
            onPress={() => {
              setItem(item);
              setMsg("Om du bekräftar detta kommer din valda bokning att raderas och du skickas vidare till bokningssidan");
              setTitle("Bekräfta ändring");
              setShowAlert(true);
            }}
          >
            <Text style={MyBookingsStyles.buttonText}>Ändra</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MyBookingsStyles.deleteButton}
            onPress={() => {
              setItem(item);
              setMsg("Är du säker på att du vill ta bort din bokning?");
              setTitle("Bekräfta radering");
              setIsSure(true);
              setShowAlert(true);
            }}
          >
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
        keyExtractor={(booking) => booking.id}
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
      navigation.navigate("Login");
    });
  };

  return (
    <SafeAreaView style={AppStyles.container5}>
      <View style={NavBarStyles.buttonContainer}>
        <TouchableOpacity
          style={NavBarStyles.bookButton}
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <Text style={NavBarStyles.bookButtonText}>Till bokningssidan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={NavBarStyles.logoutButton} onPress={logout}>
          <Text style={NavBarStyles.logoutButtonText}>Logga ut</Text>
        </TouchableOpacity>
      </View>

      <View style={AppStyles.container5}>
        <Text style={AppStyles.errorMessage}>{errorMessage}</Text>
        <Text style={MyBookingsStyles.bookingInfoTitle}>Mina bokningar</Text>
        <View style={MyBookingsStyles.bookingInfo}>
          <Text style={MyBookingsStyles.bookingInfoText}>
            {" "}
            Du är inloggad som:{" "}
            {auth.currentUser ? auth.currentUser.email : null}
          </Text>
        </View>
        {auth.currentUser ? showContent() : null}
        {showAlert && (
        <CustomAlert
          title={title}
          message={msg}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      </View>
    </SafeAreaView>
  );
}
