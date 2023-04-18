import React from 'react';
import Link from 'next/link';

import { Axios } from '@/core/axios';
import { Header, Button, ConversationCard, StartRoomModal } from '@/components';
import { checkAuth } from '../utils/checkAuth';

export default function RoomsPage({ rooms = [] }) {
  const [visibleModal, setVisibleModal] = React.useState(false);

  return (
    <>
      <Header />
      <div className="container">
        <div className="mt-40 d-flex align-items-center justify-content-between">
          <h1>All conversations</h1>
          <Button
            onClick={() => {
              setVisibleModal(true);
            }}
            color="green">
            + Start room
          </Button>
        </div>
        {visibleModal && (
          <StartRoomModal
            onClose={() => {
              setVisibleModal(true);
            }}
          />
        )}
        <div className="grid mt-30 mb-40">
          {rooms.map((obj) => (
            <Link key={obj.id} href={`/rooms/${obj.id}`}>
              <ConversationCard
                title={obj.title}
                avatars={obj.avatars}
                guests={obj.guests}
                guestsCount={obj.guestsCount}
                speakersCount={obj.speakersCount}
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

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
    
    const { data } = await Axios.get('http://localhost:3000/rooms.json');
    return {
      props: {
        user,
        rooms: data,
      },
    };
  } catch (error) {
    console.log('ERROR!');
    return {
      props: {
        rooms: [],
      },
    };
  }
};
