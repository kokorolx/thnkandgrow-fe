import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, tag, secret } = body;

    // Verify secret token for security
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Revalidate by tag
    if (tag) {
      revalidateTag(tag, '/');
      return NextResponse.json({
        revalidated: true,
        tag,
        now: Date.now(),
      });
    }

    // Revalidate by path
    if (path) {
      revalidatePath(path, 'page');
      return NextResponse.json({
        revalidated: true,
        path,
        now: Date.now(),
      });
    }

    return NextResponse.json(
      { error: 'Missing path or tag parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Error revalidating' },
      { status: 500 }
    );
  }
}
