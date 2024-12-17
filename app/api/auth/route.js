import { supabase } from '../../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
export const runtime = 'edge';
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // تسجيل الدخول عبر Google OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${
          process.env.NODE_ENV === 'development'
            ? process.env.NEXT_PUBLIC_BASE_URL
            : process.env.NEXT_PUBLIC_BASE_URL_PRODUCTION
        }/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    const { user } = data;

    // جلب بيانات المستخدم من Supabase
    const { data: existingUser, error: existingUserError } = await supabase
      .from('User')
      .select('*')
      .eq('email', user.email)
      .single();

    if (existingUserError && existingUserError.code !== 'PGRST116') {
      throw new Error(existingUserError.message);
    }

    // إذا لم يكن المستخدم موجودًا، نقوم بإضافته
    if (!existingUser) {
      const newId = uuidv4();

      const { error: insertError } = await supabase.from('User').insert({
        id: newId, // إضافة ID جديد
        email: user.email,
        name: user.user_metadata.full_name,
        image: user.user_metadata.avatar_url,
        googleId: user.id,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }
    } else {
      // تحديث googleId إذا كان مفقودًا
      if (!existingUser.googleId) {
        const { error: updateError } = await supabase
          .from('User')
          .update({ googleId: user.id })
          .eq('email', user.email);

        if (updateError) {
          throw new Error(updateError.message);
        }
      }
    }

    return res
      .status(200)
      .json({ message: 'User signed in successfully', user });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
