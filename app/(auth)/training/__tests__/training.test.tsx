import { describe, it, expect, vi, beforeEach } from "vitest";
import TrainingPage from "../page";
import { verifyAuth } from "@/lib/auth";
import { getTrainings } from "@/lib/training";
import { redirect } from "next/navigation";

vi.mock("@/lib/auth", () => ({
  verifyAuth: vi.fn(),
}));

vi.mock("@/lib/training", () => ({
  getTrainings: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

describe("TrainingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects unauthenticated users", async () => {
    vi.mocked(verifyAuth).mockResolvedValue({
      user: null, session: null,
    });

    await expect(TrainingPage()).rejects.toThrow("NEXT_REDIRECT");

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("does not redirect authenticated users", async () => {
    vi.mocked(verifyAuth).mockResolvedValue({
      user: { id: '1' },
      session: { id: 'session1', expiresAt: new Date(), fresh: true, userId: '1' },
    });

    vi.mocked(getTrainings).mockReturnValue([]);

    await TrainingPage();

    expect(redirect).not.toHaveBeenCalled();
  });

  it("calls verifyAuth once", async () => {
    vi.mocked(verifyAuth).mockResolvedValue({
      user: { id: '1' },
      session: { id: 'session1', expiresAt: new Date(), fresh: true, userId: '1' },
    });

    vi.mocked(getTrainings).mockReturnValue([]);

    await TrainingPage();

    expect(verifyAuth).toHaveBeenCalledTimes(1);
  });

  it("calls getTrainings for authenticated users", async () => {
    vi.mocked(verifyAuth).mockResolvedValue({
      user: { id: '1' },
      session: { id: 'session1', expiresAt: new Date(), fresh: true, userId: '1' },
    });

    vi.mocked(getTrainings).mockReturnValue([]);

    await TrainingPage();

    expect(getTrainings).toHaveBeenCalledTimes(1);
  });

  it("does not call getTrainings for unauthenticated users", async () => {
    vi.mocked(verifyAuth).mockResolvedValue({
      user: null,
      session: null,
    });

    await expect(TrainingPage()).rejects.toThrow("NEXT_REDIRECT");

    expect(getTrainings).not.toHaveBeenCalled();
  });
});