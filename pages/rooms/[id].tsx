import React from 'react';
import { useRouter } from 'next/router';
import { Axios } from '@/core/axios';

import { Header, BackButton, Room } from '@/components';
import { Api } from '../../api';
import { checkAuth } from '../../utils/checkAuth';

export default function RoomPage({ room }) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Header />
      <div className="container mt-40">
        <BackButton title="All rooms" href="/rooms" />
      </div>
      <Room title={room.title} avatars={room.avatars} guests={room.guests} />
    </>
  );
}

// запускається на стороні сервера
export const getServerSideProps = async (ctx) => {
  try {
    const user = await checkAuth(ctx);
    if (!user) {
      return {
        props: {},
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }

    const roomId = ctx.query.id;
    const room = await Api(ctx).getRoom(roomId as string);

    return {
      props: {
        room,
      },
    };
  } catch (error) {
    console.log('ERROR!');
    return {
      props: {},
      redirect: {
        destination: "/rooms",
        permanent: false,
      }
    };
  }
};
