import { DepartmentProvider } from "@/context/DepartmentContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DepartmentProvider>{children}</DepartmentProvider>
      </body>
    </html>
  );
}
