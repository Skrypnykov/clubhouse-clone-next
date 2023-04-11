import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import { Button, Speaker, SpeakerProps } from '@/components';

import styles from './Room.module.scss';


interface RoomProps {
  title: string;
  avatars: string;
  guests: string;
}

export const Room: React.FC<RoomProps> = ({ title, avatars, guests }) => {

  return (
    <div className={styles.wrapper}>
      <audio controls />
      <div className="d-flex align-items-center justify-content-between">
        <h2>{title}</h2>
        <div className={clsx('d-flex align-items-center', styles.actionButtons)}>
          <Link href="/rooms">
            <Button color="gray" className={styles.leaveButton}>
              <img width={18} height={18} src="/static/peace.png" alt="Hand black" />
              Leave quietly
            </Button>
          </Link>
        </div>
      </div>

      <div className={styles.users}>
        <div className={styles.speakers}>
          {/* 
          {users.map((obj) => (
            <Speaker key={obj.fullname} {...obj} />
          ))} */}

          {
            avatars.map((arr, i) => (<img key={i} src={arr} alt="speaker" />))
          }
        </div>
        <hr />
        <div className={styles.guests}>

          {
            guests.map((guests, i) => (<span key={i}>{guests}</span>))
          }
        </div>
      </div>
    </div>
  );
};
