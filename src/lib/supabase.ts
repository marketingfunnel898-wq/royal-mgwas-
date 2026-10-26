/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://peknslhedvvenfzmlrjm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBla25zbGhlZHZ2ZW5mem1scmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MzY1MDEsImV4cCI6MjEwNTExMjUwMX0.kQ9t6jFrexKixqFIXOwwQ1VXcxBRGTcYpx-G2p7ZYNc';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getRoomImageUrl(storagePath: string | null | undefined): string | null {
  if (!storagePath) return null;
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath;
  }
  const { data } = supabase.storage.from('room-images').getPublicUrl(storagePath);
  return data?.publicUrl || null;
}

export const DEFAULT_GALLERY_STORAGE_FALLBACKS: Record<string, string> = {
  'default/gallery_1.jpg': 'gallery/grounds/1789820028323_849A3067.jpg',
  'default/gallery_2.jpg': 'gallery/rooms/1790734122679_shacta_9_DQSuofOE8e0_2.jpg',
  'default/gallery_3.jpg': 'gallery/pool/1789817782602_Where_Elegance_Meets_Comfort.png',
  'default/gallery_4.jpg': 'gallery/56fdbb62-6458-46d9-b355-d4128e0b140a/1790739214247_xt4w4_849A3116.jpg',
  'default/gallery_5.jpg': 'gallery/99f73381-5333-4590-a351-b2b16613f9e5/1790739320737_cpno1_849A3115.jpg',
  'default/gallery_6.jpg': 'gallery/0276e2f7-9c2e-47f7-a62f-daac528d36d2/1790736891834_i74zh_849A3113.jpg',
  'default/gallery_7.jpg': 'gallery/1fa1da23-ccec-45ac-bff5-851864447536/1790737026410_1x8ze_the_live_band_person_image_.jpg',
  'default/gallery_8.jpg': 'gallery/c940d29c-e448-4e26-8abb-40cfc0fc349e/1790737140545_n1sne_849A3096.jpg',
  'default/gallery_9.jpg': 'gallery/c940d29c-e448-4e26-8abb-40cfc0fc349e/1790737143925_eg5t9_849A3097.jpg',
  'default/gallery_10.jpg': 'gallery/rooms/1790734122679_shacta_9_DQSuofOE8e0_2.jpg',
  'default/gallery_11.jpg': 'gallery/rooms/1790734122679_shacta_9_DQSuofOE8e0_2.jpg',
};

export function getGalleryImageUrl(storagePath: string | null | undefined): string | null {
  if (!storagePath) return null;
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath;
  }
  const effectivePath = DEFAULT_GALLERY_STORAGE_FALLBACKS[storagePath] || storagePath;
  const { data } = supabase.storage.from('gallery-images').getPublicUrl(effectivePath);
  return data?.publicUrl || null;
}

export function getHeroImageUrl(storagePath: string | null | undefined): string | null {
  if (!storagePath) return null;
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath;
  }
  const { data } = supabase.storage.from('hero-images').getPublicUrl(storagePath);
  return data?.publicUrl || null;
}
