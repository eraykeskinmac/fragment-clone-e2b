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
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  files: File[];
  handleFileChange: (files: File[]) => void;
  children: React.ReactNode;
  isMultiModal: boolean;
}) {
  return (
    <form action="">
      {error !== undefined && <div>An unexpected error has occurred. Please try again later</div>}
    </form>
  );
}
