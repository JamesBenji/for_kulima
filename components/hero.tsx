import { LinearGradient } from "react-text-gradients";

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex flex-col ">
        <span className="text-3xl lg:text-4xl !leading-tight tracking-tight max-w-xl font-semibold ">
          Know your farmers with
        </span>{" "}
        <span className="font-bold text-8xl text-center mt-1">
          <LinearGradient gradient={["to left", "#17acff ,#00ff00"]}>
            Kulima
          </LinearGradient>
        </span>
      </div>

      <div className="w-full p-[1px] bg-gradient-to-r from-[#00ff00]  via-[#17acff] to-via-foreground/10 my-8" />
    </div>
  );
}
