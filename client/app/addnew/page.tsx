"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { createMovie } from "@/app/utils/slices/movieSlice";
import Image from "next/image";
import InputFieldPrimary from "@/components/InputPrimary/InputPrimary";
import PrimaryButton from "@/components/ButtonPrimary/ButtonPrimary";
import Download from "@/public/assets/svg/download.svg";
import { useAppDispatch } from "@/app/utils/store/store";
import { toast } from "react-toastify";
import { useTranslation } from "@/node_modules/react-i18next";

const AddNew = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { t } = useTranslation('translation');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { loading, error } = useSelector((state: any) => state.movies);

    const [movieData, setMovieData] = useState({
        title: "",
        year: "",
        poster: "",
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
        const file = event.target.files?.[0];
        if (file) {
            setFieldValue("poster", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validationSchema = Yup.object({
        title: Yup.string().required(t('title') + " is required."),
        year: Yup.number()
            .required(t('year') + " is required.")
            .min(1900, t('year') + " must be after 1900")
            .max(new Date().getFullYear(), t('year') + " can't be in the future"),
    });

    const handleSubmit = async (values: any) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("year", values.year.toString());
        if (values.poster) {
            formData.append("poster", values.poster);
        }
        const res = await dispatch(createMovie(formData)).unwrap();
        toast.success(res.message || t('loginSuccess'));
        router.push("/movies");
    };

    return (
        <div className="p-8 sm:py-10 lg:pt-20 lg:pb-0 sm:px-20 lg:px-40 flex flex-col gap-10 md:gap-[120px] max-w-[1440px] mx-auto min-h-[calc(100vh-120px)]">
            <div className="flex justify-between items-center text-white">
            <div className="flex flex-col items-start justify-center gap-2">
                <h1 className="text-[20px] sm:text-[24px] md:text-[48px] text-white font-semibold">
                    {t('createMovie')}
                </h1>
                <button
                    type="button"
                    onClick={() => router.push("/movies")}
                    className="bg-[#093545] text-white rounded hover:underline transition"
                >
                 {t('← back') || "← Back"}
                </button>
            </div>
            </div>
            {error && (
                <div className="text-white text-center">{t('loadingError')}</div>
            )}
            <Formik
                initialValues={movieData}
                validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, values, resetForm, handleChange, errors }) => (
                    <Form>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 xl:gap-32 w-full">
                            <div className="flex flex-col gap-10">
                                <div className="sm:hidden flex flex-col gap-5">
                                    <div>
                                        <InputFieldPrimary
                                            name="title"
                                            error={errors.title}
                                            value={values.title}
                                            placeholder={t('title')}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="lg:w-[50%] w-full">
                                        <InputFieldPrimary
                                            type="number"
                                            name="year"
                                            error={errors.year}
                                            placeholder={t('year')}
                                            value={values.year}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-center border-[1px] border-dashed cursor-pointer border-white rounded-lg p-10 bg-[#224957] h-[473px] w-full">
                                    <label
                                        htmlFor="fileInput"
                                        className="w-full h-full flex items-center justify-center cursor-pointer relative"
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Selected Image"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="flex flex-col gap-5 justify-center items-center">
                                                <Image
                                                    src={Download}
                                                    width={20}
                                                    height={20}
                                                    alt="download"
                                                    className="cursor-pointer"
                                                />
                                                <p className="text-[16px] text-white">{t('dropImage')}</p>
                                            </div>
                                        )}
                                        <input
                                            id="fileInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) => handleFileChange(event, setFieldValue)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col gap-14">
                                <div className="sm:flex hidden flex-col gap-6">
                                    <div>
                                        <InputFieldPrimary
                                            name="title"
                                            error={errors.title}
                                            value={values.title}
                                            placeholder={t('title')}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="lg:w-[50%] w-full">
                                        <InputFieldPrimary
                                            name="year"
                                            type="number"
                                            error={errors.year}
                                            placeholder={t('year')}
                                            value={values.year}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <PrimaryButton
                                        className="bg-[#093545] border-[#FFFFFF] border-[1px]"
                                        type="button"
                                        onClick={() => { resetForm(); setImagePreview(null) }}
                                    >
                                        {t('cancel')}
                                    </PrimaryButton>
                                    <PrimaryButton type="submit" className="bg-[#2BD17E]">{t('submit')}</PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddNew;
