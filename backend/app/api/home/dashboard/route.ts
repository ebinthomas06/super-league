import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 60; // Cache this aggregation route for 60s

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // 1. Fetch Top 4 Standings
    const { data: standings } = await supabase
      .from('league_standings')
      .select('*')
      .order('rank', { ascending: true })
      .limit(4);

    // 2. Fetch Latest 5 News Items
    const { data: news } = await supabase
      .from('newsletter')
      .select('*')
      .order('date', { ascending: false })
      .limit(5);

    // 3. Fetch Top Scorer & Top Assist (from leaderboard View)
    const { data: scorers } = await supabase
      .from('top_scorers')
      .select('*')
      .order('goalsScored', { ascending: false })
      .limit(1);

    const assistsResp = await supabase
      .from('top_scorers')
      // Note: We are mocking top assist order locally if the DB doesn't support 'assists' column ordering yet, but assuming it exists:
      .select('*')
      .order('assists', { ascending: false })
      .limit(1);
    
    const assists = assistsResp.error ? scorers : assistsResp.data;

    // 4. Fetch the most recent Live/Upcoming match from Schedule
    const { data: schedule } = await supabase
      .from('league_schedule')
      .select('*')
      .order('date', { ascending: true }) // Upcoming
      .limit(1);

    // Provide a mocked live match if the database schedule is empty (until actual matches exist)
    const liveMatch = schedule && schedule.length > 0 ? {
      homeTeam: schedule[0].home_team || "Team A",
      awayTeam: schedule[0].away_team || "Team B",
      homeScore: schedule[0].status === 'completed' ? schedule[0].home_score : 0,
      awayScore: schedule[0].status === 'completed' ? schedule[0].away_score : 0,
      minute: schedule[0].status === 'live' ? "45+" : schedule[0].time || "18:00",
      homeForm: ['W','D','L','W','W'],
      awayForm: ['L','L','D','W','L']
    } : {
      homeTeam: "BETA FC",
      awayTeam: "CHARLIE UTD",
      homeScore: 2,
      awayScore: 1,
      minute: "72",
      homeForm: ['W','D','W','L','W'],
      awayForm: ['L','L','D','W','L']
    };

    // 5. Mock Fantasy Leaderboard points (Phase 3 pending 'points' column in DB)
    const fantasyTop = [
      { id: 1, name: "Sreerag", points: 8520 },
      { id: 2, name: "Pranav", points: 8150 },
      { id: 3, name: "Alen", points: 7900 }
    ];

    // Build the aggregated dashboard payload
    return NextResponse.json({
      success: true,
      data: {
        standings: standings || [],
        news: news || [],
        topScorer: scorers?.[0] ? { name: scorers[0].name, club: scorers[0].club, stat: scorers[0].goalsScored } : null,
        topAssist: assists?.[0] ? { name: assists[0].name, club: assists[0].club, stat: assists[0].assists || 0 } : null,
        liveMatch: liveMatch,
        fantasyTop: fantasyTop
      }
    });

  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to aggregate dashboard data" },
      { status: 500 }
    );
  }
}
