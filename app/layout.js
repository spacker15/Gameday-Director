
import "../styles/globals.css";

export const metadata = {
  title: "LeagueOps Live v16",
  description: "Game Day Operations Command Center"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
