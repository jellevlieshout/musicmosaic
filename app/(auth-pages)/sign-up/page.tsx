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
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Join MusicMosaic</h1>
        <p className="text-muted-foreground">
          Create an account to start your musical adventure
        </p>
      </div>

      <form className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              name="email" 
              placeholder="you@example.com" 
              required 
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              minLength={6}
              required
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Password must be at least 6 characters long
            </p>
          </div>
        </div>

        <SubmitButton 
          formAction={signUpAction} 
          pendingText="Signing up..."
          className="w-full"
        >
          Create Account
        </SubmitButton>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link 
            className="text-primary font-medium hover:text-primary/80" 
            href="/sign-in"
          >
            Sign in
          </Link>
        </div>

        <FormMessage message={searchParams} />
      </form>
    </div>
  );
}
