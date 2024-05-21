"use client";

import React, { Fragment, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "@/app/shared/loader/spinner";
import { InputField } from "@/app/shared/inputField";
import Button from "@/app/shared/button";
import { TSigninInPut } from "@/types/auth";
import { AuthService } from "@/services/auth.service";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/redux";
import {
  hideCardNotification,
  showCardNotification,
} from "@/store/actions/notification";
import Image from "next/image";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();

  const { isPending, mutate } = useMutation({
    mutationFn: new AuthService().signIn,
    onSuccess: (auth: any) => {
      console.log("Log in successful");
    },
    onError: (error: any) => {
      dispatch(showCardNotification({ type: "error", message: error.message }));
      console.log("Error: ", error.message);
      setTimeout(() => {
        dispatch(hideCardNotification());
      }, 5000);
    },
  });

  const initialValues: TSigninInPut = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      email: Yup.string().max(255).required("email is required"),
      password: Yup.string()
        .max(255)
        .min(5)
        .max(30)
        .required("password is required"),
    }),

    onSubmit: async (values, helpers) => {
      try {
        mutate(values);
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
    <Fragment>
      <div
        className="flex items-center justify-center min-h-[100vh] 
        min-w-[100vw] bg-green-500s"
      >
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-0 items-center w-[90%] sm:w-[480px]
          bg-gray-50s shadow-md p-8 rounded-md z-[1]"
        >
          <Link href="/">
            {/* <img src="/logo.png" alt="logo" className="w-28" /> */}
            <Image src="/logo.png" width={100} height={100} alt="logo" />
          </Link>
          <p className="text-center text-2xl font-semibold">Log in</p>
          <InputField type="email" name="email" formik={formik} />
          <InputField type="password" name="password" formik={formik} />
          {!isPending && (
            <Button
              label="Log in"
              type="submit"
              aria-disabled={isPending}
              className="mt-6 font-semibold"
            />
          )}
          {isPending && (
            <div className="py-[6px] font-semibold text-gray-100">
              <Spinner label="Logging in" className="w-5 h-5 text-gray-100" />
            </div>
          )}
          <div className="mt-4 space-y-4">
            <p className="text-center hover:underline hover:text-blue-500 cursor-pointer">
              <Link href="/auth/forgot-password">Forgot password</Link>
            </p>
            <p className="hover:underline hover:text-blue-500 cursor-pointer">
              <Link href="/auth/signup" className="underline">
                Create account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Login;
