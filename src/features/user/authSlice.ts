import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState  } from '../../app/store';
import axios from "axios";

const authSlice = createSlice({
    name: 'login',
    initialState: {
        openSignIn : false,
        openSignUp : false,


    },
    reducers: {
        setOpenSignIn(state) {
            state.openSignIn = true;
        },
        resetOpenSignIn(state) {
            state.openSignIn = false;
        },
        setOpenSignUp(state) {
            state.openSignUp = true;
        },
        resetOpenSignUp(state) {
            state.openSignUp = false;
        },
    }
  })


  // reducerに関するものを登録
  export const {
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp
  } = authSlice.actions

  // 各スライスのstateにアクセスするための関数
  export const selectOpenSignIn = (state: RootState) => state.signIn.openSignIn;
  export const selectOpenSignUp = (state: RootState) => state.signUp.openSignUp;
  


  export default authSlice.reducer;
