import "./style.css";

export const metadata = {
  title: "Bit Automata Release Notes",
  description: "Release notes pubbliche di Bit Automata"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
