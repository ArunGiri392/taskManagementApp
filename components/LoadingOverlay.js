import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const LoadingOverlay = ({ loading, message }) => {
    return (
        <Spinner
            visible={loading}
            textContent={message}
            textStyle={styles.spinnerTextStyle}
            overlayColor="rgba(0, 0, 0, 0.75)"
        />
    );
};

const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF',
        fontSize: 18,
    },
});

export default LoadingOverlay;
