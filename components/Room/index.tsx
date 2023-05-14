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

  const constraints = {
    audio: true,
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          socket.emit("CLIENT@ROOMS:JOIN", {
            user,
            roomId,
          });

          socket.on("SERVER@ROOMS:JOIN", (allUsers: UserData[]) => {
            //console.log("allUsers", allUsers);

            setUsers(allUsers);

            allUsers.forEach((speaker) => {
              if (
                user.id !== speaker.id &&
                !peers.find((obj) => obj.id !== speaker.id)
              ) {
                const peerIncome = new Peer({
                  initiator: true,
                  trickle: false,
                  stream,
                });

                // Отримали сигнал від ICE-сервера та просимо всіх учасників зателефонувати мені
                peerIncome.on("signal", (signal) => {
                  //console.log("peerIncome:", signal);
                  console.log(
                    "1. СИГНАЛ СТВОРЕНИЙ. ПРОСИМО КОРИСТУВАЧА " +
                      speaker.fullname +
                      " НАМ ЗАТЕЛЕФОНУВАТИ"
                  );
                  socket.emit("CLIENT@ROOMS:CALL", {
                    targetUserId: speaker.id,
                    callerUserId: user.id,
                    roomId,
                    signal,
                  });
                  peers.push({
                    peer: peerIncome,
                    id: speaker.id,
                  });
                  //console.log("PEERS", peers);
                });

                socket.on(
                  "SERVER@ROOMS:CALL",
                  ({ targetUserId, callerUserId, signal: callerSignal }) => {
                    console.log(
                      "2. КОРИСТУВАЧ " +
                        callerUserId +
                        " ПІДКЛЮЧИВСЯ, ТЕЛЕФОНУЄМО!"
                    );

                    const peerOutcome = new Peer({
                      initiator: false,
                      trickle: false,
                      stream,
                    });

                    // Дзвонимо людині і чекаємо сигнал, який нам потрібно передати назад
                    // користувачеві у відповідь
                    peerOutcome.signal(callerSignal);

                    peerOutcome
                      // Отримуємо сигнал від ICE-сервера і відправляємо його користувачеві,
                      // щоб він отримав наш сигнал для з'єднання
                      .on("signal", (outSignal) => {
                        console.log(
                          "3. ОТРИМАЛИ НАШ СИГНАЛ, ВІДПРАВЛЯЄМО У ВІДПОВІДЬ КОРИСТУВАЧЕВІ " +
                            callerUserId
                        );
                        socket.emit("CLIENT@ROOMS:ANSWER", {
                          targetUserId: callerUserId,
                          callerUserId: targetUserId,
                          roomId,
                          signal: outSignal,
                        });
                        //console.log("peerOutcome:", outSignal);
                      })
                      // Коли нам відповіли, відтворюємо звук
                      .on("stream", (stream) => {
                        document.querySelector("audio").srcObject = stream;
                        document.querySelector("audio").play();
                      });
                  }
                );

                socket.on("SERVER@ROOMS:ANSWER", ({ callerUserId, signal }) => {
                  const obj = peers.find(
                    (obj) => Number(obj.id) === Number(callerUserId)
                  );
                  if (obj.peer) {
                    obj.peer.signal(signal);
                  }
                  console.log("4. МИ ВІДПОВІЛИ КОРИСТУВАЧЕВІ: ", callerUserId);
                });
              }
            });
          });

          socket.on("SERVER@ROOMS:LEAVE", (leaveUser: UserData) => {
            console.log(leaveUser.id, peers);
            setUsers((prev) =>
              prev.filter((prevUser) => {
                const peerUser = peers.find(
                  (obj) => Number(obj.id) === Number(leaveUser.id)
                );
                if (peerUser) {
                  peerUser.peer.on("close", () => {});
                }
                return prevUser.id !== leaveUser.id;
              })
            );
          });
        })
        .catch(() => {
          console.error("Немає доступу до мікрофона!");
        });

      return () => {
        socket.disconnect();
        //console.log("disconnect: ", socket);

        peers.forEach((obj) => {
          //obj.peer.destroy();
          obj.peer.on("close", () => {});
        });
      };
    }

    return () => {
      peers.forEach((obj) => {
        obj.peer.destroy();
      });
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
          <Link href="/rooms" passHref>
            <a>
              <Button color="gray" className={styles.leaveButton}>
                <img
                  width={18}
                  height={18}
                  src="/static/peace.png"
                  alt="Hand black"
                />
                Leave quietly
              </Button>
            </a>
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
