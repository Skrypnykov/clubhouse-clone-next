import { GetServerSidePropsContext } from "next";
import { UserData } from "../pages";
import { Api } from "../api";

export const checkAuth = async (ctx: GetServerSidePropsContext): Promise<UserData | null> => {
  try {
    return await Api(ctx).getMe();
  } catch (error) {
    return null;
  }
};
