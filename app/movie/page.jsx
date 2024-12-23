'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import BackButton from '../../components/BackButton';
import Image from 'next/image';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import LoadingPhoto from '../../components/LoadingPhoto';
import VideoPlayer from '../../components/VideoPlayer';
import { ContactUs } from '../../components/sendEmail/sendEmail';
import { useAuth } from '../../components/authContext/AuthContext';
import SubscriptionPage from '../../components/paypal/subscriptionPage';
import CurrentUser from '../../components/CurrentUser';

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [movie, setMovie] = useState([]);
  const [movieName, setMovieName] = useState('');
  const [showMessage, setShowMessage] = useState(true);
  const [isTrue, setIsTrue] = useState(true);
  const session = useAuth();
  const user = CurrentUser();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const getMovieName = params.get('movieName');
    if (getMovieName) {
      setMovieName(getMovieName);
    }
  }, []); // This effect runs only once on component mount

  useEffect(() => {
    if (movieName) {
      fetchMovie();
    }
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 100000); // 10000 milliseconds = 10 seconds

    // Cleanup timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [movieName, pageNumber]); // Run this effect when movieName or pageNumber changes

  async function fetchMovie() {
    if (movieName) {
      // console.log('Fetching movie:', movieName);

      const response = await fetch(`/api/movies?movieName=${movieName}`);
      const json = await response?.json();
      if (response.ok) {
        // console.log('Fetched movie data:', json);
        setMovie(json);
      } else {
        console.error('Failed to fetch movie');
      }
    }
  }

  return (
    <>
      {session?.session?.user?.role === 'authenticated' &&
        user?.monthly_subscribed === false &&
        user?.yearly_subscribed === false && <SubscriptionPage />}

      <div className=" w-full sm:p-4 lg:p-8 rounded-lg bg-one h-[1000px] overflow-y-auto">
        <div className="absolute flex flex-col items-start gap-2 z-30 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12 ">
          {/* <TfiMenuAlt
            className="p-1 rounded-lg text-3xl lg:text-5xl text-white cursor-pointer z-50  bg-two"
            onClick={() => setIsOpen(!isOpen)}
          />
          {isOpen && <SideBarMenu setIsOpen={setIsOpen} />} */}
        </div>
        <div className="relative w-full h-72 sm:h-[500px] overflow-hidden z-30">
          {movie[0]?.movieImage ? (
            <Image
              loading="lazy"
              src={movie[0]?.movieImage}
              layout="fill"
              objectFit="cover"
              alt="photo"
              objectPosition="top"
            />
          ) : (
            <LoadingPhoto />
          )}
        </div>

        <div className="flex flex-col justify-start items-center w-full gap-4 my-8">
          <div onClick={() => setIsTrue(false)}>{/* <BackButton /> */}</div>
          <h1 className="grow text-lg lg:text-2xl w-full text-white">
            <span className="text-gray-500 ml-2">#</span>
            اسم الفيلم:
            <span> {movie[0]?.movieName}</span>
          </h1>
          {showMessage && (
            <h1 className="text-yellow-400 p-2">
              الرجاء الإنتظار قليلا ... جاري إحضار الفيلم ربما تحتاج للضغط عدة
              مرات على الزر ليعمل لاننا نقوم بمنع الاعلانات المنبثقة المزعجة
            </h1>
          )}
        </div>

        <div className="my-8 p-2">
          {movie?.length === 0 && (
            <Loading myMessage={'😉لا يوجد نتائج لعرضها'} />
          )}

          <div className=" flex-col gap-32 my-32 justify-evenly items-center w-full h-full">
            {movie?.length > 0 &&
              movie.map((item, index) => (
                <div key={index} className="w-full h-fit">
                  <VideoPlayer
                    videoUrl={item?.movieLink}
                    showAd={isTrue}
                    movie={true}
                  />
                </div>
              ))}
          </div>

          <ContactUs />
        </div>
      </div>
    </>
  );
}
