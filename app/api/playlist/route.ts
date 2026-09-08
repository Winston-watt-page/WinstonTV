import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_PLAYLIST_URL } from "@/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isAllowedPlaylistUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Thin server-side proxy that fetches the configured M3U playlist text.
 * This exists purely to sidestep browser CORS restrictions on some
 * playlist hosts; it does not proxy video streams and requires no
 * database, auth, or persistent backend state.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url") || DEFAULT_PLAYLIST_URL;

  if (!isAllowedPlaylistUrl(url)) {
    return NextResponse.json({ error: "Invalid playlist URL" }, { status: 400 });
  }

  try {
    const upstream = await fetch(url, {
      headers: { "User-Agent": "WinstonTV/1.0 (+https://winstontv.app)" },
      // Playlists change infrequently; let the edge cache briefly.
      next: { revalidate: 900 },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${upstream.status}` },
        { status: 502 }
      );
    }

    const text = await upstream.text();

    if (!text || !text.includes("#EXTM3U")) {
      return NextResponse.json({ error: "Response was not a valid M3U playlist" }, { status: 422 });
    }

    return new NextResponse(text, {
      status: 200,
      headers: {
        "Content-Type": "audio/x-mpegurl; charset=utf-8",
        "Cache-Control": "public, max-age=900, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch playlist", detail: (error as Error).message },
      { status: 502 }
    );
  }
}
