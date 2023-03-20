export const wsdotBasemaps: __esri.BasemapProperties[] = [
  { title: 'WSDOT Basemap', portalItem: { id: '9912b618413b421da251384acb70218f' } },
  { title: 'WSDOT Gray Basemap', portalItem: { id: 'c5a4e545ce8f40c9919b4a7b0fc15aa4' } },
  {
    // Imagery Hybrid
    portalItem: {
      id: '86265e5a4bbb4187a59719cf134e0018',
    },
  },
  {
    // title: 'Accessible Basemap v2',
    portalItem: { id: '200deb0a065d46b895268c43b4823f99' },
  },
  {
    // title: 'Accessible Dark Basemap v2',
    portalItem: { id: 'd4d6cd16abb84fe3ac226ae8c9a24092' },
  },
  {
    // title: 'Accessible Basemap Gray version 1',
    portalItem: { id: '3105adcfd6c145d6a474b9927df6d189' },
  },
  {
    // title: 'Accessible Basemap Gray version 2',
    portalItem: {
      id: '895f853971634637ae1b7e6aceae8d47',
    },
  },
];

export default wsdotBasemaps;

type BasemapTitleOrId = Pick<__esri.BasemapProperties, 'title' | 'id'>;

/**
 * Detects if either a basemap's title or id property contains "dark" (case-insensitive).
 * @param basemap - A basemap object.
 * @returns Returns `true` if basemap object title or id properties contain the string "dark", `false` otherwise.
 */
export function isDarkBasemap(basemap: BasemapTitleOrId | string): boolean {
  const darkRe = /dark/gi;
  if (typeof basemap === 'string') {
    return darkRe.test(basemap);
  }
  return (!!basemap.title && darkRe.test(basemap.title)) || (!!basemap.id && darkRe.test(basemap.id));
}

/**
 * Iterate through a list of basemaps and yield only the "dark" ones.
 * @param basemaps - a collection of basemap objects.
 */
export function* iterateDarkBasemaps(basemaps: Iterable<BasemapTitleOrId | string>) {
  for (const basemap of basemaps) {
    if (isDarkBasemap(basemap)) {
      yield basemap;
    }
  }
}
