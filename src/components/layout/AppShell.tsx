"use client";

import { useEffect } from "react";
import { useAppStore, hydrateAppStore } from "@/stores/useAppStore";
import { usePlaylist } from "@/hooks/usePlaylist";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { MobileMenu } from "./MobileMenu";
import { VideoPlayer } from "../player/VideoPlayer";
import { LoadingScreen } from "../feedback/LoadingScreen";
import { ErrorState } from "../feedback/ErrorState";
import { HomeView } from "../views/HomeView";
import { FavoritesView } from "../views/FavoritesView";
import { CategoriesView } from "../views/CategoriesView";
import { SettingsView } from "../views/SettingsView";
import { AboutView } from "../views/AboutView";

export function AppShell() {
  const activeView = useAppStore((s) => s.activeView);
  const playlistStatus = useAppStore((s) => s.playlistStatus);
  const playlistError = useAppStore((s) => s.playlistError);
  const { refresh } = usePlaylist();

  useEffect(() => {
    hydrateAppStore();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-ink-900 text-mist-100">
      <TopBar />
      <MobileMenu />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1">
        <Sidebar />

        <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-6">
          {playlistStatus === "loading" && <LoadingScreen />}

          {playlistStatus === "error" && (
            <ErrorState
              titleKey={
                playlistError === "network"
                  ? "networkErrorTitle"
                  : playlistError === "empty"
                  ? "emptyPlaylistTitle"
                  : "playlistErrorTitle"
              }
              onRetry={refresh}
            />
          )}

          {playlistStatus === "ready" && (
            <div className="flex flex-col gap-6">
              <VideoPlayer />

              {activeView === "home" && <HomeView />}
              {activeView === "favorites" && <FavoritesView />}
              {activeView === "categories" && <CategoriesView />}
              {activeView === "settings" && <SettingsView />}
              {activeView === "about" && <AboutView />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
