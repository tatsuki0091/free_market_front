import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState  } from '../../app/store';
import axios from "axios";
import { PROPS_COMMENT} from "../types"

import { PROPS_NEWPOST, DETAIL_ID } from "../types"

const apiUrlPost = `${process.env.REACT_APP_DEV_API_URL}api/post/`;
const apiUrlComment = `${process.env.REACT_APP_DEV_API_URL}api/comment/`;
const apiUrlDetailPost = `${process.env.REACT_APP_DEV_API_URL}api/post/detail/`;

export const fetchAsyncGetPosts = createAsyncThunk("post/get", async () => {
    const res = await axios.get(apiUrlPost);
    return res.data;
})

export const fetchAsyncGetDetailPost = createAsyncThunk("post/getDetail", async (detail: DETAIL_ID) => {
    const res = await axios.get(`${apiUrlDetailPost}${detail.id}`);
    return res.data;
})

export const fetchAsyncNewPost = createAsyncThunk(
    "post/post",
    async (newPost: PROPS_NEWPOST) => {
        const uploadData = new FormData();
        uploadData.append("title", newPost.title);
        newPost.img && uploadData.append("img", newPost.img, newPost.img.name);
        const res = await axios.post(apiUrlPost, uploadData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.localJWT}`
            }
        });
        return res.data;
});

// コメント取得
export const fetchAsyncGetComments = createAsyncThunk(
    "comment/get",
    async () => {
        const res = await axios.get(apiUrlComment);
        return res.data;
});

// コメント投稿
export const fetchAsyncPostComment = createAsyncThunk(
    "comment/post",
    async (comment: PROPS_COMMENT) => {
        const res = await axios.post(apiUrlComment, comment,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.localJWT}`
            }
        });
        return res.data;
});

const postSlice = createSlice({
    name: 'post',
    initialState: {
        isLoadingPost: false,
        openNewPost: false,
        posts: [
            {
                id:0,
                title: "",
                userPost: 0,
                created_on: "",
                img: "",
                liked: [0],
                price: 0
            }
        ],
        detailPost: 
            {
                id:0,
                title: "",
                userPost: 0,
                created_on: "",
                img: "",
                liked: [0],
                price: 0
            }
        ,
        comments: [
            {
                id:0,
                text:"",
                userComment:0,
                post:0
            }
        ]
    },
    reducers: {
        fetchPostStart(state) {
            state.isLoadingPost = true;
        },
        fetchPostEnd(state) {
            state.isLoadingPost = false;
        },
        setOpenNewPost(state) {
            state.openNewPost = true;
        },
        resetOpenNewPost(state) {
            state.openNewPost = false;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(fetchAsyncGetPosts.fulfilled, (state, action) => {
            return {
                ...state,
                posts: action.payload
            }
        });
        builder.addCase(fetchAsyncGetComments.fulfilled, (state, action) => {
            return {
                ...state,
                comments: action.payload
            }
        });
        builder.addCase(fetchAsyncPostComment.fulfilled, (state, action) => {
            return {
                ...state,
                comments: [...state.comments, action.payload],
            }
        });
        builder.addCase(fetchAsyncNewPost.fulfilled, (state, action) => {
            return {
                ...state,
                posts: [...state.posts, action.payload],
            }
        });
        builder.addCase(fetchAsyncGetDetailPost.fulfilled, (state, action) => {
            return {
                ...state,
                detailPost: action.payload,
            }
        });
    }
  })

  export const { 
    fetchPostStart, 
    fetchPostEnd, 
    setOpenNewPost, 
    resetOpenNewPost, 
} = postSlice.actions;

  export const selectPosts = (state: RootState) => state.post.posts;
  export const selectComments = (state: RootState) => state.post.comments;
  export const selectOpenNewPost = (state: RootState) => state.post.openNewPost;
  export const selectDetailPost = (state: RootState) => state.post.detailPost;

  export default postSlice.reducer;