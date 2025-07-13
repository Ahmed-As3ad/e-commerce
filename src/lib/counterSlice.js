import { createSlice } from "@reduxjs/toolkit";

export let counterSlice = createSlice({
    name:'counterSlice',
    initialState:{counter:0},
    reducers:{
        plus:(state,action)=>{
            state.counter += 1;
        },
        menus:(state,action)=>{
            state.counter -= 1;
        }
    }
})

export let CounterSliceReducer = counterSlice.reducer;
export let {plus,menus} = counterSlice.actions;
