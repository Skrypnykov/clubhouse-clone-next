import React from 'react';
import clsx from 'clsx';
import { PatternFormat } from 'react-number-format';
import { WhiteBlock } from '../../WhiteBlock';
import { Button } from '../../Button';
import { StepInfo } from '../../StepInfo';

import styles from './EnterPhoneStep.module.scss';
import { MainContext } from '@/pages';
import { Axios } from '@/core/axios';

type InputValueState = {
  formattedValue: string;
  value: string;
}

export const EnterPhoneStep: React.FC = () => {
  const { onNextStep, setFieldValue } = React.useContext(MainContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<InputValueState>({} as InputValueState);
  const nextDisabled = !inputValue.formattedValue || inputValue.formattedValue.includes('_');

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      await Axios.get(`/auth/sms?phone=${inputValue.value}`);
      setFieldValue('phone', inputValue.value);
      onNextStep();
    } catch (error) {
      console.warn('Помилка при відправці SMS', error)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.block}>
      <StepInfo
        icon="/static/phone.png"
        title="Enter your phone #"
        description="We will send you a confirmation code"
      />
      <WhiteBlock className={clsx('m-auto mt-30', styles.whiteBlock)}>
        <div className={clsx('mb-30', styles.input)}>
          <img src="/static/ukraine-flag.png" alt="flag" width={24} />
          <img src="/static/plus_icon.svg" alt="plus" width={16} />
          <PatternFormat
            className="field"
            format="### (##) ###-##-##"
            allowEmptyFormatting={false}
            mask="_"
            value={inputValue.formattedValue}
            onValueChange={({ formattedValue, value }) => setInputValue({ formattedValue, value })}
            placeholder="380 (95) 123-45-67"
          />
        </div>
        <Button disabled={isLoading || nextDisabled} onClick={onSubmit}>
          {isLoading ? (
            'Sending...'
          ) : (
            <>
              Next
              <img className="d-ib ml-10" src="/static/arrow.svg" />
            </>
          )}
        </Button>
        <p className={clsx(styles.policyText, 'mt-30')}>
          By entering your number, you’re agreeing to our Terms of Service and Privacy Policy.
          Thanks!
        </p>
      </WhiteBlock>
    </div>
  );
};