import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import express, { type Express } from "express";
import request from "supertest";

/**
 * Route-level tests for POST /demo-session. The provisioning lib is mocked so we
 * can assert the route returns a ticket on success and degrades to a 503 (rather
 * than crashing) when provisioning throws.
 */

vi.mock("../lib/demoArtist", () => ({
  createDemoSignInTicket: vi.fn(),
}));

import { createDemoSignInTicket } from "../lib/demoArtist";

const mockedCreate = vi.mocked(createDemoSignInTicket);

let app: Express;

beforeEach(async () => {
  const { default: demoRouter } = await import("./demo");
  app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as unknown as { log: Record<string, () => void> }).log = {
      error: () => {},
      warn: () => {},
      info: () => {},
      debug: () => {},
    };
    next();
  });
  app.use("/api", demoRouter);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /demo-session", () => {
  it("returns 201 with a ticket on success", async () => {
    mockedCreate.mockResolvedValueOnce("ticket_abc");

    const res = await request(app).post("/api/demo-session").send();

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ticket: "ticket_abc" });
    expect(mockedCreate).toHaveBeenCalledTimes(1);
  });

  it("returns 503 (not a crash) when provisioning fails", async () => {
    mockedCreate.mockRejectedValueOnce(new Error("Clerk POST /users failed"));

    const res = await request(app).post("/api/demo-session").send();

    expect(res.status).toBe(503);
    expect(res.body).toEqual({ error: "Demo sign-in is not available" });
  });
});
