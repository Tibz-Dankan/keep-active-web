import { useAppSelector } from "@/hooks/redux";
import { TApp } from "@/types/app";
import { elapsedTime } from "@/utils/elapsedTime";
import React, { useEffect, useState } from "react";

interface LastRequestTimeProps {
  appId: string;
}

export const LastRequestTime: React.FC<LastRequestTimeProps> = (props) => {
  const app = useAppSelector((state) =>
    state.app.apps.find((app) => app.id == props.appId)
  ) as TApp;

  const appLiveRequest = useAppSelector((state) => state.appLiveRequest);
  const liveApp = appLiveRequest?.apps[`${props.appId}`] as TApp;

  const currentApp = liveApp ? liveApp : app;

  const startedAt = currentApp.requests
    ? currentApp.requests[0]?.startedAt
    : "";

  const [elapseTime, setElapseTime] = useState(
    startedAt ? elapsedTime(startedAt) : "N/A"
  );

  // update startedAt value at the
  // start of every minute and after
  // every 30 seconds
  useEffect(() => {
    const updateElapsedTime = () => {
      if (!startedAt) return;
      setElapseTime(() => elapsedTime(startedAt));
    };

    const now = new Date();
    const delayToNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    const initialTimeoutId = setTimeout(() => {
      updateElapsedTime();
      const intervalId = setInterval(updateElapsedTime, 30000);

      return () => clearInterval(intervalId);
    }, delayToNextMinute);

    return () => clearTimeout(initialTimeoutId);
  }, [startedAt]);

  return (
    <div>
      <span>{elapseTime}</span>
    </div>
  );
};
