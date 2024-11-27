import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { RenderMounted } from "@/components/ui/render-mounted";
import { ADMIN } from "@/constants/contants";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminLayout({children}: Readonly<{
    children: ReactNode;
}>){
    // Check if the uset is authenticated and if the user is an adim
    const supabase = createClient();

    const authResponse = await (await supabase).auth.getUser(); // Await the Promise first
    const { data: authData, error: authError } = authResponse;
  

    if (authData?.user) {
        const { data, error } = await (await supabase).from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

        if (error || !data) {
        console.log('Error fetching user data', error);
        return;
        }

        if (data.type === ADMIN) return redirect('/');
    }

    return 
        <RenderMounted>
            <Header />
            <main className="min-h-[calc(100svh-128px)] py-3">{children}</main>
            <Footer/>
        </RenderMounted>
}