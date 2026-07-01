"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  order: number;
  active: boolean;
};

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadPost = async () => {
      try {
        const response = await fetch("/api/blog", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!result.success) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const foundPost = result.posts.find(
          (item: BlogPost) => item.slug === params.slug
        );

        if (!foundPost) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setPost(foundPost);
        setLoading(false);

        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 50);
      } catch {
        setNotFound(true);
        setLoading(false);
      }
    };

    loadPost();
  }, [params.slug]);

  return (
    <>
      <Header />

      <main
        style={{
          minHeight: "100vh",
          background: "#f8f6f2",
          paddingTop: "150px",
          paddingBottom: "80px",
          paddingLeft: "18px",
          paddingRight: "18px",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "760px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Link
            href="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "18px",
              borderRadius: "999px",
              background: "#ffffff",
              padding: "12px 18px",
              fontSize: "14px",
              fontWeight: 700,
              boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
            }}
          >
            <ArrowLeft size={18} />
            Назад до блогу
          </Link>

          {loading ? (
            <article
              style={{
                borderRadius: "34px",
                background: "#ffffff",
                padding: "28px",
                textAlign: "center",
                boxShadow: "0 24px 70px rgba(0,0,0,0.07)",
              }}
            >
              <Loader2 className="mx-auto animate-spin text-accent" size={30} />

              <h1
                style={{
                  marginTop: "16px",
                  fontSize: "28px",
                  fontWeight: 700,
                }}
              >
                Завантажуємо статтю...
              </h1>
            </article>
          ) : notFound || !post ? (
            <article
              style={{
                borderRadius: "34px",
                background: "#ffffff",
                padding: "28px",
                textAlign: "center",
                boxShadow: "0 24px 70px rgba(0,0,0,0.07)",
              }}
            >
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                }}
              >
                Статтю не знайдено
              </h1>
            </article>
          ) : (
            <article
              style={{
                width: "100%",
                boxSizing: "border-box",
                borderRadius: "34px",
                background: "#ffffff",
                padding: "18px",
                boxShadow: "0 24px 70px rgba(0,0,0,0.07)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  borderRadius: "28px",
                  background: "#f8f6f2",
                  padding: "22px",
                  overflow: "hidden",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#C9A96E",
                  }}
                >
                  daryna_makhraieva Blog
                </p>

                <h1
                  style={{
                    marginTop: "16px",
                    maxWidth: "100%",
                    overflowWrap: "break-word",
                    wordBreak: "break-word",
                    fontSize: "30px",
                    lineHeight: "1.14",
                    fontWeight: 700,
                    letterSpacing: "-0.06em",
                    color: "#252525",
                  }}
                >
                  {post.title}
                </h1>

                <p
                  style={{
                    marginTop: "18px",
                    maxWidth: "100%",
                    overflowWrap: "break-word",
                    wordBreak: "break-word",
                    fontSize: "16px",
                    lineHeight: "1.8",
                    color: "#77716b",
                  }}
                >
                  {post.excerpt}
                </p>

                <div
                  style={{
                    marginTop: "22px",
                    width: "100%",
                    boxSizing: "border-box",
                    borderRadius: "24px",
                    background: "#ffffff",
                    padding: "20px",
                    overflow: "hidden",
                  }}
                >
                  <p
                    style={{
                      maxWidth: "100%",
                      whiteSpace: "pre-line",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                      fontSize: "16px",
                      lineHeight: "1.85",
                      color: "#77716b",
                    }}
                  >
                    {post.content}
                  </p>
                </div>
              </div>
            </article>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}