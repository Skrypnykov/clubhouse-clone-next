import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';

import { StepInfo, WhiteBlock } from '../../../components';
import { MainContext } from '../../../pages';
import { Axios } from '../../../core/axios';

import styles from './EnterCodeStep.module.scss';

export const EnterCodeStep: React.FC = () => {
  const router = useRouter();
  const { userData } = React.useContext(MainContext);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [codes, setCodes] = React.useState(['', '', '', '']);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(event.target.getAttribute('id'));
    const value = event.target.value;
    setCodes((prev) => {
      const newArr = [...prev];
      newArr[index] = value;
      return newArr;
    });
    if (event.target.nextSibling) {
      (event.target.nextSibling as HTMLInputElement).focus();
    } else {
      onSubmit([...codes, value].join(''));
    }
  };

  const onSubmit = async (code: string) => {
    try {
      setIsLoading(true);
      await Axios.post(`/auth/sms/activate`, {
        code,
        user: userData,
      });
      router.push('/rooms');

    } catch (error) {
      alert('Помилка активації!');
      setCodes(['', '', '', '']);
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.block}>
      {!isLoading ? (
        <>
          <StepInfo icon="/static/numbers.png" title="Enter your activate code" />
          <WhiteBlock className={clsx('m-auto mt-30 mb-50', styles.whiteBlock)}>
            <div className={styles.codeInput}>
              {codes.map((code, index) => (
                <input
                  key={index}
                  type="tel"
                  placeholder="X"
                  maxLength={1}
                  id={String(index)}
                  onChange={handleChangeInput}
                  value={code}
                />
              ))}
            </div>
          </WhiteBlock>
        </>
      ) : (
        <div className="text-center">
          <div className="loader"></div>
          <h3 className="mt-5">Activation in progress ...</h3>
        </div>
      )}
    </div>
  );
};