import { theme } from "../theme";

/**
 * Compact, faithful mock of the ULBS Coach chat app — shown on the MacBook
 * display. Sidebar with conversation rows + main chat with a user bubble,
 * an assistant answer, and the glowing composer at the bottom.
 */
export const AppScreen: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: theme.bg,
        fontFamily: theme.fontFamily,
        color: theme.text,
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 132,
          flexShrink: 0,
          background: "#0c0b10",
          borderRight: "1px solid rgba(232,228,240,0.07)",
          padding: "18px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Spark size={16} />
          <div style={{ height: 7, width: 64, borderRadius: 4, background: "rgba(232,228,240,0.5)" }} />
        </div>
        <div
          style={{
            height: 26,
            borderRadius: 8,
            background: "rgba(124,106,247,0.16)",
            border: "1px solid rgba(124,106,247,0.30)",
          }}
        />
        {[0.7, 0.5, 0.6, 0.45, 0.55, 0.4].map((w, i) => (
          <div
            key={i}
            style={{
              height: 6,
              width: `${w * 100}%`,
              borderRadius: 3,
              background: "rgba(232,228,240,0.16)",
            }}
          />
        ))}
      </div>

      {/* Main chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "26px 30px" }}>
        {/* User bubble */}
        <div style={{ alignSelf: "flex-end", maxWidth: "62%", marginBottom: 18 }}>
          <div
            style={{
              background: "rgba(124,106,247,0.16)",
              border: "1px solid rgba(124,106,247,0.30)",
              borderRadius: 14,
              padding: "10px 14px",
              fontSize: 13,
              color: theme.text,
            }}
          >
            How to learn for this exam?
          </div>
        </div>

        {/* Assistant answer */}
        <div style={{ display: "flex", gap: 10, maxWidth: "78%" }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: "rgba(124,106,247,0.12)",
              border: "1px solid rgba(124,106,247,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Spark size={13} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 8, width: "55%", borderRadius: 4, background: theme.brandGradient, marginBottom: 9 }} />
            {[0.95, 0.88, 0.7].map((w, i) => (
              <div key={i} style={{ height: 6, width: `${w * 100}%`, borderRadius: 3, background: "rgba(232,228,240,0.22)", marginBottom: 7 }} />
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Composer with glow */}
        <div
          style={{
            borderRadius: 14,
            padding: 1.5,
            background:
              "conic-gradient(from 210deg, transparent 0%, transparent 30%, #7c6af7 42%, #a78bfa 52%, #c084fc 62%, transparent 78%, transparent 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderRadius: 13,
              padding: "11px 14px",
              background: "#15131c",
              border: "1px solid rgba(124,106,247,0.30)",
            }}
          >
            <div style={{ flex: 1, fontSize: 12, color: theme.textFaint }}>Ask ULBS Coach anything…</div>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                background: theme.brandGradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M12 5l-7 7M12 5l7 7" stroke="#0c0b10" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Spark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="appSpark" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={theme.violetLight} />
        <stop offset="100%" stopColor={theme.violetPink} />
      </linearGradient>
    </defs>
    <path d="M50 4 C54 30 70 46 96 50 C70 54 54 70 50 96 C46 70 30 54 4 50 C30 46 46 30 50 4Z" fill="url(#appSpark)" />
  </svg>
);
