"use client";
import { AuthDialog } from "@/components/auth-dialog";
import { Chat } from "@/components/chat";
import { ChatInput } from "@/components/chat-input";
import { ChatPicker } from "@/components/chat-picker";
import { Navbar } from "@/components/navbar";
import { AuthViewType, useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import modelsList from "@/lib/models.json";
import templates from "@/lib/templates";
import { ChatSettings } from "@/components/chat-settings";
import { LLMModelConfig } from "@/lib/models";
import { Message } from "@/lib/messsages";
import { DeepPartial } from "ai";
import { CapsuleSchema } from "@/lib/schema";

export default function Home() {
  const [isAuthDialogOpen, setAuthDialog] = useState(false);
  const [authView, setAuthView] = useState<AuthViewType>("sign_in");
  const { session } = useAuth(setAuthDialog, setAuthView);
  const [chatInput, setChatInput] = useLocalStorage("chat", "");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<"auto">("auto");
  const [languageModel, setLanguageModel] = useLocalStorage("languageModel", {
    model: "gpt-4o-mini",
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [capsule, setCapsule] = useState<DeepPartial<CapsuleSchema>>();
  const [currentTab, setCurrentTab] = useState<"code" | "capsule">("code");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

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
          />
          <Chat />
          <ChatInput
            isLoading={false}
            input={chatInput}
            handleInputChange={() => {}}
            handleSubmit={() => {}}
            handleFileChange={() => {}}
            files={files}
            error={undefined}
            retry={() => {}}
            isMultiModal={false}
            stop={() => {}}
          >
            <ChatPicker
              models={modelsList.models}
              templates={templates as any}
              selectedTemplate={selectedTemplate}
              languageModel={languageModel}
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
