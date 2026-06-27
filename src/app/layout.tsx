import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import { ProgressProvider } from "@/components/providers/ProgressProvider";
import { SidebarProvider } from "@/components/providers/SidebarProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SDET Handbook — Complete Interview Preparation Platform",
  description:
    "Master the complete SDET syllabus for Cognizant interviews. Covers Selenium WebDriver, REST Assured, Appium, JMeter, REST/SOAP/WSDL and more with interactive learning, quizzes, and progress tracking.",
  keywords: ["SDET", "Selenium", "REST Assured", "Appium", "JMeter", "interview preparation", "test automation"],
  authors: [{ name: "SDET Handbook" }],
  openGraph: {
    title: "SDET Handbook — Complete Interview Preparation Platform",
    description: "Master the complete SDET syllabus with interactive learning, quizzes, and progress tracking.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <head>
        <meta name="theme-color" content="#0B0B0D" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="bg-[#0B0B0D] text-white antialiased">
        <ProgressProvider>
          <SidebarProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ProgressProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#17171B",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#10B981", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#EF4444", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
