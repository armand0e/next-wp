"use client";

import { Section } from "@/components/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useState, useMemo } from "react";
import type { FAQBlockData } from "@next-wp/content-schema";

interface FAQBlockProps {
  id?: string;
  className?: string;
  data: FAQBlockData;
}

export default function FAQBlock({ id, className, data }: FAQBlockProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQs based on search query
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return data.faqs;
    
    const query = searchQuery.toLowerCase();
    return data.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [data.faqs, searchQuery]);

  return (
    <Section
      id={id || "faq"}
      title={data.title}
      subtitle={data.subtitle}
      className={cn("container px-10 mx-auto max-w-[var(--max-container-width)]", className)}
    >
      {data.description && (
        <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          {data.description}
        </p>
      )}

      {/* Search */}
      {data.enableSearch && (
        <div className="relative max-w-md mx-auto mb-8">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* FAQ Accordion */}
      <Accordion
        type="multiple"
        defaultValue={data.defaultOpen || []}
        className="w-full max-w-3xl mx-auto py-10"
      >
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No FAQs found matching "{searchQuery}". Try a different search term.
            </p>
          </div>
        )}
      </Accordion>
    </Section>
  );
}
