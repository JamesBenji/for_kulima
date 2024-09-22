import Hero from "@/components/hero";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";

export default async function Index() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4 w-full">
        <h2 className="font-medium text-xl mb-4">Next step</h2>
        <SignUpUserSteps />
      </main>
    </>
  );
}
