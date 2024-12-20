'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `http://localhost:3000/loginSuccess`,
        },
      });
      console.log('data **********************************************', data);

      if (error) {
        console.error('Error logging in:', error.message);
        return;
      }

      // انتظر حتى يتم تسجيل المستخدم وإحضار الجلسة
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error fetching session:', sessionError.message);
        return;
      }

      const user = sessionData?.session?.user;
      console.log('user **********************************************', user);

      // تحقق إذا كانت بيانات المستخدم موجودة
      if (user) {
        console.log(
          'user **********************************************',
          user
        );

        // أرسل طلبًا إلى api/auth
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
            name: user.user_metadata.full_name,
            avatar: user.user_metadata.avatar_url,
          }),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error('Error sending user data:', errorResponse.message);
          return;
        }

        console.log('User data sent successfully to /api/auth');

        // إعادة توجيه المستخدم إلى الصفحة الرئيسية
        router.push('/');
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
