import { readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const SKIP = /^([a-z][a-z0-9+.-]*:|\/|#|\?)/i;
const MD_LINK = /^([^?#]+\.md)([?#].*)?$/i;

/**
 * Rewrites relative links between Markdown files (`./peptide-db.md`, `../guides/help.md#x`)
 * to the routes of the pages built from them, including the site base.
 *
 * The plugin name carries a version because the content layer cache does not fingerprint
 * plugin code. Bump it after changing the plugin so cached entries are rendered again.
 */
export function contentLinks({ base, contentDir }) {
	const routes = new Map();
	const register = (dir, prefix) => {
		for (const file of readdirSync(join(contentDir, dir))) {
			if (!file.endsWith('.md')) continue;
			routes.set(pathToFileURL(join(contentDir, dir, file)).href, `${prefix}/${basename(file, '.md')}/`);
		}
	};
	register('tools', '/tools');
	register('guides', '/guide');
	const prefix = base.replace(/\/+$/, '');

	return {
		name: 'content-links-v1',
		element: {
			filter: ['a'],
			visit(node, ctx) {
				const href = node.properties?.href;
				if (typeof href !== 'string' || SKIP.test(href) || !ctx.fileURL) return;
				const match = href.match(MD_LINK);
				if (!match) return;
				const route = routes.get(new URL(match[1], ctx.fileURL).href);
				if (!route) return;
				ctx.setProperty(node, 'href', prefix + route + (match[2] ?? ''));
			},
		},
	};
}
