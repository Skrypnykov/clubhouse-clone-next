import React from 'react';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import { WhiteBlock, Button, StepInfo } from '../../../components';
import { MainContext, UserData } from '../../../pages';
import styles from './GitHubStep.module.scss';

export const GitHubStep: React.FC = () => {
  const { onNextStep, setUserData } = React.useContext(MainContext);

  const onClickAuth = () => {
    const win = window.open(
      'http://192.168.18.100:3001/auth/github',
      'Auth',
      'width=500,height=500,status=yes,toolbar=no,menubar=no,location=no'
    );

    const timer = setInterval(() => {
      if (win.closed) {
        clearInterval(timer);
        onNextStep();
      }
    }, 300);
  };

  React.useEffect(() => {
    window.addEventListener('message', ({ data }) => {
      const user: string = data;
      if (typeof user === 'string' && user.includes('avatarUrl')) {
        Cookies.remove('token');
        const json: UserData = JSON.parse(user);
        setUserData(json);
        Cookies.set('token', json.token);
      }
    });
  }, []);

  return (
    <div className={styles.block}>
      <StepInfo icon="/static/connect.png" title="Do you want import info from GitHub?" />
      <WhiteBlock className={clsx('m-auto mt-40 mb-50', styles.whiteBlock)}>
        <Button
          onClick={onClickAuth}
          className={clsx(styles.button, 'd-i-flex align-items-center')}>
          <img className="d-ib mr-10" src="/static/github.svg" />
          Import from GitHub
          <img className="d-ib ml-10" src="/static/arrow.svg" />
        </Button>
        <div className="link mt-20 cup d-ib">Enter my info manually</div>
      </WhiteBlock>
    </div>
  );
};
