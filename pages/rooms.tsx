import React from "react";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { ParsedUrlQuery } from "node:querystring";
import { AnyAction, Store } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import {
  Header,
  Button,
  ConversationCard,
  StartRoomModal,
} from "../components";

import { checkAuth } from "../utils/checkAuth";
import { Api } from "../api";
import { wrapper } from "../redux/store";
import { RootState } from "../redux/types";
import { setRoomSpeakers, setRooms } from "../redux/slices/roomsSlice";
import { selectRooms } from "../redux/selectors";
import { useSocket } from "../hooks/useSocket";

const RoomsPage: NextPage = () => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const rooms = useSelector(selectRooms);
  const dispatch = useDispatch();
  const socket = useSocket();

  React.useEffect(() => {
    socket.on('SERVER@ROOMS:HOME', ({ roomId, speakers }) => {
      dispatch(setRoomSpeakers({ speakers, roomId }));
    });
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <div className="mt-40 d-flex align-items-center justify-content-between">
          <h1>All conversations</h1>
          <Button
            className="pl-25"
            onClick={() => {
              setVisibleModal(true);
            }}
            color="green"
          >
            + Start room
          </Button>
        </div>
        {visibleModal && (
          <StartRoomModal
            onClose={() => {
              setVisibleModal(false);
            }}
          />
        )}
        <div className="grid mt-30 mb-40">
          {rooms.map((obj) => (
            <Link key={obj.id} href={`/room/${obj.id}`}>
              <ConversationCard
                title={obj.title}
                speakers={obj.speakers}
                listenersCount={obj.listenersCount}
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default RoomsPage;

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

        const rooms = await Api(ctx).getRooms();
        ctx.store.dispatch(setRooms(rooms));

        return {
          props: {},
        };
      } catch (error) {
        console.log("ERROR GETTING ROOMS!!!");
        return {
          props: {
            rooms: [],
          },
        };
      }
    }
  );
