import "./css/global.css";
import "./css/page.css";

export const metadata = {
  title: "Sorting Wheel",
  description: "A spinner for picking contestant order.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
