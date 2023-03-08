import { StyleSheet, Platform, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 16,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333333',
    },
    lightText: {
        fontSize: 16,
        color: '#999999',
        marginBottom: 24,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    rightAligned: {
        justifyContent: 'flex-end',
    },
    inlineButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#008080',
    },
    inlineButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    logoutButton: {
        backgroundColor: '#ff0000',
        borderRadius: 8,
    },

    bookingContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    bookingInfo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    editButton: {
        backgroundColor: '#ffc107',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },

    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        minWidth: 70,
    },
    infoText: {
        fontSize: 16,
    },

    deleteButton: {
        backgroundColor: '#db4437',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },


    //för the username and email
    bookingInfoContainer: {
        alignItems: 'center',
        marginBottom: 24,

    },
    bookingInfoTitle: {
        fontSize: 44,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333333',
        textAlign: 'center',

    },
    bookingInfo: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    bookingInfoText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',

    },



});
