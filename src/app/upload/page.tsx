"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function UploadPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"file" | "text">("file");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title || (file?.name ?? "Contract"));
    if (tab === "file" && file) formData.append("file", file);
    else if (tab === "text") formData.append("text", text);

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");
      router.push(`/analysis/${data.documentId}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-2">Analyze your contract</h1>
        <p className="text-slate-400 mb-6 text-sm">
          Upload a PDF or paste the contract text below.
        </p>

        <Input
          className="mb-4 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          placeholder="Contract title (e.g. Rental Agreement, Offer Letter)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {}
        <div className="flex gap-2 mb-4">
          {(["file", "text"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium transition",
                tab === t
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              )}
            >
              {t === "file" ? "Upload PDF" : "Paste Text"}
            </button>
          ))}
        </div>

        {tab === "file" ? (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition",
              isDragActive
                ? "border-blue-500 bg-blue-900/20"
                : "border-slate-700 hover:border-slate-500"
            )}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex items-center justify-center gap-2 text-green-400">
                <FileText className="w-5 h-5" />
                <span className="font-medium">{file.name}</span>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 mx-auto mb-3 text-slate-500" />
                <p className="text-slate-400 text-sm">
                  Drag &amp; drop your PDF here, or{" "}
                  <span className="text-blue-400 underline">browse</span>
                </p>
                <p className="text-slate-600 text-xs mt-1">
                  Max 10MB · PDF only
                </p>
              </>
            )}
          </div>
        ) : (
          <Textarea
            className="min-h-[200px] bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none"
            placeholder="Paste your contract text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}

        {error && (
          <div className="flex items-start gap-2 text-red-400 text-sm mt-3 bg-red-950/30 border border-red-800 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        <Button
          className="w-full mt-5 bg-blue-600 hover:bg-blue-500 text-white py-3 text-base rounded-xl"
          disabled={loading || (tab === "file" ? !file : text.trim().length < 50)}
          onClick={handleAnalyze}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            "Analyze Contract →"
          )}
        </Button>

        {loading && (
          <p className="text-center text-slate-500 text-xs mt-3 animate-pulse">
            Segmenting clauses · Running AI analysis · This takes ~20 seconds
          </p>
        )}
      </div>
    </div>
  );
}
