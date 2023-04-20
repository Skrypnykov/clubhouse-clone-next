import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { Header, Button, ConversationCard, StartRoomModal } from "@/components";
import { checkAuth } from "../utils/checkAuth";
import { Api } from "../api";
import { Room } from "../api/RoomApi";
import { GetServerSideProps, NextPage } from "next";

interface RoomsPageProps {
  rooms: Room[];
}

const RoomsPage: NextPage<RoomsPageProps> = ({ rooms }) => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  
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
            <Link key={obj.id} href={`/rooms/${obj.id}`}>
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

// запускається на стороні сервера
export const getServerSideProps: GetServerSideProps<RoomsPageProps> = async (
  ctx
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
    //ctx.store.dispatch(setRooms(rooms));

    return {
      props: {
        user,
        rooms,
      },
    };
  } catch (error) {
    console.log("ERROR!");
    return {
      props: {
        rooms: [],
      },
    };
  }
};

export default RoomsPage;
