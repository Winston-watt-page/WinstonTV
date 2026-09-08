"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, RefreshCw, ListVideo } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { useHlsPlayer } from "@/hooks/useHlsPlayer";
import { PlayerControls } from "./PlayerControls";
import { useI18n } from "@/i18n";

const CONTROLS_HIDE_DELAY = 3000;

export function VideoPlayer() {
  const { t } = useI18n();
  const channels = useAppStore((s) => s.channels);
  const currentChannelId = useAppStore((s) => s.currentChannelId);
  const selectChannel = useAppStore((s) => s.selectChannel);
  const volume = useAppStore((s) => s.volume);
  const setVolume = useAppStore((s) => s.setVolume);
  const muted = useAppStore((s) => s.muted);
  const setMuted = useAppStore((s) => s.setMuted);
  const quality = useAppStore((s) => s.quality);
  const setQuality = useAppStore((s) => s.setQuality);
  const isFullscreen = useAppStore((s) => s.isFullscreen);
  const setFullscreen = useAppStore((s) => s.setFullscreen);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [controlsVisible, setControlsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPipSupported, setIsPipSupported] = useState(false);

  const currentChannel = useMemo(
    () => channels.find((c) => c.id === currentChannelId) ?? null,
    [channels, currentChannelId]
  );

  const { status, variants, activeQuality, setQuality: applyQuality, retryNow } = useHlsPlayer({
    videoRef,
    url: currentChannel?.url ?? null,
    onStatusChange: (s) => setIsPlaying(s === "playing"),
  });

  useEffect(() => {
    setIsPipSupported(
      typeof document !== "undefined" && "pictureInPictureEnabled" in document
    );
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    video.muted = muted;
  }, [volume, muted]);

  useEffect(() => {
    applyQuality(quality);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality, currentChannelId]);

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), CONTROLS_HIDE_DELAY);
  }, []);

  const wake = useCallback(() => {
    setControlsVisible(true);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    wake();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [wake, currentChannelId]);

  useEffect(() => {
    function onFsChange() {
      setFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, [setFullscreen]);

  // Global keyboard shortcuts scoped to when the player has "focus context".
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (e.key === "f" || e.key === "F") toggleFullscreen();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  function toggleMute() {
    setMuted(!muted);
  }

  function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen?.().catch(() => {});
    }
  }

  async function togglePip() {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch {
      // PiP can silently fail (e.g. not user-gesture triggered in some browsers).
    }
  }

  function goToOffset(offset: number) {
    if (!channels.length || !currentChannelId) return;
    const idx = channels.findIndex((c) => c.id === currentChannelId);
    if (idx === -1) return;
    const nextIdx = (idx + offset + channels.length) % channels.length;
    selectChannel(channels[nextIdx].id);
  }

  if (!currentChannel) {
    return (
      <div className="flex min-h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border border-white/5 bg-ink-800 px-4 py-8 text-center">
        <ListVideo className="h-8 w-8 text-mist-700" aria-hidden="true" />
        <p className="text-sm font-medium text-mist-300">{t("noChannelSelected")}</p>
        <p className="text-xs text-mist-500">{t("selectChannelHint")}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="group relative aspect-video w-full overflow-hidden rounded-xl bg-black"
      onMouseMove={wake}
      onTouchStart={wake}
    >
      <video
        ref={videoRef}
        className="h-full w-full"
        playsInline
        autoPlay
        aria-label={currentChannel.name}
      />

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Loader2 className="h-8 w-8 animate-spin text-marigold-400" aria-hidden="true" />
        </div>
      )}

      {(status === "error" || status === "unavailable") && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 px-6 text-center">
          <p className="text-sm font-medium text-white">{t("streamUnavailableTitle")}</p>
          <p className="max-w-xs text-xs text-mist-400">{t("streamUnavailableBody")}</p>
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={retryNow}
              className="flex items-center gap-1.5 rounded-full bg-marigold-500 px-4 py-2 text-xs font-medium text-ink-950 hover:bg-marigold-400"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {t("retry")}
            </button>
            <button
              type="button"
              onClick={() => goToOffset(1)}
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white hover:bg-white/10"
            >
              {t("browseChannels")}
            </button>
          </div>
        </div>
      )}

      <PlayerControls
        channel={currentChannel}
        isPlaying={isPlaying}
        isMuted={muted}
        volume={volume}
        isFullscreen={isFullscreen}
        isPipSupported={isPipSupported}
        variants={variants}
        activeQuality={activeQuality}
        visible={controlsVisible}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        onVolumeChange={setVolume}
        onToggleFullscreen={toggleFullscreen}
        onTogglePip={togglePip}
        onPrevious={() => goToOffset(-1)}
        onNext={() => goToOffset(1)}
        onQualityChange={setQuality}
      />
    </div>
  );
}
