import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the requesting user is an admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create client to verify user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Check if user is admin (you can customize this check)
    const adminEmails = ['malhotrayash1900@gmail.com', 'adityasingh7402@gmail.com', 'aditya@fraterny.com'] // Add your admin emails
    if (!adminEmails.includes(user.email ?? '')) {
      throw new Error('Unauthorized: Admin access required')
    }

    // Fetch all auth users using admin API
    let allUsers: any[] = []
    let page = 1
    const perPage = 1000
    let hasMore = true

    while (hasMore) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage
      })

      if (error) {
        throw error
      }

      allUsers = allUsers.concat(data.users)
      hasMore = data.users.length === perPage
      page++
    }

    // Format the response with only necessary fields
    const formattedUsers = allUsers
      .filter(u => u.email) // Only users with email
      .map(u => ({
        id: u.id,
        email: u.email,
        name: u.user_metadata?.user_name || u.user_metadata?.full_name || u.email?.split('@')[0] || 'User',
        created_at: u.created_at,
        last_sign_in: u.last_sign_in_at,
        email_confirmed: u.email_confirmed_at !== null
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return new Response(
      JSON.stringify({
        success: true,
        users: formattedUsers,
        total: formattedUsers.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error fetching auth users:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to fetch auth users'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
