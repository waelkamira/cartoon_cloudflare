import { supabase } from '../../../lib/supabase';
import cookie from 'cookie';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, name, avatar } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
      });
    }

    let { data: user, error } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .single();
    console.log('user **********************************************', user);
    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from('User')
        .insert([
          {
            email,
            name: name || 'User',
            image: avatar || null,
          },
        ])
        .select()
        .single();

      if (createError) {
        return new Response(
          JSON.stringify({ error: 'Error creating user in the database' }),
          { status: 500 }
        );
      }

      user = newUser;
      console.log('user ********************************************', user);
    }

    const headers = new Headers();
    headers.append(
      'Set-Cookie',
      cookie.serialize('user', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      })
    );

    return new Response(JSON.stringify(user), {
      status: 200,
      headers,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Unexpected error occurred' }),
      { status: 500 }
    );
  }
}
