import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import { Avatar } from '../Avatar';

import styles from './Header.module.scss';

//import { selectUserData } from '../../redux/selectors';

export const Header:React.FC = () => {
  //const userData = useSelector(selectUserData);
  return (
    <div className={styles.header}>
      <div className="container d-flex align-items-center justify-content-between">
        <Link href="/rooms">
          <div className={clsx(styles.headerLogo, 'd-flex align-items-center cup')}>
            <img src="/static/hand-wave.png" alt="Logo" className="mr-5"/>
            <h4>Clubhouse</h4>
          </div>
        </Link>
        <Link href="/profile/1">
          <div className="d-flex align-items-center cup">
            <b className="mr-15">Skrypnykov Oleh</b>
            <Avatar
              src="/static/avatar-so.jpg"
              width="40px"
              height="40px"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};
