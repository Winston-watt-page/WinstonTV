import type { Channel } from "@/types/channel";

export function filterBySearch(channels: Channel[], query: string): Channel[] {
  const q = query.trim().toLowerCase();
  if (!q) return channels;
  return channels.filter((c) => {
    return (
      c.name.toLowerCase().includes(q) ||
      (c.tvgName ?? "").toLowerCase().includes(q) ||
      c.group.toLowerCase().includes(q) ||
      (c.language ?? "").toLowerCase().includes(q) ||
      (c.country ?? "").toLowerCase().includes(q)
    );
  });
}

export function filterByCategory(channels: Channel[], category: string): Channel[] {
  if (!category || category === "All") return channels;
  return channels.filter((c) => c.group === category);
}

export function deriveCategories(channels: Channel[]): string[] {
  const set = new Set<string>();
  channels.forEach((c) => set.add(c.group));
  return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
}

export function initialsFromName(name: string): string {
  const clean = name.trim();
  if (!clean) return "W";
  return clean[0].toUpperCase();
}

export function isValidChannelUrl(url: string): boolean {
  if (!url || url.trim() === "") return false;
  
  try {
    const parsed = new URL(url);
    const validProtocols = ["http:", "https:", "rtmp:", "rtmps:"];
    if (!validProtocols.includes(parsed.protocol)) return false;
    
    const hostname = parsed.hostname.toLowerCase();
    const invalidDomains = [
      "example.com",
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "invalid",
      "broken",
      "error",
      "timeout",
    ];
    
    if (invalidDomains.some(invalid => hostname.includes(invalid))) return false;
    
    return true;
  } catch {
    return false;
  }
}

export function filterValidChannels(channels: Channel[]): Channel[] {
  return channels.filter(channel => {
    if (!channel.name || channel.name.trim() === "") return false;
    if (!isValidChannelUrl(channel.url)) return false;
    return true;
  });
}
