"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputFieldPrimary from "@/components/InputPrimary/InputPrimary";
import PrimaryButton from "@/components/ButtonPrimary/ButtonPrimary";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "./utils/store/store";
import { signIn } from "./utils/slices/dataSlice";
import { toast } from "react-toastify";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from '@/node_modules/react-i18next';

const validationSchema = Yup.object({
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    )
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation('translation');
  const { loading, error, token } = useSelector((state: RootState) => state.auth);
  const [storage, setStorage] = useState(true);
  const [passwordVisibility, setPasswordBVisibility] = useState(true)

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const action = await dispatch(signIn(values));
        if (signIn.fulfilled.match(action)) {
          const token = action.payload.token;
          toast.success(t('loginSuccess'));
          if (storage) {
            localStorage.setItem("token", token);
          } else {
            sessionStorage.setItem("token", token);
          }
          router.push("/movies");
        }
      } catch (err: any) {
        toast.error(t('loginError'));
      }
    },
  });

  const toggleVisiblity = () => {
    setPasswordBVisibility(!passwordVisibility)
  }

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      router.push("/movies");
    }
  }, [router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <section className="flex flex-col justify-center  gap-[10px] items-center min-h-[calc(100vh-120px)]">
      <LanguageSwitcher />
      {loading ? (
        <div className="text-white">{t('loading')}</div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-10 items-center w-auto sm:w-[400px] px-10">
            <h1 className="text-4xl lg:text-5xl xl:text-[64px] text-white font-semibold">{t('signin')}</h1>
            <div className="w-full flex flex-col gap-6">
              <InputFieldPrimary
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder={t('email')}
                error={formik.touched.email && formik.errors.email ? formik.errors.email : ""}
              />

              <InputFieldPrimary
                type={passwordVisibility ? "password" : "text"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder={t('password')}
                toggleVisiblity={toggleVisiblity}
                passwordToggle={passwordVisibility}
                isPassword={true}
                error={formik.touched.password && formik.errors.password ? formik.errors.password : ""}
              />

              <div className="flex justify-center items-center gap-4">
                <div className="inline-flex items-center">
                  <label className="flex items-center cursor-pointer relative">
                    <input
                      type="checkbox"
                      onChange={() => setStorage(!storage)}
                      className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow-md bg-[#224957] checked:bg-[#2BD17E] "
                      id="check"
                    />
                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </span>
                  </label>
                </div>
                <span className="text-white text-sm">{t('rememberMe')}</span> {/* Translate Remember Me */}
              </div>

              <PrimaryButton type="submit" className="bg-[#2BD17E]">{t('Login')}</PrimaryButton>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
