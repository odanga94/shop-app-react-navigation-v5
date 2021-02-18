import React, { useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import { useDispatch } from 'react-redux';

import Spinner from '../components/UI/Spinner';
import * as authActions from '../store/actions/auth';

const StartUpScreen = (props) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const tryAuth = async () => {
            const userData = await AsyncStorage.getItem('userData');
            //console.log(userData);
            if (!userData){
                dispatch(authActions.setDidTryAL());
                return;
            }
            const transformedData = JSON.parse(userData);
            const { token , userId, expiryDate } = transformedData;
            const expirationDate = new Date(expiryDate);
            if (expirationDate <= new Date() || !token || !userId){
                dispatch(authActions.setDidTryAL());
                return;
            }
            const expirationTime = expirationDate.getTime() - new Date().getTime();
            dispatch(authActions.authenticate(userId, token, expirationTime));
            dispatch(authActions.setDidTryAL());
        };
        tryAuth(); 
    }, [dispatch])
    return <Spinner/>
}

export default StartUpScreen;

