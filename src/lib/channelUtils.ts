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
    
    // For web applications, only HTTP/HTTPS protocols work in browsers
    // RTMP/RTMPS are not supported in web browsers
    const validProtocols = ["http:", "https:"];
    if (!validProtocols.includes(parsed.protocol)) return false;
    
    const hostname = parsed.hostname.toLowerCase();
    
    // Filter out obviously invalid or problematic domains
    const invalidDomains = [
      "example.com",
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "invalid",
      "broken",
      "error",
      "timeout",
      "test",
      "sample",
      "demo",
      "placeholder",
    ];
    
    if (invalidDomains.some(invalid => hostname.includes(invalid))) return false;
    
    // Filter out private IP ranges that won't work from public web
    const privateIPPatterns = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
    ];
    
    if (privateIPPatterns.some(pattern => pattern.test(hostname))) return false;
    
    // Require HTTPS for better security and compatibility
    // (allow HTTP for some legacy streams but prefer HTTPS)
    
    return true;
  } catch {
    return false;
  }
}

export function filterValidChannels(channels: Channel[]): Channel[] {
  return channels.filter(channel => {
    // Validate channel name
    if (!channel.name || channel.name.trim() === "") return false;
    
    // Filter out test/sample channels
    const lowerName = channel.name.toLowerCase();
    const invalidNames = [
      "test",
      "sample",
      "demo",
      "placeholder",
      "example",
      "invalid",
      "broken",
      "timeout",
      "error",
      "not found",
      "unavailable",
      "offline",
    ];
    
    if (invalidNames.some(invalid => lowerName.includes(invalid))) return false;
    
    // Validate URL
    if (!isValidChannelUrl(channel.url)) return false;
    
    // Filter out obviously duplicate channels (same URL and similar name)
    // This will be handled separately if needed
    
    return true;
  });
}
