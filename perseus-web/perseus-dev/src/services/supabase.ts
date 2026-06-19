import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  'https://axlmifietfjcmgirjrvo.supabase.co'

const supabaseKey =
  'sb_publishable_j8r_3WW0U_b3CF5HFRLl0Q_sTaogZE1'

export const supabase =
  createClient(
    supabaseUrl,
    supabaseKey
  )

  