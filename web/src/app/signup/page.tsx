"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div
      className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-16"
      style={{ backgroundColor: "#0F1117" }}
    >
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "rounded-2xl p-8 shadow-none",
            headerTitle: "text-3xl font-bold text-white text-center",
            headerSubtitle: "text-[#8B8FA8] text-center",
            socialButtonsBlockButton: "hidden",
            dividerRow: "hidden",
            formFieldLabel: "text-[#8B8FA8] text-sm font-medium",
            formFieldInput: "w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#5c6070]",
            formButtonPrimary: "mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-[#0F1117] transition-all hover:opacity-90 active:scale-[0.98]",
            footerActionText: "text-[#8B8FA8]",
            footerActionLink: "text-[#4ECDC4] font-semibold",
          },
          variables: {
            colorPrimary: "#4ECDC4",
            colorBackground: "#1C1F26",
            colorText: "white",
            colorInputBackground: "#0F1117",
            colorInputBorder: "rgba(255,255,255,0.1)",
          },
        }}
        redirectUrl="/dashboard"
      />
    </div>
  );
}
