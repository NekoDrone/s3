import { EditorContent, useEditor } from "@tiptap/react";
import { Document } from "@tiptap/extension-document";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { History } from "@tiptap/extension-history";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Dispatch, FC, SetStateAction } from "react";

interface ContentProps {
    setContent: Dispatch<SetStateAction<string>>;
}

export const PostContent: FC<ContentProps> = ({ setContent }) => {
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

    return (
        <div className="bg-ctp-surface-0 h-36 w-96 rounded-2xl p-2">
            <EditorContent editor={editor} />
        </div>
    );
};
