import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../store";

// replaces `useDispatch` so the correct type is available
const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useAppDispatch;
