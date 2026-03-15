
import "../styles/globals.css";

export const metadata = {
  title: "LeagueOps Live v10.1",
  description: "Game Day Operations Platform"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
