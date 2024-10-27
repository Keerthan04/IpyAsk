import type { Metadata } from "next";
import { Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
// import { Toaster } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";

const source_code_pro = Source_Code_Pro({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IPyAsk - AI-Powered Jupyter Notebook Assistant",
  description:
    "Upload your Jupyter notebooks and get instant, contextual AI answers powered by RAG and Gemini AI. Get code explanations, debugging help, and insights without leaving your notebook context.",
  keywords: [
    "Jupyter Notebook",
    "AI Assistant",
    "Python",
    "RAG",
    "Gemini AI",
    "code explanation",
    "debugging",
    "notebook analysis",
    "contextual AI",
    "coding help",
  ],
  authors: [{ name: "Your Name" }],
  icons: {
    icon: {
      url: "/icon.svg",
      type: "image/svg+xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/public/icon.svg" type="image/svg+xml" />
      </head> 
      <body className={source_code_pro.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
