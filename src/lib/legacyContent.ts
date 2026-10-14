import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { toolBySlug, tools } from '../data/tools';

const legacyRoot = resolve(process.cwd(), 'src', 'singleFields');

const guideRoutes: Record<string, string> = {
	'getting_started.html': '/guide/getting-started/',
	'installation_guide.html': '/guide/installation/',
	'further_information.html': '/guide/further-information/',
	'help.html': '/guide/help/',
};

function slugForToolFile(fileName: string) {
	const tool = tools.find((candidate) => candidate.source.toLowerCase() === fileName.toLowerCase());
	if (tool) return tool.slug;
	return fileName.replace(/\.html$/i, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function rewriteInternalLinks(html: string) {
	return html.replace(/href="\.\/([^"#?]+\.html)"/gi, (_match, fileName: string) => {
		const route = guideRoutes[fileName.toLowerCase()] ?? `/tools/${slugForToolFile(fileName)}/`;
		return `href="${route}"`;
	});
}

function extractTitle(raw: string, fallback: string) {
	return raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? fallback;
}

function extractMain(raw: string) {
	const main = raw.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1];
	if (main) return main;
	return raw.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? raw.match(/<body[^>]*>([\s\S]*)/i)?.[1] ?? raw;
}

function formatLegacyParagraphs(html: string) {
	return html.replace(/<p>\s*([^<]*?)\s*<\/p>/gi, (_match, content: string) => {
		const paragraphs = content
			.split(/\r?\n\s*\r?\n/)
			.map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
			.filter(Boolean);

		return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('\n');
	});
}

export function readLegacyPage(relativePath: string, fallbackTitle: string) {
	const raw = readFileSync(resolve(legacyRoot, relativePath), 'utf8');
	let sectionNumber = 0;
	const html = formatLegacyParagraphs(extractMain(raw)
		.replace(/<(run|ToolName|toolname)>/gi, '&lt;$1&gt;'))
		.replace(/<header[\s\S]*?<\/header>/i, '')
		.replace(/<div class="description_box">/gi, '<div class="description-box">')
		.replace(/<table(\s[^>]*)?>/gi, '<div class="table-scroll"><table$1>')
		.replace(/<\/table>/gi, '</table></div>')
		.replace(/<section>/gi, () => {
			sectionNumber += 1;
			return `<section class="legacy-section" data-section="${String(sectionNumber).padStart(2, '0')}">`;
		});

	return {
		title: extractTitle(raw, fallbackTitle).replace(/^ProteomIQon\s+-\s+/i, ''),
		html: rewriteInternalLinks(html),
	};
}

export function readToolPage(source: string, fallbackTitle: string) {
	return readLegacyPage(`tools/singleTools/${source}`, fallbackTitle);
}

export function getTool(slug: string) {
	return toolBySlug[slug as keyof typeof toolBySlug];
}
