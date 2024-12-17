// 'use client';

// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import Button from '../../components/Button';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
// import Link from 'next/link';
// import { signIn, useSession } from 'next-auth/react';
// import Image from 'next/image';
// import CustomToast from '../../components/CustomToast';
// import { useEffect } from 'react';
// import { TbDoorEnter } from 'react-icons/tb';

// export default function LogInPage() {
//   const session = useSession();
//   // console.log(session?.data?.user?.name);
//   const router = useRouter();
//   const schema = z.object({
//     email: z.string().email(),
//     password: z.string().min(),
//   });

//   const {
//     register,
//     getValues,
//     handleSubmit,
//     setError,
//     formState: { errors },
//   } = useForm({ resolver: zodResolver(schema) });

//   useEffect(() => {
//     if (session?.data?.user?.email) {
//       // تحديد الصفحة المطلوبة بعد تسجيل الدخول
//       const callbackUrl = router.query?.callbackUrl || '/';
//       router.push(callbackUrl);
//     }
//   }, [router, session?.data?.user?.email]);

//   async function onSubmit() {
//     if (getValues()?.email === '') {
//       setError('email', {
//         type: 'custom',
//         message: 'عنوان البريد الإلكتروني مطلوب',
//       });
//       return;
//     } else if (getValues()?.password?.length < 5) {
//       setError('password', {
//         type: 'custom',
//         message:
//           'طول كلمة السر يجب أن يكون 5 أحرف (أو 5 أرقام وأحرف) على الأقل',
//       });
//       return;
//     }
//     // console.log('getValues', getValues());

//     const response = await signIn('credentials', {
//       ...getValues(),
//       redirect: false,
//       callbackUrl: '/',
//       popup: true,
//     });

//     if (response.ok) {
//       const values = getValues();

//       localStorage.setItem('email', values?.email);
//       // localStorage.setItem('password', values?.password);
//       router.push('/');
//       toast.custom((t) => (
//         <CustomToast
//           t={t}
//           message={' بهيجة اشرق لبن ترحب بكم أهلا وسهلا '}
//           emoji={'🧀'}
//           greenEmoji={'🧀'}
//         />
//       ));
//     } else {
//       setError(response?.error);
//       toast.custom((t) => (
//         <CustomToast
//           t={t}
//           message={
//             'عنوان البريد الالكتروني هذا غير موجود يجب عليك التسجيل أولا 😐'
//           }
//         />
//       ));
//     }
//   }

//   function handleGoogleSignIn() {
//     // تعيين العرض والارتفاع الافتراضي
//     let popupWidth = 300;
//     const popupHeight = 700;

//     // إذا كانت الشاشة متوسطة أو كبيرة (أكبر من 768px)، قم بزيادة العرض إلى 500
//     if (window.screen.width >= 768) {
//       popupWidth = 500;
//     }

//     // حساب الموضع لجعل النافذة في وسط الشاشة
//     const left = window.screen.width / 2 - popupWidth / 2;
//     const top = window.screen.height / 2 - popupHeight / 2;

//     // خيارات النافذة المنبثقة
//     const options = `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes`;

//     // فتح النافذة المنبثقة
//     const popup = window.open('/api/auth/signin', 'GoogleLoginPopup', options);

//     if (!popup) {
//       console.error('تعذر فتح النافذة المنبثقة.');
//       return;
//     }

//     // مراقبة النافذة المنبثقة
//     const checkPopup = setInterval(() => {
//       if (popup.closed) {
//         clearInterval(checkPopup);
//         fetch('/api/auth/session')
//           .then((res) => res.json())
//           .then((session) => {
//             if (session?.user) {
//               // الانتقال إلى الصفحة الرئيسية بعد تسجيل الدخول
//               router.push('/');
//               toast.custom((t) => (
//                 <CustomToast
//                   t={t}
//                   message={'بهيجة أشرق لبن ترحب بكم'}
//                   greenEmoji={'✔'}
//                 />
//               ));
//             } else {
//               console.error('لم يتم تسجيل الدخول.');
//             }
//           })
//           .catch((error) =>
//             console.error('حدث خطأ أثناء التحقق من الجلسة:', error)
//           );
//       }
//     }, 1000);
//   }

//   return (
//     <div className="absolute z-50 top-0 right-0 flex justify-center items-center w-full h-screen text-white text-lg md:text-xl text-end">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full lg:w-1/2 bg-four p-8 rounded-lg border border-one"
//       >
//         <h1 className="flex justify-center mb-16 w-full my-2 text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold text-center select-none text-nowrap">
//           تسجيل الدخول
//           <TbDoorEnter className="text-3xl" />
//         </h1>

//         <div className="relative flex justify-center h-44 w-full text-center">
//           <Image
//             loading="lazy"
//             src={'https://i.imgur.com/nfDVITC.png'}
//             layout="fill"
//             objectFit="contain"
//             alt="photo"
//           />
//         </div>

//         <div
//           className="flex justify-center w-full bg-white rounded-md px-4 py-2 gap-2 items-center my-8 hover:shadow-md cursor-pointer hover:scale-110"
//           onClick={handleGoogleSignIn}
//         >
//           <h1 className="text-sm sm:text-lg grow text-center text-gray-500 select-none font-semibold">
//             تسجيل الدخول عن طريق جوجل
//           </h1>
//           <div className="relative h-8 w-8 ">
//             <Image
//               loading="lazy"
//               src={'https://i.imgur.com/Z4ts3yl.png'}
//               alt="google image"
//               layout="fill"
//               objectFit="contain"
//             />
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }
'use client'; // اجعل هذا الملف Client Component

import { supabase } from '../../lib/supabase';

export default function Login() {
  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) alert('Error logging in!');
  };

  return (
    <button onClick={signIn} className="text-white bg-gray-300 mt-52">
      Sign In with Google
    </button>
  );
}
