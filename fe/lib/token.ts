import { TUser } from "@/types";
import { decodeJwt, type JWTPayload } from "jose";

type UserClaims = JWTPayload & Pick<TUser, "email" | "role" | "id">;

export function readTokenClaims(token: string) {
  return decodeJwt<UserClaims>(token);
}
