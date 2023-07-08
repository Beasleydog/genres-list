import Image from 'next/image'
import { Suspense } from 'react'
import Loader from '../helpers/Loader';
import Link from 'next/link';

async function getGenreData() {
  const json = await fetch(process.env.DB_URL, {
    next: {
      revalidate: 60 * 10
    }
  });
  const data = await json.json();
  return data;
}

export default function Page(props) {
  return (
    <div className='w-full h-full min-h-screen flex flex-col items-center'>
      <Header />
      <GenreListDisplay />
    </div>
  )
}
function GenreListDisplay() {
  const genreData = getGenreData();

  return (
    <div className="bg-white w-[80%] mt-20 flex-grow rounded relative">
      <Suspense fallback={<Loader />}>
        <GenreList promise={genreData} />
      </Suspense>
    </div>
  )
}
async function GenreList({ promise }) {
  const genres = await promise;
  // await new Promise(resolve => setTimeout(resolve, 100000));
  return (
    <div className="grid md:grid-cols-3 grid-cols-1 p-2 gap-2 animate-fade-in">
      {
        genres.map(genre => {
          return (
            <GenreButton name={genre.genreName} id={genre.genreId} />
          );
        })
      }
    </div>
  )

}

function GenreButton({ name, id }) {
  return (
    <Link href={`/genres/${id}/reads`} prefetch={false}>
      <div className="bg-[#d9d9d9] p-3 font-semibold cursor-pointer rounded text-[25px] hover:shadow transition-shadow text-gray-950 flex items-center justify-center">
        <span>
          {name}
        </span>
      </div>
    </Link >
  )
}
function Header() {
  return (
    <div className='bg-white flex justify-center items-center h-40 w-screen' >
      <Image src="/udplLogo.png" alt="logo" width={384} height={111} fill={false} className="h-[111px]" />
      <span className="ml-5 text-[55px] font-semibold text-[#17938e]">
        Reading Lists
      </span>
    </div>
  )
}