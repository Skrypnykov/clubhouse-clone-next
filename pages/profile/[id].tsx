import React from "react";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { UserData } from "..";
import { ParsedUrlQuery } from "node:querystring";
import { AnyAction, Store } from "@reduxjs/toolkit";
import { RootState } from "../../redux/types";

import { Header, Profile } from "../../components";
import { checkAuth } from "../../utils/checkAuth";
import { Api } from "../../api";
import { wrapper } from "../../redux/store";

interface ProfilePageProps {
  profileData: UserData | null;
}

const ProfilePage: NextPage<ProfilePageProps> = ({ profileData }) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Header />
      <div className="container mt-30">
        <Profile
          avatarUrl={profileData?.avatarUrl}
          fullname={profileData?.fullname}
          username={profileData?.username}
          phone={profileData?.phone}
          about={profileData?.about}
        />
      </div>
    </>
  );
};

// запускається на стороні сервера
export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(
    async (
      ctx: GetServerSidePropsContext<ParsedUrlQuery> & {
        store: Store<RootState, AnyAction>;
      }
    ) => {
      try {
        const user = await checkAuth(ctx);

        const userId = ctx.query.id;
        const profileData = await Api(ctx).getUserInfo(Number(userId));

        if (!user || !profileData) {
          throw new Error();
        }

        return {
          props: {
            profileData,
          },
        };
      } catch (error) {
        return {
          props: {},
          redirect: { permanent: false, destination: "/" },
        };
      }
    }
  );

export default ProfilePage;
