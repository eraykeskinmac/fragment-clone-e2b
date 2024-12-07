import { Message } from "@/lib/messsages";
import { CapsuleSchema } from "@/lib/schema";
import { ExecutionResult } from "@/lib/types";
import { DeepPartial } from "ai";
import { LoaderIcon, Terminal } from "lucide-react";

export function Chat({
  messages,
  isLoading,
  setCurrentPreview,
}: {
  messages: Message[];
  isLoading: boolean;
  setCurrentPreview: (preview: {
    capsule: DeepPartial<CapsuleSchema> | undefined;
    result: ExecutionResult | undefined;
  }) => void;
}) {
  return (
    <div id="chat-container">
      {messages.map((message: Message, index: number) => (
        <div>
          {message.content.map((content, id) => {
            if (content.type === "text") {
              return content.text;
            }
            if (content.type === "image") {
              return (
                <img key={id} src={content.image} alt="capsule" className="" />
              );
            }
          })}
          {message.object && (
            <div
              onClick={() =>
                setCurrentPreview({
                  capsule: message.object,
                  result: message.result,
                })
              }
            >
              <div>
                <Terminal strokeWidth={2} className="" />
              </div>
              <div>
                <span>{message.object.title}</span>
                <span>Click to see tiny code</span>
              </div>
            </div>
          )}
        </div>
      ))}
      {isLoading && (
        <div>
          <LoaderIcon strokeWidth={2} className="animate-spin w-4 h-4" />
          <span>Generating...</span>
        </div>
      )}
    </div>
  );
}
