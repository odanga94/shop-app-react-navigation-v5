class Product {
  constructor(id, ownerId, title, imageUrl, description, price, ownerPushToken) {
    this.id = id;
    this.ownerId = ownerId;
    this.imageUrl = imageUrl;
    this.title = title;
    this.description = description;
    this.price = price;
    this.ownerPushToken = ownerPushToken;
  }
}

export default Product;
