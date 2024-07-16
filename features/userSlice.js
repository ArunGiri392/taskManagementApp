import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 isLoggedIn:false,
 userDetails:{}
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        userLogin: (state,action)=>{
            if(action.payload){
                state.isLoggedIn = true;
                state.userDetails = action.payload;
                
            }
        },
        userLogout: (state,action)=>{
            state.user.isLoggedIn = false;
            state.user.userDetails = {};
        }
    }
})

export const {userLogin,userLogout} = userSlice.actions;
export default userSlice.reducer;