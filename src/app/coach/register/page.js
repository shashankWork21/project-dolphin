import LoginComponent from "@/components/auth/login-component";
import RegisterForm from "@/components/register/register-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CoachRegisterPage() {
  const googleSigninUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth?scope=EMAIL,PROFILE,OPENID&role=student`;
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <RegisterForm role="coach" />
      <div className="w-9/10 md:w-3/5 lg:w-1/4 flex flex-col items-center justify-center space-y-4">
        <p>OR</p>
        <Link href={googleSigninUrl} className="px-5">
          <Button variant="secondary" className="w-full hover:bg-stone-300">
            Register with Google
          </Button>
        </Link>
        <div className="flex flex-row space-x-2 mt-10 items-center">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <LoginComponent side="right" className="mt-64 bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}
