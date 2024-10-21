import TextAreaAutoSize from "react-textarea-autosize";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { Paperclip } from "lucide-react";

export function ChatInput({
  error,
  retry,
  isLoading,
  stop,
  input,
  handleInputChange,
  handleSubmit,
  files,
  handleFileChange,
  children,
  isMultiModal,
}: {
  error: undefined | unknown;
  retry: () => void;
  isLoading: boolean;
  stop: () => void;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  files: File[];
  handleFileChange: (files: File[]) => void;
  children: React.ReactNode;
  isMultiModal: boolean;
}) {
  return (
    <form action="" className="mb-2 flex flex-col mt-auto bg-background">
      {error !== undefined && (
        <div>An unexpected error has occurred. Please try again later</div>
      )}
      <div className="shadow-md rounded-2xl border">
        <div className="flex items-center">{children}</div>
        <TextAreaAutoSize
          autoFocus={true}
          minRows={1}
          maxRows={5}
          required={true}
          className="text-normal px-3 resize-none ring-0 bg-inherit w-full m-0 outline-none"
          placeholder="Describe your app imagination..."
          value={input}
          onChange={handleInputChange}
        />
        <div>
          <input
            type="file"
            id="multimodal"
            accept="image/*"
            multiple={true}
            className="hidden"
            onChange={() => {}}
          />
          <div>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    disabled={!isMultiModal}
                    type="button"
                    variant={"outline"}
                    size={"icon"}
                    className="rounded-xl h-10 w-10"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("multimodal")?.click();
                    }}
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add attachemnts</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </form>
  );
}
