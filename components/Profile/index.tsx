import React from "react";
import clsx from "clsx";
import { Avatar, Button, BackButton } from "../../components";

import styles from "./Profile.module.scss";

interface ProfileProps {
  fullname: string;
  username: string;
  avatarUrl: string;
  phone: string;
  about: string;
}

export const Profile: React.FC<ProfileProps> = (props) => {
  return (
    <>
      <BackButton title="Back" href="/rooms" />
      <div className={clsx(styles.profile,"d-flex align-items-center")}>
        <div className="d-flex align-items-center">
          <Avatar src={props.avatarUrl} width="100px" height="100px" />
          <div className="d-flex flex-column ml-30 mr-30">
            <h2 className="mt-0 mb-0">{props.fullname}</h2>
            <h3 className={clsx(styles.username, "mt-0 mb-0")}>
              @{props.username}
            </h3>
            <h3 className={clsx(styles.phone, "mt-5 mb-0")}>
              phone: {props.phone ? "+" + props.phone : "інформація відсутня"}
            </h3>
          </div>
        </div>
        <Button className={styles.followButton} color="blue">
          Follow
        </Button>
      </div>
      <p className={styles.about}>{props.about}</p>
    </>
  );
};
