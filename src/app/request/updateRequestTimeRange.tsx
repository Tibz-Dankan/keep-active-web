"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Button from "@/app/shared/button";
import { Modal } from "@/app/shared/modal";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useMutation } from "@tanstack/react-query";
import {
  hideCardNotification,
  showCardNotification,
} from "@/store/actions/notification";
import { TApp, TRequestTime, TUpdateRequestTime } from "@/types/app";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Spinner } from "@/app/shared/loader/spinner";
import { RequestService } from "@/services/request.service";
import { InputSelect } from "@/app/shared/inputSelect";
import times from "@/app/request/data/times.json";
import { TimeZoneSelect } from "@/app/shared/timeZoneSelect";
import { validateTimeRange } from "@/utils/validateTimeRange";
import { convertTo24HourFormat } from "@/utils/convertTo24HourFormat";
import { IconContext } from "react-icons";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";
import { truncateString } from "@/utils/truncateString";
import { convertTo12HourFormat } from "@/utils/convertTo 12HourFormat";

interface UpdateRequestTimeRangeProps {
  requestTimeId: string;
  app: TApp;
  openModalElement: ReactNode;
  onUpdate: () => void;
}

export const UpdateRequestTimeRange: React.FC<UpdateRequestTimeRangeProps> = (
  props
) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth).accessToken;
  console.log("accessToken:->:", accessToken);
  const app = props.app;
  const hasTimeZone: boolean =
    app.requestTimes !== null ? !!app.requestTimes[0]?.timeZone : false;

  const timeOptions = times.times;
  const [validateReqTimeRange, setValidateReqTimeRange] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: false, message: "" });

  const getAppTimezone = (): string => {
    if (hasTimeZone) {
      return app.requestTimes !== null
        ? app.requestTimes && app.requestTimes[0]?.timeZone
        : "";
    }
    return "";
  };

  const requestTimeList = app.requestTimes as TRequestTime[];

  const getCurrentRequestTime = (): TRequestTime => {
    return requestTimeList.find(
      (requestTime) => requestTime.id === props.requestTimeId
    ) as TRequestTime;
  };

  const getRequestTimeValidationList = (): TRequestTime[] => {
    return requestTimeList.filter(
      (requestTime) => requestTime.id !== props.requestTimeId
    );
  };

  const { isLoading, mutate } = useMutation({
    mutationFn: new RequestService().updateRequestTimeRange,
    onSuccess: async (response: any) => {
      console.log("postRequestTimeRange response: ", response);

      // props.onUpdate(response.app);
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

  const initialValues: TUpdateRequestTime = {
    requestTimeId: props.requestTimeId,
    appId: app.id,
    start: getCurrentRequestTime().start,
    end: getCurrentRequestTime().end,
    timeZone: getAppTimezone(),
    accessToken: accessToken,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      start: Yup.string().max(255).required("start time is required"),
      end: Yup.string().max(255).required("end time is required"),
    }),

    onSubmit: async (values, helpers) => {
      try {
        mutate({
          requestTimeId: props.requestTimeId,
          appId: app.id,
          start: convertTo24HourFormat(values.start),
          end: convertTo24HourFormat(values.end),
          timeZone: values.timeZone,
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

  useEffect(() => {
    const validateTimeRangeHandler = () => {
      if (!formik.values.start || !formik.values.end) return;
      const validator = validateTimeRange(
        getRequestTimeValidationList(),
        convertTo24HourFormat(formik.values.start),
        convertTo24HourFormat(formik.values.end)
      );

      setValidateReqTimeRange({
        isValid: validator.isValid,
        message: validator.message,
      });
    };
    validateTimeRangeHandler();
  }, [formik.values.start, formik.values.end]);

  const showTimeRangeSuccessMessage =
    validateReqTimeRange.isValid && !!validateReqTimeRange.message;
  const showTimeRangeErrorMessage =
    !validateReqTimeRange.isValid && !!validateReqTimeRange.message;
  const isDisabledSubmitBtn = isLoading || showTimeRangeErrorMessage;

  return (
    <Modal openModalElement={props.openModalElement}>
      <div
        className="flex flex-col gap-4 items-center w-[90%] sm:w-96
        border-[1px]s  border-color-border-primary p-8
        bg-color-bg-primary rounded-md max-h-[70vh] overflow-x-auto
        shadow-2xl"
      >
        <div className="flex items-center justify-between w-full">
          <p className="font-semibold">{truncateString(app.name, 40)}</p>
        </div>
        <div className="flex items-center justify-start gap-4 w-full">
          <p className="text-color-text-secondary text-sm">Edit Time Range</p>
          <p
            className="flex items-center justify-between gap-1
            bg-color-bg-secondary p-2 rounded"
          >
            <span>{convertTo12HourFormat(getCurrentRequestTime().start)}</span>
            <span>-</span>
            <span>{convertTo12HourFormat(getCurrentRequestTime().end)}</span>
          </p>
        </div>
        <div className="w-full space-y-1">
          <span className="text-sm text-color-text-secondary">
            Existing Time Ranges
          </span>
          <div
            className="grid grid-cols-2 gap-2 p-4s py-2
             border-[1px]s border-color-border-primary rounded-md"
          >
            {/* TODO: organize time ranges based on the start time in ascending order */}
            {requestTimeList.map((requestTime, index) => (
              <p
                key={index}
                className={`flex items-center justify-center gap-1 
                 p-2 rounded-md text-[12px]
                 ${
                   getCurrentRequestTime().id === requestTime.id
                     ? "border-[2px] border-primary"
                     : "border-[1px] border-color-border-primary"
                 }`}
              >
                <span>{convertTo12HourFormat(requestTime?.start)}</span>
                <span>-</span>
                <span>{convertTo12HourFormat(requestTime?.end)}</span>
              </p>
            ))}
          </div>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-0 items-center w-[90%] sm:w-full
           rounded-md z-[1]"
        >
          <div className="w-full mb-2">
            <p
              className="text-[12px] text-color-text-primary
               p-2 border-[1px] border-color-border-primary rounded-md"
            >
              Edit Time Range by selecting your preferred Start and End time
              below
            </p>
          </div>
          <div className="w-full">
            {showTimeRangeSuccessMessage && (
              <div
                className="border-[1px] border-color-border-primary rounded-md
                 p-2 w-full mb-2 flex justify-start items-start gap-2"
              >
                <span>
                  <IconContext.Provider
                    value={{
                      size: "1.2rem",
                      color: "#55C57A",
                    }}
                  >
                    <IoMdCheckmarkCircleOutline />
                  </IconContext.Provider>
                </span>
                <p className="text-[#55C57A] text-[14px] text-start">
                  {validateReqTimeRange.message}
                </p>
              </div>
            )}
            {showTimeRangeErrorMessage && (
              <div
                className="border-[1px] border-color-border-primary rounded-md
                 p-2 w-full mb-2 flex justify-start items-start gap-2"
              >
                <span>
                  <IconContext.Provider
                    value={{
                      size: "1.2rem",
                      color: "#D9534F",
                    }}
                  >
                    <MdErrorOutline />
                  </IconContext.Provider>
                </span>
                <p className="text-[#D9534F] text-[14px] text-start">
                  {validateReqTimeRange.message}
                </p>
              </div>
            )}
          </div>
          <div className="w-full flex items-center gap-4 justify-between">
            <div className="w-full -space-y-5">
              <label
                htmlFor="Start"
                className="text-sm text-color-text-secondary"
              >
                Start time
              </label>
              <InputSelect
                label="start"
                options={timeOptions}
                formik={formik}
              />
            </div>
            <div className="w-full -space-y-5">
              <label
                htmlFor="End"
                className="text-sm text-color-text-secondary"
              >
                End time
              </label>
              <InputSelect label="end" options={timeOptions} formik={formik} />
            </div>
          </div>

          <Button
            label={
              <>
                {!isLoading && (
                  <span
                    className={`${
                      showTimeRangeErrorMessage && "text-[#adb5bd]"
                    }`}
                  >
                    Submit
                  </span>
                )}
                {isLoading && (
                  <Spinner
                    label="processing"
                    className="w-5 h-5 text-gray-100"
                  />
                )}
              </>
            }
            type="submit"
            disabled={isDisabledSubmitBtn}
            className="w-full mt-6 font-semibold"
          />
        </form>
      </div>
    </Modal>
  );
};
