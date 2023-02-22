import { StyleSheet, Platform, Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: windowWidth * 0.05,
    marginTop: 24,
  },
  bookButton: {
    backgroundColor: "#008080",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: windowWidth * 0.05,
  },
  bookButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#db4437",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: windowWidth * 0.05,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
