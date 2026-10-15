

import Link from "next/link";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "n159dle8",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: true,
});

type Book = {
  _id: string;
  title: string;
  subtitle?: string;
  author?: string;
  description?: string;
  coverImage?: {
    asset?: { url?: string };
  };
  pdf?: {
    asset?: {
      url?: string;
      originalFilename?: string;
    };
  };
  slug?: { current: string };
};

async function getBooks(): Promise<Book[]> {
  try {
    return await client.fetch(
      `*[_type == "book"] | order(title asc) {
        _id,
        title,
        subtitle,
        author,
        description,
        "slug": slug,
        "coverImage": coverImage { asset->{url} },
        "pdf": pdf { asset->{url, originalFilename} }
      }`
    );
  } catch {
    return [];
  }
}

export const revalidate = 60;

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <main className="min-h-screen bg-[#f8f4ed] px-5 py-12 text-[#402126] sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="text-sm font-medium text-[#8b5e3c] hover:underline"
        >
          ← Back to Home
        </Link>

        <header className="mb-10 mt-8">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#a77b45]">
            The Knowledge Library
          </p>
          <h1 className="text-4xl font-serif font-bold sm:text-5xl">
            Books & Reading Room
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#715d58]">
            Explore books, learn at your own pace, and read available PDFs
            online for free.
          </p>
        </header>

        {books.length === 0 ? (
          <section className="rounded-2xl border border-[#e6d9c9] bg-white/70 p-8">
            <h2 className="text-xl font-semibold">The library is being prepared</h2>
            <p className="mt-3 leading-7 text-[#715d58]">
              Books will appear here once they are published in the website
              studio. Please check back soon.
            </p>
          </section>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <article
                key={book._id}
                className="overflow-hidden rounded-2xl border border-[#e6d9c9] bg-white shadow-sm"
              >
                {book.coverImage?.asset?.url ? (
                  <img
                    src={book.coverImage.asset.url}
                    alt={book.title}
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-[#eadfce] text-5xl">
                    📚
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-xl font-semibold">{book.title}</h2>

                  {book.subtitle && (
                    <p className="mt-1 text-sm text-[#8b5e3c]">
                      {book.subtitle}
                    </p>
                  )}

                  {book.author && (
                    <p className="mt-2 text-sm text-[#715d58]">
                      By {book.author}
                    </p>
                  )}

                  {book.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#715d58]">
                      {book.description}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap gap-3">
                    {book.pdf?.asset?.url && (
                      <>
                        <a
                          href={book.pdf.asset.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-[#652d36] px-5 py-3 text-sm font-medium text-white hover:bg-[#4c2028]"
                        >
                          Read PDF
                        </a>
                        <a
                          href={book.pdf.asset.url}
                          download={book.pdf.asset.originalFilename || true}
                          className="rounded-full border border-[#652d36] px-5 py-3 text-sm font-medium hover:bg-[#f8f0e8]"
                        >
                          Download
                        </a>
                      </>
                    )}

                    {book.slug?.current && (
                      <Link
                        href={`/books/${book.slug.current}`}
                        className="rounded-full border border-[#d9c4b1] px-5 py-3 text-sm hover:bg-[#f8f0e8]"
                      >
                        Details
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <footer className="mt-16 border-t border-[#e6d9c9] pt-6 text-sm text-[#8b7770]">
          © {new Date().getFullYear()} · Books & Reading Room
        </footer>
      </div>
    </main>
  );
}
