import { supabase } from '@/lib/supabase'

export async function uploadToStorage(bucket, file) {
  const ext = file.name.split('.').pop()
  const filename = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, file, { upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(filename)
  return data.publicUrl
}
