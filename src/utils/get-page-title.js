import defaultSettings from '@/settings'

const title = defaultSettings.title || 'hb-web-admin'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
