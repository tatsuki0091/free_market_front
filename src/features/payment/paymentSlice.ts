import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState  } from '../../app/store';


const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        openCheckoutForm : false,
        shippingInfo: {
            id: 0,
            firstName: "",
            lastName: "",
            userProfile: 0,
            created_on: "",
            img:"",
            postCode:"",
            address1:"",
            address2:"",
            phoneNumber:""
        }
    },
    reducers: {

        setOpenCheckoutForm(state) {
            state.openCheckoutForm = true;
        },
        resetOpenCheckoutForm(state) {
            state.openCheckoutForm = false;
        },
        editFirstname(state, action) {
            state.shippingInfo.firstName = action.payload;
        },
        editLastname(state, action) {
            state.shippingInfo.lastName = action.payload;
        },
        editPostCode(state, action) {
            state.shippingInfo.postCode = action.payload;
        },
        editAddress1(state, action) {
            state.shippingInfo.address1 = action.payload;
        },
        editAddress2(state, action) {
            state.shippingInfo.address2 = action.payload;
        },
        editPhoneNumber(state, action) {
            state.shippingInfo.phoneNumber = action.payload;
        },
        
    },

    // extraReducer追加
    extraReducers: (builder) => {

    }
  })

  // reducerに関するものを登録
  export const {
    setOpenCheckoutForm,
    resetOpenCheckoutForm,
    editFirstname,
    editLastname,
    editPostCode,
    editAddress1,
    editAddress2,
    editPhoneNumber
  } = paymentSlice.actions

  // 各スライスのstateにアクセスするための関数
  export const selectopenCheckoutForm = (state: RootState) => state.payment.openCheckoutForm;
  export const selectShippingInfo = (state: RootState) => state.payment.shippingInfo;
 
  export default paymentSlice.reducer;