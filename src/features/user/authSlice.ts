import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState  } from '../../app/store';
import axios from "axios";
import { PROPS_PROFILE, PROPS_AUTHEN, PROPS_NICKNAME} from "../types"

const apiURL = process.env.REACT_APP_DEV_API_URL;

// ログイン時処理
export const fetchAsyncLogin = createAsyncThunk (
    "auth/post",
    async(authen: PROPS_AUTHEN) => {
        const res = await axios.post(`${apiURL}authen/jwt/create`, authen, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        return res.data;
    }
);

// ユーザ登録処理
export const fetchAsyncRegister = createAsyncThunk(
    "auth/register",
    async (auth: PROPS_AUTHEN) => {
        const res = await axios.post(`${apiURL}api/register/`, auth, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        return res.data;
    }
);

// ユーザ情報更新処理
export const fetchAsyncUpdateProf = createAsyncThunk(
    "profile/put",
    async (profile: PROPS_PROFILE) => {
        // formデータのオブジェクト作成
        const uploadData = new FormData();
        uploadData.append("nickName", profile.nickName);
        uploadData.append("postCode", profile.postCode);
        uploadData.append("address1", profile.address1);
        uploadData.append("address2", profile.address2);
        uploadData.append("phoneNumber", profile.phoneNumber);
        // イメージがあった場合に処理をする
        profile.img && uploadData.append("img", profile.img, profile.img.name);
        const res = await axios.put(`${apiURL}api/profile/${profile.id}/`, uploadData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.localJWT}`
            },
        });
        return res.data;
    }
);

export const fetchAsyncGetProfs = createAsyncThunk(
    "profiles/get",
    async () => {
        const res = await axios.get(`${apiURL}api/profile/`);
        return res.data;
    }
);

export const fetchAsyncCreateProf = createAsyncThunk(
    "profile/post",
    async (nickName: PROPS_NICKNAME) => {
        const res = await axios.post(`${apiURL}api/profile/`, nickName, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.localJWT}`
            },
        });
        return res.data;
    }
);

// 自分のプロフィール取得
export const fetchAsyncGetMyProf = createAsyncThunk(
    "profile/get",
    async () => {
        const res = await axios.get(`${apiURL}api/myprofile/`, {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`
            },
        });
        return res.data[0];
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        openSignIn : false,
        openSignUp : false,
        openProfile: false,
        // APIとの通信中にtrueになる
        isLoadingAuth: false,
        // ログインしているユーザを管理するためのState
        myprofile: {
            id: 0,
            nickName: "",
            userProfile: 0,
            created_on: "",
            img:"",
            postCode:"",
            address1:"",
            address2:"",
            phoneNumber:"",
        },
        profiles: [
            {
                id: 0,
                nickName: "",
                userProfile: 0,
                created_on: "",
                img: "",
            }
        ],
    },
    reducers: {
        fetchCredStart(state) {
            state.isLoadingAuth = true;
        },
        fetchCredEnd(state) {
            state.isLoadingAuth = false;
        },
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
        setOpenProfile(state) {
            state.openProfile = true;
        },
        resetOpenProfile(state) {
            state.openProfile = false;
        },
        editNickname(state, action) {
            state.myprofile.nickName = action.payload;
        },
        editPostCode(state, action) {
            state.myprofile.postCode = action.payload;
        },
        editAddress1(state, action) {
            state.myprofile.address1 = action.payload;
        },
        editAddress2(state, action) {
            state.myprofile.address2 = action.payload;
        },
        editPhoneNumber(state, action) {
            state.myprofile.phoneNumber = action.payload;
        },
    },

    // extraReducer追加
    extraReducers: (builder) => {
        // fetchAsyncLoginメソッドがfulfilledだった場合の処理
        // ログインが成功した場合はJWTをローカルストレージに格納
        builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
            localStorage.setItem("localJWT", action.payload.access);
        });

        builder.addCase(fetchAsyncCreateProf.fulfilled, (state, action) => {
            state.myprofile = action.payload;
        });
        
        builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action) => {
            state.profiles = action.payload;
        });
        builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
            state.myprofile = action.payload;
        });
    }
  })

  


  // reducerに関するものを登録
  export const {
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    fetchCredStart,
    fetchCredEnd,
    resetOpenProfile,
    editNickname,
    setOpenProfile,
    editPostCode,
    editAddress1,
    editAddress2,
    editPhoneNumber, 
  } = authSlice.actions

  // 各スライスのstateにアクセスするための関数
  export const selectIsLoadingAuth = (state: RootState) => state.auth.isLoadingAuth;
  export const selectOpenSignIn = (state: RootState) => state.signIn.openSignIn;
  export const selectOpenSignUp = (state: RootState) => state.signUp.openSignUp;
  export const selectProfiles = (state: RootState) => state.auth.profiles;
  export const selectProfile = (state: RootState) => state.auth.myprofile;
  export const selectOpenProfile = (state: RootState) => state.auth.openProfile;
  

  export default authSlice.reducer;
