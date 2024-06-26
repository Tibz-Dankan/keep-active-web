"use client";
import React, { useState } from "react";
import { IconContext } from "react-icons";
import { GiPokecog } from "react-icons/gi";
import Link from "next/link";
import { RequestTimeRangeCard } from "@/app/request/requestTimeRangeCard";
import { PostRequestTimeRange } from "@/app/request/postRequestTimeRange";
import { RequestList } from "@/app/request/requestList";
import { DeleteApp } from "@/app/app/deleteApp";
import { useParams } from "next/navigation";
import { AppService } from "@/services/app.service";
import { useQuery } from "@tanstack/react-query";
import {
  hideCardNotification,
  showCardNotification,
} from "@/store/actions/notification";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Spinner } from "@/app/shared/loader/spinner";
import { TApp } from "@/types/app";
import { UpdateApp } from "../updateApp";
import { PageAuthWrapper } from "@/app/auth/pageAuthWrapper";
import { Modal } from "@/app/shared/modal";
import { EnableDisableAppCard } from "@/app/app/enableDisableAppCard";
import { UpdateAppCard } from "@/app/app/updateAppCard";
import { FiEdit } from "react-icons/fi";

const MyApp: React.FC = () => {
  // TODO: To dynamically change the icon color basing on the theme
  // TODO: To apply the application name in the favicon
  const [app, setApp] = useState<TApp>();
  const appId = useParams()["appId"] as string;
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const { isLoading, data } = useQuery({
    queryKey: [`app-${appId}`],
    queryFn: () =>
      new AppService().get({ appId: appId, accessToken: accessToken }),
    onSuccess: (response) => {
      console.log("response: ", response);
      setApp(() => response.data.app);
    },
    onError: (error: any) => {
      dispatch(showCardNotification({ type: "error", message: error.message }));
      setTimeout(() => {
        dispatch(hideCardNotification());
      }, 5000);
    },
  });

  const onUpdateAppHandler = (app: TApp) => {
    setApp(() => app);
  };

  // TODO: add on delete handler here

  const showRequestTimesRange = (app: TApp): boolean => {
    const isNull: boolean = app.requestTimes === null;
    const haveNoFirstElement =
      app.requestTimes && app.requestTimes[0] == undefined;

    if (isNull || haveNoFirstElement) return false;
    return true;
  };

  return (
    <div className="p-4 space-y-8 text-sm">
      {isLoading && (
        <div className="w-full grid place-items-center">
          <Spinner className="w-10 h-10" />
        </div>
      )}
      {/* Basic app info */}
      {app && (
        <div
          className="flex items-start justify-between gap-4
           border-b-[1px] border-color-border-primary pb-8"
        >
          <div className="flex flex-col items-start justify-center">
            <div className="w-40 flex items-center justify-between gap-4">
              <p className="flex items-center gap-2">
                <span>
                  <IconContext.Provider
                    value={{
                      size: "1.2rem",
                      color: "#868e96",
                    }}
                  >
                    <GiPokecog />
                  </IconContext.Provider>
                </span>
                <span className="text-sm uppercase">Application</span>
              </p>
              <Modal
                openModalElement={
                  <p className="flex items-center gap-2 cursor-pointer">
                    <span>
                      <IconContext.Provider
                        value={{
                          size: "1.0rem",
                          color: "#868e96",
                        }}
                      >
                        <FiEdit />
                      </IconContext.Provider>
                    </span>
                    <span className="text-sm">Update</span>
                  </p>
                }
              >
                <UpdateApp app={app} onUpdate={onUpdateAppHandler} />
              </Modal>
            </div>
            <div className="flex flex-col justify-center gap-2 mt-2">
              <p className="text-xl font-semibold">{app.name}</p>
              <p>
                <Link
                  href={`${app.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {app.url}
                </Link>
              </p>
              {showRequestTimesRange(app) && <RequestTimeRangeCard app={app} />}
            </div>
          </div>
          <div>
            <PostRequestTimeRange
              app={app}
              // appId={app.id}
              // requestTime={app.requestTimes!}
              onPost={() => {}}
            />
          </div>
        </div>
      )}
      {/* App Request Time paginated */}
      {app && (
        <div className="space-y-8">
          <RequestList appId={app.id} />
          {/* Update App */}
          <UpdateAppCard app={app} />
          {/* Disable/Enable App */}
          <EnableDisableAppCard app={app} />
          {/* Delete app functionality */}
          <DeleteApp app={app} />
        </div>
      )}
    </div>
  );
};

export default PageAuthWrapper(MyApp);
