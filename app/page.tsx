"use client";
import { AuthDialog } from "@/components/auth-dialog";
import { Chat } from "@/components/chat";
import { ChatInput } from "@/components/chat-input";
import { ChatPicker } from "@/components/chat-picker";
import { Navbar } from "@/components/navbar";
import { AuthViewType, useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { use, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import modelsList from "@/lib/models.json";
import templates, { TemplateId } from "@/lib/templates";
import { ChatSettings } from "@/components/chat-settings";
import { LLMModelConfig } from "@/lib/models";
import { Message, toAISDKMessages } from "@/lib/messsages";
import { DeepPartial } from "ai";
import { CapsuleSchema, capsuleSchema as schema } from "@/lib/schema";
import { experimental_useObject as useObject } from "ai/react";
import { usePostHog } from "posthog-js/react";
import { ExecutionResult } from "@/lib/types";

export default function Home() {
  const [isAuthDialogOpen, setAuthDialog] = useState(false);
  const [authView, setAuthView] = useState<AuthViewType>("sign_in");
  const { session } = useAuth(setAuthDialog, setAuthView);
  const [chatInput, setChatInput] = useLocalStorage("chat", "");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<"auto" | TemplateId>(
    "auto"
  );
  const [languageModel, setLanguageModel] = useLocalStorage("languageModel", {
    model: "gpt-4o-mini",
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [capsule, setCapsule] = useState<DeepPartial<CapsuleSchema>>();
  const [currentTab, setCurrentTab] = useState<"code" | "capsule">("code");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [result, setResult] = useState<ExecutionResult>();

  const posthog = usePostHog();

  function setCurrentPreview(preview: {
    capsule: DeepPartial<CapsuleSchema> | undefined;
    result: ExecutionResult | undefined;
  }) {
    setCapsule(preview.capsule);
    setResult(preview.result);
  }

  function setMessage(message: Partial<Message>, index?: number) {
    setMessages((previousMessages) => {
      const updatedMessages = [...previousMessages];
      updatedMessages[index ?? previousMessages.length - 1] = {
        ...previousMessages[index ?? previousMessages.length - 1],
        ...message,
      };

      return updatedMessages;
    });
  }

  const { object, submit, isLoading, stop, error } = useObject({
    api: "/api/chat",
    schema,
    onFinish: async ({ object: capsule, error }) => {
      if (!error) {
        console.log("code", capsule);
        setIsPreviewLoading(true);
        posthog.capture("capsule_generated", {
          template: capsule?.template,
        });

        const response = await fetch("/api/sandbox", {
          method: "POST",
          body: JSON.stringify({
            capsule,
            userID: session?.user.id,
          }),
        });

        const result = await response.json();
        posthog.capture("sandbox_created", { url: result.url });
        setResult(result);
        setCurrentPreview({ capsule, result });
        setMessage({ result });
        setCurrentTab("capsule");
        setIsPreviewLoading(false);
      }
    },
  });

  function retry() {
    submit({
      userID: session?.user.id,
      messages: toAISDKMessages(messages),
      template: currentTemplate,
      model: currentModal,
      config: languageModel,
    });
  }

  function logout() {
    supabase ? supabase.auth.signOut() : console.warn("supabase not loaded");
  }

  function handleLanguageModelChange(e: LLMModelConfig) {
    setLanguageModel({ ...languageModel, ...e });
  }

  const currentModal = modelsList.models.find(
    (model) => model.id === languageModel.model
  );

  const currentTemplate =
    selectedTemplate === "auto"
      ? templates
      : { [selectedTemplate]: templates[selectedTemplate] };

  const lastMessage = messages[messages.length - 1];

  function handleUndo() {
    setMessages((previousMessages) => [...previousMessages.slice(0, -2)]);
    setCurrentPreview({ capsule: undefined, result: undefined });
  }

  function handleClearChat() {
    stop();
    setChatInput("");
    setFiles([]);
    setMessages([]);
    setCapsule(undefined);
    setResult(undefined);
    setCurrentTab("code");
    setIsPreviewLoading(false);
  }

  function handleSocialClick(target: "github" | "x" | "discord") {
    posthog.capture(`${target}_click`);
  }

  function handleSaveInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setChatInput(e.target.value);
  }

  return (
    <main className="flex min-h-screen max-h-screen">
      {supabase && (
        <AuthDialog
          open={isAuthDialogOpen}
          setOpen={setAuthDialog}
          view={authView}
          supabase={supabase}
        />
      )}
      <div className="grid w-full md:grid-cols-2">
        <div className="flex flex-col w-full max-w-[800px] mx-auto px-4 overflow-auto col-span-2">
          <Navbar
            session={session}
            showLogin={() => setAuthDialog(true)}
            signOut={logout}
            onSocialClick={handleSocialClick}
            onClear={handleClearChat}
            canClear={messages.length > 0}
            onUndo={handleUndo}
            canUndo={messages.length > 1 && !isLoading}
          />
          <Chat />
          <ChatInput
            isLoading={isLoading}
            input={chatInput}
            handleInputChange={handleSaveInputChange}
            handleSubmit={() => {}}
            handleFileChange={() => {}}
            files={files}
            error={error}
            retry={retry}
            isMultiModal={false}
            stop={() => {}}
          >
            <ChatPicker
              models={modelsList.models}
              templates={templates as any}
              selectedTemplate={selectedTemplate}
              languageModel={languageModel}
              onSelectedTemplateChange={setSelectedTemplate}
              onLanguageModelChange={handleLanguageModelChange}
            />
            <ChatSettings
              languageModel={languageModel}
              onLanguageModelChange={handleLanguageModelChange}
              apiKeyConfigurable={true}
              baseURLConfigurable={true}
            />
          </ChatInput>
        </div>
      </div>
    </main>
  );
}
