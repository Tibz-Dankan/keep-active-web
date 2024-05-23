"use client";

import React, { Fragment, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "@/app/shared/loader/spinner";
import { InputField } from "@/app/shared/inputField";
import Button from "@/app/shared/button";
import { TSignupInput } from "@/types/auth";
import { AuthService } from "@/services/auth.service";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/redux";
import {
  hideCardNotification,
  showCardNotification,
} from "@/store/actions/notification";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Session } from "@/lib/session";

const SignUp: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isPending, mutate } = useMutation({
    mutationFn: new AuthService().signUp,
    onSuccess: (auth: any) => {
      console.log("signup successful", auth);
      dispatch(
        showCardNotification({ type: "success", message: auth.message })
      );
      setTimeout(() => {
        dispatch(hideCardNotification());
      }, 5000);
      // delete auth["message"];
      // delete auth["status"];
      // authenticate(auth);
      // new Session().create(auth);
      router.push(
        `/auth/authorize?accessToken=${auth.accessToken}&user=${auth.user}`
      );
    },
    onError: (error: any) => {
      dispatch(showCardNotification({ type: "error", message: error.message }));
      console.log("Error: ", error.message);
      setTimeout(() => {
        dispatch(hideCardNotification());
      }, 5000);
    },
  });

  const initialValues: TSignupInput = {
    name: "",
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      name: Yup.string().max(255).required("name is required"),
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
        className="flex flex-col items-center justify-center gap-12
         min-h-[100vh] min-w-[100vw]"
      >
        <div className="w-full flex flex-col items-center">
          <Link href="/">
            <Image src="/logo.png" width={100} height={100} alt="logo" />
          </Link>
          <p
            className="text-center text-color-primary
            flex flex-col"
          >
            <span className="text-2xl">Welcome to AppCrons</span>
            <span>Let's create your account</span>
          </p>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-0 items-center w-[90%] sm:w-96
          border-[1px] border-color-secondary bg-color-tertiary p-8 
          rounded-md z-[1] text-color-primary"
        >
          <InputField
            type="text"
            name="name"
            placeholder="Username"
            formik={formik}
          />
          <InputField
            type="email"
            name="email"
            placeholder="Email address"
            formik={formik}
          />
          <InputField
            type="password"
            name="password"
            placeholder="Password"
            formik={formik}
          />
          <Button
            label={
              <>
                {!isPending && <span>Create</span>}
                {isPending && (
                  <Spinner label="Creating" className="w-5 h-5 text-gray-100" />
                )}
              </>
            }
            type="submit"
            aria-disabled={isPending}
            className="w-full mt-6 font-semibold"
          />
          <div className="w-full mt-4 flex justify-center">
            <p className="text-center text-color-primary">
              <span className="mr-2">Already have an account?</span>
              <Link
                href="/auth/login"
                className="underline hover:text-blue-500
                 cursor-pointer"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
        {/* Footer here */}
      </div>
    </Fragment>
  );
};

export default SignUp;
