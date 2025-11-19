import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    // Sign up the user
    const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { username },
      email_confirm: true, // Auto-confirm for testing; remove in production
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Insert into users table
    if (user) {
      const { error: dbError } = await supabase.from('users').insert([
        { id: user.id, username },
      ]);

      if (dbError) {
        return NextResponse.json({ error: 'Failed to save username: ' + dbError.message }, { status: 400 });
      }

      return NextResponse.json({ message: 'Registration successful', user }, { status: 200 });
    }

    return NextResponse.json({ error: 'User creation failed' }, { status: 400 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    console.error('SignUp API error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}