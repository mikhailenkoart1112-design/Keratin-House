import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogSection from "@/components/blog/BlogSection";

export default function BlogPage() {
  return (
    <>
      <Header />

      <main
        style={{
          position: "relative",
          width: "100%",
          background: "#f8f6f2",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            backgroundImage: "url('/images/blog-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            background:
              "linear-gradient(180deg, rgba(248,246,242,0.08), rgba(248,246,242,0.34) 46%, #f8f6f2 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <section
            style={{
              width: "100%",
              padding: "128px 10px 54px 10px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "980px",
                margin: "0 auto",
              }}
            >
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.9)",
                  padding: "14px 22px",
                  fontSize: "15px",
                  fontWeight: 800,
                  color: "#2b2826",
                  textDecoration: "none",
                  boxShadow: "0 18px 45px rgba(0,0,0,0.08)",
                  backdropFilter: "blur(14px)",
                }}
              >
                <ArrowLeft style={{ marginRight: "8px" }} size={18} />
                На головну
              </Link>

              <div
                style={{
                  width: "100%",
                  maxWidth: "640px",
                  marginTop: "54px",
                  background: "rgba(255,255,255,0.88)",
                  borderRadius: "34px",
                  padding: "30px 32px 34px 32px",
                  boxShadow: "0 22px 60px rgba(0,0,0,0.10)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    lineHeight: "20px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "#c9a96e",
                  }}
                >
                  DARYNA_MAKHRAIEVA
                </p>

                <h1
                  style={{
                    marginTop: "16px",
                    marginBottom: 0,
                    fontSize: "46px",
                    lineHeight: "1.05",
                    fontWeight: 800,
                    letterSpacing: "-0.065em",
                    color: "#2b2826",
                  }}
                >
                  Корисні статті
                </h1>

                <p
                  style={{
                    marginTop: "16px",
                    marginBottom: 0,
                    maxWidth: "560px",
                    fontSize: "17px",
                    lineHeight: "1.75",
                    fontWeight: 600,
                    color: "#77716b",
                  }}
                >
                  Поради щодо догляду за волоссям, підготовки до процедур та
                  підтримання красивого результату.
                </p>
              </div>
            </div>
          </section>

          <BlogSection />
        </div>
      </main>

      <Footer />
    </>
  );
}