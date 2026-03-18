import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // 1. Create a response object to pass cookies through
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Initialize the Supabase Client for Middleware (Edge Runtime)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 3. Get the current user session
  const { data: { user } } = await supabase.auth.getUser();

  // 4. Define the VIP Rooms (Routes that require logging in AND onboarding)
  const protectedRoutes = ['/predictions', '/schedule', '/leaderboard'];
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  const isOnboardingRoute = request.nextUrl.pathname.startsWith('/onboarding');

  if (isProtectedRoute || isOnboardingRoute) {
    // If they aren't logged in at all, kick them to the login page
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If they are logged in, check their profile in the database
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('nickname, team_flair_id')
      .eq('id', user.id)
      .single();

    // The Logic Gate: Do they need to finish setup?
    const needsOnboarding = !profile?.nickname || !profile?.team_flair_id;

    // RULE A: If they need onboarding but are trying to access predictions, kick them to /onboarding
    if (needsOnboarding && !isOnboardingRoute) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // RULE B: If they are fully onboarded but try to go back to the onboarding screen, kick them to predictions
    if (!needsOnboarding && isOnboardingRoute) {
      return NextResponse.redirect(new URL('/predictions', request.url));
    }
  }

  // 5. If they pass all checks, let them through!
  return response;
}

// 6. Matcher Config: Tells Next.js to ignore static files (images, CSS) to keep the server lightning fast
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};