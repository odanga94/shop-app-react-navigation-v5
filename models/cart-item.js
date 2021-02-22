class CartItem {
    constructor(quantity, productPrice, productTitle, sum, ownerPushToken){
        this.quantity = quantity,
        this.productPrice = productPrice,
        this.productTitle = productTitle,
        this.sum = sum,
        this.ownerPushToken = ownerPushToken
    }
}

export default CartItem;