import React from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import { deleteProduct } from '../../store/actions/products'

const UserProductsScreen = props => {
    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();

    const editProductHandler = (productId) => {
        props.navigation.navigate('EditProduct', {productId: productId})
    }

    const deleteHandler = (pid) => {
        Alert.alert('Are you sure', 'Do you really want to delete this product?', [
            {text: 'No', style: 'default'},
            {text: 'Yes', style: 'destructive', onPress: () => {
                dispatch(deleteProduct(pid));
            }}
        ])
    }

    if (userProducts.length === 0){
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'open-sans-bold'}}>No products found. Maybe start adding some.</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={userProducts}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <ProductItem
                    title={itemData.item.title}
                    price={itemData.item.price}
                    image={itemData.item.imageUrl}
                    onSelect={() => {
                        editProductHandler(itemData.item.id);
                    }}
                >
                    <Button
                        title="Edit"
                        onPress={() => {
                            editProductHandler(itemData.item.id);
                        }}
                        color={Colors.primary}
                    />
                    <Button
                        title="Delete"
                        onPress={() => {
                            deleteHandler(itemData.item.id);
                        }}
                        color={Colors.primary}
                    />
                </ProductItem>
            )}
        />
    );
}
export const userProductsScreenOptions = navData => {
    return {
        headerTitle: 'My Products',
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
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton} >
                <Item
                    title='Add'
                    iconName='ios-create'
                    onPress={() => {
                        navData.navigation.navigate('EditProduct');
                    }}
                />
            </HeaderButtons>
        ),
    }
}

export default UserProductsScreen;