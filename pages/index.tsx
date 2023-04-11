import React from "react";

import { WelcomeStep } from "../components/steps/WelcomeStep";
import { GitHubStep } from '../components/steps/GitHubStep';
import { EnterNameStep } from '../components/steps/EnterNameStep';
import { ChooseAvatarStep } from '../components/steps/ChooseAvatarStep';
import { EnterPhoneStep } from '../components/steps/EnterPhoneStep';
import { EnterCodeStep } from '../components/steps/EnterCodeStep';

const stepsComponents = {
  0: WelcomeStep,
  1: GitHubStep,
  2: EnterNameStep,
  3: ChooseAvatarStep,
  4: EnterPhoneStep,
  5: EnterCodeStep,
};

export type UserData = {
  id: number;
  fullname: string;
  avatarUrl: string;
  isActive: number;
  username: string;
  phone: string;
  token?: string;
};

type MainContextProps = {
  onNextStep: () => void;
  step: number;
};

export const MainContext = React.createContext<MainContextProps>({} as MainContextProps);

export default function Home() {

  const [step, setStep] = React.useState<number>(0);
  const Step = stepsComponents[step];

  const [userData, setUserData] = React.useState();

  const onNextStep = () => {
    setStep((prev) => prev + 1);
  }

  return (
    <main>
      <style jsx>
        {`
          main {
            display: grid;
            grid-template-rows: 100vh;
            align-items: center;
          }
        `}
      </style>
      <MainContext.Provider value={{ step, onNextStep }}>
        <Step />
      </MainContext.Provider>
    </main>
  );
}
