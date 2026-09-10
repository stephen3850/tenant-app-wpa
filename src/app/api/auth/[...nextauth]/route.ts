import { handlers } from "@/auth"
import { NextRequest } from "next/server"

const { GET: _GET, POST: _POST } = handlers

export async function GET(req: NextRequest) {
  return await _GET(req)
}

export async function POST(req: NextRequest) {
  return await _POST(req)
}
