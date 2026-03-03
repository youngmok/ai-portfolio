// Static stub for next/navigation used in Vitest (no Next.js runtime).
// Individual tests override usePathname via vi.mocked() as needed.
import { vi } from "vitest";

export const usePathname = vi.fn(() => "/");
export const useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
}));
export const useSearchParams = vi.fn(() => new URLSearchParams());
