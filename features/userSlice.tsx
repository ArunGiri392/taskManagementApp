import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserDetails {
    uid?: string;
    name?: string;
    email?: string;
  }
  
  interface UserState {
    isLoggedIn: boolean;
    userDetails: UserDetails;
  }
const initialState: UserState = {
 isLoggedIn:false,
 userDetails:{}
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        userLogin: (state,action: PayloadAction<UserDetails>)=>{
            if(action.payload){
                state.isLoggedIn = true;
                state.userDetails = action.payload;
                
            }
        },
        userLogout: (state)=>{
            state.isLoggedIn = false;
            state.userDetails = {};
        }
    }
})

export const {userLogin,userLogout} = userSlice.actions;
export default userSlice.reducer;