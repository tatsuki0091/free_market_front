import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState  } from '../../app/store';
import axios from "axios";
import { ADD_CART, CART_USER_PROFILE_ID, DELETE_CART } from "../types"



const apiUrlAddCart = `${process.env.REACT_APP_DEV_API_URL}api/cart/`;
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
    const res = await axios.get(`${apiUrlAddCart}items`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.localJWT}`
        },
    });
    return res.data;
})

export const fetchAsyncDeleteCartItem = createAsyncThunk(
    "cart/delete",
    async (deleteCart: DELETE_CART) => {
        const res = await axios.delete(`${apiUrlAddCart}`+`${deleteCart.id}`, {
            data: deleteCart.id,
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.localJWT}`
            }
        });
        return res.data;
});




const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        adding: false,
        items: [
            {
                id:0,
                cartUserProfile: {
                    id:0,
                    email: ''
                },
                cartUserPost: {
                    id:0,
                    email: ''
                },
                post: {
                    id: 0,
                    description: "",
                    img: "",
                    price: 0,
                    title: "",
                    userPost: 0,
                    created_on: "",
                },
                profile: {
                    id: 0,
                    nickName: "",
                    img: "",
                    postCode: "",
                    address1: "",
                    address2: "",
                    phoneNumber: "",
                    created_on: "",
                },
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
        /** 当初はStateのリターンを返すように設定していたが、カートについた後、
        カート一覧画面に遷移するのでそこでステートを取得するような構造になっているので
        ここは一旦コメントアウト(後でstateの勉強をすること)*/ 
        // builder.addCase(fetchAsyncAddCart.fulfilled, (state, action) => {
        //     //state.items = action.payload;
        //     // return {
        //     //     ...state,
        //     //     items: action.payload
        //     // }
        // });
        builder.addCase(fetchAsyncGetCartItems.fulfilled, (state, action) => {
            return {
                ...state,
                items: action.payload
            }
        });
        // builder.addCase(fetchAsyncDeleteCartItem.fulfilled, (state, action) => {
        //     return {
        //         ...state,
        //         items: action.payload
        //     }
        // });
    }
  })

  export const { 

} = cartSlice.actions;


  export const selectCartItems = (state: RootState) => state.cart.items;

  export default cartSlice.reducer;