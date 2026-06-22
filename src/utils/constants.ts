// markdown ATX heading lines supported as section names
export const MARKDOWN_HEADING_PATTERN = /^ {0,3}#{1,6}(?:[ \t]+|$)(.*)$/;

// markdown fenced code block opening lines that should not be scanned for headings
export const FENCED_CODE_BLOCK_PATTERN = /^(`{3,}|~{3,})/;