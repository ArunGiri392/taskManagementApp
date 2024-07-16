import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 tasks: []
}

export const taskSlice = createSlice({
    name:'task',
    initialState,
    reducers:{
        updateTasks:(state,action)=>{
            if(action.payload){
                state.tasks=action.payload
            }
        }
    }
})

export const {updateTasks} = taskSlice.actions;
export default taskSlice.reducer;