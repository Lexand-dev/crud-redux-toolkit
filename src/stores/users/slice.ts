import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const DEFAULT_STATE = [
  {
    id: "1",
    name: "Peter Doe",
    email: "peterdd@gmail.com",
    github: "peterdd",
  },
  {
    id: "3",
    name: "alexander flores",
    email: "alexflow@gmail.com",
    github: "Lexand-dev",
  },
  {
    id: "4",
    name: "joseph smith",
    email: "joshsmith@gmail.com",
    github: "joshsmith",
  }
]

export type UserId = string;

export interface User {
  name: string;
  email: string;
  github: string;
}

export interface UserWithId extends User {
  id: string;
}

const initialState: UserWithId[] = (() => {
  const persistedState = localStorage.getItem("reduxState");
  if (persistedState) {
    return JSON.parse(persistedState).users;
  }
  return DEFAULT_STATE;

})()


export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addNewUser: (state, action: PayloadAction<User>) => {
      const id = crypto.randomUUID();
      state.push({ id, ...action.payload }); // se puede mutar el estado porque se usa immer
    },
    removeUser: (state, action: PayloadAction<UserId>) => {
      return state.filter((user) => user.id !== action.payload);
    },
    updateUser: (state, action) => {
      const index = state.findIndex((user) => user.id === action.payload.id);
      state[index] = action.payload;
    },
    rollbackUser: (state, action: PayloadAction<UserWithId>) => {
      const isUserAlreadyDefined = state.some((user) => user.id === action.payload.id);
      if (!isUserAlreadyDefined) {
        state.push(action.payload);
      }
    }
  },
});

export default usersSlice.reducer;

export const { addNewUser, removeUser, updateUser, rollbackUser} = usersSlice.actions;