import React from "react";

import {
  WelcomeStep,
  GitHubStep,
  EnterNameStep,
  ChooseAvatarStep,
  EnterPhoneStep,
  EnterCodeStep,
} from "@/components/steps";

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
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  setFieldValue: (field: keyof UserData, value: string) => void;
  step: number;
  userData?: UserData;
};

export const MainContext = React.createContext<MainContextProps>(
  {} as MainContextProps
);

export default function HomePage() {
  const [step, setStep] = React.useState<number>(0);
  const [userData, setUserData] = React.useState<UserData>();
  const Step = stepsComponents[step];

  const onNextStep = () => {
    setStep((prev) => prev + 1);
  };

  // змінює поле в input-e 
  const setFieldValue = (field: string, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  console.log(userData);

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
      <MainContext.Provider value={{ step, onNextStep, userData, setUserData, setFieldValue }}>
        <Step />
      </MainContext.Provider>
    </main>
  );
}
