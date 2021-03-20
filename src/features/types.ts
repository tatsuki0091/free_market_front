export interface File extends Blob {
    readonly lastModified: number;
    readonly name: string;
}

/*Post.tsx*/
export interface PROPS_POST {
    postId: number;
    userPost: number;
    title: string;
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
}

export interface DETAIL_ID {
    id: string;
}
