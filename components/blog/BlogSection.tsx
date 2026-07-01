"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Plus, X } from "lucide-react";

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

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const response = await fetch("/api/blog", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!result.success) {
          setError("Не вдалося завантажити блог.");
          setLoading(false);
          return;
        }

        setPosts(result.posts || []);
        setVisibleCount(3);
        setLoading(false);
      } catch {
        setError("Помилка завантаження блогу.");
        setLoading(false);
      }
    };

    loadBlog();
  }, []);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => Number(a.order) - Number(b.order));
  }, [posts]);

  const visiblePosts = sortedPosts.slice(0, visibleCount);
  const hasMore = visibleCount < sortedPosts.length;

  return (
    <>
      <section
        style={{
          width: "100%",
          background: "transparent",
          paddingBottom: "96px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "980px",
            margin: "0 auto",
            paddingLeft: "10px",
            paddingRight: "10px",
            boxSizing: "border-box",
          }}
        >
          {loading ? (
            <div
              style={{
                background: "#fff",
                borderRadius: "34px",
                padding: "32px",
                textAlign: "center",
                boxShadow: "0 24px 65px rgba(0,0,0,0.07)",
              }}
            >
              <Loader2 className="mx-auto animate-spin text-accent" size={30} />

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em]">
                Завантажуємо блог...
              </h2>
            </div>
          ) : error ? (
            <div
              style={{
                background: "#fff1f1",
                borderRadius: "34px",
                padding: "32px",
                textAlign: "center",
              }}
            >
              <p style={{ fontWeight: 700, color: "#ef4444" }}>{error}</p>
            </div>
          ) : sortedPosts.length === 0 ? (
            <div
              style={{
                background: "#fff",
                borderRadius: "34px",
                padding: "32px",
                textAlign: "center",
                boxShadow: "0 24px 65px rgba(0,0,0,0.07)",
              }}
            >
              <p className="text-secondary">Статті скоро зʼявляться.</p>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gap: "24px",
                  width: "100%",
                }}
              >
                {visiblePosts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => setSelectedPost(post)}
                    style={{
                      display: "block",
                      width: "100%",
                      boxSizing: "border-box",
                      background: "#ffffff",
                      border: "none",
                      borderRadius: "34px",
                      boxShadow: "0 22px 60px rgba(0,0,0,0.07)",
                      textDecoration: "none",
                      color: "inherit",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "26px 30px 30px 30px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "12px",
                          lineHeight: "20px",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.18em",
                          color: "#c9a96e",
                          margin: 0,
                        }}
                      >
                        daryna_makhraieva
                      </p>

                      <h2
                        style={{
                          marginTop: "16px",
                          marginBottom: 0,
                          fontSize: "27px",
                          lineHeight: "1.22",
                          fontWeight: 700,
                          letterSpacing: "-0.055em",
                          color: "#2b2826",
                          overflowWrap: "break-word",
                          wordBreak: "normal",
                        }}
                      >
                        {post.title}
                      </h2>

                      <p
                        style={{
                          marginTop: "16px",
                          marginBottom: 0,
                          fontSize: "16px",
                          lineHeight: "1.75",
                          color: "#77716b",
                          overflowWrap: "break-word",
                          wordBreak: "normal",
                        }}
                      >
                        {post.excerpt}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {hasMore && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "34px",
                  }}
                >
                  <button
                    onClick={() => setVisibleCount((current) => current + 3)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      border: "none",
                      borderRadius: "999px",
                      background: "#c9a96e",
                      padding: "16px 26px",
                      fontSize: "15px",
                      fontWeight: 800,
                      color: "#ffffff",
                      cursor: "pointer",
                      boxShadow: "0 18px 40px rgba(201,165,122,0.35)",
                    }}
                  >
                    <Plus size={18} />
                    Показати ще
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedPost && (
          <motion.div
            onClick={() => setSelectedPost(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 90,
              background: "rgba(0,0,0,0.34)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              padding: "12px",
            }}
          >
            <motion.div
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.96 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              style={{
                width: "100%",
                maxWidth: "820px",
                maxHeight: "88vh",
                overflowY: "auto",
                background: "#ffffff",
                borderRadius: "34px",
                boxShadow: "0 30px 90px rgba(0,0,0,0.25)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "24px 24px 30px 24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "12px",
                        lineHeight: "20px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.18em",
                        color: "#c9a96e",
                        margin: 0,
                      }}
                    >
                      daryna_makhraieva
                    </p>

                    <h2
                      style={{
                        marginTop: "14px",
                        marginBottom: 0,
                        fontSize: "34px",
                        lineHeight: "1.08",
                        fontWeight: 800,
                        letterSpacing: "-0.065em",
                        color: "#2b2826",
                        overflowWrap: "break-word",
                      }}
                    >
                      {selectedPost.title}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPost(null)}
                    style={{
                      width: "48px",
                      height: "48px",
                      flexShrink: 0,
                      border: "none",
                      borderRadius: "999px",
                      background: "#f1ebe3",
                      color: "#2b2826",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <X size={23} />
                  </button>
                </div>

                <p
                  style={{
                    marginTop: "22px",
                    marginBottom: 0,
                    fontSize: "17px",
                    lineHeight: "1.8",
                    fontWeight: 600,
                    color: "#77716b",
                    overflowWrap: "break-word",
                  }}
                >
                  {selectedPost.excerpt}
                </p>

                <div
                  style={{
                    marginTop: "26px",
                    borderRadius: "28px",
                    background: "#f8f6f2",
                    padding: "22px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      whiteSpace: "pre-line",
                      fontSize: "16px",
                      lineHeight: "1.9",
                      color: "#5f5954",
                      overflowWrap: "break-word",
                    }}
                  >
                    {selectedPost.content}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}