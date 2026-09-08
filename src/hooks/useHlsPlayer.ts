"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls, { Level } from "hls.js";
import type { HlsVariant, PlayerStatus, QualityLevel } from "@/types/channel";
import { STREAM_AUTO_RETRY_ATTEMPTS, STREAM_AUTO_RETRY_DELAY_MS } from "@/config";

function levelHeightToLabel(height: number | null): string {
  if (!height) return "Auto";
  if (height >= 1080) return "1080p";
  if (height >= 720) return "720p";
  if (height >= 576) return "576p";
  if (height >= 480) return "480p";
  return "360p";
}

interface UseHlsPlayerOptions {
  videoRef: React.RefObject<HTMLVideoElement>;
  url: string | null;
  onStatusChange?: (status: PlayerStatus) => void;
}

export function useHlsPlayer({ videoRef, url, onStatusChange }: UseHlsPlayerOptions) {
  const hlsRef = useRef<Hls | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [variants, setVariants] = useState<HlsVariant[]>([]);
  const [activeQuality, setActiveQualityState] = useState<QualityLevel>("auto");

  const setStatusBoth = useCallback(
    (s: PlayerStatus) => {
      setStatus(s);
      onStatusChange?.(s);
    },
    [onStatusChange]
  );

  const destroyHls = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  const attemptRetry = useCallback(() => {
    if (retryCountRef.current >= STREAM_AUTO_RETRY_ATTEMPTS) {
      setStatusBoth("error");
      return;
    }
    retryCountRef.current += 1;
    retryTimerRef.current = setTimeout(() => {
      if (hlsRef.current && url) {
        hlsRef.current.loadSource(url);
      }
    }, STREAM_AUTO_RETRY_DELAY_MS);
  }, [setStatusBoth, url]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) {
      destroyHls();
      setStatusBoth("idle");
      return;
    }

    retryCountRef.current = 0;
    setStatusBoth("loading");
    setVariants([]);
    destroyHls();

    const isNativeHls = video.canPlayType("application/vnd.apple.mpegurl");

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 30,
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, (_evt, data) => {
        const levels: HlsVariant[] = data.levels.map((lvl: Level, i: number) => ({
          index: i,
          height: lvl.height ?? null,
          bitrate: lvl.bitrate,
          label: levelHeightToLabel(lvl.height ?? null),
        }));
        setVariants(levels);
        video.play().catch(() => {
          /* Autoplay might be blocked until user interacts; that's fine. */
        });
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, () => {
        setStatusBoth("playing");
      });

      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (!data.fatal) return;
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            attemptRetry();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError();
            break;
          default:
            setStatusBoth("error");
            destroyHls();
        }
      });

      hls.loadSource(url);
      hls.attachMedia(video);
    } else if (isNativeHls) {
      video.src = url;
      video.addEventListener(
        "loadedmetadata",
        () => {
          video.play().catch(() => {});
        },
        { once: true }
      );
      video.addEventListener("error", () => attemptRetry());
    } else {
      setStatusBoth("unavailable");
    }

    const onPlaying = () => setStatusBoth("playing");
    const onPause = () => setStatusBoth("paused");
    const onWaiting = () => setStatusBoth("loading");

    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);

    return () => {
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      destroyHls();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const setQuality = useCallback((quality: QualityLevel) => {
    setActiveQualityState(quality);
    const hls = hlsRef.current;
    if (!hls) return;
    if (quality === "auto") {
      hls.currentLevel = -1;
      return;
    }
    const targetIndex = hls.levels.findIndex(
      (lvl) => levelHeightToLabel(lvl.height ?? null) === quality
    );
    if (targetIndex >= 0) hls.currentLevel = targetIndex;
  }, []);

  const retryNow = useCallback(() => {
    retryCountRef.current = 0;
    const video = videoRef.current;
    if (hlsRef.current && url) {
      hlsRef.current.loadSource(url);
      setStatusBoth("loading");
    } else if (video && url) {
      video.src = url;
      video.load();
      setStatusBoth("loading");
    }
  }, [url, setStatusBoth, videoRef]);

  return { status, variants, activeQuality, setQuality, retryNow };
}
