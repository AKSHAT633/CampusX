import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Download, Zap, Star } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { HelpCircle } from "lucide-react";
import MermaidSetup from "./MermaidSetup";
import RechartSetUp from "./RechartSetUp";

const FinalResult = ({ result }) => {
  const [quickRevision, setQuickRevision] = useState(false);
  const [copied, setCopied] = useState(false);

  console.log(result);

  if (!result) return null;

  const markdownComponents = {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-blue-300 mt-8 mb-4 border-b border-blue-500/30 pb-2">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold text-blue-200 mt-6 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-blue-100 mt-5 mb-2">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-blue-100/90 leading-relaxed mb-3">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc ml-6 space-y-1 text-blue-100/90 mb-4">
        {children}
      </ul>
    ),
    li: ({ children }) => <li className="marker:text-blue-400">{children}</li>,
  };

  const handleCopy = async () => {
    const text = quickRevision
      ? result.revisionPoints?.join("\n")
      : `${JSON.stringify(result.subTopics, null, 2)}\n\n${result.notes}`;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = quickRevision
      ? result.revisionPoints?.join("\n")
      : `${JSON.stringify(result.subTopics, null, 2)}\n\n${result.notes}`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.topic || "notes"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-white">
          Generated Notes
        </h2>

        <div className="flex flex-wrap gap-2">
          {/* QUICK REVISION */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setQuickRevision(!quickRevision)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition ${
              quickRevision
                ? "bg-blue-500/20 border-blue-400 text-blue-300"
                : "bg-white/5 border-blue-500/20 text-blue-200 hover:bg-blue-500/10"
            }`}
          >
            <Zap className="w-4 h-4" />
            {quickRevision ? "Exit Revision" : "Quick Revision"}
          </motion.button>

          {/* COPY */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-blue-500/20 text-blue-200 hover:bg-blue-500/10 transition text-sm"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied" : "Copy"}
          </motion.button>

          {/* DOWNLOAD */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm shadow"
          >
            <Download className="w-4 h-4" />
            Download
          </motion.button>
        </div>
      </div>

      {/* CONTENT */}
      <motion.div
        key={quickRevision ? "revision" : "notes"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {quickRevision ? (
          /* ✅ REVISION MODE */
          <ul className="space-y-2">
            {result.revisionPoints?.map((p, i) => (
              <li
                key={i}
                className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-3 py-2 text-blue-100"
              >
                {p}
              </li>
            ))}
          </ul>
        ) : (
          /* ✅ NORMAL MODE */
          <div className="space-y-8">
            {/* SUBTOPICS */}
            {result.subTopics && (
              <div>
                <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Priority Topics
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(result.subTopics).map(
                    ([priority, topics]) => (
                      <div
                        key={priority}
                        className="bg-white/5 border border-blue-500/20 rounded-lg p-4"
                      >
                        <div className="text-blue-300 font-semibold mb-2">
                          {priority} Priority
                        </div>
                        <ul className="space-y-1 text-blue-100/90 text-sm">
                          {topics.map((t, i) => (
                            <li key={i}>• {t}</li>
                          ))}
                        </ul>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* NOTES */}
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown components={markdownComponents}>
                {result.notes}
              </ReactMarkdown>
            </div>

          </div>
        )}

            {result?.charts?.length > 0 && (
              <RechartSetUp charts={result.charts} />
            )}

            <div className="space-y-4">
              {/* HEADER */}
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-blue-300">
                  Short Exam Questions
                </h3>
              </div>

              {/* LIST */}
              <ul className="space-y-3">
                {result.questions.short.map((q, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3 text-blue-100"
                  >
                    {q}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              {/* HEADER */}
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-blue-300">
                  Long Exam Questions
                </h3>
              </div>

              {/* LIST */}
              <ul className="space-y-3">
                {result.questions.long.map((q, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3 text-blue-100"
                  >
                    {q}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-white/5 border border-blue-500/20 p-3">
              <p className="text-blue-300 font-medium mb-1">Diagram question</p>
              <ul>
                <li>{result?.questions?.diagram}</li>
              </ul>
            </div>


        {result?.diagram?.data && (
          <MermaidSetup diagram={result?.diagram?.data} />
        )}
      </motion.div>
    </div>
  );
};

export default FinalResult;
