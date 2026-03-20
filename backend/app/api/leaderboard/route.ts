import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { handleError } from '../../../lib/errorHandler'; 

// Turn off caching temporarily so you can test the Mens/Womens toggle instantly!
export const revalidate = 0; 

export async function GET(request: Request) {
  try {
    // Grab the division from the URL (e.g., ?division=mens)
    const { searchParams } = new URL(request.url);
    const division = searchParams.get('division') || 'mens';

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      }
    );

    // 1. Fetch Top 10 Scorers for the specific division
    const { data: topScorers, error: scorersErr } = await supabase
      .from('top_scorers')
      .select('*')
      .eq('division', division)
      .order('goalsScored', { ascending: false })
      .limit(10); 

    if (scorersErr) throw scorersErr;

    // 2. Fetch Top 10 Assists for the specific division
    const { data: topAssists, error: assistsErr } = await supabase
      .from('top_scorers')
      .select('*')
      .eq('division', division)
      .order('assists', { ascending: false })
      .limit(10); 

    if (assistsErr) throw assistsErr;

    // Send both lists neatly packaged together!
    return NextResponse.json({
      success: true,
      message: "Leaderboard fetched successfully",
      data: {
        topScorers: topScorers || [],
        topAssists: topAssists || []
      }
    });

  } catch (error) {
    return handleError(error, "Leaderboard API Fetch");
  }
}