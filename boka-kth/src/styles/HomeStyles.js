import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const HomeStyles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        margin: 10,
        padding: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        minWidth: width * 0.4,
        maxWidth: width * 0.8,
        width: '50%',
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: width * 0.2,
    },
    text: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});

export default HomeStyles;
