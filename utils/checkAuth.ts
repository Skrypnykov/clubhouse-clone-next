//import { GetServerSidePropsContext } from "next";
import { UserData } from "../pages";
import { Api } from "../api";
import { AnyAction, Store } from "@reduxjs/toolkit";
import { RootState } from "../redux/types";

export const checkAuth = async (
  ctx: any & {
    store: Store<RootState, AnyAction>;
  }
): Promise<UserData | null> => {
  try {
    return await Api(ctx).getMe();
  } catch (error) {
    return null;
  }
};
