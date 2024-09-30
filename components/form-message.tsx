
export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  console.log({message})
  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      {"success" in message && (
        <div className="text-foreground text-center border-l-2 border-foreground px-4">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="text-red-400 border-l-2 border-l-red-500 bg-red-100 py-5 text-center">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="text-foreground border-l-2 text-center px-4">{message.message}</div>
      )}
    </div>
  );
}
