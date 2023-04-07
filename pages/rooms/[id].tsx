import React from 'react';
import { useRouter } from 'next/router';

import { Header, BackButton, Room } from '@/components';
import Axios from '../../core/axios';

export default function RoomPage({ room }) {
  const router = useRouter();
  const { id } = router.query;

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
export const getServerSideProps = async (context) => {
  try {
    const { data } = await Axios.get('/rooms.json');
    const roomId = context.query.id;
    const room = data.find((obj) => obj.id === roomId );
    return {
      props: {
        room,
      },
    };
  } catch (error) {
    console.log('ERROR!');
    return {
      props: {},
    };
  }
};
