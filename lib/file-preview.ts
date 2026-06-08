export type FileKind = "pdf" | "image" | "office" | "other";

/** Classify a file by its extension to decide how to preview it. */
export function getFileKind(fileName: string): FileKind {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (ext === "png" || ext === "jpg" || ext === "jpeg") return "image";
  if (ext === "docx" || ext === "pptx") return "office";
  return "other";
}
