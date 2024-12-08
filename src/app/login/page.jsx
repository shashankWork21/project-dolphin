import LoginForm from "@/components/register/login-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CoachLoginPage() {
  const googleSigninUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth?scope=EMAIL,PROFILE,OPENID&redirect_url=${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`;
  return (
    <div className="h-full flex flex-col items-center space-y-4">
      <LoginForm />
      <div className="w-9/10 md:w-3/5 lg:w-1/4 flex flex-col items-center justify-center space-y-4">
        <p>OR</p>
        <Link href={googleSigninUrl} className="px-5">
          <Button variant="secondary" className="w-full hover:bg-stone-300">
            Login with Google
          </Button>
        </Link>
        <div className="flex flex-row space-x-1 items-center">
          <p className="text-sm text-gray-600">New user?</p>
          <Link href="/coach/register" className="text-blue-500 text-sm">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
