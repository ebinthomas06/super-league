import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { handleError } from '../../../../lib/errorHandler';

// Helper function to init Supabase 
async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() }, setAll() {} },
  });
}

// CREATE A PLAYER
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
      .from('players')
      .insert([{
        first_name: body.first_name,
        last_name: body.last_name,
        team_id: body.team_id || null, // Nullable if they don't have a team yet
        position: body.position,
        jersey_number: body.jersey_number || null
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, message: "Player created", data });
  } catch (error) {
    return handleError(error, "Admin Create Player");
  }
}

// UPDATE A PLAYER
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.id) throw { status: 400, message: "Player ID is required for updates." };

    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
      .from('players')
      .update({
        first_name: body.first_name,
        last_name: body.last_name,
        team_id: body.team_id,
        position: body.position,
        jersey_number: body.jersey_number
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, message: "Player updated", data });
  } catch (error) {
    return handleError(error, "Admin Update Player");
  }
}

// DELETE A PLAYER
export async function DELETE(request: Request) {
  try {
    // For DELETE requests, we usually pass the ID in the URL: ?id=1234
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) throw { status: 400, message: "Player ID is required for deletion." };

    const supabase = await getSupabaseClient();

    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true, message: "Player deleted successfully" });
  } catch (error) {
    return handleError(error, "Admin Delete Player");
  }
}