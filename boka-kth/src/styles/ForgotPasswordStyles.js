import { StyleSheet, Platform, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    textInput: {
        height: 40,
        width: "100%",
        maxWidth: 300,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        backgroundColor: "#f7f7f7",
    },
    lightTextInput: {
        backgroundColor: "#f7f7f7",
    },
    lightText: {
        color: "#8e8e8e",
    },
    resetButton: {
        width: "100%",
        maxWidth: 300,
        height: 50,
        marginBottom: 20,
        backgroundColor: "#f7b267",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    errorMessage: {
        color: "red",
        marginBottom: 10,
    },
    backToLoginButton: Platform.select({
        ios: {
            marginTop: 16,
            color: "#f7b267",
            fontSize: 16,
            textDecorationLine: "underline",
        },
        android: {
            marginTop: 16,
            color: "#f7b267",
            fontSize: 16,
            textDecorationLine: "underline",
        },
        web: {
            marginTop: 16,
            color: "#f7b267",
            fontSize: 16,
            textDecorationLine: "underline",
            cursor: "pointer",
        },
    }),
});
