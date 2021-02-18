import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';

const ErrorMessage = props => {
    return (
        <View style={styles.centered}>
            <Text style={{ fontFamily: 'open-sans-bold', fontSize: 18, textAlign: 'center', marginBottom: 10 }}>
                {props.error}
            </Text>
            <Button title="Try Again" onPress={props.retry} color={Colors.primary} />
        </View>
    )
}

const styles = StyleSheet.create({
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20
    }
});

export default ErrorMessage;