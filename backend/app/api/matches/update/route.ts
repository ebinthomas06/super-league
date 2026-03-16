import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
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

    // 1. Security Check: Verify the Admin is actually logged in
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or missing session token" },
        { status: 401 }
      );
    }

    // 2. Parse the incoming JSON body
    const body = await request.json();
    const { matchId, home_score, away_score, status } = body;

    if (!matchId) {
      return NextResponse.json(
        { success: false, message: "matchId is required" },
        { status: 400 }
      );
    }

    // 3. Update the database
    const { data, error } = await supabase
      .from('matches')
      .update({ 
        home_score: home_score, 
        away_score: away_score, 
        status: status 
      })
      .eq('id', matchId)
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Match updated successfully",
      data: data
    });

  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update match" },
      { status: 500 }
    );
  }
}