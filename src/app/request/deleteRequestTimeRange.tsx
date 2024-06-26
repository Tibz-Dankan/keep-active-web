"use client";

import React, { ReactNode, useState } from "react";
import Button from "@/app/shared/button";
import { Modal } from "@/app/shared/modal";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useMutation } from "@tanstack/react-query";
import {
  hideCardNotification,
  showCardNotification,
} from "@/store/actions/notification";
import { TApp, TRequestTime } from "@/types/app";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Spinner } from "@/app/shared/loader/spinner";
import { RequestService } from "@/services/request.service";
import { convertTo12HourFormat } from "@/utils/convertTo 12HourFormat";

interface DeleteRequestTimeRangeProps {
  requestTimeId: string;
  app: TApp;
  openModalElement: ReactNode;
  onDelete: () => void;
}

export const DeleteRequestTimeRange: React.FC<DeleteRequestTimeRangeProps> = (
  props
) => {
  const [isClosedModal, setIsClosedModal] = useState(false);
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth).accessToken;
  const app = props.app;

  const requestTimeList = app.requestTimes as TRequestTime[];

  const getCurrentRequestTime = (): TRequestTime => {
    return requestTimeList.find(
      (requestTime) => requestTime.id === props.requestTimeId
    ) as TRequestTime;
  };

  const { isLoading, mutate } = useMutation({
    mutationFn: new RequestService().deleteRequestTimeRange,
    onSuccess: async (response: any) => {
      console.log("deleteRequestTimeRange response: ", response);

      // props.onDelete(response.app);
      dispatch(
        showCardNotification({ type: "success", message: response.message })
      );
      setTimeout(() => {
        dispatch(hideCardNotification());
      }, 5000);
    },
    onError: (error: any) => {
      dispatch(showCardNotification({ type: "error", message: error.message }));
      console.log("Error: ", error.message);
      setTimeout(() => {
        dispatch(hideCardNotification());
      }, 5000);
    },
  });

  const formik = useFormik({
    initialValues: {},
    validationSchema: Yup.object({}),
    onSubmit: async (values, helpers) => {
      try {
        mutate({
          requestTimeId: props.requestTimeId,
          accessToken: accessToken,
        });
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setSubmitting(false);
        showCardNotification({ type: "error", message: err.message });
        setTimeout(() => {
          hideCardNotification();
        }, 5000);
      }
    },
  });

  return (
    <Modal openModalElement={props.openModalElement} closed={isClosedModal}>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-0 items-center w-[90%] sm:w-96
         rounded-md z-[1] p-4 sm:p-8"
      >
        <div className="w-full flex items-center gap-4 justify-between">
          <p className="text-start">
            <span className="mr-2">
              Are you sure that you want to delete Time Range
            </span>
            <span className="font-semibold mr-1">
              {convertTo12HourFormat(getCurrentRequestTime().start)}
            </span>
            <span className="font-semibold mr-1">-</span>
            <span className="font-semibold">
              {convertTo12HourFormat(getCurrentRequestTime().end)}
            </span>
            <span>?</span>
          </p>
        </div>
        <div className="w-full flex items-center justify-between gap-4 mt-6">
          <Button
            label={"Cancel"}
            type="button"
            disabled={isLoading}
            onClick={() => setIsClosedModal(() => true)}
            className="w-32 font-semibold bg-gray-600"
          />
          <Button
            label={
              <>
                {!isLoading && <span>Delete</span>}
                {isLoading && (
                  <Spinner label="deleting" className="w-5 h-5 text-gray-100" />
                )}
              </>
            }
            type="submit"
            disabled={isLoading}
            className="w-32 font-semibold bg-[#D9534F]"
          />
        </div>
      </form>
    </Modal>
  );
};
