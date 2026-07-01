import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GallerySection from "@/components/gallery/GallerySection";

export default function GalleryPage() {
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
            backgroundImage: "url('/images/gallery-bg.png')",
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
              "linear-gradient(180deg, rgba(248,246,242,0.12), rgba(248,246,242,0.38) 45%, #f8f6f2 100%)",
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
              padding: "130px 10px 42px 10px",
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
              <div
                style={{
                  width: "100%",
                  maxWidth: "620px",
                  background: "rgba(255,255,255,0.84)",
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
                  Галерея робіт
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
                  Приклади догляду, відновлення, кератину, ботоксу та красивого
                  результату після процедур.
                </p>
              </div>
            </div>
          </section>

          <div
            style={{
              position: "relative",
              zIndex: 2,
              width: "100%",
            }}
          >
            <GallerySection />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}