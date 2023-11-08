import { configureStore, type Middleware } from "@reduxjs/toolkit";
import { toast } from "sonner";
import usersReducer, { rollbackUser, UserWithId } from "./users/slice";


const persistanceLocalStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  localStorage.setItem("reduxState", JSON.stringify(store.getState()));
  return result;
}

const syncWithDatabaseMiddleware: Middleware = (store) => (next) => (action) => {
  const { type, payload } = action;
  const previousState = store.getState();
  next(action);
  // sync with database 
  if (type === "users/removeUser") { // eliminando un usuario
    const userToRemove = previousState.users.find((user: UserWithId) => user.id === payload);
    const userIdToRemove = payload;

    fetch(`https://jsonplaceholder.typicode.jj/users/${userIdToRemove}`, {
      method: "DELETE"
    })
      .then(res => {
        if (res.ok) {
          toast.success(`User ${userIdToRemove} deleted from database`);
        }
        throw new Error("Error deleting user from database");
      })
      .catch(err => {
        toast.error(`Error deleting user ${userIdToRemove} from database`);
        if (userToRemove) {
          store.dispatch(rollbackUser(userToRemove));
        }
        console.error(err);
      })
  }
}

export const store = configureStore({
  reducer: {
    users: usersReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
    .concat(persistanceLocalStorageMiddleware, syncWithDatabaseMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

