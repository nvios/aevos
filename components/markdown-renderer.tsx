import React from "react";
import parse, { DOMNode, Element, Text, HTMLReactParserOptions } from "html-react-parser";
import { marked } from "marked";
import { glossaryTerms } from "@/lib/content/glossary";
import { GlossaryPopover } from "@/components/glossary-popover";

interface MarkdownRendererProps {
  content: string; // Markdown content
}

export async function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const htmlContent = await marked(content, { breaks: true, gfm: true });

  // Sort terms by length (descending) to match longer phrases first
  const sortedTerms = [...glossaryTerms].sort((a, b) => b.term.length - a.term.length);

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      // Check if it's a text node
      if (domNode.type === 'text') {
        const textNode = domNode as Text;
        const parent = textNode.parent as Element;

        // Check if parent or any ancestor is a link, code block, header, etc.
        let current = parent;
        while (current) {
          if (current.name && ["a", "code", "pre", "h1", "h2", "h3", "h4", "h5", "h6", "script", "style"].includes(current.name)) {
            return;
          }
          current = current.parent as Element;
        }

        const text = textNode.data;
        
        // Skip empty text nodes
        if (!text || !text.trim()) {
          return;
        }

        let fragments: (string | React.ReactNode)[] = [text];
        let hasMatch = false;

        for (const term of sortedTerms) {
          // Escape special regex characters in the term
          const escapedTerm = term.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b(${escapedTerm})\\b`, "gi");

          const newFragments: (string | React.ReactNode)[] = [];
          
          for (const fragment of fragments) {
            if (typeof fragment === "string") {
              const parts = fragment.split(regex);
              
              if (parts.length > 1) {
                hasMatch = true;
                
                for (let i = 0; i < parts.length; i++) {
                  const part = parts[i];
                  // Check if this part matches the term (case insensitive)
                  if (part.toLowerCase() === term.term.toLowerCase()) {
                     newFragments.push(
                      <GlossaryPopover
                        key={`${term.slug}-${i}`} // Deterministic key based on slug and index
                        term={term.term}
                        definition={term.definition}
                        slug={term.slug}
                      >
                        {part}
                      </GlossaryPopover>
                    );
                  } else if (part !== "") {
                    newFragments.push(part);
                  }
                }
              } else {
                newFragments.push(fragment);
              }
            } else {
              newFragments.push(fragment);
            }
          }
          fragments = newFragments;
        }

        if (hasMatch) {
          return <>{fragments}</>;
        }
      }
    },
  };

  // Convert HTML string to React elements
  const parsedContent = parse(htmlContent, options);

  return <div className="prose prose-zinc max-w-none">{parsedContent}</div>;
}
