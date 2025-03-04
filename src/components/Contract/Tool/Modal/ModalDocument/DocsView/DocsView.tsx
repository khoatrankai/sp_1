import React from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

type Props = {
  docs: { uri: string; fileData?: string; fileType?: string }[];
};

export default function DocsView({ docs }: Props) {
  return (
    <>
      <DocViewer
        className="!h-full !w-full"
        pluginRenderers={DocViewerRenderers}
        documents={docs}
      />
    </>
  );
}
