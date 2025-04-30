import { EditorContent, useEditor } from "@tiptap/react";
import { Document } from "@tiptap/extension-document";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { History } from "@tiptap/extension-history";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Dispatch, FC, SetStateAction } from "react";
import { CharacterCount } from "@tiptap/extension-character-count";

interface ContentProps {
    setContent: Dispatch<SetStateAction<string>>;
}

export const PostContent: FC<ContentProps> = ({ setContent }) => {
    const charLimit = 300;

    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            History,
            HardBreak,
            Placeholder.configure({
                placeholder: "What you skeetin'?",
                emptyEditorClass:
                    "first:before:h-0 first:before:text-ctp-overlay-1 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none",
            }),
            CharacterCount.configure({
                limit: charLimit,
            }),
        ],
        editorProps: {
            attributes: {
                class: "focus:outline-0",
            },
        },
        onUpdate: ({ editor }) => {
            setContent(editor.getText());
        },
    });

    const percentage = editor
        ? Math.round(
              (100 / charLimit) * editor.storage.characterCount.characters(),
          )
        : 0;

    const circumference = 31.4;
    const dashLength = (percentage * circumference) / 100;
    const dashArray = `${dashLength} ${circumference}`;

    return (
        <div className="bg-ctp-surface-0 flex min-h-36 w-96 flex-col justify-between gap-4 rounded-2xl p-2">
            <EditorContent editor={editor} />
            <div className="gap flex items-center justify-end gap-1">
                <svg
                    height="20"
                    width="20"
                    viewBox="0 0 20 20"
                    className={`${percentage == 100 ? "text-ctp-red" : percentage > 90 ? "text-ctp-peach" : "text-ctp-mauve"}`}
                >
                    <circle r="10" cx="10" cy="10" fill="#6c7086" />
                    <circle
                        r="5"
                        cx="10"
                        cy="10"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeDasharray={dashArray}
                        transform="rotate(-90) translate(-20)"
                    />
                    <circle r="7" cx="10" cy="10" fill="#313244" />
                </svg>
                {editor && (
                    <div>
                        <p
                            className={` ${percentage == 100 ? "text-ctp-red" : percentage > 90 ? "text-ctp-peach" : "text-ctp-subtext-0"} w-6 text-sm`}
                        >
                            {charLimit -
                                editor.storage.characterCount.characters()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
