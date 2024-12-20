import { NextResponse } from 'next/server';
import { supabase } from './lib/supabase';

export async function middleware(req) {
  const { data: session } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect('/login');
  }

  return NextResponse.next();
}
