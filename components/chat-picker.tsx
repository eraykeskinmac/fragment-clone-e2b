import { LLMModel } from "@/lib/models";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "./ui/select";
import { SelectValue } from "@radix-ui/react-select";

export function ChatPicker({ models }: { models: LLMModel[] }) {
  return (
    <div className="flex items-center space-x-2">
       <div>
        <Select name="languageModel" defaultValue={""} onValueChange={() => {}}>
          <SelectTrigger className="whitespace-nowrap border-none shadow-none px-0 py-0 h-6 text-xs focus:ring-0">
            <SelectValue placeholder="Language Model" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(
              Object.groupBy(models, ({ provider }) => provider)
            ).map(([provider, models]) => (
              <SelectGroup key={provider}>
                <SelectLabel>{provider}</SelectLabel>
                {models?.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div>
                      <span>{model.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Select name="languageModel" defaultValue={""} onValueChange={() => {}}>
          <SelectTrigger className="whitespace-nowrap border-none shadow-none px-0 py-0 h-6 text-xs focus:ring-0">
            <SelectValue placeholder="Language Model" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(
              Object.groupBy(models, ({ provider }) => provider)
            ).map(([provider, models]) => (
              <SelectGroup key={provider}>
                <SelectLabel>{provider}</SelectLabel>
                {models?.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div>
                      <span>{model.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
