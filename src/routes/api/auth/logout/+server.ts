import { json } from '@sveltejs/kit';

export const POST = async ({ cookies }) => {
  // Clear the session cookie
  cookies.set('session_id', '', {
    path: '/',
    expires: new Date(0), // Set expiry date to the past
  });

  return json({ message: 'Logout successful' }, { status: 200 });
};
