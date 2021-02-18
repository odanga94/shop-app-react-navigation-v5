import React, { useEffect, useState, useCallback } from 'react';
import {  
  View, 
  Text, 
  FlatList, 
  Button, 
  StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import * as productActions from '../../store/actions/products';
import Spinner from '../../components/UI/Spinner';
import ErrorMessage from '../../components/ErrorMessage';

const ProductsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const products = useSelector(state => {
    return state.products.availableProducts
  });
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    //console.log('LOAD PRODUCTS');
    setError(null);
    //setIsLoading(true);
    try {
      await dispatch(productActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    loadProducts();
  }, [dispatch, loadProducts]);

  useEffect(() => {
    const WillFocusSub = props.navigation.addListener('focus', () => {
      loadProducts();
    });
    return WillFocusSub;
  }, [loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('ProductDetail', { productId: id, productTitle: title });
  }

  if (isLoading) {
    return (
      <Spinner/>
    )
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        retry={loadProducts}
      />
    )
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontFamily: 'open-sans-bold', fontSize: 18, textAlign: 'center' }}>No products found! Maybe start adding some.</Text>
      </View>
    )
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isLoading}
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
            color={Colors.primary}
          />
          <Button
            title="To Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
            color={Colors.primary}
          />
        </ProductItem>
      )}
    />
  );
};

export const screenOptions = navData => {
  return {
    headerTitle: 'All Products',
    headerLeft: () =>  (
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
          title='Cart'
          iconName='ios-cart'
          onPress={() => {
            navData.navigation.navigate('Cart');
          }}
        />
      </HeaderButtons>
    )
  }
};


const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  }
});



export default ProductsOverviewScreen;
