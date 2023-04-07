import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import { Button } from '@/components';

import styles from './Room.module.scss';


interface RoomProps {
  title: string;
}

export const Room: React.FC<RoomProps> = ({ title }) => {

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

      <div className="users">
        {/* 
        {users.map((obj) => (
          <Speaker key={obj.fullname} {...obj} />
        ))} */}

        Speeker
      </div>
    </div>
  );
};
