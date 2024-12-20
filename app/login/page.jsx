'use client';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';

export default function Login() {
  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `https://cartoonz.top/loginSuccess`,
        },
      });
      console.log('data **********************************************', data);

      if (error) {
        console.error('Error logging in:', error.message);
        return;
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className="text-white mt-52">
        <h1>تسجيل الدخول</h1>
        <div
          className="flex justify-center w-full bg-white rounded-md px-4 py-2 gap-2 items-center my-8 hover:shadow-md cursor-pointer hover:scale-110"
          onClick={handleGoogleLogin}
        >
          <h1 className="text-sm sm:text-lg grow text-center text-gray-500 select-none font-semibold">
            تسجيل الدخول عن طريق جوجل
          </h1>
          <div className="relative h-8 w-8 ">
            <Image
              loading="lazy"
              src={'https://i.imgur.com/Z4ts3yl.png'}
              alt="google image"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
