import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, AlertTriangle, ChevronLeft, ChevronRight, Loader2, MapPin, Home, Mail, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SecureTrace — Corporate Verification Portal" },
      {
        name: "description",
        content:
          "SecureTrace corporate verification portal. Enter your tracking code to verify shipment authenticity and view secure identification details.",
      },
      { property: "og:title", content: "SecureTrace — Corporate Verification Portal" },
      {
        property: "og:description",
        content: "Professional tracking code verification with secure card display.",
      },
    ],
  }),
  component: SecureTracePage,
});

function SecureTracePage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");
  const [side, setSide] = useState<"front" | "back">("front");
  const [sortingLocation, setSortingLocation] = useState("");
  const [departureLocation, setDepartureLocation] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [isEmailSending, setIsEmailSending] = useState(false);

  const handleSendEmail = () => {
    setEmailStatus("");
    if (!email || !email.includes("@")) {
      setEmailStatus("Please enter a valid email address");
      return;
    }
    setIsEmailSending(true);
    setTimeout(() => {
      setEmailStatus(`✓ Update requests will be sent to ${email}`);
      setIsEmailSending(false);
    }, 900);
  };

  const verifyTrackingCode = async () => {
    const code = trackingCode.trim().toUpperCase();
    if (!code) {
      setError("Please enter a tracking code");
      setIsValid(false);
      return;
    }
    setIsLoading(true);
    setError("");
    setIsValid(false);
    try {
      const { data, error: dbError } = await (supabase as any)
        .from("tracking_cards")
        .select("*")
        .eq("tracking_code", code)
        .maybeSingle();

      if (dbError || !data) {
        setError("Invalid Tracking Code");
      } else {
        setFrontImage(data.front_image_url);
        setBackImage(data.back_image_url);
        setSortingLocation(data.sorting_location ?? "");
        setDepartureLocation(data.departure_location ?? "");
        setStatus(data.status ?? "");
        setIsValid(true);
        setSide("front");
        setError("");
      }
    } catch {
      setError("Invalid Tracking Code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <header className="mb-10 flex items-center gap-4">
          <div className="depth-button flex h-12 w-12 items-center justify-center rounded-xl">
            <ShieldCheck className="h-6 w-6 text-text-primary" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary md:text-3xl">
              SecureTrace
            </h1>
            <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">
              Corporate Verification Portal
            </p>
          </div>
        </header>

        {/* Verification Card */}
        <section className="depth-card rounded-3xl p-6 md:p-10">
          <label
            htmlFor="tracking-code"
            className="mb-3 block text-xs font-medium uppercase tracking-[0.18em] text-text-secondary"
          >
            Tracking Code
          </label>
          <div className="flex flex-col gap-4 md:flex-row">
            <input
              id="tracking-code"
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") verifyTrackingCode();
              }}
              placeholder="e.g. AU-Y0312J9"
              className="depth-input flex-1 rounded-xl px-5 py-4 font-mono text-base tracking-wider"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={verifyTrackingCode}
              disabled={isLoading}
              className="depth-button depth-button-primary flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" strokeWidth={2} />
              )}
              {isLoading ? "Verifying" : "Verify"}
            </button>
          </div>

          {error && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-[color:var(--status-red)]/40 bg-[color:var(--status-red)]/15 px-5 py-4 text-sm text-text-primary">
              <AlertTriangle className="h-4 w-4 text-[color:var(--status-orange)]" />
              <span className="font-medium">{error}</span>
            </div>
          )}
        </section>

        {/* Success: Card preview + info */}
        {isValid && (
          <>
            <section className="mt-8 depth-card rounded-3xl p-6 md:p-8">
              <div className="overflow-hidden rounded-2xl bg-black/30">
                <img
                  src={side === "front" ? frontImage : backImage}
                  alt={side === "front" ? "Identification card front" : "Identification card back"}
                  className="block w-full select-none"
                  draggable={false}
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSide("front")}
                  className={`depth-button flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] ${
                    side === "front" ? "text-text-primary" : "text-text-secondary"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" /> Front
                </button>
                <button
                  type="button"
                  onClick={() => setSide("back")}
                  className={`depth-button flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] ${
                    side === "back" ? "text-text-primary" : "text-text-secondary"
                  }`}
                >
                  Back <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="depth-track rounded-2xl p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
                  Departure
                </p>
                <p className="mt-2 text-base font-semibold text-text-primary">
                  {departureLocation}
                </p>
              </div>
              <div className="depth-track rounded-2xl p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
                  Sorting
                </p>
                <p className="mt-2 text-base font-semibold text-text-primary">
                  {sortingLocation}
                </p>
              </div>
            </section>

            <section className="mt-4 depth-track flex items-center justify-between rounded-2xl px-5 py-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
                Status
              </span>
              <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-text-primary">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: "var(--status-orange)" }}
                />
                {status}
              </span>
            </section>
          </>
        )}

        <footer className="mt-12 text-center text-[10px] uppercase tracking-[0.22em] text-text-secondary">
          ISO 27001 · SOC 2 Compliant · Corporate Use Only
        </footer>
      </div>
    </main>
  );
}
