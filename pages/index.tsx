import React from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "node:querystring";
import { AnyAction, Store } from "@reduxjs/toolkit";
import { RootState } from "../redux/types";
import { Axios } from "../core/axios";
import { checkAuth } from "../utils/checkAuth";
import { wrapper } from "../redux/store";

import {
  WelcomeStep,
  GitHubStep,
  EnterNameStep,
  ChooseAvatarStep,
  EnterPhoneStep,
  EnterCodeStep,
} from "../components/steps";

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
  about: string;
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

export const getUserData = (): UserData | null => {
  try {
    return JSON.parse(window.localStorage.getItem("userData"));
  } catch (error) {
    return null;
  }
};

const getFormStep = (): number => {
  const json = getUserData();
  if (json) {
    if (json.phone) {
      return 5;
    } else {
      return 4;
    }
  }
  return 0;
};

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

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const json = getUserData();
      if (json) {
        setUserData(json);
        setStep(getFormStep());
      }
    }
  }, []);

  React.useEffect(() => {
    if (userData) {
      window.localStorage.setItem("userData", JSON.stringify(userData));
      Axios.defaults.headers.Authorization = "Bearer " + userData.token;
    }
  }, [userData]);

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
      <MainContext.Provider
        value={{ step, onNextStep, userData, setUserData, setFieldValue }}
      >
        <Step />
      </MainContext.Provider>
    </main>
  );
}

// запускається на стороні сервера
export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(
    async (
      ctx: GetServerSidePropsContext<ParsedUrlQuery> & {
        store: Store<RootState, AnyAction>;
      }
    ) => {
      try {
        const user = await checkAuth(ctx);

        if (user) {
          return {
            props: {},
            redirect: {
              destination: "/rooms",
              permanent: false,
            },
          };
        }
      } catch (err) { }

      return { props: {} };
    }
  );
