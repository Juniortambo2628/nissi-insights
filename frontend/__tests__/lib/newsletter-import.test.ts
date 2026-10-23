import { readFileSync } from 'fs'
import { join } from 'path'
import { Editor } from '@tiptap/core'
import { newsletterEditorExtensions } from '@/components/admin/newsletter-editor-extensions'
import { prepareImportedNewsletter, isHtmlFile } from '@/lib/newsletter-import'
import { splitNewsletterSections } from '@/lib/newsletter-sections'

const sample = readFileSync(join(__dirname, '../../../content/energy-law-brief.html'), 'utf8')

describe('prepareImportedNewsletter', () => {
    it('imports the Energy Law Brief file Claude produced, comment header and all', () => {
        const result = prepareImportedNewsletter(sample)

        expect(result.html).not.toContain('<!--')
        expect(result.html).not.toContain('Paste everything below')
        expect(result.isEmpty).toBe(false)
        expect(result.title).toBe('Energy Law Brief')
        expect(result.subject).toBe('Energy Law Brief')
        // 13 boxes, 13 highlights, 12 grids, 4 titles, stats, key dates, team, CTA, numbered list.
        expect(result.blockCount).toBe(47)
        // 13 story/hero images + 2 team photos.
        expect(result.imageCount).toBe(15)
        expect(splitNewsletterSections(result.html)).toHaveLength(26)
    })

    it('unwraps a full HTML document and reads title / subject / preheader metadata', () => {
        const result = prepareImportedNewsletter(`<!doctype html><html><head>
            <title>Weekly Brief</title>
            <meta name="subject" content="This week in energy law">
            <meta name="preheader" content="Fuel prices, court rulings and six consultations">
            <style>p { color: red }</style>
        </head><body><script>alert(1)</script>
            <h2>Heading</h2><p onclick="steal()">Hello <a href="javascript:alert(1)">x</a></p>
            <div data-ni-highlight data-label="Impact">Matters.</div>
        </body></html>`)

        expect(result.title).toBe('Weekly Brief')
        expect(result.subject).toBe('This week in energy law')
        expect(result.preheader).toBe('Fuel prices, court rulings and six consultations')
        expect(result.blockCount).toBe(1)
        expect(result.html).not.toMatch(/<script|<style|<title|<meta|onclick|javascript:/)
        expect(result.html).toContain('<h2>Heading</h2>')
    })

    it('flags files with no content', () => {
        expect(prepareImportedNewsletter('<!-- only a comment -->').isEmpty).toBe(true)
        expect(prepareImportedNewsletter('<html><head><title>x</title></head><body> </body></html>').isEmpty).toBe(true)
    })

    it('accepts html and text files only', () => {
        expect(isHtmlFile(new File([''], 'brief.html'))).toBe(true)
        expect(isHtmlFile(new File([''], 'brief.HTM'))).toBe(true)
        expect(isHtmlFile(new File([''], 'photo.jpg', { type: 'image/jpeg' }))).toBe(false)
    })
})

describe('team photo upload controls', () => {
    const team = '<div data-ni-team data-columns="2" data-items="[{&quot;imageUrl&quot;:&quot;https://example.com/a.jpg&quot;,&quot;name&quot;:&quot;Ann&quot;,&quot;role&quot;:&quot;Founder&quot;,&quot;email&quot;:&quot;&quot;},{&quot;imageUrl&quot;:&quot;&quot;,&quot;name&quot;:&quot;Bo&quot;,&quot;role&quot;:&quot;Director&quot;,&quot;email&quot;:&quot;&quot;}]"></div>'

    it('adds an upload slot per member in the editor without changing the saved HTML', () => {
        const plain = new Editor({ extensions: newsletterEditorExtensions, content: team })
        const element = document.createElement('div')
        const editor = new Editor({ extensions: newsletterEditorExtensions, content: team, element })

        const photos = element.querySelectorAll('.ni-team-photo')
        expect(photos).toHaveLength(2)
        expect(photos[0].querySelector('img')).not.toBeNull()
        // Member without a photo gets a placeholder slot.
        expect(photos[1].classList.contains('ni-image-node-broken')).toBe(true)
        expect(photos[1].textContent).toContain('Photo of Bo')
        expect(element.querySelectorAll('.ni-image-replace-btn')).toHaveLength(2)

        const html = editor.getHTML()
        expect(html).toBe(plain.getHTML())
        expect(html).not.toMatch(/ni-image-overlay|data-team-index|ni-team-photo/)

        editor.destroy()
        plain.destroy()
    })
})
