import React from "react";
import clsx from "clsx";
import Peer from "simple-peer";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector } from "react-redux";

import { Button, Speaker } from "../../components";
import { UserData } from "../../pages";
import { useSocket } from "../../hooks/useSocket";
import { selectUserData } from "../../redux/selectors";

import styles from "./Room.module.scss";

interface RoomProps {
  title: string;
}

let peers = [];

export const Room: React.FC<RoomProps> = ({ title }) => {
  const router = useRouter();
  const user = useSelector(selectUserData);
  const [users, setUsers] = React.useState<UserData[]>([]);
  const roomId = router.query.id;
  const socket = useSocket();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      socket.emit("CLIENT@ROOMS:JOIN", {
        user,
        roomId,
      });

      socket.on("SERVER@ROOMS:LEAVE", (user: UserData) => {
        setUsers((prev) => prev.filter((obj) => obj.id !== user.id));
      });

      socket.on("SERVER@ROOMS:JOIN", (allUsers: UserData[]) => {
        setUsers(allUsers);
      });

      //setUsers((prev) => [...prev, user]);
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <audio controls />
      <div className="d-flex align-items-center justify-content-between">
        <h2>{title}</h2>
        <div
          className={clsx("d-flex align-items-center", styles.actionButtons)}
        >
          <Link href="/rooms">
            <Button color="gray" className={styles.leaveButton}>
              <img
                width={18}
                height={18}
                src="/static/peace.png"
                alt="Hand black"
              />
              Leave quietly
            </Button>
          </Link>
        </div>
      </div>

      <div className={styles.speakers}>
        {users.map((obj) => (
          <Speaker key={obj.id} {...obj} />
        ))}
      </div>
    </div>
  );
};
