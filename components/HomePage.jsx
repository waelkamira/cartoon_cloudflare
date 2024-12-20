'use client';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import { signOut, useAuth } from '../components/authContext/AuthContext';
import SideBarMenu from './SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import CategoriesSlides from './CategoriesSlides';
import Button from './Button';
import CurrentUser from './CurrentUser';
import Serieses from './serieses';
import SeriesForm from './createSeries';
import EpisodForm from './createEpisode';
import MovieForm from './createMovie';
import SongForm from './createSong';
import SpacetoonSongForm from './createSpacetoonSong';
import LoginMessage from './loginMessage';
import SubscriptionPage from './paypal/subscriptionPage';

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpacetoonOpen, setIsSpacetoonOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [display, setDisplay] = useState(false);
  const [active, setActive] = useState(false);
  const session = useAuth();
  const user = CurrentUser();
  const [open, setOpen] = useState(true);

  // console.log('user', user);
  console.log('session homepage', session);
  useEffect(() => {
    sessionStorage.clear(); // تفريغ جميع العناصر في sessionStorage
    localStorage.removeItem('episodeNumber');
  }, []);

  return (
    <>
      {user &&
        session?.session?.user?.role === 'authenticated' &&
        user?.monthly_subscribed === false &&
        user?.yearly_subscribed === false && <SubscriptionPage />}{' '}
      {session?.session === null && (
        <div
          className="absolute right-0 top-0 h-full w-full z-50"
          onClick={() => setOpen(true)}
        >
          {open ? <LoginMessage setOpen={setOpen} /> : ''}
        </div>
      )}
      <div className="relative flex flex-col justify-center items-center xl:w-4/5 z-40 sm:my-0 w-full bg-one">
        <div className=" w-full ">
          <CategoriesSlides />

          <div className={'p-4'}>
            {user?.isAdmin ? (
              <>
                <Button title={'انشاء حلقة'} onClick={() => setShow(!show)} />
                <Button
                  title={'انشاء مسلسل'}
                  onClick={() => setIsVisible(!isVisible)}
                />
                <Button
                  title={'انشاء أغنية سبيس تون'}
                  onClick={() => setIsSpacetoonOpen(!isSpacetoonOpen)}
                />
                <Button
                  title={'انشاء فيلم'}
                  onClick={() => setDisplay(!display)}
                />
                <Button
                  title={'انشاء أغنية'}
                  onClick={() => setActive(!active)}
                />
              </>
            ) : (
              ''
            )}
            <SeriesForm setIsVisible={setIsVisible} isVisible={isVisible} />
            <EpisodForm setShow={setShow} show={show} />
            <MovieForm setDisplay={setDisplay} display={display} />
            <SongForm setActive={setActive} active={active} />
            <SpacetoonSongForm
              setIsSpacetoonOpen={setIsSpacetoonOpen}
              isSpacetoonOpen={isSpacetoonOpen}
            />

            {session?.session === null && (
              <Button title={'تسجيل الدخول'} path={'/login'} style={' '} />
            )}
          </div>
        </div>
        <div className=" flex flex-col justify-center items-center w-full rounded-lg sm:p-8 gap-2 ">
          <Serieses />
        </div>
      </div>
    </>
  );
}
