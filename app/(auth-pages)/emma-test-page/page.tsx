import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
 

  return (
    <>
        <div className="flex flex-col">
            <div>
                <p className="neon-tubes-styling text-center text-8xl">MM</p>

            </div>
            <br></br>
            <div>
                <p className="neon-tubes-styling text-center text-4xl"></p>
            </div>
        </div>
    </>
  );
}