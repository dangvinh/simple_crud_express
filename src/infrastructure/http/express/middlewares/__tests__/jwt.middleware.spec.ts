import { authenticateJWT } from "../jwt.middleware";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

jest.mock("jsonwebtoken");
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe("authenticateJWT", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 401 if no Authorization header", () => {
    authenticateJWT(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing or invalid Authorization header",
    });
  });

  it("should return 401 if Authorization header is malformed", () => {
    req.headers = { authorization: "BadToken" };
    authenticateJWT(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing or invalid Authorization header",
    });
  });

  it("should return 403 if token is invalid", () => {
    req.headers = { authorization: "Bearer invalidtoken" };
    mockedJwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authenticateJWT(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or expired token",
    });
  });

  it("should call next if token is valid", () => {
    req.headers = { authorization: "Bearer validtoken" };
    const payload = { userId: "123" };
    mockedJwt.verify.mockReturnValue(
      payload as unknown as ReturnType<typeof jwt.verify>,
    );

    authenticateJWT(req as Request, res as Response, next);
    expect((req as any).user).toEqual(payload);
    expect(next).toHaveBeenCalled();
  });
  it("should attach user with role in payload", () => {
    req.headers = { authorization: "Bearer rolebasedtoken" };
    const payload = { userId: "123", role: "admin" };
    mockedJwt.verify.mockReturnValue(
      payload as unknown as ReturnType<typeof jwt.verify>,
    );

    authenticateJWT(req as Request, res as Response, next);
    expect((req as any).user).toEqual(payload);
    expect(next).toHaveBeenCalled();
  });

  it("should attach user with scope in payload", () => {
    req.headers = { authorization: "Bearer scopetoken" };
    const payload = { userId: "123", scope: ["product:read", "product:write"] };
    mockedJwt.verify.mockReturnValue(
      payload as unknown as ReturnType<typeof jwt.verify>,
    );

    authenticateJWT(req as Request, res as Response, next);
    expect((req as any).user).toEqual(payload);
    expect(next).toHaveBeenCalled();
  });
});
