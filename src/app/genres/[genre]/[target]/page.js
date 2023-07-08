'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { BsChevronLeft } from "react-icons/bs";
import { IconContext } from "react-icons";

const SMALL_WINDOW = window.innerWidth < 640;

async function getGenreData() {
    const json = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/listData`, {
        next: {
            revalidate: 5 * 60
        }
    });
    const data = await json.json();
    return data;
}


export default function GenreTab(params) {
    console.log("bruh");

    const focusedGenreId = params.params.genre;
    const focusTarget = params.params.target;

    const [genreData, setGenreData] = useState([]);

    useEffect(() => {
        (async () => {
            const data = await getGenreData();
            console.log(data);
            setGenreData(data);
        })();
    }, []);
    const focusedGenre = genreData.filter((genre) => {
        return genre.genreId == focusedGenreId;
    })[0];

    return (
        <div className='w-full h-full min-h-screen flex flex-col items-center'>
            {focusedGenre &&
                <>
                    <Header genreName={focusedGenre.genreName} target={focusTarget} genreId={focusedGenreId} />
                    {(focusTarget == "reads" || focusTarget != "authors") && <BookDisplay books={focusedGenre.books} />}
                    {focusTarget == "authors" && <AuthorDisplay authors={focusedGenre.popularAuthors} />}
                </>
            }
        </div>
    )
}
function BookDisplay({ books }) {
    return (
        <div className={`w-[85%] mt-20 grid sm:grid-cols-4 grid-cols-2 p-2 gap-x-[8%] sm:gap-y-[4%] gap-y-[1%] flex-grow rounded ${SMALL_WINDOW ? "pt-[90px]" : "pt-[200px]"}`}>
            {books.map(book => {
                return (
                    <BookImage isbn={book.isbn} />
                );
            })}
        </div>
    )
}
function AuthorDisplay({ authors }) {
    return (
        <div className='pt-[220px] flex flex-col gap-2'>
            {authors.map(author => {
                return (
                    <AuthorName name={author} />
                );
            })}
        </div>
    )
}
function AuthorName({ name }) {
    return <div className="text-gray-900 text-2xl font-semibold p-2 bg-slate-200 rounded">{name}</div>
}
function BookImage({ isbn }) {
    return <Link href="https://google.com">
        <Image quality={100} height={0} width={0} sizes="100vw" src={`${process.env.NEXT_PUBLIC_URL}/api/bookCover?isbn=${isbn}`} alt="book cover" className="w-full h-auto rounded-lg shadow" />
    </Link>;
}
function Header({ genreName, target, genreId }) {
    const [MINIMIZED, setMinimized] = useState(false);

    const FOCUSED_CLASS = "text-gray-900 border-b-4 border-[#17938e]";

    useEffect(() => {
        const threshold = 150;
        //Listen for scroll in window
        window.addEventListener('scroll', (e) => {
            console.log(window.scrollY, MINIMIZED);
            if (MINIMIZED && window.scrollY < threshold) setMinimized(false);
            else if (!MINIMIZED && window.scrollY > threshold) setMinimized(true);
        });

        //Remove event listener on unmount
        return () => {
            window.removeEventListener('scroll', () => { });
        }
    }, [MINIMIZED]);

    const popReadsLink = <Link href={`/genres/${genreId}/reads`} replace prefetch={false} shallow scroll={false}>
        <span className={target == "reads" || target != "authors" ? FOCUSED_CLASS : ""}>
            <span className="sm:inline-block hidden">Popular</span> Reads
        </span>
    </Link>;
    const popAuthorsLink = <Link href={`/genres/${genreId}/authors`} replace prefetch={false} shallow scroll={false}>
        <span className={target == "authors" ? FOCUSED_CLASS : ""}>
            <span className="sm:inline-block hidden">Popular</span> Authors
        </span>
    </Link>;

    return (
        <div className={`bg-white flex justify-center w-screen fixed top-0 transition-all ${SMALL_WINDOW ? "h-[120px]" : ""} ${MINIMIZED && !SMALL_WINDOW ? 'h-[80px] flex-row gap-[50px] shadow-xl' : 'flex-col h-[200px]'} items-center shadow`} >
            <Link className="" href="/">
                <span className={`cursor-pointer absolute transition-all left-[4vw] bg-[#f1f1f1] p-2 pt-2.5 rounded text-gray-900 h-[40px] w-[40px] hover:shadow-md ${SMALL_WINDOW ? " transform scale-75 top-[40px]" : ""} ${MINIMIZED && !SMALL_WINDOW ? 'top-[21px]' : 'top-[75px]'}`}>
                    <IconContext.Provider value={{ color: "#111827", className: "stroke-[1.5px]" }}>
                        <BsChevronLeft size={20} />
                    </IconContext.Provider>
                </span>
            </Link>
            <span className={`ml-5 font-semibold text-[#17938e] ${MINIMIZED && !SMALL_WINDOW ? 'sm:text-[45px] text-[30px]' : ' sm:text-[90px] text-[40px]'}`}>
                {genreName}
            </span>
            <span className="flex flex-row gap-4 font-bold text-[20px] text-gray-500">
                {popReadsLink}
                {popAuthorsLink}
            </span>
        </div>
    )
}