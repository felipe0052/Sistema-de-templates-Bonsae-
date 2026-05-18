<?php

namespace App\Services;

use DOMDocument;
use DOMElement;
use DOMNode;

class TemplateHtmlSanitizer
{
    private const ALLOWED_TAGS = [
        "p",
        "br",
        "strong",
        "b",
        "em",
        "i",
        "u",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "div",
        "span",
    ];

    private const ALLOWED_STYLES = [
        "text-align",
        "font-weight",
        "font-style",
        "text-decoration",
        "font-size",
        "line-height",
        "margin",
        "margin-left",
        "margin-right",
        "margin-top",
        "margin-bottom",
        "padding",
        "padding-left",
        "padding-right",
        "padding-top",
        "padding-bottom",
    ];

    public function sanitize(string $html): string
    {
        if (trim($html) === "") {
            return "";
        }

        $document = new DOMDocument();
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML(
            '<?xml encoding="UTF-8"><div id="template-root">' .
                $html .
                "</div>",
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD,
        );
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        $root = $document->getElementById("template-root");
        if (!$root) {
            return "";
        }

        $this->sanitizeNode($root);

        $output = "";
        foreach ($root->childNodes as $child) {
            $output .= $document->saveHTML($child);
        }

        return str_replace('<?xml encoding="UTF-8">', "", $output);
    }

    private function sanitizeNode(DOMNode $node): void
    {
        for ($child = $node->firstChild; $child !== null; ) {
            $next = $child->nextSibling;

            if ($child instanceof DOMElement) {
                $tagName = strtolower($child->tagName);

                if (!in_array($tagName, self::ALLOWED_TAGS, true)) {
                    while ($child->firstChild) {
                        $node->insertBefore($child->firstChild, $child);
                    }
                    $node->removeChild($child);
                    $child = $next;
                    continue;
                }

                $this->sanitizeElementAttributes($child);
            }

            $this->sanitizeNode($child);
            $child = $next;
        }
    }

    private function sanitizeElementAttributes(DOMElement $element): void
    {
        for ($index = $element->attributes->length - 1; $index >= 0; $index--) {
            $attribute = $element->attributes->item($index);
            if (!$attribute) {
                continue;
            }

            $name = strtolower($attribute->name);
            if ($name === "style") {
                $style = $this->sanitizeStyle($attribute->value);
                if ($style === "") {
                    $element->removeAttribute($attribute->name);
                } else {
                    $element->setAttribute("style", $style);
                }
                continue;
            }

            $element->removeAttribute($attribute->name);
        }
    }

    private function sanitizeStyle(string $style): string
    {
        $safe = [];
        foreach (explode(";", $style) as $declaration) {
            $parts = explode(":", $declaration, 2);
            if (count($parts) !== 2) {
                continue;
            }

            $property = strtolower(trim($parts[0]));
            $value = trim($parts[1]);

            if (
                $value === "" ||
                !in_array($property, self::ALLOWED_STYLES, true) ||
                preg_match("/url\s*\(|expression\s*\(|javascript:/i", $value)
            ) {
                continue;
            }

            $safe[] = "{$property}: {$value}";
        }

        return implode("; ", $safe);
    }
}
