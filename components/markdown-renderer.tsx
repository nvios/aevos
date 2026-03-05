import React from "react";
import parse, { Element, Text, HTMLReactParserOptions } from "html-react-parser";
import { marked } from "marked";
import { getAllGlossaryTerms } from "@/lib/content/glossary";
import { GlossaryPopover } from "@/components/glossary-popover";
import { localePath } from "@/lib/i18n/paths";

interface MarkdownRendererProps {
  content: string;
  locale?: string;
}

export async function MarkdownRenderer({ content, locale = 'it' }: MarkdownRendererProps) {
  const htmlContent = await marked(content, { breaks: true, gfm: true });
  const glossaryTerms = getAllGlossaryTerms(locale);

  const sortedTerms = [...glossaryTerms].sort((a, b) => b.term.length - a.term.length);

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      // Translate internal link hrefs for non-Italian locales
      if (domNode instanceof Element && domNode.name === 'a' && domNode.attribs?.href) {
        const href = domNode.attribs.href;
        if (href.startsWith('/') && locale !== 'it') {
          domNode.attribs.href = localePath(href, locale);
        }
      }

      if (domNode.type === 'text') {
        const textNode = domNode as Text;
        const parent = textNode.parent as Element;

        let current = parent;
        while (current) {
          if (current.name && ["a", "code", "pre", "h1", "h2", "h3", "h4", "h5", "h6", "script", "style"].includes(current.name)) {
            return;
          }
          current = current.parent as Element;
        }

        const text = textNode.data;
        
        if (!text || !text.trim()) {
          return;
        }

        let fragments: (string | React.ReactNode)[] = [text];
        let hasMatch = false;

        for (const term of sortedTerms) {
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
                  if (part.toLowerCase() === term.term.toLowerCase()) {
                     newFragments.push(
                      <GlossaryPopover
                        key={`${term.slug}-${i}`}
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

  const parsedContent = parse(htmlContent, options);

  return <div className="prose prose-zinc max-w-none">{parsedContent}</div>;
}
