import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState  } from '../../app/store';
import axios from "axios";
import { PROPS_COMMENT} from "../types"
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";

import { setOpenSignIn} from "../user/authSlice"

const apiUrlPost = `${process.env.REACT_APP_DEV_API_URL}api/post/`;
const apiUrlComment = `${process.env.REACT_APP_DEV_API_URL}api/comment/`

export const fetchAsyncGetPosts = createAsyncThunk("post/get", async () => {
    const res = await axios.get(apiUrlPost);
    return res.data;
})

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

  export default postSlice.reducer;