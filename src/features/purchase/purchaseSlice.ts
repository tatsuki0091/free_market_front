import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState  } from '../../app/store';
import axios from "axios";
// import { PURCHASE } from "../types"

// const apiUrlAddCart = `${process.env.REACT_APP_DEV_API_URL}api/cart/`;
// export const fetchAsyncAddCart = createAsyncThunk(
//     "cart/post",
//     async (addCart: PURCHASE) => {
//         const res = await axios.post(apiUrlAddCart, addCart, {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `JWT ${localStorage.localJWT}`
//             }
//         });
//         return res.data;
// });



const purchaseSlice = createSlice({
    name: 'purchase',
    initialState: {
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

    },

    extraReducers: (builder) => {

    }
  })














export const { 

} = purchaseSlice.actions;



export default purchaseSlice.reducer;