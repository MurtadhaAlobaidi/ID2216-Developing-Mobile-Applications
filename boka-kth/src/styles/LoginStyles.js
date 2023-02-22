import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: windowWidth * 0.05,
        paddingVertical: windowHeight * 0.05,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
        maxWidth: windowWidth * 0.9,
        minHeight: windowHeight * 0.5,
        maxHeight: windowHeight * 0.7,
    },
    header: {
        fontSize: windowWidth * 0.07,
        fontWeight: 'bold',
        marginBottom: windowHeight * 0.03,
        textAlign: 'center',
    },
    textInput: {
        backgroundColor: '#F6F6F6',
        borderRadius: 5,
        paddingHorizontal: windowWidth * 0.02,
        paddingVertical: windowHeight * 0.02,
        marginBottom: windowHeight * 0.03,
        maxWidth: windowWidth * 0.8,
    },
    loginButton: {
        backgroundColor: '#F7B267',
        borderRadius: 5,
        paddingHorizontal: windowWidth * 0.09,
        paddingVertical: windowHeight * 0.02,
        alignItems: 'center',
        maxWidth: windowWidth * 0.8,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: windowWidth * 0.05,
    },
    forgotPasswordText: {
        color: '#BEBEBE',
        fontSize: windowWidth * 0.04,
        textAlign: 'center',
        marginTop: windowHeight * 0.03,
    },
});
