/**
 * Safe HTML Sanitizer Utility (XSS Prevention)
 * Sanitizes rich text HTML description using browser's native DOMParser.
 * Removes dangerous tags (script, iframe, object, etc.) and inline event handlers (onerror, onclick, etc.).
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  if (typeof window === 'undefined') return html;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // ۱. حذف تگ‌های خطرناک
    const dangerousTags = doc.querySelectorAll('script, iframe, object, embed, style, link, applet, base');
    dangerousTags.forEach((tag) => tag.remove());

    // ۲. حذف ویژگی‌های خطرناک (رویدادهای JS مثل onerror و onclick و لینک‌های javascript:)
    const allElements = doc.body.querySelectorAll('*');
    allElements.forEach((el) => {
      const attrs = Array.from(el.attributes);
      for (const attr of attrs) {
        const attrName = attr.name.toLowerCase();
        const attrVal = attr.value.toLowerCase();

        if (attrName.startsWith('on') || attrVal.includes('javascript:')) {
          el.removeAttribute(attr.name);
        }
      }
    });

    return doc.body.innerHTML;
  } catch {
    // در صورت بروز خطا، فقط متن ساده بدون تگ برگردانده شود
    return html.replace(/<[^>]*>?/gm, '');
  }
}

export default {
  sanitize: sanitizeHtml,
};
