import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || "tienda-deploy-secret-2024";

function verifySignature(payload: string, signature: string | null): boolean {
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  const digest = "sha256=" + hmac.update(payload).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-hub-signature-256");

    // Verify GitHub signature
    if (!verifySignature(payload, signature)) {
      console.log("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = request.headers.get("x-github-event");
    const body = JSON.parse(payload);

    // Only deploy on push to main branch
    if (event === "push" && body.ref === "refs/heads/main") {
      console.log("Received push to main, starting deploy...");

      // Execute deploy script in background
      execAsync("/var/www/vhosts/imegamobile.com/tienda.esix.online/deploy.sh")
        .then(({ stdout, stderr }) => {
          console.log("Deploy completed:", stdout);
          if (stderr) console.error("Deploy stderr:", stderr);
        })
        .catch((error) => {
          console.error("Deploy failed:", error);
        });

      return NextResponse.json({
        message: "Deploy started",
        commit: body.after?.substring(0, 7),
        pusher: body.pusher?.name
      });
    }

    return NextResponse.json({ message: "Event ignored", event });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Webhook endpoint active",
    usage: "POST with GitHub webhook payload"
  });
}
