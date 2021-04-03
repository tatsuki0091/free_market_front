import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState  } from '../../app/store';
import axios from "axios";
import { ADD_CART, CART_USER_PROFILE_ID } from "../types"
import { listenerCount } from 'events';


const apiUrlAddCart = `${process.env.REACT_APP_DEV_API_URL}api/cart`;

export const fetchAsyncAddCart = createAsyncThunk(
    "cart/post",
    async (addCart: ADD_CART) => {
        const res = await axios.post(apiUrlAddCart, addCart, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.localJWT}`
            }
        });
        return res.data;
});

export const fetchAsyncGetCartItems = createAsyncThunk("get/cart", async (cartUserProfileId: CART_USER_PROFILE_ID) => {
    const res = await axios.get(`${apiUrlAddCart}/list`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.localJWT}`
        },
    });
    return res.data;
})




const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        adding: false,
        items: [
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
                items: action.payload
            }
        });
        builder.addCase(fetchAsyncGetCartItems.fulfilled, (state, action) => {
            return {
                ...state,
                items: action.payload
            }
        });
    }
  })

  export const { 

} = cartSlice.actions;


  export const selectCartItems = (state: RootState) => state.cart.items;

  export default cartSlice.reducer;