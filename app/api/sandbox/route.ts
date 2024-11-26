import { CapsuleSchema } from "@/lib/schema";
import { ExecutionResultInterpreter, ExecutionResultWeb } from "@/lib/types";
import { Sandbox } from "@e2b/code-interpreter";

const sandboxTimeout = 10 * 60 * 1000; // 10 minute in ms
export const maxDuration = 60;

export async function POST(req: Request) {
  const {
    capsule,
    userID,
    apiKey,
  }: { capsule: CapsuleSchema; userID: string; apiKey?: string } =
    await req.json();

  console.log("capsule", capsule);
  console.log("userID", userID);

  const sbx = await Sandbox.create(capsule.template, {
    metadata: { template: capsule.template, userID: userID },
    timeoutMs: sandboxTimeout,
    apiKey,
  });

  // Install packages if needed
  if (capsule.additional_dependencies) {
    await sbx.commands.run(capsule.install_dependencies_command);
    console.log(
      `Installed dependencies: ${capsule.additional_dependencies.join(
        ", "
      )} in sandbox ${sbx.sandboxId}`
    );
  }

  // Handle file writing
  if (capsule.code && Array.isArray(capsule.code)) {
    for (const file of capsule.code) {
      await sbx.files.write(file.file_path, file.file_content);
      console.log(`Copied file to ${file.file_path} in ${sbx.sandboxId}`);
    }
  } else if (capsule.code) {
    await sbx.files.write(capsule.file_path, capsule.code);
    console.log(`Copied file to ${capsule.file_path} in ${sbx.sandboxId}`);
  }

  // Handle code execution or return sandbox URL
  if (capsule.template === "ty-nextjs-developer") {
    const { logs, error, results } = await sbx.runCode(capsule.code || "");

    return new Response(
      JSON.stringify({
        sbxId: sbx.sandboxId,
        template: capsule.template,
        stdout: logs.stdout,
        stderr: logs.stderr,
        runtimeError: error,
        cellResults: results,
      } as ExecutionResultInterpreter)
    );
  }

  return new Response(
    JSON.stringify({
      sbxId: sbx.sandboxId,
      template: capsule.template,
      url: `https://${sbx.getHost(capsule.port || 80)}`,
    } as ExecutionResultWeb)
  );
}
