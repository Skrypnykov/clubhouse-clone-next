import React from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Socket, io } from "socket.io-client";

import { Button, Speaker } from "../../components";
import { UserData } from "../../pages";
import { selectUserData } from "../../redux/selectors";

import styles from "./Room.module.scss";

interface RoomProps {
  title: string;
}

export const Room: React.FC<RoomProps> = ({ title }) => {
  const router = useRouter();
  const user = useSelector(selectUserData);
  const [users, setUsers] = React.useState<UserData[]>([]);

  const socketRef = React.useRef<Socket>();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      socketRef.current = io("http://localhost:3001");

      socketRef.current.emit("CLIENT@ROOM:JOIN", {
        user,
        roomId: router.query.id,
      });

      socketRef.current.on("SERVER@ROOM:LEAVE", (user: UserData) => {
        setUsers((prev) => prev.filter((obj) => obj.id !== user.id));
      });

      socketRef.current.on("SERVER@ROOM:JOIN", (allUsers) => {
        console.log('allUsers', allUsers);
        setUsers(allUsers);
      });

      setUsers((prev) => [...prev, user]);
    }

    return () => {
      socketRef.current.disconnect();
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

      <div className={styles.users}>
        {users.map((obj) => (
          <Speaker key={obj.fullname} {...obj} />
        ))}
      </div>
    </div>
  );
};
