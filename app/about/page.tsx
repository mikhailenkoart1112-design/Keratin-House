import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AboutSection from "@/components/about/AboutSection";

export default function AboutPage() {
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
            backgroundImage: "url('/images/about-bg.png')",
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
              "linear-gradient(180deg, rgba(248,246,242,0.10), rgba(248,246,242,0.35) 45%, #f8f6f2 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <AboutSection />
        </div>
      </main>

      <Footer />
    </>
  );
}