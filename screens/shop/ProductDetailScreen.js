import React from 'react';
import {
    ScrollView,
    Button,
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import * as cartActions from '../../store/actions/cart';

const ProductDetailScreen = props => {
    const productId = props.route.params.productId;
    const selectedProduct = useSelector(state => state.products.availableProducts.find(product => product.id === productId));
    const dispatch = useDispatch();

    return (
        <ScrollView>
            <Image source={{ uri: selectedProduct.imageUrl }} style={styles.image} />
            <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
            <Text style={styles.description}>{selectedProduct.description}</Text>
            <View style={styles.action}>
                <Button title="Add to Cart" onPress={() => { 
                    dispatch(cartActions.addToCart(selectedProduct))
                }} />
            </View>
        </ScrollView>
    )
}

export const productDetailScreenOptions = (navData) => {
    //console.log('Nav Data:', navData)
    return {
        headerTitle: navData.route.params.productTitle
    }
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },
    price: {
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: 'open-sans-bold'
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20,
        fontFamily: 'open-sans'
    },
    action: {
        marginVertical: 10,
        alignItems: 'center'
    }
});

export default ProductDetailScreen;