export interface File extends Blob {
    readonly lastModified: number;
    readonly name: string;
}

/*Post.tsx*/
export interface PROPS_POST {
    postId: number;
    userPost: number;
    title: string;
    price: number;
    imageUrl: string;
    liked: number[];
}

export interface PROPS_PROFILE {
    id: number;
    nickName: string;
    img: File | null;
    postCode: string;
    address1: string;
    address2: string;
    phoneNumber: string;
}

export interface PROPS_COMMENT {
    text: string;
    post: number;
}

// authSlice.ts
export interface PROPS_AUTHEN {
    email: string;
    password: string;
}

export interface PROPS_NICKNAME {
    nickName: string;
}


/*postSlice.ts*/
export interface PROPS_NEWPOST {
    title: string;
    img: File | null;
    price: string;
    description: string;
}

export interface DETAIL_ID {
    id: string;
}

export interface ADD_CART {
    cartUserPost: string;
    cartUserProfile: string;
    post: string;
    profile: string;
}

export interface CART_USER_PROFILE_ID {
    cartUserProfile: string;
}

export interface DELETE_CART {
    id: string;
}

export interface FILTER_CART_ITEMS_FOR_PAYMENT {
    filterCartItemsForPayment:{
    id: number;
    cartUserProfile: {
        id: number;
        email: string;
    };
    cartUserPost: {
        id: number;
        email: string;
    };
    post: {
        id: number;
        description: string;
        img: string;
        price: number;
        title: string;
        userPost: number;
        created_on: string;
    };
    profile: {
        id: number;
        nickName: string;
        img: string;
        postCode: string;
        address1: string;
        address2: string;
        phoneNumber: string;
        created_on: string;
    };
    created_on: string;
}[]

}


// export interface PURCHASE {
//     purchaseinfo: [
//         id: string
//     ];
// }