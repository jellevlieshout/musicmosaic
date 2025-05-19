import { createClient } from "@/utils/supabase/server";

export async function getUserEmailData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  //console.log(user?.email);
  return user?.email;
}
