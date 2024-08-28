import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Avatar from "@/components/avatar";

type Props = {};

export async function signIn(formData: FormData) {
  "use server";
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
    },
  });

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  "use server";
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (!error) {
    revalidatePath("/");
    redirect("/login");
  }
}

export default async function Navbar({}: Props) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  const userId = data.user?.id;

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  return (
    <form className="flex gap-2 items-center">
      <div className="flex gap-2 items-center">
        {data.user && (
          <>
            <div>{user?.full_name}</div>
            <div>@{user?.user_name}</div>

            <div>{user?.email}</div>
            <div>
              <Avatar user={user} />
            </div>
          </>
        )}
        {data.user ? (
          <button
            className="px-2 py-1 rounded border-black border"
            formAction={signOut}
          >
            Sign Out
          </button>
        ) : (
          <button
            className="px-2 py-1 rounded border-black border"
            formAction={signIn}
          >
            Sign In
          </button>
        )}
      </div>
    </form>
  );
}
