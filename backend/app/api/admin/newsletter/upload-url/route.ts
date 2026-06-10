import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

// Initialize the R2 client using standard S3 configuration
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const { filename, contentType } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: "Filename and content type are required" }, { status: 400 });
    }

    // Create a unique filename so old images aren't accidentally overwritten
    const uniqueFilename = `${Date.now()}-${filename.replace(/\s+/g, '-')}`;

    // Prepare the command for Cloudflare R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: uniqueFilename,
      ContentType: contentType,
    });

    // Generate a secure URL that expires in 60 seconds
    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 60 });
    
    // Construct the final public URL that will be saved in Supabase
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_URL}/${uniqueFilename}`;

    return NextResponse.json({ success: true, signedUrl, publicUrl });
  } catch (error) {
    console.error("Presigned URL error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate upload URL" }, { status: 500 });
  }
}