"use client";
import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const supabaseClient = createClient()
  
  const [notes, setNotes] = useState<any[] | null>(null);
  

  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabaseClient.from('notes').select('*');
      if (error) {
        console.error(error);
      } else {
        setNotes(data);
      }
    };
    fetchNotes();
  }, []);
 

  return (
    <>
      <div>
        {notes?.map((note: any) => (
          <div key={note.id}>{note.note_content}</div>
        ))}
      </div>
    </>
  );
}
