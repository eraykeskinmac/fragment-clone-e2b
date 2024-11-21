import CodeInterpreter, { Sandbox } from "@e2b/code-interpreter";
import { CapsuleSchema } from "@/lib/schema";

const sandboxTimeout = 10 * 60 * 1000;

export async function POST(req: Request) {
  const {
    capsule,
    userID,
    apiKey,
  }: { capsule: CapsuleSchema; userID: string; apiKey?: string } =
    await req.json();

  let sbx: Sandbox | CodeInterpreter | undefined = undefined;

  if (capsule.template === "code-interpreter-multilang") {
    sbx = await CodeInterpreter.create({
      matedata: { template: capsule.template, userID: userID },
      timeoutMs: sandboxTimeout,
      apiKey,
    });
  } else {
    sbx = await Sandbox.create(capsule.template, {
      matedata: { template: capsule.template, userID: userID },
      timeoutMs: sandboxTimeout,
      apiKey,
    });
  }
}
