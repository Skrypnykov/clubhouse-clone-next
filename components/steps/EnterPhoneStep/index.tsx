import React from 'react';
import clsx from 'clsx';
import { PatternFormat } from 'react-number-format';
import { WhiteBlock } from '../../WhiteBlock';
import { Button } from '../../Button';
import { StepInfo } from '../../StepInfo';

import styles from './EnterPhoneStep.module.scss';
import { MainContext } from '@/pages';

type InputValueState = {
  formattedValue: string;
  value: string;
}

export const EnterPhoneStep: React.FC = () => {

  const [inputValue, setInputValue] = React.useState<InputValueState>({} as InputValueState);
  const nextDisabled = !inputValue.formattedValue || inputValue.formattedValue.includes('_');

  const { onNextStep } = React.useContext(MainContext);

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
          <PatternFormat
            className="field"
            format="+380 (##) ###-##-##"
            allowEmptyFormatting
            mask="_"
            value={inputValue.formattedValue}
            onValueChange={({ formattedValue, value }) => setInputValue({ formattedValue, value })}
          />
        </div>
        <Button disabled={nextDisabled} onClick={onNextStep}>
          Next
          <img className="d-ib ml-10" src="/static/arrow.svg" />
        </Button>
        <p className={clsx(styles.policyText, 'mt-30')}>
          By entering your number, you’re agreeing to our Terms of Service and Privacy Policy.
          Thanks!
        </p>
      </WhiteBlock>
    </div>
  );
};