import { colors, fontSizes } from "@/lib/tokens";

export default function Hero() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 20,
        maxWidth: 820,
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: fontSizes.hero,
          fontWeight: 700,
          lineHeight: 0.96,
          letterSpacing: "-0.03em",
          color: colors.text,
        }}
      >
        Your private tutor
        <br />
        for everything{" "}
        <em
          style={{
            fontStyle: "italic",
            color: colors.text,
            opacity: 0.7,
          }}
        >
          ULBS
        </em>
        .
      </h1>

      <p
        style={{
          margin: 0,
          fontSize: 18,
          lineHeight: 1.55,
          color: colors.textMuted,
          maxWidth: 520,
        }}
      >
        Ask anything from any course. Drop a PDF, get a citation.
        <br />
        Built on the university&apos;s own reading lists and lecture notes.
      </p>
    </div>
  );
}
