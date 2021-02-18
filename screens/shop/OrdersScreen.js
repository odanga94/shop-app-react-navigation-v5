import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as orderActions from '../../store/actions/orders';
import Spinner from '../../components/UI/Spinner';

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    useEffect(() => {
      const loadOrders = async () => {
        setIsLoading(true);
        await dispatch(orderActions.fetchOrders());
        setIsLoading(false);
      }
      loadOrders();
      
    }, [dispatch, setIsLoading]);

    if(isLoading){
      return <Spinner/>
    }

    if (orders.length === 0){
      return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontFamily: 'open-sans-bold'}}>No orders found. Maybe start shopping.</Text>
          </View>
      )
  }

    return (
        <FlatList
            data={orders}
            renderItem={itemData => (
                <OrderItem
                    items={itemData.item.items}
                    amount={itemData.item.totalAmount}
                    date={itemData.item.readableDate}
                />
            )}
            keyExtractor={item => item.id}
        />
    )

}

export const ordersScreenOptions = navData => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton} >
              <Item
                title='Menu'
                iconName='ios-menu'
                onPress={() => {
                  navData.navigation.toggleDrawer();
                }}
              />
            </HeaderButtons>
          ),
    }
}

export default OrdersScreen