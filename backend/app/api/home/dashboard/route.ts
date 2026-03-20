import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 0; 

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const division = searchParams.get('division') || 'mens';

    // 1. Fetch Top 4 Standings 
    const { data: standings } = await supabase
      .from('league_standings')
      .select('*')
      .eq('division', division) 
      .order('rank', { ascending: true })
      .limit(4);

    // 2. Fetch Latest News
    const { data: news } = await supabase
      .from('newsletter')
      .select('*')
      .order('date', { ascending: false })
      .limit(5);

    // 3. Fetch Top Scorer & Assist (Now reading from our new View!)
    const { data: scorers } = await supabase
      .from('top_scorers')
      .select('*')
      .eq('division', division)
      .order('goalsScored', { ascending: false })
      .limit(1);

    const { data: assists } = await supabase
      .from('top_scorers')
      .select('*')
      .eq('division', division)
      .order('assists', { ascending: false })
      .limit(1);

    // 4. THE REAL MATCH LOGIC WITH GOALSCORERS
    // First, try to find a LIVE match
    let { data: liveMatches } = await supabase
      .from('matches')
      .select(`
        id, home_score, away_score, status, date, home_team_id, away_team_id,
        home:teams!home_team_id(name), 
        away:teams!away_team_id(name),
        goals ( player_id, team_id, players ( first_name, last_name ) )
      `)
      .eq('division', division)
      .eq('status', 'live')
      .limit(1);

    let targetMatch = liveMatches?.[0];

    // If no live match, fetch the NEXT SCHEDULED match
    if (!targetMatch) {
      const { data: scheduledMatches } = await supabase
        .from('matches')
        .select(`
          id, home_score, away_score, status, date, home_team_id, away_team_id,
          home:teams!home_team_id(name), 
          away:teams!away_team_id(name),
          goals ( player_id, team_id, players ( first_name, last_name ) )
        `)
        .eq('division', division)
        .eq('status', 'scheduled')
        .gte('date', new Date().toISOString()) 
        .order('date', { ascending: true })
        .limit(1);

      targetMatch = scheduledMatches?.[0];
    }

    let liveMatchData = null;
    if (targetMatch) {
      
      const extractTeamName = (teamData: any) => {
        if (!teamData) return 'TBD';
        if (Array.isArray(teamData)) return teamData[0]?.name || 'TBD';
        return teamData.name || 'TBD';
      };

      // Separate goals into Home and Away arrays
      const homeGoals = targetMatch.goals?.filter((g: any) => g.team_id === targetMatch.home_team_id).map((g: any) => ({
        name: g.players?.last_name || g.players?.first_name || 'Unknown'
      })) || [];

      const awayGoals = targetMatch.goals?.filter((g: any) => g.team_id === targetMatch.away_team_id).map((g: any) => ({
        name: g.players?.last_name || g.players?.first_name || 'Unknown'
      })) || [];

      liveMatchData = {
        homeTeam: extractTeamName(targetMatch.home),
        awayTeam: extractTeamName(targetMatch.away),
        homeScore: targetMatch.home_score || 0,
        awayScore: targetMatch.away_score || 0,
        status: targetMatch.status, 
        date: targetMatch.date,     
        minute: targetMatch.status === 'live' ? "LIVE" : "", 
        homeForm: ['-','-','-','-','-'], 
        awayForm: ['-','-','-','-','-'],
        homeScorers: homeGoals, // <--- New data for the frontend!
        awayScorers: awayGoals  // <--- New data for the frontend!
      };
    }

    const fantasyTop = [
      { id: 1, name: "Sreerag", points: 8520 },
      { id: 2, name: "Pranav", points: 8150 },
      { id: 3, name: "Alen", points: 7900 }
    ];

    return NextResponse.json({
      success: true,
      data: {
        standings: standings || [],
        news: news || [],
        topScorer: scorers?.[0] ? { name: scorers[0].name, club: scorers[0].club, stat: scorers[0].goalsScored } : null,
        topAssist: assists?.[0] ? { name: assists[0].name, club: assists[0].club, stat: assists[0].assists || 0 } : null,
        liveMatch: liveMatchData,
        fantasyTop: fantasyTop
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to aggregate dashboard data" }, { status: 500 });
  }
}