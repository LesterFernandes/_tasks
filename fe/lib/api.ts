import ky from "ky";

export const api = ky.create({
  baseUrl: "http://localhost:3020",
  credentials: "include", // Automatically sends & saves your httpOnly cookie
});
