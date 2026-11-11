import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = url && key ? createClient(url,key,{auth:{storage:AsyncStorage,autoRefreshToken:true,persistSession:true,detectSessionInUrl:false}}) : null;
export const configured = !!supabase;
export async function ensureAuth() {
  if (!supabase) return null;
  const {data:{session}}=await supabase.auth.getSession();
  if(session) return session.user.id;
  const {data,error}=await supabase.auth.signInAnonymously();
  if(error) throw error;
  return data.user?.id ?? null;
}
