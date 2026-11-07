import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  'https://lloiyxagwcbsunhsbvip.supabase.co';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_FnH4c5thM1I7uFpX64Ilkw_F1HtzASN';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const BUCKET_NAME = 'media';

/**
 * Upload an image file to Supabase Storage and return its public URL
 */
export async function uploadMediaToSupabase(
  file: File,
  folder = 'logos'
): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    return data.publicUrl;
  } catch (err) {
    console.error('Failed to upload media to Supabase:', err);
    return null;
  }
}
