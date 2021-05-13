import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import signInReducer from '../features/user/authSlice';
import signUpReducer from '../features/user/authSlice';
import postReducer from '../features/post/postSlice';
import authReducer from '../features/user/authSlice';
import cartReducer from '../features/cart/cartSlice';
import purchaseReducer from '../features/purchase/purchaseSlice';
import paymentReducer from '../features/payment/paymentSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    signIn: signInReducer,
    signUp: signUpReducer,
    post: postReducer,
    auth: authReducer,
    cart: cartReducer,
    purchase: purchaseReducer,
    payment: paymentReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// storeのdispatchの型を定義
export type AppDispatch = typeof store.dispatch;