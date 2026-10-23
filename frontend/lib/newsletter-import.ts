import { repairNewsletterHtml } from '@/lib/newsletter-repair'

/**
 * Importing a newsletter from an HTML file (or pasted HTML) produced by
 * Claude. Accepts either a bare fragment or a full <html> document, strips
 * everything that is not newsletter content (comments, head, scripts…),
 * repairs nested-table distortions, and pulls out optional metadata so the
 * title / subject / preheader fields can be pre-filled.
 */

export interface ImportedNewsletter {
    /** Clean newsletter body HTML, ready for the composer. */
    html: string
    title: string
    subject: string
    preheader: string
    /** Structured data-ni-* blocks found (boxes, stats, key dates…). */
    blockCount: number
    /** Images that will show as placeholders until replaced. */
    imageCount: number
    /** True when the HTML has no visible content at all. */
    isEmpty: boolean
}

const REMOVED_ELEMENTS = 'head, title, meta, link, script, style, noscript, iframe, object, embed, base'

const BLOCK_SELECTOR = [
    'div[data-ni-box]',
    'div[data-ni-highlight]',
    'div[data-ni-stats]',
    'div[data-ni-keydates]',
    'div[data-ni-numberedlist]',
    'div[data-ni-title]',
    'div[data-ni-grid]',
    'div[data-ni-cta]',
    'div[data-ni-team]',
].join(', ')

const squash = (text: string | null | undefined): string => (text || '').replace(/\s+/g, ' ').trim()

const metaContent = (doc: Document, ...names: string[]): string => {
    for (const name of names) {
        const meta = doc.querySelector(`meta[name="${name}" i]`)
        const content = squash(meta?.getAttribute('content'))
        if (content) return content
    }
    return ''
}

const removeComments = (root: Node, doc: Document) => {
    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_COMMENT)
    const comments: Node[] = []
    while (walker.nextNode()) comments.push(walker.currentNode)
    comments.forEach((comment) => comment.parentNode?.removeChild(comment))
}

/** Drop inline event handlers and javascript: URLs. */
const stripUnsafeAttributes = (root: Element) => {
    root.querySelectorAll('*').forEach((el) => {
        for (const { name, value } of Array.from(el.attributes)) {
            if (/^on/i.test(name)) el.removeAttribute(name)
            else if ((name === 'href' || name === 'src') && /^\s*javascript:/i.test(value)) el.removeAttribute(name)
        }
    })
}

const countTeamPhotos = (root: Element): number => {
    let count = 0
    root.querySelectorAll('div[data-ni-team]').forEach((team) => {
        try {
            const items = JSON.parse(team.getAttribute('data-items') || '[]')
            if (Array.isArray(items)) count += items.length
        } catch {
            // Malformed items fall back to the block's defaults on parse.
        }
    })
    return count
}

/** Read the text of an uploaded .html / .htm / .txt file. */
export const readHtmlFile = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result || ''))
        reader.onerror = () => reject(reader.error || new Error('Could not read the file.'))
        reader.readAsText(file)
    })

export const isHtmlFile = (file: File): boolean =>
    /\.(html?|txt)$/i.test(file.name) || file.type === 'text/html' || file.type === 'text/plain'

export const prepareImportedNewsletter = (raw: string): ImportedNewsletter => {
    const doc = new DOMParser().parseFromString(raw || '', 'text/html')

    const title = squash(doc.querySelector('title')?.textContent) ||
        metaContent(doc, 'title', 'newsletter-title')
    const subject = metaContent(doc, 'subject', 'email-subject')
    const preheader = metaContent(doc, 'preheader', 'description')

    const body = doc.body
    removeComments(doc, doc)
    body.querySelectorAll(REMOVED_ELEMENTS).forEach((el) => el.remove())
    stripUnsafeAttributes(body)

    // Fall back to the first heading for the title (e.g. "Energy Law Brief").
    const heading = squash(body.querySelector('h1, h2')?.textContent)
    const html = repairNewsletterHtml(body.innerHTML.trim())

    const isEmpty = !squash(body.textContent) && !body.querySelector('img, [data-ni-stats], [data-ni-team], [data-ni-cta]')

    return {
        html,
        title: title || heading,
        subject: subject || title || heading,
        preheader,
        blockCount: body.querySelectorAll(BLOCK_SELECTOR).length,
        imageCount: body.querySelectorAll('img').length + countTeamPhotos(body),
        isEmpty,
    }
}

/**
 * Instructions a non-technical editor can paste into a Claude chat so the
 * HTML it produces uses the newsletter's blocks and imports cleanly.
 */
export const CLAUDE_NEWSLETTER_INSTRUCTIONS = `Please write this week's newsletter as a single HTML file I can upload to our newsletter editor. Follow these rules exactly:

1. Start the file with:
   <title>NEWSLETTER TITLE</title>
   <meta name="subject" content="EMAIL SUBJECT LINE">
   <meta name="preheader" content="ONE-SENTENCE INBOX PREVIEW">
   Then write the newsletter body. No <html>, <head>, <body>, CSS stylesheets or scripts are needed.

2. Use normal HTML for text: <h2>, <h3>, <p>, <ul>/<ol>, <a>, <strong>, <em>, <hr>. Inline style="" attributes are fine.

3. Use these special blocks for structure (list values are JSON inside a double-quoted attribute, with every " inside written as &quot;):
   - Boxed section: <div data-ni-box data-label="Bulletin">…any content…</div>
   - Impact highlight: <div data-ni-highlight data-label="Impact">Text</div>
   - Statistics row: <div data-ni-stats data-items="[{&quot;value&quot;:&quot;14&quot;,&quot;label&quot;:&quot;Developments&quot;}]"></div>
   - Section title: <div data-ni-title data-title="🇰🇪 Kenya" data-label="2 updates"></div>
   - Numbered list: <div data-ni-numberedlist data-items="[{&quot;text&quot;:&quot;Kenya. First point.&quot;}]"></div>
   - Key dates: <div data-ni-keydates data-title="Key dates to note" data-items="[{&quot;date&quot;:&quot;29 Oct&quot;,&quot;flag&quot;:&quot;🇬🇧&quot;,&quot;text&quot;:&quot;Consultation closes&quot;}]"></div>
   - Team: <div data-ni-team data-columns="2" data-items="[{&quot;imageUrl&quot;:&quot;https://example.com/photo.jpg&quot;,&quot;name&quot;:&quot;Name&quot;,&quot;role&quot;:&quot;Role&quot;,&quot;email&quot;:&quot;name@company.com&quot;}]"></div>
   - Call to action: <div data-ni-cta data-heading="Heading" data-body="Body text" data-button-text="Talk to us" data-button-url="https://www.nissi-insights.com" data-note="Small print"></div>
   - Two columns (image beside text):
     <div data-ni-grid data-columns="2"><table role="presentation" width="100%"><tr>
       <td data-ni-col data-columns="2" style="width:34%;"><img src="…" alt="…"></td>
       <td data-ni-col data-columns="2" style="width:66%;"><h3>Headline</h3><p>Story…</p></td>
     </tr></table></div>

4. For every image, use a placeholder URL such as https://placeholder.nissi-insights.com/story-name.jpg and a descriptive alt="" text. I will upload the real photos in the editor.

5. Reply with the complete HTML only, as one file.`
