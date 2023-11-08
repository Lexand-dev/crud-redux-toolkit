import { User, UserId, addNewUser, removeUser } from "../stores/users/slice";
import { useAppDispatch } from "./store";

export const useUserActions = () => {
  const dispatch = useAppDispatch();
  
  const addUser = ({name, email, github}: User ) => {
    dispatch(addNewUser({ name, email, github }));
  }
  const deleteUserById = (id: UserId) => {
    dispatch(removeUser(id));
  }

  return { deleteUserById, addUser };
}