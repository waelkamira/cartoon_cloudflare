import { supabase } from '../../../lib/supabase';
import cookie from 'cookie';

export const runtime = 'edge';

export async function POST(req) {
  try {
    // قراءة البيانات من الطلب
    const body = await req.json();
    const { email, name, avatar } = body;
    console.log('Received email:', email);

    // التحقق من وجود البريد الإلكتروني
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
      });
    }

    // البحث عن المستخدم في قاعدة البيانات
    const { data: user, error: fetchError } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .single();

    console.log('User fetched:', user);

    if (fetchError && fetchError.code !== 'PGRST116') {
      return new Response(
        JSON.stringify({
          error: 'Error fetching user from database',
          details: fetchError.message,
        }),
        { status: 500 }
      );
    }

    let finalUser = user;

    // إذا لم يكن المستخدم موجودًا، قم بإنشائه
    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from('User')
        .insert([
          {
            email: email,
            name: name || 'User', // اسم افتراضي إذا لم يتم تقديمه
            image: avatar || null, // الصورة اختيارية
          },
        ])
        .select()
        .single();

      console.log('User created:', newUser);

      if (createError) {
        return new Response(
          JSON.stringify({
            error: 'Error creating user in the database',
            details: createError.message,
          }),
          { status: 500 }
        );
      }

      finalUser = newUser;
    }

    // إعداد الكوكيز
    const headers = new Headers();
    headers.append(
      'Set-Cookie',
      cookie.serialize('user', JSON.stringify(finalUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 365, // سنة واحدة
        path: '/',
      })
    );

    // إرجاع المستخدم
    return new Response(JSON.stringify(finalUser), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: 'Unexpected error occurred',
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
