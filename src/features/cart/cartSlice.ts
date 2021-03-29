import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState  } from '../../app/store';
import axios from "axios";
import { ADD_CART } from "../types"


const apiUrlAddCart = `${process.env.REACT_APP_DEV_API_URL}api/cart/`;

export const fetchAsyncAddCart = createAsyncThunk(
    "cart/post",
    async (addCart: ADD_CART) => {
        console.log(addCart)
        const res = await axios.post(apiUrlAddCart, addCart, {
            headers: {
                "Content-Type": "application/json",
                //Authorization: `JWT ${localStorage.localJWT}`
            }
        });
        return res.data;
});

const cartSlice = createSlice({
    name: 'post',
    initialState: {
        adding: false,
        cart: [
            {
                id:0,
                userProfile: 0,
                userPost: 0,
                created_on: "",
            }
        ],
    },
    reducers: {
        fetchAddStart(state) {
            state.adding = true;
        },
        fetchAddEnd(state) {
            state.adding = false;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(fetchAsyncAddCart.fulfilled, (state, action) => {
            return {
                ...state,
                posts: action.payload
            }
        });
    }
  })