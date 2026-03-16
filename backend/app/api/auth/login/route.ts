import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Admin logged in successfully",
      data: {
        user: data.user,
        session: data.session 
      }
    });

  } catch (error: any) {
    console.error("Auth error:", error.message);
    return NextResponse.json(
      { success: false, message: "Invalid login credentials" },
      { status: 401 }
    );
  }
}