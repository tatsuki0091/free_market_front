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