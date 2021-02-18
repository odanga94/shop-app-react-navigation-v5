import React, { 
    useReducer, 
    useCallback, 
    useState,
    useEffect
} from 'react';
import { 
    ScrollView, 
    StyleSheet, 
    KeyboardAvoidingView, 
    View, 
    Button,
    Alert,
    Platform 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';
import Spinner from '../../components/UI/Spinner';



const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        let updatedFormIsValid = true;
        const updatedValues = {
            ...state.inputValues,
            [action.inputLabel]: action.value
        };
        const updatedInputValidities = {
            ...state.inputValidities,
            [action.inputLabel]: action.isValid
        };
        for (let key in updatedInputValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedInputValidities[key];
        }
        return {
            inputValues: updatedValues,
            inputValidities: updatedInputValidities,
            formIsValid: updatedFormIsValid
        }
    }
    return state;
}

const AuthScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSignUp, setIsSignUp] = useState(false);
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: '',
        },
        inputValidities: {
            email: false,
            password: false,
        },
        formIsValid: false
    });

    useEffect(() => {
        if (error){
            Alert.alert('An error occurred!', error, [{ text: 'Okay'}]);
        }
    }, [error]);

    const signUpHandler = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await dispatch(authActions.signUp(formState.inputValues.email, formState.inputValues.password));
            props.navigation.navigate('Shop');
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    }

    const logInHandler = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await dispatch(authActions.logIn(formState.inputValues.email, formState.inputValues.password));
            //props.navigation.navigate('Shop');
        } catch (err) {
            setError(err.message)
            setIsLoading(false);
        }
    }

    const inputChangeHandler = useCallback((inputLabel, value, validity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value,
            isValid: validity,
            inputLabel
        })
    }, [dispatchFormState]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height' }
            keyboardVerticalOffset={50}
            style={styles.screen}
        >
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id="email"
                            label="E-mail:"
                            keyboardType="email-address"
                            required
                            email
                            autoCapitalize="none"
                            errorText="Please enter a valid email address."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <Input
                            id="password"
                            label="Password:"
                            keyboardType="default"
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize="none"
                            errorText="Please enter a valid password."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <View style={styles.buttonContainer}>
                            {isLoading ?
                                <Spinner /> :
                                <Button title={isSignUp ? "SIGN UP" : "LOG IN"} color={Colors.primary} onPress={() => {
                                    isSignUp ? signUpHandler() : logInHandler();
                                }} />
                            }
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button enabled={!isLoading} title={isSignUp ? "Switch to Log In" : "Switch to Sign Up"} color={Colors.accent} onPress={() => {
                                setIsSignUp(prevState => !prevState);
                            }} />
                        </View>


                    </ScrollView>

                </Card>

            </LinearGradient>
        </KeyboardAvoidingView>

    );
}

export const authScreenOptions = {
    headerTitle: "Authenticate"
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    gradient: {
        width: '100%',
        height: '100%',
        justifyContent: "center",
        alignItems: "center"
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    buttonContainer: {
        marginTop: 15,
    }
});

export default AuthScreen;