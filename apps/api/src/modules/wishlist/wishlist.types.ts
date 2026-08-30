export type addWishlistVariant = { 
    variantId : string,
    productId : string,
    identifier : string,
};

export type getList = {
    userId : string
};


export type deleteItemList = {
    id : string,
    productId : string,
    variantId : string
}