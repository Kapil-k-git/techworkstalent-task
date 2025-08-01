"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { createMovie, fetchMovieById, updateMovie } from "@/app/utils/slices/movieSlice";
import Image from "next/image";
import InputFieldPrimary from "@/components/InputPrimary/InputPrimary";
import PrimaryButton from "@/components/ButtonPrimary/ButtonPrimary";
import { useAppDispatch } from "@/app/utils/store/store";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from "@/node_modules/react-i18next";
export const BackArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round"
       strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const EditMovie = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { id } = useParams();
    const { t } = useTranslation('translation');
    const movieId = id;
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { movies, loading, error } = useSelector((state: any) => state.movies);
    
    const [movieData, setMovieData] = useState({
        title: "",
        year: "",
        poster: "",
    });

    // Helper function to get the correct image URL
    const getImageUrl = (posterValue: string): string => {
        // If it's already a full URL (starts with http/https), use it directly
        if (posterValue && posterValue.startsWith('http')) {
            return posterValue;
        }
        
        // If it's a local path, prepend the server URL
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080';
        return `${serverUrl}${posterValue}`;
    };

    useEffect(() => {
        if (movieId && typeof movieId === "string") {
            dispatch(fetchMovieById(movieId));
        }
    }, [movieId, dispatch]);

    useEffect(() => {
        if (movieId && movies) {
            setMovieData({
                title: movies?.title,
                year: movies?.year,
                poster: movies?.poster,
            });
        }
    }, [movieId, movies]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
        const file = event.target.files?.[0];
        if (file) {
            setFieldValue("poster", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validationSchema = Yup.object({
        title: Yup.string().required(t("title-required")),
        year: Yup.number()
            .required(t("year-required"))
            .min(1900, t("year-min"))
            .max(new Date().getFullYear(), t("year-max")),
    });

    const handleSubmit = async (values: any) => {
        try {
            const formData = new FormData();
            if (values.title !== movieData.title) {
                formData.append("title", values.title);
            }
            if (values.year.toString() !== movieData.year) {
                formData.append("year", values.year.toString());
            }
            if (values.poster && values.poster !== movieData.poster) {
                if (values.poster instanceof File) {
                    formData.append("poster", values.poster);
                } else {
                    const response = await fetch(values.poster);
                    const blob = await response.blob();
                    const file = new File([blob], values.poster.split("/").slice(-1)[0], { type: blob.type });
                    formData.append("poster", file);
                }
            }
            if (formData.has("title") || formData.has("year") || formData.has("poster")) {
                await dispatch(updateMovie({ id: movieId, formData }));
                toast.success(movies.message || t("movie-update-success"));
                router.push("/movies")
            } else {
                console.log(t("no-changes-detected"));
            }
        } catch (err) {
            toast.error(error.message || t("movie-update-error"));
        }
    };

    return (
        <div className="p-8 sm:py-10 sm:px-20 lg:py-20 lg:px-40 flex flex-col gap-10 md:gap-[120px] mx-auto max-w-[1440px] min-h-[calc(100vh-120px)]">
            <div className="flex justify-between items-center text-white">
                <div className="flex flex-col items-start justify-center gap-2">
                    <h1 className="text-[16px] md:text-[48px] text-white font-semibold">
                        {t("edit")}
                    </h1>
                    <button
                        type="button"
                        onClick={() => router.push("/movies")}
                        className="bg-[#093545] flex items-center gap-2 text-white rounded hover:underline transition"
                    >
                        <span>
                            <BackArrow />
                        </span>
                    <h5>
                        {t('back') || "Back"}
                    </h5>
                    </button>
                </div>
            </div>
            {movies && loading ? (
                <div className="text-white text-center text-lg min-h-[calc(100vh-120px)]">{t("loading")}</div>
            ) : movies && error ? (
                <div className="text-white text-center">{t("loadingError")}</div>
            ) : (
                <Formik
                    initialValues={movieData}
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values, handleChange, resetForm, errors }) => {
                        return (
                            <Form>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 sm:gap-20 lg:gap-32 w-full">
                                    <div className="col-span-2 flex flex-col gap-10">
                                        <div className="sm:hidden flex flex-col gap-5">
                                            <div>
                                                <InputFieldPrimary
                                                    name="title"
                                                    error={errors.title}
                                                    value={values.title}
                                                    placeholder={t("title")}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="lg:w-[50%] w-full">
                                                <InputFieldPrimary
                                                    type="number"
                                                    name="year"
                                                    error={errors.year}
                                                    placeholder={t("year")}
                                                    value={values.year}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center rounded-lg p-10 bg-[#224957] h-[473px] w-full">
                                            <label
                                                htmlFor="fileInput"
                                                className="w-full h-full flex items-center justify-center cursor-pointer relative"
                                            >
                                                {imagePreview ? (
                                                    <img
                                                        src={imagePreview}
                                                        alt={t("selected-image")}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <>
                                                        {values.poster && 
                                                            <Image
                                                                src={getImageUrl(values.poster)}
                                                                alt={values.title}
                                                                width={450}
                                                                height={500}
                                                                className="h-full w-full object-cover rounded-lg"
                                                                priority={false}
                                                                placeholder="blur"
                                                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                                            />
                                                        }
                                                    </>
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
                                    <div className="flex col-span-2 flex-col gap-14">
                                        <div className="sm:flex hidden flex-col gap-6">
                                            <div>
                                                <InputFieldPrimary
                                                    name="title"
                                                    error={errors.title}
                                                    value={values.title}
                                                    placeholder={t("title")}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="lg:w-[50%] w-full">
                                                <InputFieldPrimary
                                                    type="number"
                                                    name="year"
                                                    error={errors.year}
                                                    placeholder={t("year")}
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
                                                {t("cancel")}
                                            </PrimaryButton>
                                            <PrimaryButton type="submit" className="bg-[#2BD17E]">{t("submit")}</PrimaryButton>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            )}
        </div>
    );
};

export default EditMovie;