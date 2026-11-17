import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Ogamoto",
  description: "Exporting only inspected and high-quality vehicles from Japan/Korea directly to Nigeria and Africa.",
};

// Root layout component providing baseline HTML skeleton, client wrapper, and Toast notices
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="antialiased" suppressHydrationWarning={true}>
        <ClientLayout>
          {children}
        </ClientLayout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </body>
    </html>
  );
}
