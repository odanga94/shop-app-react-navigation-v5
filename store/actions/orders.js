import { exp } from 'react-native/Libraries/Animated/src/Easing';
import { BASE_URL } from '../../constants/base-url';
import Order from '../../models/order';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId
        try {
            const response = await fetch(`${BASE_URL}orders/${userId}.json`);

            if (!response.ok){
                //console.log(response);
                throw new Error('Something went wrong!');
            }
            const resData = await response.json();
            //console.log(resData);
            const loadedOrders = resData ? Object.keys(resData).map(key => {
                return new Order(
                    key,
                    resData[key].cartItems,
                    resData[key].totalAmount,
                    new Date(resData[key].date),
                );
            }) : [];
            loadedOrders.sort((a, b) => a.date > b.date ? -1 : 1)
            //console.log(loadedOrders);
            dispatch({
                type: SET_ORDERS,
                orders: loadedOrders
            })
        } catch (err) {
            // send to custom analytics server
            throw err;
        }  
    }
}

export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch, getState) => {
        const { token, userId } = getState().auth;
        const date = new Date();
        const response = await fetch(`${BASE_URL}orders/${userId}.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartItems,
                totalAmount,
                date: date.toISOString()
            })
        });

        if(!response.ok){
            throw new Error('Something went wrong!');
        }

        const resData = await response.json();
        console.log(resData);
        dispatch({
            type: ADD_ORDER,
            orderData: {
                orderId: resData.name,
                items: cartItems,
                amount: totalAmount,
                date
            }
        });

        cartItems.forEach((cartItem, index) => {
            const ownerPushToken = cartItem.ownerPushToken;
            console.log(ownerPushToken);

            fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip, deflate',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: ownerPushToken,
                    title: 'Order was placed!',
                    body: cartItem.productTitle
                })
            }).catch(err => {
                console.log(err)
            });
        })
    }
}