import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { handleError } from '../../../../../lib/errorHandler'; // Adjust path if needed

// 1. THE MAGIC FIX: Teach the client to read the Auth Header!
async function getSupabaseClient(request: Request) {
  const cookieStore = await cookies();
  const authHeader = request.headers.get('Authorization'); // Grab the VIP Pass from the frontend!

  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() }, setAll() {} },
    global: {
      headers: {
        Authorization: authHeader || '', // Force Supabase to use the token!
      },
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { match_id, action, player_id, team_id, minute } = body;

    if (!match_id || !action) {
      throw { status: 400, message: "match_id and action are required." };
    }

    // 2. PASS THE REQUEST IN HERE
    const supabase = await getSupabaseClient(request); 

    // Security check
    // 1. Get the User
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // 2. KICK OUT NOBODIES FIRST!
    if (authError || !user) {
      throw { status: 401, message: "Unauthorized: Please log in." };
    }

    // 3. NOW check if they are an Admin
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    // 4. Kick out logged-in students who aren't admins
    if (!roleData) {
      throw { status: 403, message: "Forbidden: Admin clearance required." };
    }

    // 1. Fetch the current state of the match
    const { data: match, error: matchErr } = await supabase
      .from('matches')
      .select('*')
      .eq('id', match_id)
      .single();

    if (matchErr || !match) throw { status: 404, message: "Match not found." };

    let updatePayload: any = { updated_at: new Date().toISOString() };
    let responseMessage = "Match updated.";

    // 2. THE ACTION SWITCHBOARD
    switch (action) {
      case 'add_goal':
        if (!player_id || !team_id) throw { status: 400, message: "player_id and team_id required for a goal." };
        
        const isHomePlayer = match.home_team_id === team_id;
        
        if (body.is_own_goal) {
          // 1. Give point to the OPPOSITE team
          updatePayload.home_score = !isHomePlayer ? (match.home_score || 0) + 1 : match.home_score;
          updatePayload.away_score = isHomePlayer ? (match.away_score || 0) + 1 : match.away_score;
          
          // 2. Add to an 'own_goals' array INSTEAD of 'scorers' so they don't get Golden Boot points!
          const currentOwnGoals = match.own_goals || [];
          updatePayload.own_goals = [...currentOwnGoals, player_id];
          
          responseMessage = "Own Goal registered! Point awarded to the opposition.";
        } else {
          // Normal Goal: Give point to the PLAYER'S team
          updatePayload.home_score = isHomePlayer ? (match.home_score || 0) + 1 : match.home_score;
          updatePayload.away_score = !isHomePlayer ? (match.away_score || 0) + 1 : match.away_score;
          
          // Add to regular scorers array
          const currentScorers = match.scorers || [];
          updatePayload.scorers = [...currentScorers, player_id];

          // MAGIC FIX: Log the assist AND update the player's permanent stats!
          if (body.assist_id) {
            const currentAssists = match.assists || [];
            updatePayload.assists = [...currentAssists, body.assist_id];

            // Grab the assisting player's current tally and add 1
            const { data: assistPlayer } = await supabase.from('players').select('assists').eq('id', body.assist_id).single();
            await supabase.from('players').update({ assists: (assistPlayer?.assists || 0) + 1 }).eq('id', body.assist_id);
          }
          responseMessage = "Goal registered successfully!";
        }
        updatePayload.status = 'live';
        
        // (Optional) If you have an is_own_goal column in your goals table, you can pass it here later!
        await supabase.from('goals').insert([{ match_id, player_id, team_id }]);
        break;
        
      case 'add_assist':
        if (!player_id) throw { status: 400, message: "player_id required for an assist." };
        const currentAssists = match.assists || [];
        updatePayload.assists = [...currentAssists, player_id];
        responseMessage = "Assist registered successfully!";
        break;

      case 'update_time':
        // Just sets the status to live so the frontend shows the red blinking dot
        updatePayload.status = 'live';
        responseMessage = "Match is now LIVE!";
        break;

      case 'close_match':
        // Blow the final whistle
        updatePayload.status = 'completed';
        responseMessage = "Match officially closed! Ready for grading.";
        break;

      default:
        throw { status: 400, message: "Unknown action type." };
    }

    // 3. Execute the final Match update
    const { data: updatedMatch, error: updateErr } = await supabase
      .from('matches')
      .update(updatePayload)
      .eq('id', match_id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return NextResponse.json({ 
      success: true, 
      message: responseMessage, 
      data: updatedMatch 
    });

  } catch (error) {
    return handleError(error, "Live Match Controller");
  }
}