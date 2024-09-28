import Link from "next/link";
import { TutorialStep } from "./tutorial-step";

export default function SignUpUserSteps() {
  return (
    <ol className="flex flex-col md:gap-6">
      <TutorialStep title="Sign in/Sign up">
        <p>
          Head over to the{" "}
          <Link
            href="/sign-up"
            className="font-bold hover:underline text-foreground/80"
          >
            Sign up
          </Link>{" "}
          page and sign up to create an account and access this system. If you
          already have an account,{" "}
          <a
            href="/sign-in"
            className="font-bold hover:underline text-foreground/80"
          >
            sign in
          </a>
          .
        </p>
      </TutorialStep>
    </ol>
  );
}
