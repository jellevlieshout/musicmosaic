import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-muted-foreground">
          Sign in to continue your musical journey
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
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                className="text-sm text-primary hover:text-primary/80"
                href="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              required
              className="w-full"
            />
          </div>
        </div>

        <SubmitButton 
          pendingText="Signing In..." 
          formAction={signInAction}
          className="w-full"
        >
          Sign in
        </SubmitButton>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link 
            className="text-primary font-medium hover:text-primary/80" 
            href="/sign-up"
          >
            Sign up
          </Link>
        </div>

        <FormMessage message={searchParams} />
      </form>
    </div>
  );
}
