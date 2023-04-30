import React from "react";
import { AnyAction, Store } from "@reduxjs/toolkit";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "node:querystring";
import { RootState } from "../../redux/types";

import { Header, BackButton, Room } from "../../components";
import { checkAuth } from "../../utils/checkAuth";
import { Api } from "../../api";
import { wrapper } from "../../redux/store";

export default function RoomPage({ room }) {
  
  return (
    <>
      <Header />
      <div className="container mt-40">
        <BackButton title="All rooms" href="/rooms" />
      </div>
      <Room title={room.title} />
    </>
  );
}

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

        if (!user) {
          return {
            props: {},
            redirect: {
              permanent: false,
              destination: "/",
            },
          };
        }

        const roomId = ctx.query.id;
        const room = await Api(ctx).getRoom(roomId as string);

        return {
          props: {
            user,
            room,
          },
        };
      } catch (error) {
        console.log("ROOM ERROR!");
        return {
          props: {},
          redirect: {
            destination: "/rooms",
            permanent: false,
          },
        };
      }
    }
  );
