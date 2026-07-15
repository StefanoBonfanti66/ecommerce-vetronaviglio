import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "jsr:@supabase/supabase-js"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const authHeader = req.headers.get('Authorization')!
  const jwt = authHeader.replace('Bearer ', '')
  const { data: { user: adminUser }, error: authError } = await supabaseClient.auth.getUser(jwt)

  if (authError || !adminUser) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders })
  }

  const { data: adminProfile } = await supabaseClient
    .from('profiles')
    .select('role')
    .eq('id', adminUser.id)
    .single()

  if (!adminProfile || !['admin', 'ceo'].includes(adminProfile.role)) {
    return new Response('Forbidden', { status: 403, headers: corsHeaders })
  }

  const { user_id } = await req.json()

  // Controlla ordini associati
  const { count } = await supabaseClient
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user_id)

  if (count && count > 0) {
    return new Response(JSON.stringify({ message: 'Impossibile eliminare: l\'utente ha ordini associati.' }), { status: 409, headers: corsHeaders })
  }

  // Elimina profilo
  const { error: profileError } = await supabaseClient
    .from('profiles')
    .delete()
    .eq('id', user_id)

  if (profileError) {
    return new Response(JSON.stringify(profileError), { status: 500, headers: corsHeaders })
  }

  // Elimina auth user
  const { error: authError2 } = await supabaseClient.auth.admin.deleteUser(user_id)

  if (authError2) {
    return new Response(JSON.stringify(authError2), { status: 500, headers: corsHeaders })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders })
})
