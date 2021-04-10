import { Product } from "../../models/product.entity";

export interface Offer {
    product: Product,
    price: number,
    quantity: number,
}