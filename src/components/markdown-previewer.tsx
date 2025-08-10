"use client"

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs, atomDark, dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';
import { Check, Copy, Code } from "lucide-react";
import { motion } from "framer-motion";

interface MarkdownPreviewProps {
    content: string;
    className?: string;
    noHighlight?: boolean;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
    content,
    className,
    noHighlight = false,
}) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    
    // Add state for tracking copied code blocks
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const handleCopyCode = async (code: string) => {
        await navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div
            className={cn(
                'markdown-preview text-sm leading-relaxed',
                'prose dark:prose-invert prose-headings:font-medium prose-headings:tracking-tight',
                'prose-a:text-blue-500/90 dark:prose-a:text-blue-400/90 prose-a:no-underline hover:prose-a:underline',
                'prose-code:bg-white/20 dark:prose-code:bg-black/30 prose-code:backdrop-blur-sm',
                'prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:border prose-code:border-white/20',
                'prose-code:before:content-none prose-code:after:content-none',
                'prose-blockquote:border-l-4 prose-blockquote:border-white/30 dark:prose-blockquote:border-white/20',
                'prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-white/5 dark:prose-blockquote:bg-black/20',
                'prose-blockquote:backdrop-blur-sm prose-blockquote:rounded-r-xl prose-blockquote:py-4',
                'prose-img:rounded-xl prose-img:mx-auto prose-img:shadow-lg',
                'prose-hr:border-white/20 dark:prose-hr:border-white/10',
                'prose-table:border prose-table:border-collapse prose-table:border-white/20',
                'prose-th:bg-white/10 dark:prose-th:bg-black/20 prose-th:backdrop-blur-sm',
                'prose-th:p-3 prose-th:border prose-th:border-white/20',
                'prose-td:p-3 prose-td:border prose-td:border-white/10',
                'prose-li:marker:text-white/60 dark:prose-li:marker:text-white/40',
                'max-w-none leading-relaxed',

                "overflow-hidden break-words",
                className
            )}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    h1: ({ children, ...props }) => (
                        <h1 
                            className="text-3xl font-bold mb-6 mt-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-serif tracking-wide" 
                            {...props}
                        >
                            {children}
                        </h1>
                    ),
                    h2: ({ children, ...props }) => (
                        <h2
                            className="text-2xl font-semibold mb-4 mt-6 text-white/90 font-serif border-b border-white/20 pb-2" 
                            {...props}
                        >
                            {children}
                        </h2>
                    ),
                    h3: ({ children, ...props }) => (
                        <h3
                            className="text-xl font-medium mb-3 mt-5 text-white/90"
                            {...props}
                        >
                            {children}
                        </h3>
                    ),
                    p: ({ children, ...props }) => (
                        <p className="mb-4 text-white/80 leading-7 " {...props}>
                            {children}
                        </p>
                    ),
                    a: ({ children, href, ...props }) => {
                        const cleanHref = href ? (() => {
                            try {
                                let decodedHref = decodeURIComponent(href.trim());
                                decodedHref = decodedHref
                                    .replace(/^[`\[\]]+|[`\[\]]+$/g, '')
                                    .trim();
                                return decodedHref || '#';
                            } catch (e) {
                                return href.trim().replace(/%60|%5B|%5D/g, '') || '#';
                            }
                        })() : '#';
                        
                        return (
                            <Link 
                                href={cleanHref} 
                                target={'_blank'} 
                                rel={cleanHref?.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className={cn(
                                    "text-blue-500/90 hover:text-blue-400 transition-all duration-200",
                                    "hover:underline decoration-blue-400/50 underline-offset-4",
                                    "font-medium relative group"
                                )}
                                {...props}
                            >
                                {children}
                                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                            </Link>
                        );
                    },
                    img: ({ src, alt, ...props }) => (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="my-6 flex justify-center"
                        >
                            {typeof src === 'string' && src && (
                                <div className="relative group">
                                    {src.startsWith('http') ? (
                                        <img
                                            src={src}
                                            alt={alt || ''}
                                            className="rounded-2xl max-h-96 object-contain shadow-2xl border border-white/20 transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                            {...props}
                                        />
                                    ) : (
                                        <Image
                                            src={src}
                                            alt={alt || ''}
                                            className="rounded-2xl max-h-96 object-contain shadow-2xl border border-white/20 transition-transform duration-300 group-hover:scale-105"
                                            {...props}
                                            width={600}
                                            height={400}
                                        />
                                    )}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            )}
                        </motion.div>
                    ),
                    code: ({ node, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match && match[1] ? match[1] : '';
                        const isInline = !className || !language;
                        
                        if (isInline && !className) {
                            return (
                                <code 
                                    className="bg-white/20 dark:bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-mono border border-white/20 text-white/90" 
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }
                        
                        const codeContent = String(children).replace(/\n$/, '');
                        const isCopied = copiedCode === codeContent;
                        
                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="my-6 overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 shadow-2xl"
                            >
                                <div className="flex items-center justify-between px-6 py-4 border-b border-white/20 bg-white/5 dark:bg-black/10 backdrop-blur-sm">
                                    <div className="flex items-center gap-3">
                                        <Code size={18} className="text-blue-400" />
                                        <span className="text-sm font-semibold text-white/80 tracking-wide">
                                            {language || 'plain text'}
                                        </span>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleCopyCode(codeContent)}
                                        className="h-9 w-9 flex items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/20 dark:hover:bg-black/30 backdrop-blur-sm border border-white/20 cursor-pointer group"
                                        title="Copy code"
                                    >
                                        {isCopied ? (
                                            <Check size={16} className="text-green-400" />
                                        ) : (
                                            <Copy size={16} className="text-white/60 group-hover:text-white/90" />
                                        )}
                                    </motion.button>
                                </div>
                                <div className="relative w-full overflow-auto">
                                    <SyntaxHighlighter
                                        language={language || 'text'}
                                        style={(isDark ? atomDark : vs) as any}
                                        customStyle={{
                                            margin: 0,
                                            padding: '1.5rem',
                                            background: 'transparent',
                                            borderRadius: 0,
                                            fontSize: '0.875rem',
                                            maxWidth: '100%',
                                        }}
                                        wrapLongLines={true}
                                        showLineNumbers={false}
                                        {...props as any}
                                    >
                                        {codeContent}
                                    </SyntaxHighlighter>
                                </div>
                            </motion.div>
                        );
                    },
                    ul: ({ children, ...props }) => (
                        <ul className="list-none pl-0 mb-6 space-y-2" {...props}>
                            {children}
                        </ul>
                    ),
                    ol: ({ children, ...props }) => (
                        <ol className="list-none pl-0 mb-6 space-y-2" {...props}>
                            {children}
                        </ol>
                    ),
                    li: ({ children, ...props }) => (
                        <li className="mb-2 flex items-start gap-3 text-white/80" {...props}>
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mt-2.5 flex-shrink-0" />
                            <span className="">{children}</span>
                        </li>
                    ),
                    blockquote: ({ children, ...props }) => (
                        <blockquote
                            className="border-l-4 border-gradient-to-b from-blue-500 to-purple-500 pl-6 my-6 py-4 italic text-white/70 bg-white/5 dark:bg-black/10 backdrop-blur-sm rounded-r-2xl relative overflow-hidden" 
                            {...props}
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500" />
                            {children}
                        </blockquote>
                    ),
                    hr: (props) => (
                        <hr className="my-8 border-none h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" {...props} />
                    ),
                    table: ({ children, ...props }) => (
                        <div className="overflow-x-auto my-8">
                            <table 
                                className="min-w-full backdrop-blur-xl bg-white/5 dark:bg-black/10 border border-white/20 rounded-2xl overflow-hidden shadow-xl" 
                                {...props}
                            >
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children, ...props }) => (
                        <thead className="bg-white/10 dark:bg-black/20 backdrop-blur-sm" {...props}>
                            {children}
                        </thead>
                    ),
                    th: ({ children, ...props }) => (
                        <th className="py-4 px-6 text-left font-semibold border-b border-white/20 text-white/90" {...props}>
                            {children}
                        </th>
                    ),
                    td: ({ children, ...props }) => (
                        <td className="py-4 px-6 border-t border-white/10 text-white/80" {...props}>
                            {children}
                        </td>
                    ),
                    pre: ({ children, ...props }) => (
                        <pre className="my-6 rounded-2xl overflow-hidden bg-transparent p-0" {...props}>
                            {children}
                        </pre>
                    ),
                }}
            >
                {content || ''}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownPreview;