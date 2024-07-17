import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface TaskState {
    tasks: Array<any>;
  }

const initialState: TaskState = {
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