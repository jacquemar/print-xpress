import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ticketList: [],
  currentTicketNumber: "",
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    addTicketNumber: (state, action) => {
      if (!Array.isArray(state.ticketList)) {
        state.ticketList = [];
      }
      if (!state.ticketList.includes(action.payload)) {
        state.ticketList.push(action.payload);
      }
    },
    setTicketNumber: (state, action) => {
      state.currentTicketNumber = action.payload;
    },
    setTicketList: (state, action) => {
      state.ticketList = Array.isArray(action.payload) ? action.payload : [];
    },
    resetTicketList: (state) => {
      state.ticketList = [];
    },
  },
});

export const {
  addTicketNumber,
  setTicketNumber,
  setTicketList,
  resetTicketList,
} = ticketSlice.actions;

export default ticketSlice.reducer;
