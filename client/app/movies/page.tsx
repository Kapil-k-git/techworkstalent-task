"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import AddIcon from "@/public/assets/svg/add.svg";
import Logout from "@/public/assets/svg/logout.svg";
import Card from "../../components/Card/Card";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies } from "../utils/slices/movieSlice";
import { AppDispatch, RootState } from "../utils/store/store";
import PrimaryButton from "../../components/ButtonPrimary/ButtonPrimary";
import { useTranslation } from "@/node_modules/react-i18next";

const Movies = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation('translation');

    const { movies, loading, error, totalPages } = useSelector((state: RootState) => state.movies);
    const [currentPage, setCurrentPage] = useState(0);
    const moviesPerPage = 8;

    const logout = () => {
        localStorage.clear();
        router.push("/");
    };

    useEffect(() => {
        dispatch(fetchMovies({ page: currentPage + 1, perPage: moviesPerPage }));
    }, [currentPage, dispatch]);

    const handlePageChange = (index: number) => {
        setCurrentPage(index);
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            handlePageChange(currentPage + 1);
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/movies/${id}`);
    };

    const handleNew = () => {
        router.push(`/addnew`);
    };

    return (
        <>
            {movies.length === 0 ? (
                <div className="flex flex-col justify-center items-center min-h-[calc(100vh-120px)] gap-10 px-4 text-white">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl text-center font-semibold leading-tight">
                        {t('emptyList')}
                    </h1>
                    <div className="w-full max-sm:max-w-52 flex justify-center">
                        <PrimaryButton
                            type="button"
                            onClick={handleNew}
                            className="sm:w-auto px-7 py-4 text-center bg-[#2BD17E]"
                        >
                            {t('addMovie')}
                        </PrimaryButton>
                    </div>
                </div>
            ) : (
                <div className="p-8 sm:py-10 sm:px-20 lg:py-20 lg:px-40 flex flex-col gap-10 md:gap-[120px] mx-auto max-w-[1440px] w-full min-h-[calc(100vh-120px)]">
                    <div className="flex justify-between items-center text-white">
                        <div className="flex items-center justify-center gap-2 sm:gap-5">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl xl:leading-[56px]  text-white font-semibold">
                                {t('myMovies')}
                            </h1>
                            <Image
                                src={AddIcon}
                                width={32}
                                height={32}
                                alt="add"
                                className="cursor-pointer max-md:size-6"
                                onClick={handleNew}
                            />
                        </div>
                        <div className="cursor-pointer flex items-center justify-center gap-2 sm:gap-3" onClick={logout}>
                            <h4 className="font-bold text-base">{t('logout')}</h4>
                            <Image src={Logout} width={32} height={32} className="max-lg:size-6" alt="logout" />
                        </div>
                    </div>
                    <div>
                        {loading ? (
                            <div className="text-white text-center text-lg min-h-[calc(100vh-120px)]">{t('loading')}</div>
                        ) : error ? (
                            <div className="text-white text-center">{t('error')}</div>
                        ) : (
                            <div className="flex flex-col gap-20 md:gap-[120px]">
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-5 md:gap-7">
                                    {movies.length > 0 && movies?.map((movie) => (
                                        <div key={movie._id} onClick={() => handleEdit(movie._id)} className="flex w-full">
                                            {movie.poster && <Card title={movie.title} year={movie.year} poster={movie.poster} />}
                                        </div>
                                    ))}
                                </div>
                                {totalPages > 0 && (
                                    <div className="flex justify-center items-center gap-5 text-white">
                                        <div
                                            className={`cursor-pointer font-bold ${currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                            onClick={handlePrevPage}
                                        >
                                            {t('prev')}
                                        </div>
                                        <div className="flex justify-center items-center gap-2">
                                            {Array.from({ length: totalPages }, (_, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => handlePageChange(index)}
                                                    className={`cursor-pointer font-bold text-white flex justify-center items-center text-base h-8 w-8 ${currentPage === index ? "bg-[#2BD17E]" : "bg-[#092C39]"} rounded`}
                                                >
                                                    {index + 1}
                                                </div>
                                            ))}
                                        </div>
                                        <div
                                            className={`cursor-pointer font-bold ${currentPage === totalPages - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                            onClick={handleNextPage}
                                        >
                                            {t('next')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Movies;
