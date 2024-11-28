import templates from "./templates.json";

export default templates;

export type Templates = keyof typeof templates;
export type TemplateId = keyof typeof templates;
export type TemplateConfig = (typeof templates)[TemplateId];

export function templatesToPrompt(filterTemplates?: Templates[]) {
  const templatesEntries = filterTemplates
    ? Object.entries(templates).filter(([id]) => filterTemplates.includes(id as Templates))
    : Object.entries(templates);

  return templatesEntries
    .map(
      ([id, t], index) =>
        `${index + 1}. ${id}: "${t.instructions}". File: ${
          t.file || "none"
        }. Dependencies installed: ${t.lib.join(",")}. Port: ${
          t.port || "none"
        }`
    )
    .join("\n");
}