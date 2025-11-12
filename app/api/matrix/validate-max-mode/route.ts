import { NextRequest, NextResponse } from "next/server";

/**
 * Validate MAX MODE auth key
 * This endpoint checks if the provided auth key matches the server-side key
 */
export async function POST(request: NextRequest) {
  try {
    const { authKey } = await request.json();
    
    const serverKey = process.env.MATRIX_MAX_AUTH_KEY;
    
    if (!serverKey) {
      return NextResponse.json(
        { error: "MAX MODE not configured on server" },
        { status: 500 }
      );
    }
    
    if (authKey === serverKey) {
      return NextResponse.json({ valid: true }, { status: 200 });
    } else {
      return NextResponse.json({ valid: false }, { status: 401 });
    }
  } catch (error) {
    console.error("[MAX MODE] Validation error:", error);
    return NextResponse.json(
      { error: "Validation failed" },
      { status: 500 }
    );
  }
}

